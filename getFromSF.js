var request = require("request");

let authResponse = {};
var authToken;

var SFTokenOptions = { 
    method: `POST`,
    url: `https://login.salesforce.com/services/oauth2/token`,
    qs: 
    {   grant_type: `password`,
        client_id: `3MVG9_XwsqeYoueKgrACbJJ7N0IcMhxUVPzjFNl3_CPbXM1jIoiISPmVhIMLCJ0cnyNC7IhMo2xx5XhbFpFP7`,
        client_secret: `C2DCF62D4C415A41D829936D61AE137B32F4D669CF6D619E8400E6984467F370`,
        username: `joshbrown2019@jb.com`,
        password: `Aa11001001\!9qRAB14y2Ksacu77HfG7iTBP` 
    }
//     ,
//     headers: 
//    { 'cache-control': 'no-cache',
//      Connection: 'keep-alive',
//      'Content-Length': '0',
//      Cookie: 'BrowserId=Anyj4cuoR_yCqoaNjxixHg',
//      'Accept-Encoding': 'gzip, deflate',
//      Host: 'login.salesforce.com',
//      'Postman-Token': '72bd5980-56b5-47ac-ae8f-08ab9967cb1b,d1b027f2-c4ee-4af7-8d3f-0860834a510f',
//      'Cache-Control': 'no-cache',
//      Accept: '*/*',
//      'User-Agent': 'PostmanRuntime/7.18.0' }
   
};

var SFQueryOptions = { 
    method: 'GET',
    url: 'https://na114.salesforce.com/services/data/v40.0/limits/recordCount',
    qs: { sObjects: 'Opportunity' },
    headers: {
        Authorization: ""
    }
};

var WoBoOptions = { 
    method: 'POST',
    url: 'https://myworkboard.com/wb/apis/hook/',
    qs: { 
        metric_id: '226910', 
        metric_data: 0,
        metric_comment: "Test data via Heroku"
    }
    // ,
    // headers: 
    // { 'cache-control': 'no-cache',
    //   Connection: 'keep-alive',
    //   'Content-Length': '0',
    //   Cookie: 'BrowserId=Anyj4cuoR_yCqoaNjxixHg',
    //   'Accept-Encoding': 'gzip, deflate',
    //   Host: 'www.workboard.com',
    //   'Postman-Token': 'e99b7b78-abc0-41a0-b10f-b41f0ba1b34d,3fe66a64-d854-4bd8-b859-3546b963da6f',
    //   'Cache-Control': 'no-cache',
    //   Accept: '*/*',
    //   'User-Agent': 'PostmanRuntime/7.18.0' }
};

let getToken = async() => {
    await request(SFTokenOptions, function(error, response, body) {
        if (error) throw new Error(error);
        authResponse = JSON.parse(body);
        authToken = authResponse.token_type + " " + authResponse.access_token
        console.log("AuthToken: ", authToken)
        SFQueryOptions.headers.Authorization = authToken;
        let getOpportunityCount = async() => {
            await request(SFQueryOptions, function(error, response, body) {
                if (error) throw new Error(error);
                WoBoOptions.qs.metric_data = JSON.parse(body).sObjects[0].count;
                let sendToWoBo = async function() {
                    console.log("Return data from Salesforce: ", WoBoOptions.qs.metric_data)
                    await request(WoBoOptions, function(error, response, body) {
                        if (error) throw new Error(error);
                        result = JSON.parse(body);
                        console.log("Authorization string: ", authResponse)
                        console.log("Results", result)
                    })
                    return;
                }
                sendToWoBo();
            })
        }
        getOpportunityCount();
    })
}
getToken();
