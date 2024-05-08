async function getDataPage(page) {
  if (page) {
    ORG="ublue-os"
    API_URL="https://github.com/orgs/" + ORG + "/packages?ecosystem=container&page=";
    GET_URL = API_URL + page;
    
    let ghData = {};
    
    const response = await fetch(GET_URL)
    const data = await response.text()
    const packages = [...data.matchAll(/<a class=\"text-bold f4 Link--primary\" style=\"text-overflow: ellipsis\" title=\".*\" href=\".*\">(.*)<\/a>/g)]
    const pulls = [...data.matchAll(/\s+([\d\.?]+[km]?)\s*<\/span>/g)]
    
    for(let i = 0; i < packages.length; i++) {
      pullData = pulls[i][1];

      if(pullData.indexOf('k') > -1) {
        pullData = Math.floor(parseFloat(pullData) * 1000);
      } else if(pullData.indexOf('m') > -1) {
        pullData = Math.floor(parseFloat(pullData) * 1000000);
      } else {
        pullData = parseInt(pullData);
      }

      ghData[packages[i][1]] = pullData;
    }
    return await ghData;
  } 
}

async function getData(){
  let ghData = {};
  let returned = 30;
  let page = 1;
  while(returned != 0) {
    let data = await getDataPage(page);
    returned = Object.keys(data).length;
    ghData = {...ghData, ...data};
    page++;
  }
  return ghData;
}

getData().then(data => {
  // current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

  // prints date & time in YYYY-MM-DD format
  actualDate = year + "-" + month + "-" + date;

  realData = {};
  realData[actualDate] = data;

  const { readFileSync, writeFileSync } = require('fs');
  const priorData = readFileSync('./data/data.json');
  const priorDataJSON = JSON.parse(priorData);
  const newData = {...priorDataJSON, ...realData};

  try {
    writeFileSync('./data/data.json', JSON.stringify(newData, null, 2), 'utf8');
    console.log('Data successfully saved to disk');
  } catch (error) {
    console.log('An error has occurred ', error);
  }

  const { Storage } = require('@google-cloud/storage')

  // Initialize storage
  const storage = new Storage({
    keyFilename: `./secrets/the-grid-creds.json`,
  })

  const bucketName = 'ghp-stats'
  const bucket = storage.bucket(bucketName)

  const gcsFile = bucket.file(`${ORG}/data.json`)
  gcsFile.save(JSON.stringify(newData, null, 2), function (err) {
    if (!err) {
      console.log(`${ORG} data.json uploaded to ${bucketName}.`)
    } else {
      console.error(`Error uploading data: ${err}`)
    }
  })

  // Sending the upload request
  /*bucket.upload(
    `./data/data.json`,
    {
      destination: `${ORG}/data.json`,
    },
    function (err, file) {
      if (err) {
        console.error(`Error uploading data: ${err}`)
      } else {
        console.log(`${ORG} data.json uploaded to ${bucketName}.`)
      }
    }
  )*/

});