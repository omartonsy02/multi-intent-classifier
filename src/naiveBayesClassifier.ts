import { exec } from 'child_process';
import { promisify } from 'util';

// Create a promisified exec function for async use
const execPromise = promisify(exec);

export class NaiveBayesClassifier {
    private modelPath: string;
    private vectorizerPath: string;

    constructor(modelPath: string, vectorizerPath: string) {
        this.modelPath = modelPath;
        this.vectorizerPath = vectorizerPath;
    }

    async classify(query: string) {
        try {
            // Run the Python classifier script with the query
            const { stdout, stderr } = await execPromise(`python classify.py "${query}" ${this.modelPath} ${this.vectorizerPath}`);
            if (stderr) {
                console.error('Error:', stderr);
                throw new Error(stderr);
            }

            // Parse the result from the Python script
            const result = JSON.parse(stdout);
            return result;
        } catch (error) {
            console.error('Failed to classify using NaiveBayesClassifier:', error);
            throw new Error('Error classifying query with NaiveBayesClassifier');
        }
    }
}
