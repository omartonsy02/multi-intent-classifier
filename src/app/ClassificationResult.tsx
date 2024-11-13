import React from "react";
import { ClassificationResult } from "../../classifier";

interface ClassificationResultProps {
  classification: ClassificationResult;
}

const ClassificationResultComponent: React.FC<ClassificationResultProps> = ({ classification }) => {
  // Find the intent with the highest confidence score
  const highestConfidenceIntent = classification.intents.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );

  // Ensure that only one intent (the highest confidence) is rendered
  return (
    <div className="classification-result">
      <div className="intent-item">
        <p><strong>Intent:</strong> {highestConfidenceIntent.intent}</p>
        <p><strong>Confidence:</strong> {Math.round(highestConfidenceIntent.confidence * 100)}%</p>
      </div>
      <div className="processing-time">
        <p><strong>Processing Time:</strong> {classification.processingTime} ms</p>
      </div>
    </div>
  );
};

export default ClassificationResultComponent;
