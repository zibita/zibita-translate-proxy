const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Zibita Proxy on Render is active.');
});

app.post('/', async (req, res) => {
  const { q } = req.body;
  if (!q) return res.status(400).json({ error: 'Missing text (q)' });

  try {
    const response = await axios.post('https://libretranslate.com/translate', {
      q,
      source: 'auto',
      target: 'fa',
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const translatedText = response?.data?.translatedText || '[⚠️ ترجمه انجام نشد]';
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed', detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('✅ Zibita Translate Proxy running on port', PORT);
});
