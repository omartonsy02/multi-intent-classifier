import React, { useState } from 'react';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // The query to classify
  const [classificationResult, setClassificationResult] = useState<any | null>(null); // Store the result
  const [error, setError] = useState<string | null>(null); // Store errors if any

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Handle classification request
  const handleClassify = async () => {
    if (!query) return;

    setError(null); // Reset the error message before making the request

    // Send the query to the API route
    const response = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }), // Send the query to classify
    });

    if (response.ok) {
      const data = await response.json();
      setClassificationResult(data); // Store the classification result
    } else {
      setError('Failed to classify the query');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter your query"
      />
      <button onClick={handleClassify}>Classify</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {classificationResult && classificationResult.intents && (
        <div>
          <h3>Classification Result</h3>
          {classificationResult.intents.map((intent: { intent: string, confidence: number }, index: number) => (
            <div key={index}>
              <p><strong>Intent:</strong> {intent.intent}</p>
              <p><strong>Confidence:</strong> {Math.round(intent.confidence * 100)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

