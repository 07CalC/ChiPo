const cloudinary = require("cloudinary").v2;

function objectToQueryString(data) {
  // Build set list
  let set = '';
  for (const name of Object.keys(data)) {
    if (set) set += ', ';
    //if value is string put it in another quotes
    if (typeof data[name] === 'string') {
      set += `${name} = '${data[name]}'`;
    } else {
      set += `${name} = ${data[name]}`;
    }
  }
  return set;
}

function objectArrayToJsonString(data) {
  let set = '';
  for (const name of Object.keys(data)) {
    if (set) set += ', ';
    set += `${name} = '${JSON.stringify(data[name])}'`;
  }
  return set;
}

function removeDuplicates(data) {

  // Create an array of objects
  jsonObject = data.map(JSON.stringify);
  uniqueSet = new Set(jsonObject);
  uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return uniqueArray;
}

async function imgToUrl(imgData) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadResponse = await cloudinary.uploader.upload(imgData);
  return uploadResponse.secure_url;
}


module.exports = { objectToQueryString, objectArrayToJsonString, removeDuplicates, imgToUrl};