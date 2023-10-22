<?php
// This script processes the GET parameters from the client-side code and returns a JSON-encoded array of sorted data from a text file

// Define the file names for the data sources
$pokemonFile = "pokemon.txt";
$moviesFile = "movies.json";

// Validate and sanitize the GET parameters
$choice = filter_input(INPUT_GET, "choice", FILTER_SANITIZE_STRING);
$sort = filter_input(INPUT_GET, "sort", FILTER_SANITIZE_STRING);

// Check if the choice parameter is valid
if ($choice == "pokemon" || $choice == "movies") {

    // Check if the sort parameter is valid
    if ($sort == "a" || $sort == "d") {

        $data = ($choice == "pokemon") ? read_pokemon_file($pokemonFile) : read_movies_file($moviesFile);
        
        // Sort the data array by name based on the sort parameter
        if ($sort == "a") {
            usort($data, "compare_ascending");
        } else {
            usort($data, "compare_descending");
        }
        // Encode the data array as a JSON string
        $json = json_encode($data);

        // Send the JSON string as a response to the client-side
        echo $json;

    } else {
        // Invalid sort parameter
        echo "Error: Invalid sort option.";
    }
} else {
    // Invalid choice parameter
    echo "Error: Invalid choice option.";
}

// This function reads the pokemon.txt file and returns an associative array of name and image pairs
function read_pokemon_file($file) {

    // Initialize an empty array to store the data
    $pokemon = [];

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES); //https://www.phptutorial.net/php-tutorial/php-file/

    // Loop through the file line by line until the end of file is reached
        for($i=0; $i<count($lines); $i+=2){
            $name = trim($lines[$i]);
            $image = trim($lines[$i+1]);
            
            if ($name != "" && $image != "") {
                // Create an associative array with name and image as keys and values
                $entry = ["name" => $name, "image" => $image];
                
                // Append the entry to the pokemon array
                $pokemon[] = $entry;   
            }
        }
    // Return the pokemon array
    return $pokemon;
}

// This function reads the movies.json file and returns an associative array of movie records
function read_movies_file($file) {

    // Initialize an empty array to store the data
    $movies = [];

    // Get the contents of the file or exit with an error message
    $json = file_get_contents($file) or die("Error: Unable to open file.");

    // Decode the JSON string into an associative array
    $movies = json_decode($json, true);

    // Return the movies array
    return $movies;
}

// This function compares two elements of an array by their name values in ascending order
function compare_ascending($a, $b) {
    return strcmp($a["name"], $b["name"]);
}

// This function compares two elements of an array by their name values in descending order
function compare_descending($a, $b) {
    return strcmp($b["name"], $a["name"]);
}
?>