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

  
  feedData.defineFeed('steeComment','钢构厂，项目的评论',[
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '评分',
      type: 'radio',
      keys: ["",'1','2','3','4','5'],
      values: ['未评分','一星(极差)','二星(较差)','三星(一般)','四星(较好)','五星(极好)']
    },
    {
      name: 'content',
      desc:'留言',
      placeholder: '留言千古事，得失寸心知。',
      type: 'mtext',
      maxlength: 999,
      minlength: 3
    },
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    },
  ]);
}]);
