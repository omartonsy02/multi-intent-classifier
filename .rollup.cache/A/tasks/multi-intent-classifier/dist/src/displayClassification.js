// src/displayClassification.ts
import { classifier } from './classifier'; // Adjust the import path as necessary
// Create an instance of the classifier
// Function to display classification results
function displayClassification(input) {
    const result = classifier.classify(input);
    console.log(`Input: "${input}"`);
    console.log(`Classification Result:`);
    console.log(`Processing Time: ${result.processingTime} ms`);
    if (result.intents.length > 0) {
        result.intents.forEach(({ intent, confidence }) => {
            console.log(`Intent: "${intent}", Confidence: ${confidence}`);
        });
    }
    else {
        console.log("No intents matched.");
    }
}
// Example usage
const userInput = "Can you help me find a recipe?";
displayClassification(userInput);
//# sourceMappingURL=displayClassification.js.map