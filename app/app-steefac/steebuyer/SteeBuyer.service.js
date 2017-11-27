'use strict';
(function(){

angular.module('steefac')
.factory('SteeBuyer',
['$location','$log','$q','AppbData','AppbAPI',
function($location,$log,$q,AppbData,AppbAPI) {
  
  var SteeBuyer={};
  var appData=AppbData.getAppData();

  appData.SteeBuyer=SteeBuyer;

  var defImg=appData.appCfg.assetsRoot+'/img/img-steefac/tallests.jpg';
  SteeBuyer.defImg=defImg;
  SteeBuyer.buyerList=[
    {oid:101,kName:'上海二建',kPic:defImg},
    {oid:102,kName:'中建一局',kPic:defImg},
    {oid:103,kName:'中建八局',kPic:defImg},
    {oid:104,kName:'中建三局',kPic:defImg},
    {oid:105,kName:'上海机施',kPic:defImg},
    {oid:106,kName:'宝钢钢构',kPic:defImg},
    {oid:107,kName:'中建钢构',kPic:defImg},
    {oid:108,kName:'上海七建',kPic:defImg},
    {oid:109,kName:'南通二建',kPic:defImg},
    {oid:110,kName:'江中集团',kPic:defImg},
    {oid:111,kName:'安徽建工',kPic:defImg},
    {oid:112,kName:'山东建工',kPic:defImg},
  ]
  
 
  return  SteeBuyer;
  
}]);
 
  

})();