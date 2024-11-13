import express, { Request, Response } from 'express';
import MultiIntentClassifier, { intentPatterns } from './classifier.ts';
//import { NaiveBayesClassifier } from './naiveBayesClassifier.ts';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize classifiers
const multiIntentClassifier = new MultiIntentClassifier(intentPatterns);
//const naiveBayesClassifier = new NaiveBayesClassifier();

// Endpoint for classifying input text
app.post('/classify', async (req: Request, res: Response): Promise<void> => {
    const { query } = req.body;

    // Check if query is provided
    if (!query) {
         res.status(400).json({ error: 'Query is required' }); // Return immediately after sending error response
    }

  /*  try {
        // Get classification results from both classifiers
        const multiIntentResult = multiIntentClassifier.classify(query);
        const naiveBayesResult = await naiveBayesClassifier.classify(query);

        // Compare the confidence scores and select the classifier with higher confidence
        let finalResult;
        if (multiIntentResult.intents[0]?.confidence > naiveBayesResult.confidence) {
            finalResult = multiIntentResult;
        } else {
            finalResult = {
                intents: [{ intent: naiveBayesResult.intent, confidence: naiveBayesResult.confidence }],
                processingTime: 0 // Optional, can set to the actual processing time if needed
            };
        }

    */    // Send the response with the selected result
        res.json(multiIntentClassifier.classify(query));
    }/* catch (error) {
        console.error('Error classifying query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}*/);
