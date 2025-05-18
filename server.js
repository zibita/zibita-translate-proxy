const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/translate', async (req, res) => {
    const { q } = req.body;
    if (!q) return res.status(400).json({ error: 'Missing "q" field in request body.' });

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a professional Persian translator.' },
                { role: 'user', content: `Translate this to fluent Persian: ${q}` }
            ],
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const translatedText = response.data.choices[0].message.content.trim();
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Translation failed', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Zibita Proxy running on port ${PORT}`));
