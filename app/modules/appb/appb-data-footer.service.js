'use strict';
(function(){

angular.module('appb')
.factory('AppbDataFooter',
['$route','$rootScope','$location','$log',
function($route, $rootScope,$location,$log) {

  var footerData={};
    
  // footerData
  // footer 的链接强制是APP内部链接, 即链接要求是 #!/xxx ，
  // 但js中的链接不需要写全， 模板中会自动加 #!
  // '/' 实际代表 '#!/' ， '/default-search' 代表 '#!/default-search'。
  
  var tabsAvailable=this.tabsAvailable={
    "0": [
      {text:'首页',icon:'home',href:'/',onClick:0,active:0},
      {text:'搜索',icon:'search',href:'/default-search',onClick:0,active:1},
      {text:'测试',icon:'cog',href:'/default-settings',onClick:0,active:0}
    ],
    "test": [
      {text:'TEST1',icon:'car',href:'/test-1',onClick:0,active:0},
      {text:'test2',icon:'bell',href:'/test-2',onClick:0,active:2},
      {text:'test-3',icon:'bicycle',href:'/test-3',onClick:0,active:0}
    ]
  };
  activeFooter('0');
  
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
  function setFooter(name,tabs) {
    delete tabsAvailable[name];
    tabsAvailable[name]=tabs;
    activeFooter(name);
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
    setFooter:setFooter,
    activeFooter:activeFooter,
    activeTabByPath:activeTabByPath,
    activeTabByIndex:activeTabByIndex,
    startPathMonitor:startPathMonitor,

    getFooterData:function(){return footerData}
  }
  
}]);
 
  
//___________________________________
})();
