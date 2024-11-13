// Import the necessary libraries
import { WordTokenizer } from 'natural';
const natural = require('natural');
const PorterStemmer = natural.PorterStemmer;

// Synonym dictionary for basic expansion
const synonyms: Record<string, string[]> = {
    "shop": ["buy", "acquire", "purchase"],
    "help": ["assist", "aid", "support"],
    "find": ["search", "locate", "look for"],
    "cost": ["price", "amount", "value"],
    "job": ["career", "position", "vacancy", "opening"]
};

// Define the intent patterns and their weights
type IntentPatterns = Record<string, { pattern: RegExp; weight: number }[]>;

export interface ClassificationResult {
    intents: { intent: string; confidence: number }[];
    processingTime: number;
}

export default class MultiIntentClassifier {
    private patterns: IntentPatterns;

    constructor(patterns: IntentPatterns) {
        this.patterns = patterns;
    }

    classify(input: string): ClassificationResult {
        const startTime = performance.now();
        const matchedIntents: { intent: string; confidence: number }[] = [];

        // Preprocess input using Porter Stemmer
        const normalizedInput = this.preprocess(input);

        // Early return if input is empty after preprocessing
        if (!normalizedInput.length) {
            return { intents: [], processingTime: 0 };
        }

        // Check matches and compute confidence
        for (const [intent, patterns] of Object.entries(this.patterns)) {
            let totalWeight = 0;
            let matchedWeight = 0;

            for (const { pattern, weight } of patterns) {
                totalWeight += weight;
                if (pattern.test(normalizedInput)) {
                    matchedWeight += weight;
                }
            }

            // Calculate confidence based on weighted matches
            let confidence = 0;
            if (totalWeight > 0) {
                confidence = matchedWeight / totalWeight;
            }

            // Ensure confidence is within [0, 1]
            confidence = Math.min(1, Math.max(0, confidence)) * 100;

            // Only include intents with non-zero confidence
            if (confidence > 0) {
                matchedIntents.push({ intent, confidence: Math.round(confidence) });
            }
        }

        // Normalize confidence scores
        const totalConfidence = matchedIntents.reduce((sum, item) => sum + item.confidence, 0);
        if (totalConfidence > 0) {
            matchedIntents.forEach(item => {
                item.confidence = Math.round((item.confidence / totalConfidence) * 100);
            });
        }

        // Sort by confidence
        matchedIntents.sort((a, b) => b.confidence - a.confidence);

        const endTime = performance.now();
        const processingTime = endTime - startTime;

        return { intents: matchedIntents, processingTime };
    }

    private tokenizer = new WordTokenizer();

    private preprocess(input: string): string {
        // Tokenize, expand synonyms, and apply stemming
        const tokens = this.tokenizer.tokenize(input.toLowerCase()).map(this.expandSynonyms);
        const stemmedTokens = tokens.map(PorterStemmer.stem);
        return stemmedTokens.join(" ");
    }

    private expandSynonyms(word: string): string {
        for (const [key, syns] of Object.entries(synonyms)) {
            if (syns.includes(word)) return key;
        }
        return word;
    }
}

// Intent patterns
export const intentPatterns: IntentPatterns = {
    "Chat/Conversational": [
        { pattern: /\b(help|support|please|would)\b/i, weight: 0.8 },
        { pattern: /\b(i need|could|may)\b/i, weight: 0.9 }
    ],
    "URL/Website Search": [
        { pattern: /\bhttps?:\/\/\S+\b/i, weight: 1.0 },
        { pattern: /\b(find|look)\s?(website|link|page|url)\b/i, weight: 1.0 },
        { pattern: /\b(\.com|\.net|\.org)\b/i, weight: 0.8 }
    ],
    "Question-Answer": [
        { pattern: /\b(who|what|when|where|why|how|is|are|can)\b/i, weight: 1.0 },
        { pattern: /\b(explain|define|meaning|about)\b/i, weight: 0.9 }
    ],
    "Financial Markets": [
        { pattern: /\$\w+/i, weight: 1.0 },
        { pattern: /\b(stock|price|market|finance|invest)\b/i, weight: 0.9 }
    ],
    "Code/Programming": [
        { pattern: /\b(error|bug|issue|fix|code|syntax)\b/i, weight: 0.9 },
        { pattern: /\b(java|python|javascript|typescript|html|css)\b/i, weight: 1.0 }
    ],
    "Math/Calculations": [
        { pattern: /\b(sum|difference|product|calculate|convert|solve)\b/i, weight: 1.0 },
        { pattern: /\b(\d+[\+\-\*\/]\d+|pi|cos|sin|tan|log)\b/i, weight: 0.9 }
    ]
};

// Usage example
const classifier = new MultiIntentClassifier(intentPatterns);
const result = classifier.classify("Can you help me find the latest stock prices?");
console.log(result);
