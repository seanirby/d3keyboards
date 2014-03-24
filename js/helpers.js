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

    // TODO: Create a cross browser forEach function that maintains context, replace all instances in project
    forEach: function(arr, func){}
  }
})()