/**
    @author   Stephen Adams <stephen.adams5@mohawkcollege.ca
    @purpose  Client side code for COMP 10260 Assignment 2
    @revision 2023.35.0
 */

document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('csvFileInput');
    const sortColumn = document.querySelector('input[name="sortColumn"]:checked').value;
    const file = fileInput.files[0];
    
    if (file) {
        const formData = new FormData();
        formData.append('csvFile', file);
        formData.append('sortColumn', sortColumn);

        fetch('file_processor.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            const resultTable = document.getElementById('resultTable');
            resultTable.innerHTML = ''; // Clear previous results

            const table = document.createElement('table');
            table.className = "table table-striped table-light text-center";
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Create table header row
            const headerRow = document.createElement('tr');
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Create table data rows
            data.forEach(rowData => {
                const row = document.createElement('tr');
                Object.values(rowData).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value.replace(/&amp;/g, '&');
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            resultTable.appendChild(table);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please select a CSV file to upload.');
    }
});