<?php
// This script processes the POST parameters from the client-side code and returns a JSON-encoded array of sorted data from a CSV file

// Define the maximum file size in bytes
define("MAX_FILE_SIZE", 1000000);

// Validate and sanitize the POST parameters
$sortColumn = filter_input(INPUT_POST, "sortColumn", FILTER_SANITIZE_NUMBER_INT);

// Check if the sortColumn parameter is valid
if ($sortColumn >= 0 && $sortColumn <= 3) {

    // Check if the csvFile parameter is a valid file upload
    if (isset($_FILES["csvFile"]) && $_FILES["csvFile"]["error"] == UPLOAD_ERR_OK) {

        // Get the file name, type, size, and temporary location
        $fileName = $_FILES["csvFile"]["name"];

        $fileType = $_FILES["csvFile"]["type"];

        $fileSize = $_FILES["csvFile"]["size"];

        $fileTmpName = $_FILES["csvFile"]["tmp_name"];
        
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);

        // Check if the file name has a .csv extension
        if ($extension == "csv") {

            // Check if the file type is text/csv
            if ($fileType == "text/csv") {

                // Check if the file size is within the limit
                if ($fileSize <= MAX_FILE_SIZE) {

                    // Call the function to read and sort the CSV file based on the sortColumn parameter
                    $data = readAndSortCSV($fileTmpName, $sortColumn - 1);

                    // Encode the data array as a JSON string
                    $json = json_encode($data);

                    // Send the JSON string as a response to the client-side
                    echo $json;

                } else {

                    // File size exceeds the limit
                    echo "Error: File size is too large.";
                }
            } else {

                // File type is not text/csv
                echo "Error: File type is not supported.";
            }
        } else {
            
            // File name does not have a .csv extension
            echo "Error: File name is not valid.";
        }
    } else {

        // csvFile parameter is not a valid file upload
        echo "Error: No file was uploaded or there was an error during upload.";
    }

} else {

    // sortColumn parameter is not valid
    echo "Error: Invalid sort column option.";
}

// This function reads and sorts a CSV file based on a given column index and returns an associative array of data records
function readAndSortCSV($file, $column) {
    $data = [];
    $handle = fopen($file, "r");
    
    if ($handle !== false) {
        $fields = fgetcsv($handle);
        
        while (($values = fgetcsv($handle)) !== false) {
            $entry = array_combine($fields, $values);
            $data[] = $entry;
        }
        
        fclose($handle);
        
        usort($data, function ($a, $b) use ($fields, $column) {
            return strnatcasecmp($a[$fields[$column]], $b[$fields[$column]]);
        });
    }
    
    return $data;
}

?>