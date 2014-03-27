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

  //Arrow keys are handled as a special case;
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
        heightTopRowKey     = 0.5 * heightBottomRowKey;

    var uniqueKeyWidths = {
      "delete": widthDeleteKey,
      "tab": widthDeleteKey,
      "caps-lock": widthCapsLockKey,
      "enter": widthCapsLockKey,
      "shift": widthShiftKey,
      "super": widthCommandKey,
      "spacebar": widthSpacebarKey
    };

    var arrowKeyXPosition = {
      "up":  widthKeyboard - 2 * widthCharKey - widthMargin,
      "down": widthKeyboard - 2 * widthCharKey - widthMargin,
      "left": widthKeyboard - 3 * widthCharKey - 2 * widthMargin,
      "right": widthKeyboard - widthCharKey
    };

    var accX = 0,
        accY = 0;

    function getHeight(keyName, rowIndex, mapLength){
      if(rowIndex == 0){
        return heightTopRowKey;
      }
      else if( arrowKeyXPosition[keyName]){
        return heightTopRowKey;
      }
      else if( rowIndex == mapLength-1){
        return heightTopRowKey * 2;
      }
      else {
        return widthCharKey;
      }
    }
    function getWidth(keyName, rowIndex){
      if (rowIndex == 0){
        return widthTopRowKey;
      } else {
        return uniqueKeyWidths[keyName] || widthCharKey;
      }
    }
    function getX(keyName, accX){
      return arrowKeyXPosition[keyName] || accX;
    }
    function getY(keyName, accY){
      if ( arrowKeyXPosition[keyName] ){
        if (keyName == "up"){
          return accY;
        } else {
          return accY + heightTopRowKey;
        }
      } else {
        return accY;
      }
    }

    return KEY_MAP.map(function(row, i, map){
      accX = 0;
      accY += i == 0 ? 0 : getHeight(row[0], i - 1, map.length) + widthMargin;
      return row.map(function(keyName, j, row){
        accX += j == 0 ? 0 : getWidth(row[j-1], i) + widthMargin;
        return new Key({  name: keyName,
                          x: getX(keyName, accX),
                          y: getY(keyName, accY),
                          width: getWidth(keyName, i),
                          height: getHeight(keyName, i, row.length) });
      })
    })
  }

  function buildGenericKeyboard(){}

  return {
    build: function(type, margin){
      return new Keyboard(type, margin);
    }
  }
})()