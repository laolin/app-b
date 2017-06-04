'use strict';
angular.module('jia')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('jia','comment','嘉空间留言',[
    {
      name: 'content',
      desc:'留言',
      placeholder: '我来说两句',
      type: 'mtext',
      maxlength: 99,
      minlength: 2
    },
    {
      name: 'pics',
      desc:'图片',
      type: 'pics'
    }
  ]);

}]);
