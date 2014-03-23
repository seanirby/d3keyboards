htmlKeyboard = (function(JSHelpers){
  var keyboard, containerElem, keyboardElem, shortcuts;

  function createKeyboard(){
    // Temp variables to reference current key-row and key
    var keyElem,
        rowElem;

    containerElem.appendChild(keyboardElem);
    containerElem.style.paddingBottom = keyboard.height*100 + "%";

    keyboard.keys.forEach(function(key_row, i){
      createKeyRow(key_row)
      key_row.forEach(function(key, j){
        createKey(key);
      });
    });

    function createKeyRow(key_row){
      rowElem = JSHelpers.createNode("<div class='key-row'></div>");
      keyboardElem.appendChild(rowElem);
      rowElem.style.height = (key_row[0].height/keyboard.height)*100 + "%";
      rowElem.style.top = (key_row[0].y/keyboard.height)*100 + "%";
    }

    function createKey(key){
      keyElem = JSHelpers.createNode("<button class='key'></button>");
      rowElem.appendChild(keyElem);
      keyElem.style.left = key.x*100 + "%";
      keyElem.style.width = key.width*100 + "%";
      JSHelpers.setText(keyElem, key.name);

      if(key.name == "up" || key.name == "down" || key.name == "left" || key.name == "right"){
        keyElem.style.height = "50%";
        if(key.name == "up"){
          keyElem.style.top = "0";
        }
        else{
          keyElem.style.top = "50%";
        }
      }
    }
  }

  function createShortcutList(){

  }

  return {
    init: function(kbrd, shrtcts){
      //Initialize Variables
      containerElem = document.getElementById("keyboard-container");
      keyboardElem = JSHelpers.createNode("<div id='keyboard'></div>");
      keyboard = kbrd;
      shortcuts = shrtcts;

      createKeyboard();
      createShortcutList();
    }
  }
})(JSHelpers)

JSHelpers.ready(htmlKeyboard.init, htmlKeyboard, [keyboard.build("apple", 1/100)])
