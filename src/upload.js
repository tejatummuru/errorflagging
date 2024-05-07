import React, { useRef, useState } from 'react';
import * as turf from '@turf/turf';
import midwestCounties from './geoJson-Midwest.json'; // Updated import

// Function to find county by coordinates using Turf.js and the GeoJSON data
async function findCountyByCoordinates(longitude, latitude) {
  try {
      // Update the URL to use the FCC's API endpoint
      const url = `https://geo.fcc.gov/api/census/block/find?latitude=${latitude}&longitude=${longitude}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      // Extract the county name from the FCC's response structure
      // Note: Adjust the path if necessary based on the actual response structure
      const countyName = data.County?.name;
      return countyName || 'County information not available';
  } catch (error) {
      console.error('Error finding county:', error);
      return 'Error finding county';
  }
}

// Function to get HUC code from  server
// async function fetchHucCode(latitude, longitude) {
//   const response = await fetch(`http://localhost:3001/getHucFromCoordinates?lat=${latitude}&lon=${longitude}`);
//   const data = await response.json();
//   console.log("huc info: ", data);
//   return data.hucCode;
// }
// Function to fetch HUC12 code based on latitude and longitude
// Function to fetch HUC12 code based on latitude and longitude
// Function to fetch HUC12 code from your server based on latitude and longitude
async function fetchHucByCoordinates(latitude, longitude) {
  try {
    // Construct the URL to your server endpoint
    const queryUrl = `http://localhost:3001/getHucFromCoordinates?lat=${latitude}&lon=${longitude}`;

    const response = await fetch(queryUrl);
    if (!response.ok) throw new Error('Failed to fetch HUC data from server');

    const data = await response.json();
    if (!data.hucId) throw new Error('No HUC ID returned from server');

    // Return the HUC ID from the server response
    return data.hucId;
  } catch (error) {
    console.error('Error fetching HUC ID from server:', error);
    return 'HUC information not available';
  }
}

// Function to enrich species data with county and HUC info using the GeoJSON data
async function enrichSpeciesData(speciesData) {
  // Use Promise.all to wait for all asynchronous operations to complete
  const enrichedData = await Promise.all(speciesData.map(async (species) => {
    // Skip processing if coordinates are not available
    if (species.latitude === "N/A" || species.longitude === "N/A") {
      console.log(`Skipping species ${species.genus} ${species.species} due to missing coordinates.`);
      return species;
    }

    try {
      // Fetch county and HUC information
      const countyName = await findCountyByCoordinates(parseFloat(species.longitude), parseFloat(species.latitude));
      const huc12Code = await fetchHucByCoordinates(species.latitude, species.longitude);

      // Update the species object
      return {
        ...species,
        county: countyName || 'County information not available',
        huc: huc12Code || 'HUC information not available'
      };
    } catch (error) {
      console.error(`Error enriching species ${species.genus} ${species.species}:`, error);
      return species; // Return original species data in case of an error
    }
  }));
  console.log("enriched: ", enrichedData);
  return enrichedData;
}

const UploadCsv = ({ handleLinesSplited }) => {
    const fileRef = useRef(null);
    const [disabled, setDisabled] = useState(true);

    const preprocessData = (lines) => {
      // Extract headers and convert them to lower case, trimming spaces
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      // Define the columns you need
      const requiredColumns = ['genus', 'species', 'latitude', 'longitude', 'catalog_number', 'max_error_meters'];
      // Get indices of required columns in the header
      const requiredIndices = requiredColumns.map(col => headers.indexOf(col));
  
      // Process each line starting from the second one (to skip the header)
      return lines.slice(1).map((lineStr) => {
          const lineParts = lineStr.split(',').map(part => part.trim());
          // Initialize an object to hold processed data for the current line
          const processedData = {};
  
          // Populate the object, ensuring every required field gets a value or 'N/A'
          requiredColumns.forEach((col, i) => {
              const value = lineParts[requiredIndices[i]];
              processedData[col] = value ? value : 'N/A'; // Use existing value or 'N/A' if empty
          });
  
          // Ensure the row is included if it has a catalog number
          return processedData.catalog_number !== 'N/A' ? processedData : null;
      }).filter(record => record !== null); // Filter out any null entries
  };  

    const getFile = () => fileRef.current?.files?.[0] ?? null;

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const file = getFile();
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    const lines = text.split(/\r?\n|\r/);
                    const preprocessedData = preprocessData(lines);
                    console.log(preprocessedData);
                    const m = enrichSpeciesData(preprocessedData);
                    handleLinesSplited(preprocessedData);
                    console.log("printing: ", m)
                };
                reader.readAsText(file);
                setDisabled(false); // Enable the upload button once a file is selected
            }
        }}>
            <input type="file" ref={fileRef} accept=".csv" onChange={() => setDisabled(!getFile())} />
            <br />
            <input type="submit" value="Upload" disabled={disabled} />
        </form>
    );
};

export default UploadCsv;