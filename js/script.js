htmlKeyboard = (function(JSHelpers){
  var scale = 60; // length of 1 key in pixels

  return {
    init: function(keyboard){
      var container = document.getElementById("keyboard-container");
      var key;
      keyboard.forEach(function(elem, i){
        elem.forEach(function(elem, j){
          key = JSHelpers.createNode("<button class='key'></button>");
          container.appendChild(key);
          key.style.width = scale * keyboard[i][j].width+"px";
          key.style.height = scale * keyboard[i][j].height+"px";
          key.style.left = scale * keyboard[i][j].x + "px";
          key.style.top = scale * keyboard[i][j].y + "px";
          if( key.style.borderRadius == "" ){
            key.style.borderRadius = 1/8*scale + "px";
          }
        });
      });
    }
  }
})(JSHelpers)

JSHelpers.ready(  htmlKeyboard.init, htmlKeyboard, [keyboard.build("apple")] )
