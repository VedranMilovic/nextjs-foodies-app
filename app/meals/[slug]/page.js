import classes from "./page.module.css";
import Image from "next/image";
import { getMeal } from "@/lib/meals";
// import { NotFound } from "./not-found";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  // za dinamično dobivanje metadata
  const meal = await getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailsPage({ params }) {
  const meal = await getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  // Replace all newlines with HTML line breaks so they render properly in the browser
  if (meal && meal.instructions) {
    meal.instructions = meal.instructions.replaceAll("\n", "<br>");
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://vedranmilovicnextjsdemoimages.s3.eu-north-1.amazonaws.com/${meal.image}`}
            alt={meal.title}
            fill
          />
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
          dangerouslySetInnerHTML={{ __html: meal?.instructions || "" }}
          // tu outputamo user instruction s share page kao HTML, pa ga treba sanitizirati protiv xss attacks, to radimo u lib
        ></p>
      </main>
    </>
  );
}
