import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class NaiveBayesClassifier {
    async classify(query: string) {
        try {
            // Run the Python script with the input query
            const { stdout } = await execPromise(`python naive_bayes_predict.py "${query}"`);
            // Parse and return the JSON result
            return JSON.parse(stdout);
        } catch (error) {
            console.error('Classification Error:', error);
            throw new Error('Failed to classify the query.');
        }
    }
}
