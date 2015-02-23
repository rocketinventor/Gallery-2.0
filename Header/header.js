var button = document.getElementById('searchbox-toggle');

button.onclick = function() {
    var div = document.getElementById('searchbox');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
};
//trying to adapt code from http://jsfiddle.net/andrewwhitaker/hefGK/