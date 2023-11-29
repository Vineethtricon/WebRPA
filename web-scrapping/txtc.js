const http = require('http');
const https = require('https');
const fs = require('fs');
/**
 * Function to make a GET request to a specified URL and return the response body.
 * @param {string} url - The URL to make the GET request to.
 */


async function httpGet(url) {
  return new Promise((resolve, reject) => {
    // Choose the correct module based on the protocol
    const protocol = new URL(url).protocol;
    const lib = protocol === 'https:' ? https : http;

    const handleResponse = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        httpGet(res.headers.location).then(resolve).catch(reject);
      } else if (res.statusCode < 200 || res.statusCode >= 300) {
        // Handle other HTTP errors
        reject(new Error('statusCode=' + res.statusCode));
      } else {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { resolve(data); });
      }
    };

    lib.get(url, handleResponse).on('error', reject);
  });
}


/**
 * Function to make a POST request to a specified URL with JSON data.
 * @param {string} url - The URL to make the POST request to.
 * @param {object} jsonData - The JSON data to send in the POST request.
 */
async function httpPost(url, jsonData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(jsonData);
    const options = {
      hostname: new URL(url).hostname,
      port: new URL(url).port,
      path: new URL(url).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const protocol = new URL(url).protocol;
    const lib = protocol === 'https:' ? https : http;

    const req = lib.request(options, (res) => {
      // Check for redirect
      if (res.statusCode === 307 && res.headers.location) {
        // Follow redirect
        return httpPost(res.headers.location, jsonData).then(resolve).catch(reject);
      } else {
        // Resolve with the status code
        resolve(res.statusCode);
      }
    });

    req.on('error', (e) => { reject(e); });
    req.write(data);
    req.end();
  });
}


// Main function
(async () => {
  let getURL = 'http://www.triconinfotech.com/';
  let postURL = 'https://9gc3i32w1h.execute-api.ap-south-1.amazonaws.com/Prod/hello/';

  try {
    // Perform GET request
    const pageContent = await httpGet(getURL);

    // Save the content to a file
    fs.writeFileSync('jsonContent.json', pageContent, 'utf8');

    // Perform POST request
    const response = await httpPost(postURL, pageContent);
    console.log('API Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();
