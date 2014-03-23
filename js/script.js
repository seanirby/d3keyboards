htmlKeyboard = (function(JSHelpers){
  //  Data
  var keyboard,
      shortcuts,

  //  DOM Nodes
      mainContainer,
      keyboardContainer,
      shortcutsContainer,
      keyboardElem;

  function createKeyboard(){
    // Temp variables to reference current key-row and key
    var keyElem,
        rowElem;

    keyboardContainer.appendChild(keyboardElem);
    keyboardContainer.style.paddingBottom = keyboard.height*100 + "%";

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
    //
  }

  return {
    init: function(kbrd, shrtcts){
      //Initialize variables and create containers
      keyboard = kbrd;
      shortcuts = shrtcts;
      mainContainer = document.getElementById("keyboard-shortcuts-container");
      keyboardContainer = JSHelpers.createNode("<div id=keyboard-container></div>");
      keyboardElem = JSHelpers.createNode("<div id='keyboard'></div>");
      shortcutsContainer = JSHelpers.createNode("<div id='shortcuts-container'></div>");
      mainContainer.appendChild(keyboardContainer);
      mainContainer.appendChild(shortcutsContainer);
      keyboardContainer.appendChild(keyboardElem);

      createKeyboard();
      createShortcutList();
    }
  }
})(JSHelpers)

JSHelpers.ready(htmlKeyboard.init, htmlKeyboard, [keyboard.build("apple", 1/100)])
