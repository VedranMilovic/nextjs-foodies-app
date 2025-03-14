import classes from "./page.module.css";
import Image from "next/image";
import { getMeal } from "@/lib/meals";
export default function MealDetailsPage({ params }) {
  const meal = getMeal(params.slug);

  // Replace all newlines with HTML line breaks so they render properly in the browser
  meal.instructions = meal.instructions.replaceAll("\n", "<br>");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main className={classes.meal}>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: meal.instructions }}
        ></p>
      </main>
    </>
  );
}
