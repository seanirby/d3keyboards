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

    var k = 1,                      //Width of character keys EXCEPT space
        m = 1/6,                    //Width of margin
        dlt = (1.5*k) + (0.5*m),    //Width of delete key AND tab key
        w = (13*k) + (13*m) + dlt,  //Length of keyboard
        caps = (w - (11*k) - (12*m)) / 2,
        shift = caps + (0.5*k) + (0.5*m),
        cmd = shift - k - m,
        space = (5*k) + (4*m),
        kx = (w - (13*m)) / 14,     //Width of functions keys
        hx = 0.5 * (k+m),           //Height of function keys
        kb = 2 * hx;                //Height of bottom row keys

    // Temp variables for building keyboard
    var row =[],
        names = [],
        widths = [],
        y,  // y position of row
        acc = 0;

    // Build first row (function keys)
    row =[];
    names = ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", ""];
    y = 0;
    names.forEach(function(elem, i){
      row.push( new Key(elem, i * (kx+m), y, kx, hx));
    })
    keyboard.push(row)

    // Build second row (numbers)
    row = [];
    names = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"];
    y = hx + m;
    names.forEach(function(elem, i){
      var key = new Key(elem, i * (k+m), y, k, k);
      if(elem == "delete") key.width = dlt;
      row.push(key);
    })
    keyboard.push(row)

    // Build third row (QWERTY)
    row = [];
    names = ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
    y += k + m;
    names.forEach(function(elem, i){
      var key = new Key(elem, dlt + ((i-1)*k) + (i*m), y, k, k);
      if(elem == "tab"){
        key.width = dlt;
        key.x = 0;
      }
      row.push(key);
    })
    keyboard.push(row)

    // Build fourth row (ASDF)
    row = [];
    names = ["caps-lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"];
    y += k + m;
    names.forEach(function(elem, i){
      var key = new Key(elem, caps + ((i-1)*k) + (i*m), y, k, k);
      if(elem == "caps-lock") key.x = 0;
      if(elem == "caps-lock" || elem == "enter") key.width = caps;
      row.push(key);
    })
    keyboard.push(row);

    // Build fifth row (ZXCV)
    row = [];
    names = ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"];
    y += k + m;
    names.forEach(function(elem, i){
      var key = new Key(elem, shift + ((i-1)*k) + (i*m), y, k, k);
      if(elem == "shift") key.width = shift;
      if(i == 0) key.x = 0;
      row.push(key);
    })
    keyboard.push(row);

    // Build sixth row
    row = [];
    names = ["fn", "ctrl", "alt", "super", "spacebar", "super", "alt"];
    widths = [k, k, k, cmd, space, cmd, k];
    y += k + m;
    acc = 0;
    names.forEach(function(elem, i){
      var key = new Key(elem, acc, y, widths[i], 2*hx);
      acc += widths[i] + m;
      row.push(key)
    })
    // Build arrow keys
    row.push( new Key("left",   w - (3*k) - (2*m), y + hx,  k, hx));
    row.push( new Key("up",     w - (2*k) - (1*m),      y,  k, hx));
    row.push( new Key("down",   w - (2*k) - (1*m), y + hx,  k, hx));
    row.push( new Key("right",              w - k, y + hx,  k, hx));
    keyboard.push(row)

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