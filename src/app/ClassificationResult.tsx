import React from "react";
import { ClassificationResult } from "../classifier";

interface ClassificationResultProps {
  classification: ClassificationResult;
}

const ClassificationResultComponent: React.FC<ClassificationResultProps> = ({ classification }) => {
  return (
    <div className="classification-result">
      {classification.intents.map((intentItem, index) => (
        <div key={index} className="intent-item">
          <p><strong>Intent:</strong> {intentItem.intent}</p>
          <p><strong>Confidence:</strong> {Math.round(intentItem.confidence * 100)}%</p>
        </div>
      ))}
    </div>
  );
};

export default ClassificationResultComponent;
