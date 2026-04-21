export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { jobDescription, resume, tone } = req.body;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: 'You are an expert career coach and cover letter writer.' },
        { role: 'user', content: `Write a ${tone} cover letter for this job:\n\n${jobDescription}\n\nCandidate background:\n${resume}\n\nThen write ---TIPS--- followed by 3 resume tips starting with • ` }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}