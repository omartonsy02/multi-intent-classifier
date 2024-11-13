import sys
import joblib
import json
from typing import Dict

class NaiveBayesClassifier:
    def __init__(self, model_path: str, vectorizer_path: str):
        # Load the Naive Bayes model and vectorizer
        self.nb_classifier = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)

    def classify(self, query: str) -> Dict[str, any]:
        # Vectorize the query and predict the intent and confidence
        query_vec = self.vectorizer.transform([query])
        predicted_intent = self.nb_classifier.predict(query_vec)[0]
        predicted_confidence = self.nb_classifier.predict_proba(query_vec).max()

        return {
            'intent': predicted_intent,
            'confidence': round(predicted_confidence, 2)
        }

# Example usage
if __name__ == "__main__":
 
    # Initialize the classifier and classify the query
    classifier = NaiveBayesClassifier('naive_bayes_model.pkl', 'tfidf_vectorizer.pkl')
    result = classifier.classify(sys.argv[1])

    # Print the result as JSON
    print(json.dumps(result, indent=2))
