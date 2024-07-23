const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/numerology', (req, res) => {
    const apiUrl = `https://openapi.cozeable.com/numerology/?fullName=${req.query.fullName}&dateOfBirth=${req.query.dateOfBirth}`;
    request(apiUrl).pipe(res);
});

app.post('/save-temp-file', (req, res) => {
    const { fullName, dateOfBirth, data } = req.body;
    const dateParts = dateOfBirth.split('%2F');
    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    const fileName = `${fullName.replace(/\s+/g, '_')}_${formattedDate}.html`;
    const filePath = path.join(__dirname, 'public', fileName);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Numerology Analysis Result</title>
    </head>
    <body>
        <h1>Numerology Analysis Result</h1>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    </body>
    </html>`;

    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error('Error saving the file:', err);
            res.status(500).send('Error saving the file.');
        } else {
            res.send(fileName);
        }
    });
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
