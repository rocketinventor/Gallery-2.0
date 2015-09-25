/**
 * Send an XMLHttpRequest
 * @param {object} properties The properties of the request.
 * @config {string} [type] The method of the request. Default: "GET"
 * @config {url} [url] The url of the request.
 * @config {object} [requestHeaders] The requestHeaders to use for the request.
 * @config {string} [data] The data to send with the request.
 * @config {string} [dataType] The dataType to return. Default is "TEXT". could be "TEXT", "JSON" and "XML"
 */

var images;
var page;
var methodName;
var methodPrev;

// get #/this/blah
var getHashMain = function() {
  var str;
  str = location.hash.split("#/").pop();
  str = str.substring(0, str.indexOf("/"));
  return str;
};

// get #/blah/this
var getHashNumber = function() {
  var str;
  str = location.hash.split("#/").pop();
  str = str.substring(0, str.indexOf("/"));
  str = location.hash.split("#/" + str + "/").pop();
  return str;
};

function getMethodName() {
  var i;
  var methodPrev = methodName; //save old methodname
  methodName = "getLatestPaintings"; //fallback

  // #/gallery/
  if (getHashMain() == "gallery") {
    i = getHashNumber();
    if (i == 0) {
      methodName = "getLatestPaintings";
    }
    if (i == 1) {
      methodName = "getStaffPickedPaintings";
    }
    if (i == 2) {
      methodName = "getMostViewedPaintings";
    }
    if (i == 3) {
      methodName = "getMostFavoritedPaintings";
    }
    //the following is not avaliable on the official app
    if (i == 4) {
      methodName = "getMostCommentedPaintings";
    }
  }

  //else painting or user gallery

  //if method changed, set page to 0
  if (methodName != methodPrev) {
    page = 0;
  }

  return methodName;
}

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
          }
          catch (e) {
            reject(Error(e));
          }

        }
      }
      else {
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
function ajaxLoad() {
  getMethodName();
  ajax({
    "url": "http://www.psykopaint.com/php/dataservice/amfservices/?contentType=application/json",
    "type": "POST",
    "dataType": "JSON",
    "data": JSON.stringify({
      "serviceName": "Main",
      "methodName": methodName,
      "parameters": [(0 + page * 16), "16", "1"]
    })
  }).then(function(result) {
    images = result;
    console.log(result);
    var firstPaintingsId = result[0].id;
    console.log(firstPaintingsId);
    console.log("Page " + page);

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

    //This adds the usenames to the page
    for (var i = 0; i < result.length; i++) {
      document.getElementById("U" + (i + 1)).innerHTML = result[i].user_name;
    }

    //this creates the user thumnails in the DOM using the array
    for (var i = 0; i < result.length; i++) {
      document.getElementById("UT" + (i + 1)).src = result[i].user_thumbnailURL;
    }

    //This sets the paintings to thier thumnails images
    for (var i = 0; i < result.length; i++) {
      document.getElementById("P" + (i + 1)).style.backgroundImage = 'url(' + result[i].thumbnailURL50 + ')';
    }

    //Set the first picture to full res
    document.getElementById("P1").style.backgroundImage = 'url(' + images[0].imageURL + ')';

  });
}

page = 0;
ajaxLoad();

//fetch & switch to next page
function nextPage() {
  page = page + 1;
  ajaxLoad(page);
}

//switch to prev page (unless on first page)
function prevPage() {
  if (page > 0) {
    page = page - 1;
    ajaxLoad(page);
  }
  else {
    page = 0;
  }
}

//If nessasry, data could be prefetched and stored
