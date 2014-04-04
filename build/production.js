var JSHelpers = {

  // Cross browser on document ready function
  // Accepts function to call, context, and arguments
  ready: function(func, context, arguments){
    if (document.addEventListener){
      document.addEventListener('DOMContentLoaded', func.apply(context, arguments));
    } else {
      document.attachEvent('onreadystatechange', function(){
        if(document.readyState === 'interactive')
          func.apply(context, arguments)
      })
    }
  },


  addEventListener: function(el, eventName, handler){
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function(){
        handler.call(el);
      });
    }
  },

  simulateMouseEvent: function(el, type){
    if (document.createEvent){
      var event = new MouseEvent(type, {
        'view': window,
        'bubbles': false,
        'cancelable': true
      });
    el.dispatchEvent(event);
    } else {
      el.fireEvent('on'+type);
    }
  },

  addClass: function(el, clazz){
    if(el.classList){
      el.classList.add(clazz)
    } else {
      el.className += ' ' + clazz;
    }
  },

  removeClass: function(el, clazz){
    if (el.classList){
      el.classList.remove(clazz);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + clazz.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },

  // NOTE: This function doesn't support all node types yet ('th', 'tr', etc..)
  // TODO: Fix above;
  createNode: function(string){
    var div = document.createElement('div');
    div.innerHTML = string;
    var elements = div.childNodes;
    return elements[0];
  },

  setText: function(el, string){
    if (el.textContent !== undefined)
      el.textContent = string;
    else
      el.innerText = string;
  },

  createTable: function(headings){
    var acc = "";
    headings.forEach(function(elem, i){
      acc = acc + "<th>" + headings[i] + "</th>";
    });
    return this.createNode("<table><thead>" + acc + "</thead><tbody></tbody></table>")
  },

  indexOf: function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
          var i = -1, index = -1;
          for(i = 0; i < this.length; i++) {
              if(this[i] === needle) {
                index = i;
                break;
              }
          }
          return index;
        }
    }
    return indexOf.call(this, needle);
  },
  // TODO: Create a cross browser 'forEach' function that maintains context, replace all instances in project
  forEach: function(arr, func){},
  // TODO: Create a cross browser 'map' function
  map: function(arr, func){}
}

