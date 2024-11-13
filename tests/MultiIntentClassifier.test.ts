import MultiIntentClassifier, { intentPatterns } from "../classifier";

describe('MultiIntentClassifier', () => {
  const classifier = new MultiIntentClassifier(intentPatterns);

  it('should classify a conversational query correctly', async () => {
    const result = await classifier.classify('Can you help me with my project?');
    expect(result.intents[0].intent).toBe('Chat/Conversational');
  });

  it('should handle multi-intent queries', async () => {
    const result = await classifier.classify('Find the latest news about stock prices');
    expect(result.intents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ intent: 'Financial Markets' }),
        expect.objectContaining({ intent: 'News/Current Events' }),
      ])
    );
  });

  it('should handle queries with no intent matched', async () => {
    const result = await classifier.classify('Hello, how are you?');
    expect(result.intents).toEqual([]);
  });

  it('should handle invalid input gracefully', async () => {
    const result = await classifier.classify('');
    expect(result.intents).toEqual([]);
  });

 
});
