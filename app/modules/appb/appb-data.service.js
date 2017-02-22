'use strict';
(function(){
  
var KEY_CLIENTID=appbCfg.keyClientId;

angular.module('appb')
.factory('AppbData',
['$route','$rootScope','$location','$log','$timeout','$http','$window',
  'AppbConfig','AppbDataUser','AppbUiDialogService',
function($route, $rootScope,$location,$log,$timeout,$http,$window,
  AppbConfig,AppbDataUser,AppbUiDialogService) 
{
  
  var appCfg=AppbConfig();

  var headerData={};
  var footerData={};
  var userData=AppbDataUser.getUserData();
  var dialogData=AppbUiDialogService.getData();

  var appData=this.appData={
    isWeixinBrowser:(/micromessenger/i).test(navigator.userAgent),
    clientId:'not-init-'+(+new Date()),
    
    
    headerData:headerData,
    footerData:footerData,
    userData:userData,
    setUserData:AppbDataUser.setUserData,

    dialogData:dialogData,
    setDialogData:AppbUiDialogService.setData,
    showDialog:AppbUiDialogService.show,
    hideDialog:AppbUiDialogService.hide,
    
    appCfg:appCfg
  }
  initClientId();

  window.appData=appData;//export to global
 
  // headerData
  headerData.headerText='Welcome';
  
  // 链接需要正常的html的地址格式，就是要写上 #!，因为链接可能是外部链接
  headerData.widgets=[
    {side:'left',link:'#!/abc/',icon:'cubes'},
    {side:'left',link:'#!/',text:'HOME'},
    //{side:'left',link:'javascript:;',img:'assets/img/logo-32.png',text:''},
    {side:'right',link:'#!/abc/',icon:'battery-half'},
    {side:'right',link:'#!/default-settings',text:'测试中'}
  ];
  
  // footerData
  // footer 的链接强制是APP内部链接, 即链接要求是 #!/xxx ，
  // 但js中的链接不需要写全， 模板中会自动加 #!
  // '/' 实际代表 '#!/' ， '/default-search' 代表 '#!/default-search'。
  footerData.tabs=[
    {text:'首页',icon:'home',href:'/',onClick:0,active:0},
    {text:'搜索',icon:'search',href:'/default-search',onClick:0,active:1},
    {text:'测试',icon:'cog',href:'/default-settings',onClick:0,active:0}
  ];
  
  
  //factory functions
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
    headerData.type=footerData.tabs[nt].hdType;
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
  

  //
  function initClientId() {
    var saved_id= $window.localStorage.getItem(KEY_CLIENTID);
    if(saved_id) {
      return appData.clientId=saved_id;
    }
    var t1= +new Date();
    $timeout(function(){
      var t2= +new Date();
      appData.clientId='APP-B-'+md5('%@&*'+$location.host()+t1+t2+Math.random());
      $window.localStorage.setItem(KEY_CLIENTID,appData.clientId);
    },Math.random()*10);
    return false;
  }
  
  return {
    
    getHeaderData:function(){return headerData},
    getFooterData:function(){return footerData},
    getAppData:function(){return appData},
    getUserData:function(){return userData},
    
    getDialogData:function(){return dialogData},

    activeTabByPath:activeTabByPath,
    activeTabByIndex:activeTabByIndex,
    startPathMonitor:startPathMonitor
  }
  
}]);
 
  
//___________________________________
})();
