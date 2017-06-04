'use strict';
angular.module('appb')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  $log.log('appb init ok');
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('appb_score','评价',[
    {
      name: 'd1',
      desc: '评分',
      type: 'radio',
      keys: ['1','2','3','4','5'],
      values: ['1分','2分','3分','4分','5分']
    },
    {name: 'content',desc:'内容'},
    {name: 'pics',desc:'图片'}
  ]);
  
  feedData.defineFeed('appb_report','投诉/举报',[
    {
      name: 'd1',
      desc: '类型',
      type: 'radio',
      keys: ['1','2','3','4','5'],
      values: ['欺诈','色情','违法犯罪','骚扰','其他']
    },
    {name: 'content',desc:'内容'},
    {name: 'pics',desc:'图片'}
  ]);

}]);
