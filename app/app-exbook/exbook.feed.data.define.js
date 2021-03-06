'use strict';
angular.module('appb')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  $log.log('exbook init ok');
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('exbook','错题本',[
    {
      name: 'content',
      desc:'内容',
      placeholder: '不求万人怜惜，但求一人懂得。',
      type: 'mtext',
      maxlength: 999,
      minlength: 3
    },
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    },
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '年级',
      type: 'radio',
      keys: ['x0','x1','x2','x3','x4','x5','x6'],
      values: ['幼升小','一年级','二年级','三年级','四年级','五年级/小升初','初中以上']
    },
    {
      name: 'd2',//d1~d4,attr,要和数据表的列名对应
      desc: '科目',
      type: 'radio',
      keys: ['yu','shu','ying','other'],
      values: ['语文','数学','英语','其他']
    }/*,
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
