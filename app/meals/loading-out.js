import classes from "./loading.module.css";

// reserved filename je loading.js
export default function MealsLoadingPage() {
  return <p className={classes.loading}>Fetching meals...</p>;
}
