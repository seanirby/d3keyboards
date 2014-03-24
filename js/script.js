htmlKeyboard = (function(JSHelpers){
  //  Input data
  var keyboard,       //keyboard[Array of Keys][Key]
      shortcutData,   //shortcuts[Array of JS object literals], each object has a 'title' and 'shortcuts' property.
                      //The 'shortcuts' property is an array of JS objects literals, each object has a 'command' and 'description' property;

  //  DOM Nodes
      mainContainer,
      keyboardContainer,
      shortcutsContainer,
      keyboardElem;

  function createContainers(){
    mainContainer = document.getElementById("keyboard-shortcuts-container");
    keyboardContainer = JSHelpers.createNode("<div id=keyboard-container></div>");
    keyboardElem = JSHelpers.createNode("<div id='keyboard'></div>");
    shortcutsContainer = JSHelpers.createNode("<div id='shortcuts-container'></div>");
    mainContainer.appendChild(keyboardContainer);
    mainContainer.appendChild(shortcutsContainer);
    keyboardContainer.appendChild(keyboardElem);
  }

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
    // Temp variables for building table
    var table,
        tbody,
        tr,
        td;

    shortcutData.forEach(function(elem, i){
      table = JSHelpers.createTable(["Shortcut", "Command", "Context"]);
      shortcutsContainer.appendChild(table);
      tbody = table.lastElementChild;

      elem.shortcuts.forEach(function(shortcut, j){
        createShortcutRow(shortcut)

        //Create highlight event for 'tr', set event to trigger on hover;
      })
    })

    function createShortcutRow(shortcut){
      tr = document.createElement("TR");
      tbody.appendChild(tr);

      //Add keys
      td = document.createElement("TD");
      td.appendChild( document.createTextNode(shortcut["keys"]) );
      tr.appendChild(td);

      //Add description
      td = document.createElement("TD");
      td.appendChild( document.createTextNode(shortcut["command"]) );
      tr.appendChild(td);

      //Add Context
      td = document.createElement("TD");
      if(shortcut["context"]){
        td.appendChild( document.createTextNode(shortcut["context"]) );
      }
      tr.appendChild(td);
    }
  }

  return {
    init: function(kbrd, shortcuts){
      //Initialize variables
      keyboard = kbrd;
      shortcutData = shortcuts;

      createContainers();
      createKeyboard();
      createShortcutList();
    }
  }
})(JSHelpers)

JSHelpers.ready(htmlKeyboard.init, htmlKeyboard, [keyboard.build("apple", 1/100), testShortcuts])
