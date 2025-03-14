"use client";

import classes from "./image-picker.module.css";
import { useRef } from "react";
import Image from "next/image";
import { useState } from "react";
export default function ImagePicker({ label, name }) {
  const imageInputRef = useRef();
  const [pickedImage, setPickedImage] = useState();

  function pickImageHandler() {
    imageInputRef.current.click();
  }

  function pickedImageHandler(event) {
    //  'files' is a FileList object containing the selected files from input field, which is type=file
    const file = event.target.files[0];
    // Update the state with the selected file
    setPickedImage(file);

    if (!file) {
      setPickedImage(null);
      return;
    }

    // Create a new FileReader object to read the file's data
    const fileReader = new FileReader();
    // The FileReader object allows web applications to asynchronously read the contents of files (or raw data buffers)
    // stored on the user's computer, using File or Blob objects to specify the file or data to read.

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    // Read the file as a data URL (base64 encoded string)
    fileReader.readAsDataURL(file);
    // The readAsDataURL method is used to read the contents of the specified Blob or File.
    // When the read operation is finished, the readyState becomes DONE, and the loadend event is triggered.
    // At that time, the result attribute contains the data as a base64 encoded string representing the file's data.
  }
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>🌟 Kein Bild vom Benutzer ausgewählt.</p>}
          {pickedImage && <Image src={pickedImage} alt="picked" fill />}
        </div>
        <input
          className={classes.input} // skriva input field
          type="file"
          id={name}
          name={name}
          accept="image/png, image/jpeg"
          ref={imageInputRef}
          onChange={pickedImageHandler}
        />
        <button
          className={classes.button}
          type="button"
          onClick={pickImageHandler}
        >
          Choose Image
        </button>
      </div>
    </div>
  );
}
