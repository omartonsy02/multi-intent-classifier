import { NextRequest, NextResponse } from 'next/server';
import MultiIntentClassifier, { intentPatterns } from '../../../../classifier';
//import { NaiveBayesClassifier } from '../../../../naiveBayesClassifier';

const multiIntentClassifier = new MultiIntentClassifier(intentPatterns);
//const naiveBayesClassifier = new NaiveBayesClassifier();

export async function POST(req: NextRequest) {
    const { query } = await req.json();
    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        const startTime = Date.now();

        // Get classification results from both classifiers
        const multiIntentResult = multiIntentClassifier.classify(query);
      //  const naiveBayesResult = await naiveBayesClassifier.classify(query);

        // Choose the result with the higher confidence score
      //  const multiIntentConfidence = multiIntentResult.intents[0]?.confidence || 0;
       // const naiveBayesConfidence = naiveBayesResult.confidence || 0;

    //    const finalResult = multiIntentConfidence > naiveBayesConfidence
    //        ? multiIntentResult
     //       : { intents: [{ intent: naiveBayesResult.intent, confidence: naiveBayesConfidence }] };

        const processingTime = Date.now() - startTime;

        // Return the final result with processing time
        return NextResponse.json({ ...multiIntentResult, processingTime: `${processingTime} ms` });
    } catch (error) {
        console.error('Error classifying query:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
