const fetch = require('node-fetch');
const fs = require('fs');

async function fetchNumerologyData(fullName, dateOfBirth) {
    const url = `https://openapi.cozeable.com/numerology/?fullName=${encodeURIComponent(fullName)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        fs.writeFileSync('numerologyData.json', JSON.stringify(data, null, 2));
        console.log('Data has been saved to numerologyData.json');
    } catch (error) {
        console.error('Error fetching the numerology analysis:', error);
    }
}

fetchNumerologyData('Phan Dung', '2007-08-13');
