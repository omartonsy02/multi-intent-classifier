// src/classifier.ts
export class MultiIntentClassifier {
    patterns;
    constructor(patterns) {
        this.patterns = patterns;
    }
    classify(query) {
        const start = performance.now();
        const matchedIntents = [];
        // Edge case: Empty query
        if (!query || typeof query !== 'string') {
            return { intents: [], processingTime: 0 };
        }
        // Loop through each intent and check for matches
        for (const [intent, regexPatterns] of Object.entries(this.patterns)) {
            let matchCount = 0;
            for (const pattern of regexPatterns) {
                if (pattern.test(query)) {
                    matchCount++;
                }
            }
            // Calculate confidence as a percentage of regex patterns matched
            const confidence = matchCount > 0 ? matchCount / regexPatterns.length : 0;
            if (confidence > 0) {
                matchedIntents.push({ intent, confidence });
            }
        }
        const end = performance.now();
        const processingTime = end - start;
        // Sort intents by confidence score in descending order
        matchedIntents.sort((a, b) => b.confidence - a.confidence);
        return {
            intents: matchedIntents,
            processingTime: Math.round(processingTime),
        };
    }
}
// Precomputed patterns for intents
const patterns = {
    "Chat/Conversational": [
        /\b(help|advice|thoughts|discuss|talk)\b/i,
        /(can you|could you|will you)/i
    ],
    "URL/Website Search": [
        /\b(find|show|link|website|page|site)\b/i,
        /(website for|link to)/i
    ],
    "Question-Answer": [
        /\b(what|who|where|when|why|how)\b/i,
    ],
    "Financial Markets": [
        /\b(stock|market|trade|investment)\b/i,
    ],
    "Code/Programming": [
        /\b(code|program|script|debug|write|develop)\b/i,
    ],
    "Math/Calculations": [
        /\b(calculate|math|solve|add|subtract|multiply|divide)\b/i,
    ],
    "Product Search": [
        /\b(find|search|buy|product|available|order)\b/i,
    ],
    "Location/Navigation": [
        /\b(location|directions|map|navigate|find my way)\b/i,
    ],
    "News/Current Events": [
        /\b(news|updates|current|events|latest)\b/i,
    ],
    "Recipe/Cooking": [
        /\b(recipe|cook|food|ingredients|make|prepare)\b/i,
    ],
    "Translation": [
        /\b(translate|translate to|in language|how do you say)\b/i,
    ],
    "Academic/Research": [
        /\b(research|study|academic|thesis|paper|journal)\b/i,
    ],
    "Job/Career": [
        /\b(job|career|employment|resume|apply|vacancy)\b/i,
    ],
    "Travel Planning": [
        /\b(travel|trip|holiday|plan|book|itinerary)\b/i,
    ],
    "Social Media": [
        /\b(social|media|post|share|tweet|instagram)\b/i,
    ]
};
// Export an instance of the classifier
export const classifier = new MultiIntentClassifier(patterns);
//# sourceMappingURL=classifier.js.map