import React, { useState } from 'react';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // The query to classify
  const [classificationResult, setClassificationResult] = useState<any | null>(null); // Store the result
  const [error, setError] = useState<string | null>(null); // Store errors if any
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [processingTime, setProcessingTime] = useState<number | null>(null); // Store processing time

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setClassificationResult(null); // Clear previous results on input change
    setProcessingTime(null); // Clear processing time
  };

  // Handle classification request
  const handleClassify = async () => {
    if (!query) return;

    setError(null);
    setLoading(true);
    setClassificationResult(null);
    setProcessingTime(null);

    try {
      // Send the query to the API route
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data); // Log the full API response for debugging
        
        // Find the intent with the highest confidence
        const highestConfidenceIntent = data.intents.reduce((prev: any, current: any) =>
          prev.confidence > current.confidence ? prev : current
        );

        // Set the highest confidence intent directly
        setClassificationResult({
          intent: highestConfidenceIntent.intent,
          confidence: highestConfidenceIntent.confidence,
        });

        // Check if processingTime is a valid number
        const time = parseFloat(data.processingTime);
        if (!isNaN(time)) {
          setProcessingTime(time);
        } else {
          console.error('Invalid processing time:', data.processingTime); // Log error if processing time is invalid
        }
      } else {
        setError('Failed to classify the query');
      }
    } catch (error) {
      console.error('Error during classification:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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
      <button onClick={handleClassify} disabled={loading}>
        {loading ? 'Classifying...' : 'Classify'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {classificationResult && (
        <div>
          <h3>Classification Result</h3>
          <div>
            <p><strong>Intent:</strong> {classificationResult.intent}</p>
            <p><strong>Confidence:</strong> {classificationResult.confidence}%</p>
          </div>

          {processingTime !== null && !isNaN(processingTime) && (
            <div>
              <p><strong>Processing Time:</strong> {processingTime.toFixed(2)} ms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
