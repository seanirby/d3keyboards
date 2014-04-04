var JSHelpers = {

  // Cross browser on document ready function
  // Accepts function to call, context, and arguments
  ready: function(func, context, args){
    if (document.addEventListener){
      document.addEventListener('DOMContentLoaded', func.apply(context, args));
    } else {
      document.attachEvent('onreadystatechange', function(){
        if(document.readyState === 'interactive')
          func.apply(context, args);
      });
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
      el.classList.add(clazz);
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
    return this.createNode("<table><thead>" + acc + "</thead><tbody></tbody></table>");
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
        };
    }
    return indexOf.call(this, needle);
  },
  // TODO: Create a cross browser 'forEach' function that maintains context, replace all instances in project
  forEach: function(arr, func){},
  // TODO: Create a cross browser 'map' function
  map: function(arr, func){}
};
