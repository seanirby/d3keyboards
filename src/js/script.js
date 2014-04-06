var htmlKeyboardModule = (function(JSHelpers, shortcutData, keyboardModule){
  //  DOM Nodes
  var keyboardContainer,
      selectorContainer,
      shortcutsContainer;

  function createContainers(){
    var mainContainer = document.getElementById("keyboard-shortcuts-container"),
        parent = mainContainer.parentNode;

    mainContainer.parentNode.removeChild(mainContainer);
    keyboardContainer = JSHelpers.createNode("<div id=keyboard-container></div>");
    selectorContainer = JSHelpers.createNode("<div id='selector-container'></div>");
    shortcutsContainer = JSHelpers.createNode("<div id='shortcuts-container'></div>");
    mainContainer.appendChild(keyboardContainer);
    mainContainer.appendChild(selectorContainer);
    mainContainer.appendChild(shortcutsContainer);
    parent.appendChild(mainContainer);
  }

  function createKeyboards(keyboards){
    // Temp variables to reference current key-row and key
    var keyboardElem,
        keyElem,
        rowElem;

    keyboards.forEach(function(keyboard, i){
      keyboardContainer.style.paddingBottom = keyboard.height*100 + "%";
      keyboardElem = JSHelpers.createNode("<div id='" + keyboard.type + "-keyboard'></div>");
      keyboardElem.style.top = (1/keyboard.height)*keyboard.width*keyboard.margin*100 + "%";
      keyboardElem.style.bottom = (1/keyboard.height)*keyboard.width*keyboard.margin*100 + "%";
      keyboardElem.style.left = keyboard.margin*100 + "%";
      keyboardElem.style.right = keyboard.margin*100 + "%";
      JSHelpers.addClass(keyboardElem, "keyboard");
      keyboard.keys.forEach(function(key_row, i){
        createKeyRow(keyboard, key_row);
        key_row.forEach(function(key, j){
          createKey(key, j);
        });
      });
      keyboardContainer.appendChild(keyboardElem);
    });

    // Helper functions
    function createKeyRow(keyboard, key_row){
      rowElem = JSHelpers.createNode("<div class='key-row'></div>");
      rowElem.style.height = (key_row[0].height/keyboard.height)*100 + "%";
      rowElem.style.top = (key_row[0].y/keyboard.height)*100 + "%";
      keyboardElem.appendChild(rowElem);
    }

    function createKey(key, index){
      keyElem = JSHelpers.createNode("<button class='key'></button>");
      JSHelpers.addClass(keyElem, "key-" + key.name);
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
        JSHelpers.removeClass(keyElem, "key-" + key.name);
        if(index < 5) {
          JSHelpers.addClass(keyElem, "key-" + key.name + "-left");
        } else{
          JSHelpers.addClass(keyElem, "key-" + key.name + "-right");
        }
      }
      rowElem.appendChild(keyElem);
      JSHelpers.addEventListener(keyElem, 'mouseover', mouseOver);
      JSHelpers.addEventListener(keyElem, 'mouseout', mouseOut);
    }

    // Event handlers
    function mouseOver(e){
      JSHelpers.addClass(this, 'key-highlight');
    }

    function mouseOut(e){
      JSHelpers.removeClass(this, 'key-highlight');
    }
  }

  function createSelectors(){
    shortcutData.forEach(function(shortcutList, i){
      selectorContainer.appendChild( JSHelpers.createNode( "<div class='selector' id='" + shortcutList.type + "-selector'>" + shortcutList.type + "</div>") );
    });

    for (var i = 0; i < selectorContainer.childNodes.length; i++) {
      JSHelpers.addEventListener( selectorContainer.childNodes[i], 'click', changeType);
    }

    function changeType(){
      var type = this.id.replace('-selector', '');
      JSHelpers.removeClass( document.querySelectorAll("#keyboard-container .active")[0], "active");
      JSHelpers.removeClass( document.querySelectorAll("#selector-container .active")[0], "active");
      JSHelpers.removeClass( document.querySelectorAll("#shortcuts-container .active")[0], "active" );
      JSHelpers.addClass(document.getElementById(type + "-keyboard"), "active");
      JSHelpers.addClass(this, "active");
      JSHelpers.addClass(document.getElementById(type + "-shortcuts"), "active");
    }
  }

  function createFilter(){
    var filter = JSHelpers.createNode("<div id='shortcut-filter' class='selector selector-filter'><form><input type='text' placeholder='Filter by Command'/></form></div>")
    selectorContainer.appendChild(filter);
  }

  function createShortcutLists(){
    var table, tbody, tr, td;

    shortcutData.forEach(function(shortcutList, i){
      table = JSHelpers.createTable(["Shortcut", "Command", "Context"]);
      table.setAttribute('id', shortcutList.type + "-shortcuts");
      tbody = table.lastElementChild;

      shortcutList.shortcuts.forEach(function(shortcut, j){
        createShortcutRow(shortcut);
        createHoverEvent(shortcut, tr);
      });
      shortcutsContainer.appendChild(table);
    });

    function createShortcutRow(shortcut){
      tr = document.createElement("TR");
      td = document.createElement("TD");
      td.appendChild( document.createTextNode(shortcut.keys) );
      tr.appendChild(td);

      td = document.createElement("TD");
      td.appendChild( document.createTextNode(shortcut.command) );
      tr.appendChild(td);

      td = document.createElement("TD");
      if(shortcut.context){
        td.appendChild( document.createTextNode(shortcut.context) );
      }
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    function createHoverEvent(shortcut){
      var cases = {"shift": null, "super": null, "alt": null},
          sequenceIndex,
          timerID;

      //TODO: Stop using left key as default. Consider writing an algorithm that chooses based on distance?
      var commandSequence = shortcut.keys
        .map(function(sequenceString){
          return sequenceString.split("+").map(function(keyName){
            return "key-" + keyName + (cases.hasOwnProperty(keyName) ? "-left" : "" );
          });
        });

      if( commandSequence.length > 1){
        sequenceIndex = 0;
        commandSequence.push([]);
        JSHelpers.addEventListener(tr, 'mouseover', function(){
          timerID = setInterval(function(){
            for (var i = 0; i < commandSequence.length; i++) {
              if(i == sequenceIndex){
                highlightKeys(commandSequence[i]);
              } else {
                fadeKeys(commandSequence[i], commandSequence[sequenceIndex]);
              }
            }

            if(sequenceIndex == commandSequence.length - 1){
              sequenceIndex = 0;
            } else {
              ++sequenceIndex;
            }
          },400);
        });
      } else {
        JSHelpers.addEventListener(tr, 'mouseover', function(){
          highlightKeys( commandSequence[0] );
        });
      }

      JSHelpers.addEventListener(tr, 'mouseout', function(){
        commandSequence.forEach(function(sequence, i){
          fadeKeys(sequence);
        });
        sequenceIndex = 0;
        clearTimeout(timerID);
      });

      function highlightKeys(sequence){
        sequence.forEach(function(keyClass, i){
          JSHelpers.simulateMouseEvent( document.querySelectorAll("#keyboard-container .keyboard.active ." + keyClass)[0], 'mouseover' );
        });
      }

      function fadeKeys(sequence, ignore){
        sequence.forEach(function(keyClass, i){
          if(ignore){
            if(JSHelpers.indexOf.call(ignore, keyClass) == -1){
              JSHelpers.simulateMouseEvent( document.querySelectorAll("#keyboard-container .keyboard.active ." + keyClass)[0], 'mouseout' );
            }
          } else {
            JSHelpers.simulateMouseEvent( document.querySelectorAll("#keyboard-container .keyboard.active ." + keyClass)[0], 'mouseout' );
          }
        });
      }
    }
  }

  return {
    init: function(){
      createContainers();
      createKeyboards( shortcutData.map(function(keyboard){ return keyboardModule.build( keyboard.type ); }));
      createSelectors();
      createFilter();
      createShortcutLists();
      JSHelpers.simulateMouseEvent(document.querySelectorAll("#selector-container .selector")[0], "click");
    }
  };
})(JSHelpers, SHORTCUTS, keyboardModule);

JSHelpers.ready(htmlKeyboardModule.init, htmlKeyboardModule);
