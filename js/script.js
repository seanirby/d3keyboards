htmlKeyboard = (function(JSHelpers, shortcuts){

  function handleArrowKeys(keyElem, key){
    keyElem.style.height = "50%";
    if(key.name == "up"){
      keyElem.style.top = "0";
    }
    else{
      keyElem.style.top = "50%";
    }
  }

  return {
    init: function(keyboard){
      var containerElem = document.getElementById("keyboard-container"),
          keyboardElem = JSHelpers.createNode("<div id='keyboard'></div>"),
          keyElem,
          rowElem;

      containerElem.appendChild(keyboardElem);
      containerElem.style.paddingBottom = keyboard.height*100 + "%";

      keyboard.keys.forEach(function(key_row, i){

        rowElem = JSHelpers.createNode("<div class='key-row'></div>");
        keyboardElem.appendChild(rowElem);
        rowElem.style.height = (key_row[0].height/keyboard.height)*100 + "%";
        rowElem.style.top = (key_row[0].y/keyboard.height)*100 + "%";

        key_row.forEach(function(key, j){

          keyElem = JSHelpers.createNode("<button class='key'></button>");
          rowElem.appendChild(keyElem);
          keyElem.style.left = key.x*100 + "%";
          keyElem.style.width = key.width*100 + "%";
          JSHelpers.setText(keyElem, key.name);

          if(key.name == "up" || key.name == "down" || key.name == "left" || key.name == "right"){
            handleArrowKeys(keyElem, key);
          }

        });
      });
    }
  }
})(JSHelpers, shortcuts)

JSHelpers.ready(  htmlKeyboard.init, htmlKeyboard, [keyboard.build("apple", 1/100)] )
