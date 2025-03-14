import Image from "next/image";
import classes from "./meal-item.module.css";
import Link from "next/link";
export default function MealItem({ title, image, summary, creator, slug }) {
  return (
    <article className={classes.meal}>
      <div className={classes.image}>
        {/* Image component with fill prop to fit container dimensions, fill je umjesto width and height (ako ih ne znamo),govori Next.js  da popuni prostor */}
        <Image src={image} alt={title} fill />
      </div>
      <header>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>By {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}
