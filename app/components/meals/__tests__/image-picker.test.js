import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImagePicker from "../image-picker";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill }) => {
    return (
      <img
        src={src}
        alt={alt}
        data-testid="next-image"
        style={fill ? { objectFit: "cover" } : {}}
      />
    );
  },
}));

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  // dummy implementation
}));

describe("ImagePicker Component", () => {
  test("renders without crashing", () => {
    render(<ImagePicker label="Test Label" name="test-name" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(
      screen.getByText("🌟 Kein Bild vom Benutzer ausgewählt.")
    ).toBeInTheDocument();
    expect(screen.getByText("Choose Image")).toBeInTheDocument();
  });

  test("clicking the button triggers file input click", () => {
    render(<ImagePicker label="Test Label" name="test-name" />);

    const button = screen.getByText("Choose Image");
    const fileInput = screen.getByLabelText("Test Label");

    // Mock the click method
    const clickSpy = jest.spyOn(fileInput, "click");

    // Click the button
    fireEvent.click(button);

    // Verify file input click was triggered
    expect(clickSpy).toHaveBeenCalled();

    // Clean up
    clickSpy.mockRestore();
  });

  test("handles case when no file is selected", () => {
    render(<ImagePicker label="Test Label" name="test-name" />);

    // Trigger file selection with empty files array
    const fileInput = screen.getByLabelText("Test Label");
    fireEvent.change(fileInput, { target: { files: [] } });

    // Expect the "no image" text to still be shown
    expect(
      screen.getByText("🌟 Kein Bild vom Benutzer ausgewählt.")
    ).toBeInTheDocument();
  });
});
