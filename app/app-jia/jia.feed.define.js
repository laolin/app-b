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
      name: 'content',
      desc:'服务内容',
      placeholder: '请输入嘉空间服务内容',
      type: 'mtext'
    },
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '原价',
      type: 'number',
      min: 0.99,
      max: 19999
    },
    {
      name: 'd2',//d1~d4,attr,要和数据表的列名对应
      desc: '推广优惠价',
      type: 'number',
      min: 0.99,
      max: 19999
    },
    {
      name: 'attr_promoBegin',
      desc:'惠开始时间',
      type: 'datetime',
    },
    {
      name: 'attr_promoEnd',
      desc:'惠结束时间',
      type: 'datetime',
    },
    {
      name: 'attr_promoDesc',
      desc:'推广优惠说明',
      type: 'text',
      required:1,
      fminlength:2,
      fmaxlength:100
    }
  ]);

}]);
