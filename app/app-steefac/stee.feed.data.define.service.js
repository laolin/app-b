'use strict';
angular.module('appb')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('steeFacCase','钢构厂业绩',[
    {
      name: 'content',
      desc:'业绩简介',
      placeholder: '请输入业绩简介',
      type: 'mtext',
      maxlength: 999,
      minlength: 3
    },
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    }/*,
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '年级',
      type: 'radio',
      keys: ['x0','x1','x2','x3','x4','x5','x6'],
      values: ['幼升小','一年级','二年级','三年级','四年级','五年级/小升初','初中以上']
    }*/
  ]);

}]);
