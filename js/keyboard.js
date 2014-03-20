var keyboard = (function(){
  function Key(name, x, y, width, height){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  function buildAppleKeyboard(){
    var keyboard = [];

    var widthCharKey        = 1,    // Exluding spacebar.  Value also equals the height for all keys except top row keys and bottom row keys.
        widthMargin         = 1/8,  // Just guessing on this one. Values from 1/6 to 1/8 seem reasonable
        widthDeleteKey      = 1.5 * widthCharKey + 0.5 * widthMargin,
        widthKeyboard       = 13 * widthCharKey + 13 * widthMargin + widthDeleteKey,
        widthCapsLockKey    = 0.5 * (widthKeyboard - 11 * widthCharKey - 12 * widthMargin), // Value also equals width of enter key
        widthShiftKey       = widthCapsLockKey + 0.5 * widthCharKey + 0.5 * widthMargin,
        widthCommandKey     = widthShiftKey - widthCharKey - widthMargin,
        widthSpacebarKey    = 5 * widthCharKey + 4 * widthMargin,
        widthTopRowKey      = (1/14) * (widthKeyboard - 13 * widthMargin),
        heightBottomRowKey  = widthCharKey + widthMargin,
        heightTopRowKey     = 0.5 * heightBottomRowKey;

    var tempRow =[],                // Keyboard row
        tempNames = [],             // Array of key names
        tempWidths = [],            // Array of key widths (corresponding to variable above)
        tempY,                      // Y position of tempRow
        tempAcc;                    // Length accumulator for positioning keys

    // Build first row (function keys)
    tempRow =[];
    tempNames = ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", ""];
    tempY = 0;
    tempNames.forEach(function(elem, i){
      tempRow.push( new Key(elem, i * (widthTopRowKey + widthMargin), tempY, widthTopRowKey, heightTopRowKey));
    })
    keyboard.push(tempRow)

    // Build second row (numbers)
    tempRow = [];
    tempNames = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"];
    tempY += heightTopRowKey + widthMargin;
    tempNames.forEach(function(elem, i){
      var key = new Key(elem, i * (widthCharKey + widthMargin), tempY, widthCharKey, widthCharKey);
      if(elem == "delete") key.width = widthDeleteKey;
      tempRow.push(key);
    })
    keyboard.push(tempRow)

    // Build third row (QWERTY)
    tempRow = [];
    tempNames = ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
    tempY += widthCharKey + widthMargin;
    tempNames.forEach(function(elem, i){
      var key = new Key(elem, widthDeleteKey + ((i-1) * widthCharKey) + (i * widthMargin), tempY, widthCharKey, widthCharKey);
      if(elem == "tab"){
        key.width = widthDeleteKey;
        key.x = 0;
      }
      tempRow.push(key);
    })
    keyboard.push(tempRow)

    // Build fourth row (ASDF)
    tempRow = [];
    tempNames = ["caps-lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"];
    tempY += widthCharKey + widthMargin;
    tempNames.forEach(function(elem, i){
      var key = new Key(elem, widthCapsLockKey + ((i-1) * widthCharKey) + (i * widthMargin), tempY, widthCharKey, widthCharKey);
      if(elem == "caps-lock") key.x = 0;
      if(elem == "caps-lock" || elem == "enter") key.width = widthCapsLockKey;
      tempRow.push(key);
    })
    keyboard.push(tempRow);

    // Build fifth row (ZXCV)
    tempRow = [];
    tempNames = ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"];
    tempY += widthCharKey + widthMargin;
    tempNames.forEach(function(elem, i){
      var key = new Key(elem, widthShiftKey + ((i-1) * widthCharKey) + (i * widthMargin), tempY, widthCharKey, widthCharKey);
      if(elem == "shift") key.width = widthShiftKey;
      if(i == 0) key.x = 0;
      tempRow.push(key);
    })
    keyboard.push(tempRow);

    // Build sixth row
    tempRow = [];
    tempNames = ["fn", "ctrl", "alt", "super", "spacebar", "super", "alt"];
    widths = [widthCharKey, widthCharKey, widthCharKey, widthCommandKey, widthSpacebarKey, widthCommandKey, widthCharKey];
    tempY += widthCharKey + widthMargin;
    tempAcc = 0;
    tempNames.forEach(function(elem, i){
      var key = new Key(elem, tempAcc, tempY, widths[i], heightBottomRowKey);
      tempAcc += widths[i] + widthMargin;
      tempRow.push(key)
    })
    // Build arrow keys
    tempRow.push( new Key("left",   widthKeyboard - (3 * widthCharKey) - (2 * widthMargin), tempY + heightTopRowKey,  widthCharKey, heightTopRowKey));
    tempRow.push( new Key("up",     widthKeyboard - (2 * widthCharKey) - (1 * widthMargin),              tempY,  widthCharKey, heightTopRowKey));
    tempRow.push( new Key("down",   widthKeyboard - (2 * widthCharKey) - (1 * widthMargin), tempY + heightTopRowKey,  widthCharKey, heightTopRowKey));
    tempRow.push( new Key("right",  widthKeyboard - widthCharKey, tempY + heightTopRowKey,  widthCharKey, heightTopRowKey));
    keyboard.push(tempRow)

    return keyboard;
  }

  function buildGenericKeyboard(){}

  return {
    build: function(type){
      if(type == "apple" || undefined){
        return buildAppleKeyboard();
      }
      else if(type == "generic"){
        return buildGenericKeyboard();
      }
      else{
        return buildAppleKeyboard();
      }
    }
  }
})()