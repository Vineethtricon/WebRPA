const http = require('http');
const https = require('https');
const playwright = require('playwright');

let getURL = 'http://www.triconinfotech.com/';
let postURL = 'https://9gc3i32w1h.execute-api.ap-south-1.amazonaws.com/Prod/hello/';

/**
 * This script uses Playwright to automate browser interactions for web scraping and API communication.
 * It performs the following actions:
 * 
 * 1. Opens a new page in the browser.
 * 2. Navigates to a specified UI URL (getURL) to scrape data from it.
 * 3. Extracts the HTML content of the webpage.
 * 4. Converts the extracted HTML content to JSON format.
 * 5. Saves the JSON data to a file named "jsonContent.json".
 * 6. Makes a POST request to a specified API URL (postURL) sending the JSON data as the payload.
 * 7. Retrieves the response status from the API call and logs it to the console.
 * 8. Closes the browser after completing these actions.
 * 
 * Note: The URLs (getURL and postURL) and the specific data extraction logic must be defined according to the user's requirements.
 */

/**
 * Function to make a GET request to a specified URL and return the response body.
 * @param {string} url - The URL to make the GET request to.
 */

// GET request 
async function httpGet(url) {
  return new Promise((resolve, reject) => {
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
    const data = jsonData;
    const options = {
      hostname: new URL(url).hostname,
      // port: new URL(url).port, //if url has any port numbr use this
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
      let responseBody = '';
      res.setEncoding('utf8');

      res.on('data', (chunk) => { responseBody += chunk; });

      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          body: responseBody
        };
        resolve(response);
      });
    });

    req.on('error', (e) => { reject(e); });
    req.write(data);
    req.end();
  });
}


(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  

await page.goto(getURL); // Replace with your target URL

// Extract data using selectors
const data = await page.evaluateHandle(() => document.body);
  const dataEvalute = await page.evaluateHandle(body => body.innerHTML, data);
  const pageJSON = await dataEvalute.jsonValue();
  await dataEvalute.dispose();

// Convert the data to JSON
const json = JSON.stringify(pageJSON, null, 2);
// POST API call
const response = await httpPost(postURL, json);
//console.log('API Response Body:', response.body);
console.log('API Response Status Code:', response.statusCode);
 await browser.close();
})();

