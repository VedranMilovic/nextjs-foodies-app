"use client";

import classes from "./page.module.css";
import ImagePicker from "@/components/meals/image-picker";

export default function SharedMealsPage() {
  function handleSubmit(event) {
    event.preventDefault();
    // Form submission logic will be added later
  }

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>Favorite Meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
              />
            </p>
            <p>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
              />
            </p>
          </div>

          <p>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter meal title"
            />
          </p>

          <p>
            <label htmlFor="summary">Summary</label>
            <input
              type="text"
              id="summary"
              name="summary"
              required
              placeholder="Enter a brief summary of the meal"
            />
          </p>

          <p>
            <label htmlFor="instructions">Cooking Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
              placeholder="Enter the cooking instructions"
            />
          </p>

          <ImagePicker label="Image" name="image" />

          <div className={classes.actions}>
            <button type="submit">Share Meal</button>
          </div>
        </form>
      </main>
    </>
  );
}
