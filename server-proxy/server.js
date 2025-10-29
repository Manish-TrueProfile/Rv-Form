const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/submit-form', async (req, res) => {
    console.log(req.body)
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw5xUaKiCImsEMO81i0VqphXu_9JufrfAI9uPZxN_c-2YswWaMsLxXZMshBkTFQ_ztp/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch {
            res.status(response.status).send(text);
        }

    } catch (error) {
        console.error('Error forwarding to Apps Script:', error);
        res.status(500).json({ error: 'Failed to forward request', details: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

