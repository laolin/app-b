'use strict';
angular.module('jia')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('jia_trade','嘉空间订单',[
    {
      name: 'content',
      desc:'留言',
      placeholder: '您的附加要求',
      type: 'mtext',
      maxlength: 99,
      minlength: 2
    },
    {
      name: 'd1',//d1~d4,attr,要和数据表的列名对应
      desc: '小时数',
      type: 'number',
      required: 1,
      pattern: '[0-9]',
      min: 1,
      max: 5
    },
    {
      name: 'd2',//d1~d4,attr,要和数据表的列名对应
      desc: '人数',
      type: 'number',
      required: 1,
      pattern: '[0-9]',
      min: 1,
      max: 5
    },
    {
      name: 'attr_serve_time',
      desc: '时间',
      type: 'datetime',
      required: 1,
      minlength: 2,
      maxlength: 100
    },
    {
      name: 'attr_serve_posision',
      desc: '地址',
      type: 'text',
      required: 1,
    },
    {
      name: 'attr_contact_name',
      desc: '联系人',
      type: 'text',
      required: 1,
    },
    {
      name: 'attr_contact_tel',
      desc: '电话',
      type: 'text',
      required: 1,
    }
  ]);

}]);
