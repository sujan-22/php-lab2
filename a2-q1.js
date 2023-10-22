// Add event listeners to the buttons
document.getElementById("pokemonButton").addEventListener("click", function() {
    fetchData("pokemon");
});

document.getElementById("moviesButton").addEventListener("click", function() {
    fetchData("movies");
});

document.getElementById("sortDropdown").addEventListener("change", function() {
    if (elementExists('movies'))
        fetchData('movies');
    else if (elementExists('pokemon'))
        fetchData('pokemon');
});

fetch( "me.php" )
.then( response => {
    if ( !response.ok ) {
        throw new Error(response.status+" "+response.statusText)
    } else {
        return response.text();
    } 
} )
.then( data => document.getElementById( "student_info" ).innerHTML = data )
.catch( error => document.getElementById( "student_info" ).innerHTML = '<strong>'+error+'</strong>' );

// Check if a hidden element with a specific ID exists
function elementExists(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        return true;
    }
    return false;
}

// Function to send a fetch request to data_processor.php
function fetchData(choice) {
    // Get the selected sorting option
    const sortDropdown = document.getElementById("sortDropdown");
    const sortOption = sortDropdown.options[sortDropdown.selectedIndex].value;

    // Build the URL with the selected parameters
    const url = `data_processor.php?choice=${choice}&sort=${sortOption}`;

    // Fetch data from data_processor.php
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Clear previous results
            const resultContainer = document.getElementById("resultContainer");
            resultContainer.innerHTML = "";

            if (Array.isArray(data)) {
                const flag = document.createElement("div");
                // Check if the response contains images or years
                if (data[0].hasOwnProperty("image")) {
                    resultContainer.className = "container";
                    flag.id = "pokemon";
                    flag.style.display = "none";

                    // Create a row to allow pictures to float in
                    const row = document.createElement("div");
                    row.className = "row";

                    // Create picture containers with images and names
                    // Create a pictureContainer with a maximum dimension of 150x150                   
                    data.forEach( item => {
                        const pictureContainer = document.createElement("picture");
                        pictureContainer.className = "col-lg-3 col-md-3 col-sm-3 col-xs-6 text-center";

                        const image = document.createElement("img");
                        image.className = "img-fluid";
                        image.src = item.image;
                        image.alt = `An image of ${item.name}`;
                        image.style.width="100%";
                        image.style.height="auto";
                        image.style.maxWidth = "150px";
                        image.style.maxHeight = "150px";
                        const title = document.createElement("p");
                        title.className = "text-center";
                        title.textContent = item.name;
                        title.style.width = "100%";

                        // Append image and title to the pictureContainer
                        pictureContainer.appendChild(image);
                        pictureContainer.appendChild(title);

                        // Append pictureContainer to the column
                        row.appendChild(pictureContainer);
                    });

                    // Append the column to the row, and the row to the resultContainer
                    resultContainer.appendChild(row);
               } else if (data[0].hasOwnProperty("year")) {
                    flag.id = "movies";
                    // Create a table with years and names
                    const table = document.createElement("table");
                    table.className = "table table-striped table-light";
                    const thead = document.createElement("thead");
                    const tbody = document.createElement("tbody");

                    // Create table header
                    const headerRow = thead.insertRow();
                    headerRow.className = "table-danger";
                    const yearHeader = document.createElement("th");
                    yearHeader.textContent = "Year";
                    const nameHeader = document.createElement("th");
                    nameHeader.textContent = "Name";
                    headerRow.appendChild(yearHeader);
                    headerRow.appendChild(nameHeader);

                    // Create table rows
                    data.forEach(item => {
                        const row = tbody.insertRow();
                        const yearCell = row.insertCell();
                        yearCell.textContent = item.year;
                        const nameCell = row.insertCell();
                        nameCell.textContent = item.name;
                    });

                    table.appendChild(thead);
                    table.appendChild(tbody);
                    resultContainer.appendChild(table);
                }
                resultContainer.appendChild(flag);
            }
        })
        .catch(error => {
            console.error("Error fetching data: " + error);
        });
}