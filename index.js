"use strict";

const bucket = "pleasenobugs";
const AWS = require("aws-sdk");
const S3 = new AWS.S3();

exports.handler = async (event) => {
  let downloaded = await download();

  let list = downloaded.body;
  console.log("download.body:", list, typeof list);

  let metadata = event.Records[0].s3.object;
  let metaJSON = JSON.stringify(metadata, null, 2);

  console.log("get metadata:", metaJSON);
  list.push(metaJSON);
//   await uploadOnS3("images.json", list);
  console.log("list: ", list);
  await putObjectToS3(bucket, "images.json", list);
};

async function download() {
  try {
    const data = await S3.getObject({
      Bucket: bucket,
      Key: "images.json",
    }).promise();

    return {
      statusCode: 200,
      body: JSON.parse(data.Body.toString("utf-8")),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message || JSON.stringify(err.message),
    };
  }
}

async function putObjectToS3(bucket, key, data) {
  var s3 = new AWS.S3();
  var params = {
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data),
  };
  await s3.putObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("success", data); // successful response
  });
}

// async function uploadOnS3(fileName, fileData) {
//   let params = {
//     Bucket: bucket,
//     Key: fileName,
//     Body: JSON.stringify(fileData),
//   };
//   try {
//     console.log("inside uploadOnS3", params);
//     const res = await S3.upload(params).promise();
//     console.log("response: ", res);
//     return res;
//   } catch (err) {
//     console.log("error has occured: ", err);
//   }
// }
