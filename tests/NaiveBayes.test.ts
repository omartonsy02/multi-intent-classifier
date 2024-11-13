/* import fetch from 'node-fetch';

export interface IntentPrediction {
  intents: {
    intent: string;
    confidence: number;
  }[];
}

describe('Naive Bayes Classifier API', () => {
  it('should classify a single-intent query correctly', async () => {
    const response = await fetch('http://localhost:3000/api/naive_bayes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is the latest news in technology?' }),
    });

    // Type assertion to specify the data type
    const data = await response.json() as IntentPrediction;
    
    expect(response.status).toBe(200);
    expect(data.intents).toBeDefined();
    expect(data.intents[0].intent).toContain('News/Current Events');
    expect(data.intents[0].confidence).toBeGreaterThan(0);
  });

  it('should classify a query with multiple intents', async () => {
    const response = await fetch('http://localhost:3000/api/naive_bayes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Show me stock prices and latest tech news' }),
    });

    const data = await response.json() as IntentPrediction;
    expect(response.status).toBe(200);
    expect(data.intents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ intent: 'Financial Markets' }),
        expect.objectContaining({ intent: 'News/Current Events' }),
      ])
    );
  });

  it('should handle an empty query gracefully', async () => {
    const response = await fetch('http://localhost:3000/api/naive_bayes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }),
    });

    const data = await response.json() as { error: string }; // specify expected error shape
    expect(response.status).toBe(400);
    expect(data.error).toBe('Query is required');
  });

  it('should return an error for an unknown query', async () => {
    const response = await fetch('http://localhost:3000/api/naive_bayes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'qwertyuiop' }),
    });

    const data = await response.json() as IntentPrediction;
    expect(response.status).toBe(200);
    expect(data.intents).toHaveLength(0);
  });

  it('should classify a numerical query correctly', async () => {
    const response = await fetch('http://localhost:3000/api/naive_bayes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Calculate 5 * 3' }),
    });

    const data = await response.json() as IntentPrediction;
    expect(response.status).toBe(200);
    expect(data.intents[0].intent).toBe('Math/Calculations');
    expect(data.intents[0].confidence).toBeGreaterThan(0);
  });
});
*/