function getNumerologyAnalysis() {
    const fullName = document.getElementById('fullName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    if (fullName && dateOfBirth) {
        const dateParts = dateOfBirth.split('-');
        const formattedDate = `${dateParts[2]}%2F${dateParts[1]}%2F${dateParts[0]}`;
        const url = `http://localhost:3000/numerology?fullName=${encodeURIComponent(fullName)}&dateOfBirth=${formattedDate}`;

        console.log('Request URL:', url);

        fetch(url)
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                document.getElementById('result').innerText = 'Processing...';

                // Send the result to the server to save as a temporary file
                fetch('http://localhost:3000/save-temp-file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fullName, dateOfBirth, data }),
                })
                .then(response => response.text())
                .then(fileName => {
                    console.log('File saved as:', fileName);
                    document.getElementById('result').innerHTML = `<a href="/download/${fileName}" target="_blank">Download the result</a>`;
                })
                .catch(error => {
                    console.error('Error saving the file:', error);
                    document.getElementById('result').innerText = 'Error saving the result.';
                });
            })
            .catch(error => {
                console.error('Error fetching the numerology analysis:', error);
                document.getElementById('result').innerText = 'Error fetching the numerology analysis.';
            });
    } else {
        alert('Please fill in all fields.');
    }
}
