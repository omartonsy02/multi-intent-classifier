
"use client"; // Ensures client-side rendering for React hooks

import SearchBox from './SearchBox';

export default function Home() {
  return (
    <main className="container">
      <h1>Multi-Intent Classifier</h1>
      <p>Enter a query below to classify its intent:</p>
      <SearchBox />
    </main>
  );
}

