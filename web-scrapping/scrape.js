const playwright = require('playwright');
const fs = require('fs');
let postURL = 'https://9gc3i32w1h.execute-api.ap-south-1.amazonaws.com/Prod/hello/';
let uiURL = 'http://www.triconinfotech.com/';

/**
 * This script uses Playwright to automate browser interactions for web scraping and API communication.
 * It performs the following actions:
 * 
 * 1. Opens a new page in the browser.
 * 2. Navigates to a specified UI URL (uiURL) to scrape data from it.
 * 3. Extracts the HTML content of the webpage.
 * 4. Converts the extracted HTML content to JSON format.
 * 5. Saves the JSON data to a file named "jsonContent.json".
 * 6. Makes a POST request to a specified API URL (postURL) sending the JSON data as the payload.
 * 7. Retrieves the response status from the API call and logs it to the console.
 * 8. Closes the browser after completing these actions.
 * 
 * Note: The URLs (uiURL and postURL) and the specific data extraction logic must be defined according to the user's requirements.
 */

(async () => {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    

  await page.goto(uiURL); // Replace with your target URL

  // Extract data using selectors
  const data = await page.evaluateHandle(() => document.body);
    const dataEvalute = await page.evaluateHandle(body => body.innerHTML, data);
    const pageJSON = await dataEvalute.jsonValue();
    await dataEvalute.dispose();

  // Convert the data to JSON
  const json = JSON.stringify(pageJSON, null, 2);
  fs.promises.writeFile("jsonContent.json", json, 'utf-8');
  // POST API call
  const apiResponse = await context.request.post(postURL, {
    data: json,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const responseBody = await apiResponse.status();
  console.log('API Response:', responseBody);  await browser.close();
})();