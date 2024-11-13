"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intentPatterns = void 0;
var natural_1 = require("natural");
var natural = require('natural');
var PorterStemmer = natural.PorterStemmer;
// Synonym dictionary for basic expansion
var synonyms = {
    "shop": ["buy", "acquire", "purchase"],
    "help": ["assist", "aid", "support"],
    "find": ["search", "locate", "look for"],
    "cost": ["price", "amount", "value"],
    "job": ["career", "position", "vacancy", "opening"]
};
var MultiIntentClassifier = /** @class */ (function () {
    function MultiIntentClassifier(patterns) {
        this.tokenizer = new natural_1.WordTokenizer();
        this.patterns = patterns;
    }
    MultiIntentClassifier.prototype.classify = function (input) {
        var startTime = performance.now();
        var matchedIntents = [];
        // Preprocess input using Porter Stemmer
        var normalizedInput = this.preprocess(input);
        // Early return if input is empty after preprocessing
        if (!normalizedInput.length) {
            return { intents: [], processingTime: 0 };
        }
        // Check matches and compute confidence
        for (var _i = 0, _a = Object.entries(this.patterns); _i < _a.length; _i++) {
            var _b = _a[_i], intent = _b[0], patterns = _b[1];
            var totalWeight = 0;
            var matchedWeight = 0;
            for (var _c = 0, patterns_1 = patterns; _c < patterns_1.length; _c++) {
                var _d = patterns_1[_c], pattern = _d.pattern, weight = _d.weight;
                totalWeight += weight;
                if (pattern.test(normalizedInput)) {
                    matchedWeight += weight;
                }
            }
            // Calculate confidence based on weighted matches
            var confidence = 0;
            if (totalWeight > 0) {
                confidence = matchedWeight / totalWeight;
            }
            // Ensure confidence is not less than 0 or more than 1
            confidence = Math.min(1, Math.max(0, confidence));
            // Convert to percentage
            confidence *= 100;
            // Only include intents with non-zero confidence
            if (confidence > 0) {
                matchedIntents.push({ intent: intent, confidence: confidence });
            }
        }
        // Normalize the confidence scores
        var totalConfidence = matchedIntents.reduce(function (sum, item) { return sum + item.confidence; }, 0);
        if (totalConfidence > 0) {
            matchedIntents.forEach(function (item) {
                item.confidence = (item.confidence / totalConfidence) * 100;
            });
        }
        // If no intent matches, classify it as "Chat/Conversational" with 10% confidence
        if (matchedIntents.length === 0) {
            matchedIntents.push({ intent: "Chat/Conversational", confidence: 10 });
        }
        // Sort by confidence
        matchedIntents.sort(function (a, b) { return b.confidence - a.confidence; });
        var endTime = performance.now();
        var processingTime = endTime - startTime;
        return { intents: matchedIntents, processingTime: processingTime };
    };
    MultiIntentClassifier.prototype.preprocess = function (input) {
        var _this = this;
        // Step 1: Tokenize the input
        var tokens = this.tokenizer.tokenize(input.toLowerCase());
        // Step 2: Expand synonyms
        tokens = tokens.map(function (word) { return _this.expandSynonyms(word); });
        // Step 3: Apply stemming to each word
        var stemmedTokens = tokens.map(function (word) { return PorterStemmer.stem(word); });
        // Step 4: Join stemmed tokens back into a processed string
        return stemmedTokens.join(" ");
    };
    MultiIntentClassifier.prototype.expandSynonyms = function (word) {
        for (var _i = 0, _a = Object.entries(synonyms); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], syns = _b[1];
            if (syns.includes(word)) {
                return key; // Replace synonym with its base form
            }
        }
        return word; // Return original word if no synonym match is found
    };
    return MultiIntentClassifier;
}());
exports.default = MultiIntentClassifier;
exports.intentPatterns = {
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
