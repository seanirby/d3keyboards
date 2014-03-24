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

    keyboardContainer.style.paddingBottom = keyboard.height*100 + "%";

    keyboard.keys.forEach(function(key_row, i){
      createKeyRow(key_row)
      key_row.forEach(function(key, j){
        createKey(key, j);
      });
    });
    keyboardContainer.appendChild(keyboardElem);

    // Helper functions
    function createKeyRow(key_row){
      rowElem = JSHelpers.createNode("<div class='key-row'></div>");
      rowElem.style.height = (key_row[0].height/keyboard.height)*100 + "%";
      rowElem.style.top = (key_row[0].y/keyboard.height)*100 + "%";
      keyboardElem.appendChild(rowElem);
    }

    function createKey(key, index){
      keyElem = JSHelpers.createNode("<button class='key'></button>");
      keyElem.setAttribute('id', "key-" + key.name)
      keyElem.style.left = key.x*100 + "%";
      keyElem.style.width = key.width*100 + "%";
      JSHelpers.setText(keyElem, key.symbol);

      // Handle special cases, arrow keys, and left-right
      if(key.name == "up" || key.name == "down" || key.name == "left" || key.name == "right"){
        keyElem.style.height = "50%";
        if(key.name == "up"){
          keyElem.style.top = "0";
        } else{
          keyElem.style.top = "50%";
        }
      }
      else if(key.name == "shift" || key.name == "alt" || key.name == "super"){
        if(index < 5) {
          keyElem.setAttribute('id', keyElem.id + "-left")
        } else{
          keyElem.setAttribute('id', keyElem.id + "-right")
        }
      }
      rowElem.appendChild(keyElem);
    }
  }

  function createShortcutList(){
    // Temp variables for building table
    var table, tbody, tr, td;

    shortcutData.forEach(function(elem, i){
      table = JSHelpers.createTable(["Shortcut", "Command", "Context"]);
      shortcutsContainer.appendChild(table);
      tbody = table.lastElementChild;

      elem.shortcuts.forEach(function(shortcut, j){
        createShortcutRow(shortcut)
        createHoverEvent(shortcut, tr)
      })
    })

    // Helper functions
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

    function createHoverEvent(shortcut){
      var cases = {"shift": null, "super": null, "alt": null};

      //Store an array of id's
      //TODO: Stop using left key as default. Consider writing an algorithm that chooses based on distance?
      var commandSequence = shortcut["keys"]
        .map(function(sequenceString){
          return sequenceString.split("+").map(function(keyName){
            return "key-" + keyName + (cases.hasOwnProperty(keyName) ? "-left" : "" );
          });
        })

      JSHelpers.addEventListener(tr, 'mouseover', function(){
        commandSequence.forEach(function(sequence, i){
          sequence.forEach(function(keyID, j){
            JSHelpers.addClass( document.getElementById(keyID), "key-highlight" );
          });
        });
      });

      JSHelpers.addEventListener(tr, 'mouseout', function(){
        commandSequence.forEach(function(sequence, i){
          sequence.forEach(function(keyID, j){
            JSHelpers.removeClass( document.getElementById(keyID), "key-highlight" );
          });
        });
      });
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
