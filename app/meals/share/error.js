"use client";

export default function Error() {
  // Next.js tu daje i error  object prop, koji može bolje oblikovati error, mi ga sad nismo koristili
  return (
    <main className="error">
      {/*classname je iz globals.css, pa ne treba importati */}
      <h1>An error occurred</h1>
      <p>Failed to create meal.</p>
    </main>
  );
}
