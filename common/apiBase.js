const triconModule = require('animeshtricon');
const fs = require('fs');


export class APIBaseClass {

    constructor() {
        this.triconModule = triconModule;
    }

   async httpsPOSTCall ({ request, URL, payload }) {
        const response = await request.post(URL, {
            data: await triconModule.readJSONfile(payload),
            headers: {
                'Content-Type': 'application/json'
                
            }
        });
        const responseText = await response.text()
        console.log("Response Code => ", response.status())
        return response
    }

}
