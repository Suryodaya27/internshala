const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/', (req, res) => {
    const payload = req.body;
    const str = payload.str;

    // Using regex to count words
    const wordCount = (str.match(/\S+/g) || []).length;

    if (wordCount >= 8) {
        res.status(200).send('200 OK');
    } else {
        res.status(406).send('Not Acceptable');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
