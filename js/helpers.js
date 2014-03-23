JSHelpers = (function(){
  return {
    ready: function(fn, context, args){
      if (document.addEventListener){
        document.addEventListener('DOMContentLoaded', fn.apply(context, args));
      } else {
        document.attachEvent('onreadystatechange', function(){
          if(document.readyState === 'interactive')
            fn.apply(context, args)
        })
      }
    },

    createNode: function(str){
      var div = document.createElement('div');
      div.innerHTML = str;
      var elements = div.childNodes;
      return elements[0];
    },

    setText: function(el, str){
      if (el.textContent !== undefined)
        el.textContent = str;
      else
        el.innerText = str;
    }
  }
})()