var keyboard = (function(){
  var APPLE_WIDTH = 1,
      APPLE_MARGIN = 1/100;

  var NAME_TO_SYMBOL = {
    "escape":           "esc",
    "power":            " ",
    "backtick":         "`",
    "minus":            "-",
    "equals":           "=",
    "left-bracket":     "[",
    "right-bracket":    "]",
    "back-slash":       "\\",
    "forward-slash":    "/",
    "semicolon":        ";",
    "comma":            ",",
    "period":           "."
  };

  var KEY_MAP = [
    ["escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "power"],
    ["backtick", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "minus", "equals", "delete"],
    ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "left-bracket", "right-bracket", "back-slash"],
    ["caps-lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "semicolon", "comma", "enter"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", "comma", "period", "forward-slash", "shift"],
    ["fn", "ctrl", "alt", "super", "spacebar", "super", "alt", "left", "up", "down", "right"]
  ];

  function Key(obj){
    this.name = obj.name || "";
    this.symbol = NAME_TO_SYMBOL[this.name] || this.name;
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.width = obj.width || 0;
    this.height = obj.height || 0;
  }
  Key.prototype.convert = function(name, symbol){
    this.name = name;
    this.symbol = symbol || name;
  }

  function Keyboard(type){
    this.width = APPLE_WIDTH;
    this.margin = APPLE_MARGIN;
    this.keys = buildAppleKeyboard();
    this.height = (function(keyboard, acc){
      keyboard.keys.forEach(function(row, i){
        acc += row[0].height;
        if(i != 0){ acc += keyboard.margin }
      })
      return acc;
    })(this, 0);

    if(type == "generic"){
      this.findKey("delete").convert("backspace");
    }
  }
  Keyboard.prototype.findKey = function(keyName){
    for (var i = 0; i < this.keys.length; i++) {
      for (var j = 0; j < this.keys[i].length; j++) {
        if(this.keys[i][j].name == keyName){
          return this.keys[i][j];
        }
      };
    };
  }

  function buildAppleKeyboard(){
    var widthKeyboard       = APPLE_WIDTH,
        widthMargin         = APPLE_MARGIN,
        widthCharKey        = (1 - 13.5 * widthMargin) / 14.5,
        widthDeleteKey      = 1.5 * widthCharKey + 0.5 * widthMargin,
        widthCapsLockKey    = 0.5 * (widthKeyboard - 11 * widthCharKey - 12 * widthMargin), // Value also equals width of enter key
        widthShiftKey       = widthCapsLockKey + 0.5 * widthCharKey + 0.5 * widthMargin,
        widthCommandKey     = widthShiftKey - widthCharKey - widthMargin,
        widthSpacebarKey    = 5 * widthCharKey + 4 * widthMargin,
        widthTopRowKey      = (1/14) * (widthKeyboard - 13 * widthMargin),
        heightBottomRowKey  = widthCharKey + widthMargin,
        heightTopRowKey     = 0.5 * heightBottomRowKey,
        uniqueKeyWidths = {
          "delete": widthDeleteKey,
          "tab": widthDeleteKey,
          "caps-lock": widthCapsLockKey,
          "enter": widthCapsLockKey,
          "shift": widthShiftKey,
          "super": widthCommandKey,
          "spacebar": widthSpacebarKey
        },
        arrowKeyXPosition = {
          "up":  widthKeyboard - 2 * widthCharKey - widthMargin,
          "down": widthKeyboard - 2 * widthCharKey - widthMargin,
          "left": widthKeyboard - 3 * widthCharKey - 2 * widthMargin,
          "right": widthKeyboard - widthCharKey
        },
        accX = 0,
        accY = 0;

    function getHeight(keyName, rowIndex){
      if(rowIndex == 0 || arrowKeyXPosition[keyName]){
        return heightTopRowKey;
      }
      else if(rowIndex == KEY_MAP.length - 1){
        return heightTopRowKey * 2;
      }
      else {
        return widthCharKey;
      }
    }
    function getWidth(keyName, rowIndex){ return rowIndex == 0 ? widthTopRowKey : uniqueKeyWidths[keyName] || widthCharKey }
    function getX(keyName, acc){ return arrowKeyXPosition[keyName] || acc; }
    function getY(keyName, acc){ return (arrowKeyXPosition[keyName] && keyName != "up") ? acc + heightTopRowKey : acc }

    return KEY_MAP.map(function(row, i, map){
      accX = 0;
      accY += i == 0 ? 0 : getHeight(row[0], i - 1) + widthMargin;
      return row.map(function(keyName, j, row){
        accX += j == 0 ? 0 : getWidth(row[j-1], i) + widthMargin;
        return new Key({  name: keyName,
                          x: getX(keyName, accX),
                          y: getY(keyName, accY),
                          width: getWidth(keyName, i),
                          height: getHeight(keyName, i) });
      })
    })
  }

  function buildGenericKeyboard(){

  }

  return {
    build: function(type){
      return new Keyboard(type);
    }
  }
})()
var SHORTCUTS = [{
  title: "apple",

  shortcuts: [
    { "keys": ["super+shift+n"], "command": "new_window", "context": "Default"},
    { "keys": ["super+shift+w"], "command": "close_window", "context": "Default"},
    { "keys": ["super+o"], "command": "prompt_open", "context": "Default"},
    { "keys": ["super+shift+t"], "command": "reopen_last_file", "context": "Default"},
    { "keys": ["super+s"], "command": "save", "context": "Default"},
    { "keys": ["super+shift+s"], "command": "prompt_save_as", "context": "Default"},
    { "keys": ["super+alt+s"], "command": "save_all", "context": "Default"},
    { "keys": ["super+w"], "command": "close", "context": "Default"},
    { "keys": ["super+k", "super+t", "y", "alt+k", "super+k"], "command": "fold_tag_attributes" }]
},{
  title: "PC",

  shortcuts: [
    { "keys": ["super+shift+n"], "command": "new_window", "context": "Default"},
    { "keys": ["super+shift+w"], "command": "close_window", "context": "Default"},
    { "keys": ["super+o"], "command": "prompt_open", "context": "Default"},
    { "keys": ["super+shift+t"], "command": "reopen_last_file", "context": "Default"},
    { "keys": ["super+s"], "command": "save", "context": "Default"},
    { "keys": ["super+shift+s"], "command": "prompt_save_as", "context": "Default"},
    { "keys": ["super+alt+s"], "command": "save_all", "context": "Default"},
    { "keys": ["super+w"], "command": "close", "context": "Default"},
    { "keys": ["super+k", "super+t", "y", "alt+k", "super+k"], "command": "fold_tag_attributes" }]
}];
var htmlKeyboard = (function(JSHelpers){
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
      JSHelpers.addEventListener(keyElem, 'mouseover', mouseover);
      JSHelpers.addEventListener(keyElem, 'mouseout', mouseout);
    }

    // Event handlers
    function mouseover(e){
      JSHelpers.addClass(this, 'key-highlight');
    }

    function mouseout(e){
      JSHelpers.removeClass(this, 'key-highlight');
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
      var cases = {"shift": null, "super": null, "alt": null},
          sequenceIndex,
          timerID;

      //Store an array of id's
      //TODO: Stop using left key as default. Consider writing an algorithm that chooses based on distance?
      var commandSequence = shortcut["keys"]
        .map(function(sequenceString){
          return sequenceString.split("+").map(function(keyName){
            return "key-" + keyName + (cases.hasOwnProperty(keyName) ? "-left" : "" );
          });
        })

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
            };

            if(sequenceIndex == commandSequence.length - 1){
              sequenceIndex = 0;
            } else {
              ++sequenceIndex;
            }
            //console.log(sequenceIndex);
          },400)
        })
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
        sequence.forEach(function(keyID, i){
          JSHelpers.simulateMouseEvent( document.getElementById(keyID), 'mouseover' );
        });
      }

      function fadeKeys(sequence, ignore){
        sequence.forEach(function(keyID, i){
          if(ignore){
            if(JSHelpers.indexOf.call(ignore, keyID) == -1){
              JSHelpers.simulateMouseEvent( document.getElementById(keyID), 'mouseout' );
            }
          } else {
            JSHelpers.simulateMouseEvent( document.getElementById(keyID), 'mouseout' );
          }
        });
      }
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

JSHelpers.ready(htmlKeyboard.init, htmlKeyboard, [keyboard.build("generic"), SHORTCUTS])
