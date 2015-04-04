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
      var curve = document.getElementById('addCurve');
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
      curve.addEventListener('click',function(e){
        canServ.addCurve();
      });
      draft.addEventListener('click',function(e){
        var evt = new Event('add');
        evt.x = e.layerX;
        evt.y = e.layerY;
        line.dispatchEvent(evt);
        circle.dispatchEvent(evt);
        freeLine.dispatchEvent(evt);
        curve.dispatchEvent(evt);
      });
    }
    function canvasService(){
      var service = {
        addLine: addLine,
        addCircle: addCircle,
        addFreeLine: addFreeLine,
        addCurve: addCurve
      }
      var canvas = document.getElementById('canvasDraw');
      var draft = document.getElementById('canvasDraft');
      var ctx = canvas.getContext('2d');
      var ctxDraft = draft.getContext('2d');
      var running = false;
      var runningAnimation = false;
      var x,y,x1,y1,x2,y2,xMoving,yMoving;
      var raf;
      var lineListener = function(e){
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
      function addLine(){
        var line = document.getElementById('addLine');
        if(!running){
          line.addEventListener('add',lineListener);
          line.style.background = 'linear-gradient(rgba(73, 255, 69, 0.407843),rgba(0,0,0,0.05),rgba(73, 255, 69, 0.407843))';
          draft.classList.add('pen');
          running = true;
        }
        else{
          line.removeEventListener('add',lineListener);
          line.style.background = '';
          draft.classList.remove('pen');
          running = false;
        }
      }
      var circleListener = function(e){
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
      function addCircle(){
        var circle = document.getElementById('addCircle');
        if(!running){
          circle.addEventListener('add',circleListener);
          circle.style.background = 'rgba(50, 190, 185, 0.6)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          circle.removeEventListener('add',circleListener);
          circle.style.background = '';
          draft.classList.remove('pen');
          running = false;
        }
      }
      var freeLinelistener = function(e){
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
      function addFreeLine(){
        var freeLine = document.getElementById('addFreeLine');
        if(!running){
          freeLine.addEventListener('add',freeLinelistener);
          freeLine.style.background = 'rgba(255, 73, 73, 0.6)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          freeLine.removeEventListener('add',freeLinelistener);
          freeLine.style.background = '';
          draft.classList.remove('pen');
          running = false;
        }
      }
      var curveListener = function(e){
          if(!runningAnimation){
            if(x1 == undefined || y1 == undefined){
              x1 = e.x;
              y1 = e.y;
            }
            else{
              x2 = e.x;
              y2 = e.y;
              runningAnimation = true;
            }
            var frameCallback = function(){
                ctxDraft.save();
                ctxDraft.globalCompositeOperation = 'source-out';
                ctxDraft.beginPath();
                ctxDraft.moveTo(x1,y1);
                ctxDraft.quadraticCurveTo(xMoving, yMoving, x2, y2);
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
            console.log(x1+','+y1+','+x2+','+y2);
          }
          else {
            window.cancelAnimationFrame(raf);
            draft.removeEventListener('mousemove',movingCallback);
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.quadraticCurveTo(xMoving, yMoving, x2, y2);
            ctx.stroke();
            x1 = undefined;
            y1 = undefined;
            x2 = undefined;
            y2 = undefined;
            runningAnimation = false;
          }
        }
      function addCurve(){
        var curve = document.getElementById('addCurve');
        if(!running){
          curve.addEventListener('add',curveListener);
          curve.style.background = 'rgba(50, 100, 185, 0.6)';
          draft.classList.add('pen');
          running = true;
        }
        else{
          curve.removeEventListener('add',curveListener);
          curve.style.background = '';
          draft.classList.remove('pen');
          running = false;
        }
      }
      return service;
    }