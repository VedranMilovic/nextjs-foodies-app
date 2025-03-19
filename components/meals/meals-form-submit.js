"use client";

import { useFormStatus } from "react-dom";

/**
 * The useFormStatus hook is a React hook that provides information about the
 * current state of the nearest parent <form> element. It returns an object
 * containing the 'pending' property which indicates whether a form submission
 * is in progress. This allows us to create responsive UI elements that reflect
 * the submission state, such as disabling buttons and showing loading indicators
 * during form submission.
 */
export default function MealsFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>{pending ? "Sharing..." : "Share Meal"}</button>
  );
}
