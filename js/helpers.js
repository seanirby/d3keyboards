var JSHelpers = (function(){
  return {
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
      var table = this.createNode("<table><tr></tr></table>");

      // TODO: Create a cross browser forEach function that can maintain context
      for (var i = 0; i < headings.length; i++) {
        table.childNodes[0].appendChild( this.createNode("<th>" + headings[i] + "</th>") );
      };

      return table;
    }
  }
})()