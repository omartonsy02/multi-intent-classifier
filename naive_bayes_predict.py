import sys
import pickle
import joblib
import json
from typing import Dict

class NaiveBayesClassifier:
    def __init__(self, model_path: str, vectorizer_path: str):
        # Load the Naive Bayes model and vectorizer
        with open(model_path, 'rb') as model_file:
            self.nb_classifier = joblib.load(model_file)

        with open(vectorizer_path, 'rb') as vectorizer_file:
            self.vectorizer = joblib.load(vectorizer_file)

    def classify(self, query: str) -> Dict[str, any]:
        """
        Classifies the input query and returns the predicted intent and confidence score.
        
        Args:
            query (str): The user input query to classify.

        Returns:
            Dict[str, any]: A dictionary containing the predicted intent and confidence score.
        """
        # Vectorize the input query
        query_vec = self.vectorizer.transform([query])

        # Predict the intent
        predicted_intent = self.nb_classifier.predict(query_vec)[0]
        predicted_prob = self.nb_classifier.predict_proba(query_vec).max()

        # Return the result as a dictionary
        result = {
            'intent': predicted_intent,
            'confidence': round(predicted_prob * 100, 2)
        }

        return result

# Example usage
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a query to classify.")
        sys.exit(1)

    # Paths to the model and vectorizer files
    model_path = 'src/naive_bayes_model.pkl'
    vectorizer_path = 'src/tfidf_vectorizer.pkl'

    # Initialize the classifier
    classifier = NaiveBayesClassifier(model_path, vectorizer_path)

    # Get the query from the command-line arguments
    query = sys.argv[1]

    # Classify the query
    result = classifier.classify(query)

    # Print the result as JSON
    print(json.dumps(result, indent=2))
