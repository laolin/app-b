'use strict';
angular.module('jia')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  $log.log('exbook init ok');
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('jia','嘉空间服务',[
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    },
    {
      name: 'content',
      desc:'服务内容',
      placeholder: '请输入嘉空间服务内容',
      type: 'mtext',
      maxlength: 999,
      minlength: 2
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
      name: 'k1',
      desc: '状态',
      type: 'radio',
      keys: ['1','0'],
      values: ['开放服务','停止此业务']
    },
    {
      name: 'attr_promoEnd',
      desc:'优惠结束时间',
      type: 'datetime',
    },
    {
      name: 'attr_promoDesc',
      desc:'推广优惠说明',
      type: 'text',
      required:1,
      minlength:2,
      maxlength:100
    }
  ]);

}]);
