(function(_window, _document){
  //-----------------------------------------
  //
  //  滑屏事件，全局
  //
  //-----------------------------------------
  function CMyEvent(eventName){
    this.eventName = eventName;
    this.init();
  }
    //初始化自定义事件
  CMyEvent.prototype.init = function(){
    if (typeof _document.CustomEvent === 'function') {
      this.event = new _document.CustomEvent(this.eventName, {//自定义事件名称
        bubbles: true,//是否冒泡
        cancelable: true//是否可以停止捕获
      });
    }
    else if (typeof _document.createEvent === 'function') {
      this.event = _document.createEvent('Event');
      this.event.initEvent(this.eventName, true, true);
    }
    else {
     this.event = false;
    }
  };

  //触发事件
  CMyEvent.prototype.fire = function(dom, data){
    if(!this.event) return;
    this.event.data = data || "";
    dom.dispatchEvent(this.event);
  };

  (function(){
    // 计划触发的事件：
    // 1. 开始左滑    slide-left-begin
    var SlideLeftBegin = new CMyEvent("slide-left-begin");
    // 2. 开始右滑    slide-right-begin
    var SlideRightBegin = new CMyEvent("slide-right-begin");
    // 3. 开始上滑    slide-up-begin
    var SlideUpBegin = new CMyEvent("slide-up-begin");
    // 4. 开始下滑    slide-down-begin
    var SlideDownBegin = new CMyEvent("slide-down-begin");
    // 5. 滑动中      slide-begin
    var SlideBegin = new CMyEvent("slide-begin");
    // 6. 滑动中      slide-moving
    var SlideMoving = new CMyEvent("slide-moving");
    // 7. 滑动结束    slide-end
    var SlideEnd = new CMyEvent("slide-end");
    // 8. 滑动结束    slide-end
    var SlideMouseDown = new CMyEvent("slide-mousedown");

    
    var MinSlide = 15;//多少像素后，才算滑动
    var M = {
      downElement: false,
      pressed: false,
      dragingX: false,
      dragingY: false,
      downX: 0,
      downY: 0,
      data:{
        direction: "",
        dx: 0,
        dy: 0
      },
      direction: function(){
        return this.data.direction;
      },
      set: function(direction, dx, dy){
        this.data.direction = direction;
        this.data.dx = dx;
        this.data.dy = dy;
      },
      setDirection: function(direction){
        this.data.direction = direction;
      },
      setXY: function(dx, dy){
        this.data.dx = dx;
        this.data.dy = dy;
      }
    };

    function onmousedown(event){
      if(+event.button == 2){//按下鼠标右键
        onmouseup();
        return;
      }
      M.downX = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX : event.screenX;
      M.downY = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY : event.screenY;
      M.pressed = true;
      M.downElement = event.target;
      M.setDirection("");
      SlideMoving.event.fireMoving = false;//滑动过程中，是否要通知
    }
    function onmousemove(event){
      if(!M.pressed)return;
      var x = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageX : event.screenX;
      var y = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].pageY : event.screenY;
      if(!M.direction()){
        var dx = x - M.downX ; dx<0 && (dx=-dx);
        var dy = y - M.downY; dy<0 && (dy=-dy);
        if(dx > dy*2 && dx >MinSlide){
          M.dragingX = true;
          M.set("x", x - M.downX,y - M.downY);
          if(dx < 0){
            SlideLeftBegin.fire(M.downElement, M.data);
          }
          else{
            SlideRightBegin.fire(M.downElement, M.data);
          }
          SlideBegin.fire(M.downElement, M.data);
          SlideMoving.event.fireMoving = true;//滑动过程中，是否要通知
        }
        if(dy > dx*2 && dy >MinSlide){
          M.dragingY = true;
          M.set("y", x - M.downX,y - M.downY);
          if(dy < 0){
            SlideUpBegin.fire(M.downElement, M.data);
          }
          else{
            SlideDownBegin.fire(M.downElement, M.data);
          }
          SlideBegin.fire(M.downElement, M.data);
          SlideMoving.event.fireMoving = true;//滑动过程中，是否要通知
        }
      }
      else{
        if(!SlideMoving.event.fireMoving)return;
        M.setXY(x - M.downX, y - M.downY);
        SlideMoving.fire(M.downElement, M.data);
      }
    }
    function onmouseup(event){
      M.pressed &&
      (M.dragingX || M.dragingY) &&
      SlideMoving.event.fireMoving && SlideEnd.fire(M.downElement, M.data);
      M.pressed = M.dragingY = M.dragingY = M.downElement = false;
    }

    function begin(){
      _document.addEventListener("mousedown" , onmousedown);
      _document.addEventListener("mousemove" , onmousemove);
      _document.addEventListener("mouseup"   , onmouseup  );
      _document.addEventListener("mousedown" , onmousedown);
      _document.addEventListener('touchstart', onmousedown);
      _document.addEventListener('touchmove' , onmousemove);
      _document.addEventListener('touchend'  , onmouseup  );
    }

    begin();

  })();
  

})(window, document);