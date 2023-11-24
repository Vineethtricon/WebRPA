const { test, request } = require('@playwright/test')
//import { test, expect, request } from '@playwright/test';
const { uiCommonUtils } = require('../../utils/uiCommonMethodModule')
const uiMethods = new uiCommonUtils.uiBaseClass.uiBaseClass()


const apiMethods = new uiCommonUtils.apiBaseClass.APIBaseClass()
/*
1. Lounch Triconinfotech URL 
2. Navigate to Menu "Industries", "Solution", "Difference"
3. Validate the Page title 
*/
test.only('Demo Method for Tricon Module', async ({ request, page }) => {
    const URL = "https://postman-echo.com/post"
    const payload = "triconWebSiteHomeData.json"
   await uiMethods.uiToJson(page)
   await apiMethods.httpsPOSTCall({request,URL, payload})
  

})