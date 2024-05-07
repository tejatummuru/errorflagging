// const express = require('express');
// let fetch;
// (async () => {
//   fetch = (await import('node-fetch')).default;
// })();

// const app = express();

// const PORT = process.env.PORT || 3001; // You can choose your port here

// app.use(express.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// app.get('/getCounty', async (req, res) => {
//     const { longitude, latitude } = req.query;
//     const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${longitude}&y=${latitude}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         res.send(data);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const app = express();
const port = 3001; // Example port
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes
// Require client library and private key.
var ee = require('@google/earthengine');
var privateKey = require('/Users/tejasvinitummuru/errorflagging/client/fishes-of-texas-417717-5dd8551aec64.json');

// Initialize client library and run analysis.
var runAnalysis = function() {
  ee.initialize(null, null, function() {
    // ... run analysis ...
  }, function(e) {
    console.error('Initialization error: ' + e);
  });
};

// Authenticate using a service account.
ee.data.authenticateViaPrivateKey(privateKey, runAnalysis, function(e) {
  console.error('Authentication error: ' + e);
});
// Assuming you've already set up Express app and Earth Engine initialization

// Endpoint to get HUC for given coordinates
app.get('/getHucFromCoordinates', (req, res) => {
    // Extract latitude and longitude from query parameters
    console.log("Endpoint hit with query:", req.query);
    const { lat, lon } = req.query;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    // Check for missing parameters
    if (!lat || !lon) {
      return res.status(400).send({error: 'Missing latitude or longitude query parameters.'});
    }
  
    // Convert lat and lon to numbers
    const latitude = Number(lat);
    const longitude = Number(lon);
  
    // Define the point using the given coordinates
    const point = ee.Geometry.Point([longitude, latitude]);
  
    // Define the HUC dataset
    const hucDataset = ee.FeatureCollection("USGS/WBD/2017/HUC12");
  
    // Filter the dataset to find HUCs intersecting with the point
    const intersectingHUCs = hucDataset.filterBounds(point);
  
    // Attempt to get the first intersecting HUC's properties
    intersectingHUCs.first().evaluate((feature) => {
      // Safely check if the feature and its properties exist
      if (feature && feature.properties && feature.properties['huc12']) {
        console.log("HUC confirmed: ", feature.properties['huc12']);
        // Send HUC ID back as response
        res.send({ hucId: feature.properties['huc12'] });
      } else {
        console.log('No HUC found for this location:', feature);
        res.status(404).send({ error: 'No HUC found for this location.' });
      }
    });
});
  
// app.get('/', (req, res) => {
//     res.send('Hello, World! Server is running.');
//   });
  
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
