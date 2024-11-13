import { PythonShell } from 'python-shell';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.body.query;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Define the options without explicitly using PythonShell.Options
    const options = {
      mode: 'text' as const, // Explicit type assertion for mode
      pythonOptions: ['-u'],
      scriptPath: './python-scripts/',
      args: [query],
    };

    // Use Promise for async handling of PythonShell
    const result = await new Promise<string[]>((resolve, reject) => {
      PythonShell.run('naive_bayes_predict.py', options);
    });

    // Check for empty results
    if (!result || result.length === 0) {
      return res.status(500).json({ error: 'No response from Python script' });
    }

    // Parse the prediction result from Python script
    const intentPrediction = JSON.parse(result[0]);
    res.status(200).json(intentPrediction);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
