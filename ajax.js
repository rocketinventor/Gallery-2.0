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
methodName = "getLatestPaintings"; //fallback
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

var getMethodName = function() {
  var i;
  methodPrev = methodName; //save old methodname

  // if "#/gallery/"
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

  if (getHashMain() == "user") {
    methodName = "getUserPaintings";
  }

  //else use already established methodName

  //if method changed, set page to 0
  if (methodName != methodPrev) {
    page = 0;
  }
  return methodName;
};
/*global contentLoad*/
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
  var parameters;
  var name = getHashNumber();
  getMethodName();
  if (getMethodName() == "getUserPaintings") {
    parameters = [(0 + page * 16), "16", name, "1"];
  } else {
  parameters = [(0 + page * 16), "16", "1"];
  }
  ajax({
    "url": "https://www.psykopaint.com/php/dataservice/amfservices/?contentType=application/json",
    "type": "POST",
    "dataType": "JSON",
    "data": JSON.stringify({
      "serviceName": "Main",
      "methodName": getMethodName(),
      "parameters": parameters
    })
  }).then(function(result) {
    images = result;
    console.log("Page " + page);
    console.log(result);
    contentLoad(result);
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
