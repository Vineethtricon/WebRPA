const playwright = require('playwright');
const fs = require('fs');
let postURL = 'https://9gc3i32w1h.execute-api.ap-south-1.amazonaws.com/Prod/hello/';
let uiURL = 'http://www.triconinfotech.com/';

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