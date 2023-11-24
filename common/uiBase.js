const triconModule = require('animeshtricon');
const { expect } = require('@playwright/test');
import { pageFactoryUtils } from "../utils/uiPageFactoryModule";
const fs = require('fs');

const pageFactory = pageFactoryUtils.pageOne.triconHomePage;

export class uiBaseClass {
    constructor() {
        this.triconModule = triconModule;
    }

    // Launches a given URL and sets the viewport size.
    async launchURL(page) {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');
    }

    // Extracts data from a webpage and saves it as a JSON file.
    async uiToJson(page) {
        // First, navigate to the URL.
        await this.launchURL(page);

        // Extract data from the page.
        const data = await page.evaluate(() => {
            const jsonData = [];
            // Replace 'div' with the appropriate selector to target specific elements.
            const elements = document.querySelectorAll('div');

            // Iterates through the elements and extracts the required data.
            for (let element of elements) {
                jsonData.push({
                    id: element.id,
                    className: element.className,
                    content: element.textContent
                });
            }

            return jsonData;
        });

        // Save the extracted data to a JSON file.
        // Ensure the file path is correct and accessible.
        fs.writeFile('triconWebSiteHomeData.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('Successfully wrote data to triconWebSiteHomeData.json');
            }
        });

        // Wait for some time to ensure file writing is completed.
        await page.waitForTimeout(5000);
    }
}
