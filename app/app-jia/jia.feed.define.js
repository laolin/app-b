'use strict';
angular.module('jia')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  $log.log('exbook init ok');
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('jia','serve','嘉空间服务',[
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
    },
    {
      name: 'd3',//d1~d4,attr,要和数据表的列名对应
      desc: '时间',
      type: 'datetime'
    },
    {
      name: 'd4',//d1~d4,attr,要和数据表的列名对应
      desc: '价格',
      type: 'text'
    },
    {
      name: 'content',
      desc:'内容',
      type: 'mtext'
    },
    {
      name: 'attr.promoBegin',
      desc:'优惠开始时间',
      type: 'datetime'
    },
    {
      name: 'attr.promoEnd',
      desc:'优惠结束时间',
      type: 'datetime'
    },
    {
      name: 'attr.promoDesc',
      desc:'优惠说明',
      type: 'text'
    },
    {
      name: 'attr.size',
      desc:'类型',
      type: 'radio',
      keys: ['1','2','3','4'],
      values: ['房间','阳台','车库','厨房']
    }
  ]);

}]);
