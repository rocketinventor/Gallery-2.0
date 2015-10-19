// Author: Elliot Gerchak
// Contact: e@dementedLab.com

/*
global ajaxLoad
global images
*/

// Create 'contentLoad' function
// This is the function that gets run after the ajax call is complete
var contentLoad = function(result) {
  //This loop creates the 200px thumnail images
  for (var i = 0; i < result.length; i++) {
    creatChildImg(byId("content"), result[i].thumbnailURL200, result[i].id, result[i].name);
  }
};

function clearData() {
  byId("content").innerHTML = "";
}

// Do stuff on load
window.onload = (function() {
  //set hash if it doesn't exist
  if (location.hash == "") {
    location.hash = "#/gallery/0";
  }
})();

// Load new content on url change
window.onhashchange = locationHashChanged;

function locationHashChanged() {
  clearData();
  ajaxLoad();
}

// create function to be called during ajaxLoad();

function creatChildImg(parent, url, id, alt) {
  // create child with id __ on node __ with url _______
  var element = document.createElement("IMG");
  element.setAttribute("src", url);
  element.setAttribute("alt", alt);
  parent.appendChild(element);
  element.id = id;
  element = byId(id);
  element.style.width = "200px";
  element.style.height = "150px";

  return element;
}

function $(style) {
  return document.querySelector(style);
}

function $$(style) {
  return document.querySelectorAll(style);
}

function byId(element) {
  return document.getElementById(element);
}

// function loadPainting(e) {
//   if (e.target !== e.currentTarget) {
//     var id = e.target.id;
//     var image = images[id];
//     console.log(image);
//   }
//   e.stopPropagation();
// }