import { S3 } from "@aws-sdk/client-s3";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs/promises"; // Using promises version for better async handling
import path from "node:path";

const s3 = new S3({
  region: "eu-north-1",
});
const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // .run() ako želimo insertati data, .get() ako želimo single row

  //   throw new Error("Failed to fetch meals");
  return db.prepare("SELECT * FROM meals").all();
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

/**
 * Saves a new meal to the database and stores the associated image file
 *
 * @param {Object} meal - The meal object containing all meal data
 * @returns {Object} - Success status and the generated slug
 * @throws {Error} - If any validation or file operations fail
 */

export async function saveMeal(meal) {
  try {
    // Validate essential meal data to prevent errors later in the process
    if (!meal.title || !meal.image || !meal.image.name) {
      throw new Error("Missing required meal data");
    }

    // Generate a URL-friendly slug from the meal title
    // A slug is a URL-friendly version of the title with spaces replaced by hyphens
    // and special characters removed to ensure valid URLs and consistent routing
    // The 'lower: true' option converts the slug to lowercase for consistency
    // Example: "Spaghetti Bolognese" becomes "spaghetti-bolognese"
    meal.slug = slugify(meal.title, { lower: true });

    // Sanitize the instructions to prevent XSS attacks
    meal.instructions = xss(meal.instructions);

    // Extract the file extension from the uploaded image
    const extension = meal.image.name.split(".").pop();

    // Validate that we have a proper file extension
    if (!extension) {
      throw new Error("Invalid image file format");
    }

    // Create a filename based on the meal slug to ensure uniqueness
    const fileName = `${meal.slug}.${extension}`;

    // Build the absolute path where the image will be stored
    // process.cwd() ensures we get the correct path regardless of where the app is started from
    // path.join intelligently combines path segments using the correct platform-specific separator
    // The structure follows Next.js conventions:
    // - 'public' directory is automatically served at the root of the website
    // - 'images' is a subdirectory we're using to organize meal images
    // - fileName contains the slug-based name we generated earlier with the proper extension
    // This creates a path like: /your/project/directory/public/images/spaghetti-bolognese.jpg
    const imagePath = path.join(process.cwd(), "public", "images", fileName);

    // Convert the uploaded file to an ArrayBuffer
    // This is needed because the image comes as a File object from the form
    // The File object is part of the Web API and represents a file selected by the user
    // arrayBuffer() is a method that reads the file's contents and returns a promise
    // that resolves with an ArrayBuffer containing the binary data of the image
    // An ArrayBuffer is a low-level representation of binary data that we'll later
    // convert to a Node.js Buffer for file system operations
    const bufferedImage = await meal.image.arrayBuffer();

    //ovdje saveamo na local file system!

    // Write the image file to the filesystem
    // fs.writeFile() writes data to a file, creating the file if it doesn't exist or overwriting it if it does
    // The first parameter (imagePath) specifies the file path where the image will be saved
    // The second parameter is the data to write - we convert the ArrayBuffer to a Node.js Buffer
    // Using fs/promises with await ensures the operation completes before moving on
    // This prevents race conditions where database entries could be created before the file is ready
    // If the operation fails (e.g., due to permissions or disk space), it will throw an error
    // that will be caught by our try/catch block
    // await fs.writeFile(imagePath, Buffer.from(bufferedImage));

    // Update the meal object with the public URL path to the image
    // This path will be stored in the database and used for rendering the image
    // The path starts with /images/ which makes it a relative URL path from the web root
    // This is important for proper image rendering in HTML via <img src="/images/...">
    // meal.image = `/images/${fileName}`;

    //ovdje saveamo na S3!

    s3.putObject({
      Bucket: "vedranmilovicnextjsdemoimages",
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });

    meal.image = fileName;

    // Insert the meal data into the database
    // Using prepared statements with named parameters (@title, etc.) to prevent SQL injection
    // The .run() method executes the SQL statement immediately
    db.prepare(
      `INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug) VALUES (
      @title,
      @summary,
      @instructions,
      @image,
      @creator,
      @creator_email,
      @slug
    )`
    ).run(meal);

    // Return success information to the caller
    // Including the slug allows for redirects to the new meal page
    return { success: true, slug: meal.slug };
  } catch (error) {
    // Log the detailed error for debugging purposes
    console.error("Error saving meal:", error);

    // Rethrow with a user-friendly message while preserving the original error
    // This helps with debugging while providing clear feedback
    throw new Error(`Failed to save meal: ${error.message}`);
  }
}
