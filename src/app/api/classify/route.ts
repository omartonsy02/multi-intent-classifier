// pages/api/classify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import MultiIntentClassifier, { intentPatterns } from '../../../classifier';
import { NaiveBayesClassifier } from '../../../naiveBayesClassifier';

const multiIntentClassifier = new MultiIntentClassifier(intentPatterns);
const naiveBayesClassifier = new NaiveBayesClassifier('naive_bayes_model.pkl', 'vectorizer.pkl');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        try {
            // Get classification results from both classifiers
            const multiIntentResult = multiIntentClassifier.classify(query);
            const naiveBayesResult = await naiveBayesClassifier.classify(query);

            // Compare confidence scores
            let finalResult;
            if (multiIntentResult.intents[0]?.confidence > naiveBayesResult.confidence) {
                finalResult = multiIntentResult;
            } else {
                finalResult = {
                    intents: [{ intent: naiveBayesResult.intent, confidence: naiveBayesResult.confidence }],
                    processingTime: 0
                };
            }

            return res.json(finalResult);
        } catch (error) {
            console.error('Error classifying query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
