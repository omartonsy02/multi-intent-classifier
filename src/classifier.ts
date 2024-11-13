// Import the necessary libraries

const natural = require('natural');
const PorterStemmer = natural.PorterStemmer;
import { WordTokenizer } from 'natural';
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

            // Ensure confidence is not less than 0 or more than 1
            confidence = Math.min(1, Math.max(0, confidence));

            // Convert to percentage
            confidence *= 100;

            // Only include intents with non-zero confidence
            if (confidence > 0) {
                matchedIntents.push({ intent, confidence });
            }
              // Normalize the confidence scores
            const totalConfidence = matchedIntents.reduce((sum, item) => sum + item.confidence, 0);
            if (totalConfidence > 0) {
             matchedIntents.forEach(item => {
                item.confidence = (item.confidence / totalConfidence) * 100;
                });
             }
            }

        // Sort by confidence
        matchedIntents.sort((a, b) => b.confidence - a.confidence);

        const endTime = performance.now();
        const processingTime = endTime - startTime;

        return { intents: matchedIntents, processingTime };
    }

    private tokenizer = new WordTokenizer();

    private preprocess(input: string): string {
        // Step 1: Tokenize the input
        let tokens = this.tokenizer.tokenize(input.toLowerCase());

        // Step 2: Expand synonyms
        tokens = tokens.map(word => this.expandSynonyms(word));

        // Step 3: Apply stemming to each word
        const stemmedTokens = tokens.map(word => PorterStemmer.stem(word));

        // Step 4: Join stemmed tokens back into a processed string
        return stemmedTokens.join(" ");
    }
    private expandSynonyms(word: string): string {
        for (const [key, syns] of Object.entries(synonyms)) {
            if (syns.includes(word)) {
                return key; // Replace synonym with its base form
            }
        }
        return word; // Return original word if no synonym match is found
    }
}

export const intentPatterns: IntentPatterns = {
  "Chat/Conversational": [
      { pattern: /\b(help|support|can|please|would)\b/i, weight: 0.8 },
      { pattern: /\b(i need|could|may)\b/i, weight: 0.9 }
  ],
  "URL/Website Search": [
      { pattern: /\bhttps?:\/\/\S+\b/i, weight: 1.0 },
      { pattern: /\b(find|look)\s?(website|link|page|url)\b/i, weight: 1 },
      { pattern: /\b(\.com|\.net|\.org)\b/i, weight: 0. }
  ],
  "Question-Answer": [
      { pattern: /\b(who|what|when|where|why|how|is|are|can)\b/i, weight: 1.0 },
      { pattern: /\b(explain|define|meaning|about)\b/i, weight: 0.9 }
  ],
  "Financial Markets": [
      { pattern: /\$\w+/i, weight: 1.0 },
      { pattern: /\b(stock|price|market|finance|trade|invest)\b/i, weight: 0.9 },
  ],
  "Code/Programming": [
      { pattern: /\b(error|bug|issue|fix|code|syntax|compile|run)\b/i, weight: 0.9 },
      { pattern: /\b(java|python|javascript|typescript|c\+\+|c#|html|css)\b/i, weight: 1.0 },
      { pattern: /\b(function|class|variable|array|loop|if statement)\b/i, weight: 0.8 }
  ],
  "Math/Calculations": [
      { pattern: /\b(sum|difference|product|quotient|calculate|convert|solve)\b/i, weight: 1.0 },
      { pattern: /\b(\d+[\+\-\*\/]\d+|percentage|fraction|square root)\b/i, weight: .9 },
      { pattern: /\b(\=|pi|cos|sin|tan|log)\b/i, weight: 0.9 }
  ],
  "Product Search": [
      { pattern: /\b(price|cost|shop|deal)\b/i, weight: 1.0 },
      { pattern: /\b(for sale|get|discount|availability)\b/i, weight: 0.9 }
  ],
  "Location/Navigation": [
      { pattern: /\b(near|directions|navigate|route)\b/i, weight: 1.0 },
      { pattern: /\b(map|distance|find|where)\b/i, weight: 0.9 }
  ],
  "News/Current Events": [
      { pattern: /\b(latest|current|breaking|updates)\b/i, weight: 1.0 },
      { pattern: /\b(headline|trend|recent|today)\b/i, weight: 0.9 }
  ],
  "Recipe/Cooking": [
      { pattern: /\b(how to|recipe|ingredients|cooking)\b/i, weight: 1.0 },
      { pattern: /\b(bake|cook|grill|boil|oven|fry)\b/i, weight: 0.9 }
  ],
  "Translation": [
      { pattern: /\b(translate|translation|say)\b/i, weight: 1.0 },
      { pattern: /\b(in [a-zA-Z]+\s?language)\b/i, weight: 0.9 },
      { pattern: /\b(to [a-zA-Z]+)\b/i, weight: 0.8 }
  ],
  "Academic/Research": [
      { pattern: /\b(paper|study|research|journal)\b/i, weight: 1.0 },
      { pattern: /\b(thesis|dissertation|academic|cite)\b/i, weight: 0.9 }
  ],
  "Job/Career": [
      { pattern: /\b(job|career|salary|vacancy|position|opening)\b/i, weight: 1.0 },
      { pattern: /\b(hire|apply|work|intern)\b/i, weight: 0.9 }
  ],
  "Travel Planning": [
      { pattern: /\b(flight|hotel|book|vacation|travel|tour)\b/i, weight: 1.0 },
      { pattern: /\b(reservation|flight|place|stay|itinerary)\b/i, weight: 0.9 }
  ],
  "Social Media": [
      { pattern: /\b(@\w+|#\w+|hashtag|mention)\b/i, weight: 1.0 },
      { pattern: /\b(post|like|follow|share|profile|trend)\b/i, weight: 0.9 }
  ]
};


// Usage example:
const classifier = new MultiIntentClassifier(intentPatterns);
const result = classifier.classify("Can you help me find the latest stock prices?");
console.log(result);
