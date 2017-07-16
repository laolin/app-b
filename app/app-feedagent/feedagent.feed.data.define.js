'use strict';
angular.module('appb')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  $log.log('feedagent init ok');
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('feedagent','评论',[
    {
      name: 'content',
      desc:'内容',
      placeholder: '请留下您的宝贵意见和建议',
      type: 'mtext',
      maxlength: 199,
      minlength: 2
    },
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    },
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '评级',
      type: 'radio',
      keys: ['x1','x2','x3','x4','x5'],
      values: ['一星','二星','三星','四星','五星']
    }/*,
    {
      name: 'd2',//d1~d4,attr,要和数据表的列名对应
      desc: '科目',
      type: 'radio',
      keys: ['yu','shu','ying','other'],
      values: ['语文','数学','英语','其他']
    },
    {
      name: 'd3',//d1~d4,attr,要和数据表的列名对应
      desc: '公开',
      type: 'radio',
      keys: ['pub','friendsonly','private'],
      values: ['公开','朋友可见','仅自己可见']
    },
    {
      name: 'd4',//d1~d4,attr,要和数据表的列名对应
      desc: '匿名',
      type: 'radio',
      keys: ['1','0'],
      values: ['是','否']
    }*/
  ]);

}]);
