var keyboardModule = (function(){
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
  };

  function Keyboard(type){
    this.width = APPLE_WIDTH;
    this.margin = APPLE_MARGIN;
    this.type = type || "apple";
    this.keys = buildAppleKeyboard();
    this.height = (function(keyboard, acc){
      keyboard.keys.forEach(function(row, i){
        acc += row[0].height;
        if(i !== 0){ acc += keyboard.margin; }
      });
      return acc;
    })(this, 0);

    if(this.type === "pc"){
      this.findKey("delete").convert("backspace");
    }
  }
  Keyboard.prototype.findKey = function(keyName){
    for (var i = 0; i < this.keys.length; i++) {
      for (var j = 0; j < this.keys[i].length; j++) {
        if(this.keys[i][j].name == keyName){
          return this.keys[i][j];
        }
      }
    }
  };

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
      if(rowIndex === 0 || arrowKeyXPosition[keyName]){
        return heightTopRowKey;
      }
      else if(rowIndex == KEY_MAP.length - 1){
        return heightTopRowKey * 2;
      }
      else {
        return widthCharKey;
      }
    }
    function getWidth(keyName, rowIndex){ return rowIndex === 0 ? widthTopRowKey : uniqueKeyWidths[keyName] || widthCharKey; }
    function getX(keyName, acc){ return arrowKeyXPosition[keyName] || acc; }
    function getY(keyName, acc){ return (arrowKeyXPosition[keyName] && keyName !== "up") ? acc + heightTopRowKey : acc; }

    return KEY_MAP.map(function(row, i, map){
      accX = 0;
      accY += i === 0 ? 0 : getHeight(row[0], i - 1) + widthMargin;
      return row.map(function(keyName, j, row){
        accX += j === 0 ? 0 : getWidth(row[j-1], i) + widthMargin;
        return new Key({  name: keyName,
                          x: getX(keyName, accX),
                          y: getY(keyName, accY),
                          width: getWidth(keyName, i),
                          height: getHeight(keyName, i) });
      });
    });
  }

  return {
    build: function(type){
      return new Keyboard(type);
    },
    getNameFromSymbol: function(keyName){
      for(key in NAME_TO_SYMBOL){
        if(NAME_TO_SYMBOL[key] === keyName){
          return key;
        }
      }
    },
    capitalizeIfFunctionKey:  function(keyName){
      // TODO: Use a more precise Regex for testing for funciton keys F1-F12
      if(/^f|F{1,1}[0-9]{1,1}[0-2]?/.test(keyName)){
        return keyName.toUpperCase();
      }
    }

  };
})();