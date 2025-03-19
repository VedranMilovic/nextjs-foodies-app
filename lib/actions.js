"use server";

import { saveMeal } from "./meals";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  // sad je ovo funkcija koja se izvršava samo na serveru, šaljemo ja kao action form elementu
  // ti iz form elementa dobivamo podatke iz SharedMealsPage

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // throw new Error("Invalid input");
    return { message: "Invalid input" };
  }

  await saveMeal(meal);
  revalidatePath("/meals"); // revalidatePath je funkcija iz next/cache, koja revalidira cache za određenu rutu
  redirect("/meals");
}
