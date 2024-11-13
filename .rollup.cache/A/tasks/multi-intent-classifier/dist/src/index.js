// MultiIntentClassifier class
class MultiIntentClassifier {
    patterns;
    constructor(patterns) {
        this.patterns = patterns;
    }
    classify(input) {
        const startTime = performance.now();
        const matchedIntents = [];
        // Edge case: Empty input
        if (!input || typeof input !== 'string') {
            return { intents: [], processingTime: 0 };
        }
        // Check for matches across all patterns
        for (const [intent, regexes] of Object.entries(this.patterns)) {
            let matchCount = 0;
            for (const regex of regexes) {
                if (regex.test(input)) {
                    matchCount++;
                }
            }
            // Calculate confidence as a percentage of regex patterns matched
            if (matchCount > 0) {
                const confidence = matchCount / regexes.length;
                matchedIntents.push({ intent, confidence });
            }
        }
        // Sort intents by confidence in descending order
        matchedIntents.sort((a, b) => b.confidence - a.confidence);
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        return { intents: matchedIntents, processingTime };
    }
}
// Export the classifier
export default MultiIntentClassifier;
//# sourceMappingURL=index.js.map