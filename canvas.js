     widgetService().addDockItem('rgba(50, 190, 185, 0.6)', '#FF4444',function(e){
      this.style.background = '#FF44be'
      var widget = document.getElementById('canvasWidget');
      canvasController();
    }).innerHTML = 'Canvas';

     function canvasController(){
      var widget = document.getElementById('canvasWidget');
      var line = document.getElementById('addLine');
      var canServ = canvasService();
      var canvas = document.getElementById('canvasDraw');
      canvas.width = widget.clientWidth * 0.98;
      canvas.height = widget.clientHeight * 0.90;
      line.addEventListener('click',function(e){
        canServ.addLine();
      });
      canvas.addEventListener('click',function(e){
        var evt = new Event('add');
        evt.x = e.layerX;
        evt.y = e.layerY;
        line.dispatchEvent(evt);
      });
     }
     function canvasService(){
      var service = {
        addLine: addLine
      }
      var canvas = document.getElementById('canvasDraw');
      var ctx = canvas.getContext('2d');
      var running = false;
      function addLine(){
        var line = document.getElementById('addLine');
        var x,y;
        var runningAnimation = false;
        var raf;
        var listener = function(e){
              if(!runningAnimation){
                // raf = window.requestAnimationFrame(function(){
                  // ctx.beginPath();
                  // ctx.moveTo(e.x,e.y);
                  // ctx.lineTo(100,100);
                  // ctx.stroke();
                // });
                x = e.x;
                y = e.y;
                runningAnimation = true;
              }
              else {
                // window.cancelAnimationFrame(raf);
                ctx.beginPath();
                ctx.moveTo(x,y);
                ctx.lineTo(e.x,e.y);
                ctx.stroke();
                runningAnimation = false;
              }
        }
        if(!running){
          line.addEventListener('add',listener);
          line.style.background = 'rgba(0,100,0,0.9)';
          canvas.classList.add('pen');
          running = true;
        }
        else{
          line.removeEventListener('add',listener);
          line.style.background = 'rgba(0,0,0,0.1)';
          canvas.classList.remove('pen');
          running = false;
        }
      }
      return service;
     }