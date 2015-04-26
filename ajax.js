/**
 * Send an XMLHttpRequest
 * @param {object} properties The properties of the request.
 * @config {string} [type] The method of the request. Default: "GET"
 * @config {url} [url] The url of the request.
 * @config {object} [requestHeaders] The requestHeaders to use for the request.
 * @config {string} [data] The data to send with the request.
 * @config {string} [dataType] The dataType to return. Default is "TEXT". could be "TEXT", "JSON" and "XML"
 */

function ajax(parameters) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(parameters.type || "GET", parameters.url);
    xhr.addEventListener("load", function() {
      if (xhr.status === 200) {
        if (parameters.dataType === "TEXT" || !parameters.dataType) {
          resolve(xhr.responseText);
          return;
        }
        if (parameters.dataType === "XML") {
          resolve(xhr.responseXML);
          return;
        }
        if (parameters.dataType === "JSON") {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(Error(e));
          }

        }
      } else {
        reject(Error("request failed; error code:" + xhr.statusText));
      }

    });
    xhr.addEventListener("error", reject);

    if (parameters.requestHeaders) {
      for (var header in parameters.requestHeaders) {
        var value = parameters.requestHeaders[header];
        if (value !== null && value !== undefined) {
          xhr.setRequestHeader(header, value);
        }
      }
    }
    xhr.send(parameters.data);
  });
}


ajax({
  "url": "http://www.psykopaint.com/php/dataservice/amfservices/?contentType=application/json",
  "type": "POST",
  "dataType": "JSON",
  "data": JSON.stringify({
    "serviceName": "Main",
    "methodName": "getLatestPaintings",
    "parameters": ["0", "16", "1"]
  })
}).then(function(result) {
  console.log(result);
  var firstPaintingsId = result[0].id;
  console.log(firstPaintingsId);

  //These will set values for the painting urls
  var P1 = result[0].imageURL;
  var P2 = result[1].imageURL;
  var P3 = result[2].imageURL;
  var P4 = result[3].imageURL;
  var P5 = result[4].imageURL;
  var P6 = result[5].imageURL;
  var P7 = result[6].imageURL;
  var P8 = result[7].imageURL;
  var P9 = result[8].imageURL;
  var P10 = result[9].imageURL;
  var P11 = result[10].imageURL;
  var P12 = result[11].imageURL;
  var P13 = result[12].imageURL;
  var P14 = result[13].imageURL;
  var P15 = result[14].imageURL;
  var P16 = result[15].imageURL;

  //These will set values for the original image urls
  var Org1 = result[0].originalURL;
  var Org2 = result[1].originalURL;
  var Org3 = result[2].originalURL;
  var Org4 = result[3].originalURL;
  var Org5 = result[4].originalURL;
  var Org6 = result[5].originalURL;
  var Org7 = result[6].originalURL;
  var Org8 = result[7].originalURL;
  var Org9 = result[8].originalURL;
  var Org10 = result[9].originalURL;
  var Org11 = result[10].originalURL;
  var Org12 = result[11].originalURL;
  var Org13 = result[12].originalURL;
  var Org14 = result[13].originalURL;
  var Org15 = result[14].originalURL;
  var Org16 = result[15].originalURL;

  //this creates the user thumnails in the DOM using the array
  for (var i = 0; i < result.length; i++) {
    document.getElementById("UT" + (i + 1)).src = result[i].user_thumbnailURL;
  }
  //This sets the paintings to thier thumnails images
  for (var i = 0; i < result.length; i++) {
    document.getElementById("P" + (i + 1)).style.backgroundImage = 'url(' + result[i].thumbnailURL200 + ')';
  }
});
