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
      var draft = document.getElementById('canvasDraft');
      canvas.width = widget.clientWidth * 0.98;
      canvas.height = widget.clientHeight * 0.90;
      draft.width = widget.clientWidth * 0.98;
      draft.height = widget.clientHeight * 0.90;
      line.addEventListener('click',function(e){
        canServ.addLine();
      });
      draft.addEventListener('click',function(e){
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
      var draft = document.getElementById('canvasDraft');
      var ctx = canvas.getContext('2d');
      var ctxDraft = draft.getContext('2d');
      var running = false;
      function addLine(){
        var line = document.getElementById('addLine');
        var x,y,xMoving,yMoving;
        var runningAnimation = false;
        var raf;
        var listener = function(e){
          if(!runningAnimation){
            x = e.x;
            y = e.y;
            var frameCallback = function(){
                ctxDraft.save();
                ctxDraft.globalCompositeOperation = 'source-out';
                ctxDraft.beginPath();
                ctxDraft.moveTo(x,y);
                ctxDraft.lineTo(xMoving,yMoving);
                ctxDraft.stroke();
                ctxDraft.restore();
                raf = window.requestAnimationFrame(frameCallback);
            }
            var movingCallback = function(e){
                xMoving = e.layerX;
                yMoving = e.layerY;
            }
            draft.addEventListener('mousemove',movingCallback);
            raf = window.requestAnimationFrame(frameCallback);
            runningAnimation = true;
          }
          else {
            window.cancelAnimationFrame(raf);
            draft.removeEventListener('mousemove',movingCallback);
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(xMoving,yMoving);
            ctx.stroke();
            runningAnimation = false;
            console.log(x+','+y+','+xMoving+','+yMoving);
          }
        }
        if(!running){
          line.addEventListener('add',listener);
          line.style.background = 'rgba(0,100,0,0.9)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          line.removeEventListener('add',listener);
          line.style.background = 'rgba(0,0,0,0.1)';
          draft.classList.remove('pen');
          running = false;
        }
      }
      return service;
    }