     widgetService().addDockItem('rgba(50, 190, 185, 0.6)', '#FF4444',function(e){
      this.style.background = '#FF44be'
      var widget = document.getElementById('canvasWidget');
      canvasController();
    }).innerHTML = 'Canvas';

     function canvasController(){
      var widget = document.getElementById('canvasWidget');
      var line = document.getElementById('addLine');
      var circle = document.getElementById('addCircle');
      var freeLine = document.getElementById('addFreeLine');
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
      circle.addEventListener('click',function(e){
        canServ.addCircle();
      });
      freeLine.addEventListener('click',function(e){
        canServ.addFreeLine();
      });
      draft.addEventListener('click',function(e){
        var evt = new Event('add');
        evt.x = e.layerX;
        evt.y = e.layerY;
        line.dispatchEvent(evt);
        circle.dispatchEvent(evt);
        freeLine.dispatchEvent(evt);
      });
    }
    function canvasService(){
      var service = {
        addLine: addLine,
        addCircle: addCircle,
        addFreeLine: addFreeLine
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
          line.style.background = 'rgba(73, 255, 69, 0.407843)';
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
      function addCircle(){
        var circle = document.getElementById('addCircle');
        var x,y,xMoving,yMoving;
        var runningAnimation = false;
        var raf;
        var listener = function(e){
          if(!runningAnimation){
            x = e.x;
            y = e.y;
            var frameCallback = function(){
                // This is not the needed equation.
                var radius = Math.sqrt(Math.abs((yMoving - y)*(yMoving - y) - (xMoving - x)*(xMoving - x)));
                ctxDraft.save();
                ctxDraft.globalCompositeOperation = 'source-out';
                ctxDraft.beginPath();
                ctxDraft.arc(x, y, radius, 0, Math.PI*2, true);
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
            var radius = Math.sqrt(Math.abs((yMoving - y)*(yMoving - y) - (xMoving - x)*(xMoving - x)));
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.stroke();
            runningAnimation = false;
            console.log(x+','+y+','+xMoving+','+yMoving);
          }
        }
        if(!running){
          circle.addEventListener('add',listener);
          circle.style.background = 'rgba(50, 190, 185, 0.6)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          circle.removeEventListener('add',listener);
          circle.style.background = 'rgba(0,0,0,0.1)';
          draft.classList.remove('pen');
          running = false;
        }
      }
      function addFreeLine(){
        var freeLine = document.getElementById('addFreeLine');
        var xMoving,yMoving;
        var runningAnimation = false;
        var raf;
        var listener = function(e){
          if(!runningAnimation){
            var frameCallback = function(){
                ctx.beginPath();
                ctx.moveTo(xMoving-1,yMoving-1);
                ctx.lineTo(xMoving,yMoving);
                ctx.stroke();
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
            runningAnimation = false;
          }
        }
        if(!running){
          freeLine.addEventListener('add',listener);
          freeLine.style.background = 'rgba(255, 73, 73, 0.6)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          freeLine.removeEventListener('add',listener);
          freeLine.style.background = 'rgba(0,0,0,0.1)';
          draft.classList.remove('pen');
          running = false;
        }
      }
      return service;
    }