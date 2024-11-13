import { PythonShell } from 'python-shell';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const options = {
      mode: 'text' as 'text', // Explicitly set the type to 'text'
      pythonOptions: ['-u'],
      scriptPath: './python-scripts/',
      args: [query],
    };

    // Use Promise to handle PythonShell
    PythonShell.run('naive_bayes_predict.py', options);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
