'use strict';
angular.module('jia')
.run(['$log','AppbFeedService',function($log,AppbFeedService){
  var feedData=AppbFeedService.getFeedData();
  feedData.defineFeed('jia_serve_comment','嘉空间留言',[
    {
      name: 'content',
      desc:'留言',
      placeholder: '欢迎咨询/留言',
      type: 'mtext',
      maxlength: 140,
      minlength: 2
    }
  ]);

}]);
