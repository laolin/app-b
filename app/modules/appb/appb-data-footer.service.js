'use strict';
(function(){

angular.module('appb')
.factory('AppbDataFooter',
['$route','$rootScope','$location','$log','AppbConfig',
function($route, $rootScope,$location,$log,AppbConfig) {

  var footerData={};
    
  // footerData
  // footer 的链接强制是APP内部链接, 即链接要求是 #!/xxx ，
  // 但js中的链接不需要写全， 模板中会自动加 #!
  // '/' 实际代表 '#!/' ， '/default-search' 代表 '#!/default-search'。
  
  var tabsAvailable=this.tabsAvailable={
    "0": [
      {text:'首页',icon:'home',href:'/',onClick:0,active:0},
      {text:'搜索',icon:'search',href:'/a',onClick:0,active:1},
      {text:'测试',icon:'cog',href:'/b',onClick:0,active:0}
    ]
  };
  var cfg=AppbConfig();
  if(cfg.tabsAvailable) {
    var cfgt=cfg.tabsAvailable;
    for(var i=cfgt.length; i--; ) {
      addFooter(cfgt[i][0],cfgt[i][1]);
    }
  }
  //默认用 index 的footer，由app自己定义名为index的footer，
  //如果名为 `index` 的footer不存在，自动会切换为 `0`
  activeFooter('index');
  
  //预设的 footer
  function activeFooter(name) {
    if(footerData.name==name)
      return;//名字相等 就不用做什么了  
    if(!tabsAvailable[name]) {
      name='0';
    }
    footerData.tabs=tabsAvailable[name];
    footerData.name=name;
    activeTabByPath($location.path());
  }
  
  //新定义的 footer
  function addFooter(name,tabs,ac) {
    delete tabsAvailable[name];
    tabsAvailable[name]=tabs;
    if(ac)activeFooter(name);
  }


  function activeTabByPath(p) {
    $log.log('activeTabByPath',p);
    for(var i=footerData.tabs.length;i--; ){
      if(footerData.tabs[i].href==p)break;
    }
    if(i<0)return true;
    return activeTabByIndex(i);
  }

  function activeTabByIndex(nt) {
    $log.log('activeTabByIndex',nt);
    for(var i=footerData.tabs.length;i--; ){
      footerData.tabs[i].active=false;
    }
    footerData.tabs[nt].active=true;
    if(typeof(footerData.tabs[nt].onClick)=='function')footerData.tabs[nt].onClick();
    return true;
  }
  
  function startPathMonitor() {
    $rootScope.$on('$routeChangeSuccess', function() {
      
      //if(! userData || !userData.token) {
      //  $location.path( "/wx-login" );
      //} else {
        activeTabByPath($location.path());
      //}
    });
  }
  return {
    addFooter:addFooter,
    activeFooter:activeFooter,
    activeTabByPath:activeTabByPath,
    activeTabByIndex:activeTabByIndex,
    startPathMonitor:startPathMonitor,

    getFooterData:function(){return footerData}
  }
  
}]);
 
  
//___________________________________
})();
