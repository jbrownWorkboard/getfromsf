var request = require("request");

var SFQueryOptions = { 
    method: 'GET',
    url: 'https://na114.salesforce.com/services/data/v40.0/limits/recordCount',
    qs: { sObjects: 'Opportunity' },
    headers: 
        {
        Authorization: 'Bearer 00D3k000000tGbH!ARkAQNOZGb0EBpihDCKw9fDlcKzAWXa7.xyztPm5gtrwywJUJSp36ZdNX1zGNZC4SkUYwMhRG8UXWBC0KI_6XL3iaZgB6cLw' 
        } 
    };

var WoBoOptions = { 
    method: 'POST',
    url: 'https://myworkboard.com/wb/apis/hook/27b674dd4ed5ea04fbf5ae0666b5fe089de9a792',
    qs: { 
        metric_id: '226910', 
        metric_data: 0,
        metric_comment: "TestDataFromSFDC-FromHeroku"
    }
};

let getOpportunityCount = async() => {
    await request(SFQueryOptions, function(error, response, body) {
        if (error) throw new Error(error);
        WoBoOptions.qs.metric_data = JSON.parse(body).sObjects[0].count;
        var sendToWoBo = async function() {
            await request(WoBoOptions, function(error, response, body) {
                if (error) throw new Error(error);
                result = JSON.parse(body);
            })
            return;
        }
        sendToWoBo();
    })
    console.log("Done")
}

getOpportunityCount();