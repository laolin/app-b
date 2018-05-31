
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          编导模块 - 知识库                           ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//  知识库列表 
CTRL("KnowledgeListCtrl", function ($scope) {
  API.module = "service";
  var D = $scope.D = {
    hash_data: "KnowledgeListCtrl",
    pagesize:8, 
    sublist: [{en:"qa", cn:"问答"}, {en:"outside", cn:"未收录"}, {en:"inside", cn:"已收录"}, {en:"all", cn:"全部"}],
    baseAPI: "/kl/getlist",
    defaultlist: 3,
    post:{page: 0},
    removedata: function(item){
      API.post("/user/removedata", {en:"kl", id: item.id}, {
        success: function(json){
          D.gotopage(D.post.page);
        }
      });
    }
  }
  InitSmartPage($scope, $scope.D);
})
// 知识库详情
CTRL("KnowledgeShowCtrl", function ($scope) {
  API.module = "service";
  var klid = GetQueryString("klid");
  $scope.reget = function(){
    API.get("/kl/getdetail", {klid: klid}, {
      success: function(json){
        $scope.detail = json.detail;
        init_kl($scope, json.detail);
        $scope.$apply();
      }
    });
  }
  $scope.reget();
})

function init_kl($scope, kl){
  !kl.attr && (kl.attr={ask: {}, answer:[]});
  kl.attr.ask && initqa_attr($scope, kl.attr.ask);//当前回答，数据初始化
  for(var i in kl.attr.answer)initqa_attr($scope, kl.attr.answer[i]);//当前回答，数据初始化
}
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          专家模块 - 知识库                           ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// ------------- 知识库列表  ------------- 
CTRL("ExpertKnowledgeListCtrl", function ($scope) {
  API.module = "expert";
  $scope.D = {
    pagesize:10, 
    sublist: [ {en:"all", cn:"全部"}],
    baseAPI: "/kl/getlist",
    defaultlist: 0
  }
  InitSmartPage($scope, $scope.D);
})
// ------------- 详情和操作 ------------- 
CTRL("ExpertKnowledgeShowCtrl", function ($scope) {
  API.module = "expert";
  var klid = GetQueryString("klid");
  var EDIT;
  var reget = $scope.reget = function(){
    API.get("/kl/expertgetdetail", {klid: klid}, {
      success: function(json){
        $http.post("WxJssdk/initWx", {}).finally(res => {
          init(json.detail);
        });
      } 
    });
  }
  reget();
  function init(detail){
    init_kl($scope, detail);
    $scope.knowledgewriting = !detail.rq && true;//这是草稿？
    if($scope.knowledgewriting){
      var ask = detail.attr.ask || {};
      InitCIA($scope, "EDIT", { keyid:"klid", url: "/kl/updatedraft"});
      EDIT = $scope.EDIT;
      EDIT.controldata = {
        id: klid = detail.id,
        klid: detail.id,
        content: ask.content || ""
      }
      EDIT.audios.list = ask.audioslist || [];//录音列表初始化
      EDIT.images.list = ask.imageslist || [];//图像列表初始化
    }
    else{
      $scope.detail = detail;
    }
    $scope.$apply(); 
  } 
  $scope.onsubmit = function(){
    if(EDIT.controldata.content.length <3){
      API.alert("正文至少3个字符"); return false;
    } 
    //发出提问：
    API.confirm("您确定已完成知识库？", function(){
      API.post("/kl/savedraft", {klid: EDIT.controldata.id}, {
        success: function(json){
          if( json.errcode !== 0){
            if(json.field){
              API.alert(json.errmsg);
              $scope.$apply();
            } 
          }else{
            reget();
          } 
        } 
      }); 
    }); 
  }
})




// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          专家                                        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

// 专家列表 
CTRL("SuperiorListCtrl", function ($scope) {
  API.module = "service";
  
  var usertypes = { 
    newexpert: "新专家", usedexpert: "活动专家", allexpert: "所有专家"
  };
  $scope.userlist={};
  $scope.enusertype = "activeexpert";
  $scope.usertype = "活动专家";
  var pagesize = 10;
  $scope.page = new SmartPage(pagesize, 1, 7);
  
  function setusertype(enusertype, nthpage){
    $scope.userlist = {};//先清空
    if(!usertypes[enusertype])enusertype = "allexpert";
    $scope.enusertype = enusertype;
    $scope.usertype = usertypes[enusertype];
    API.get("/user/superiorlist", {page: nthpage, pagesize: pagesize, searchtype: enusertype}, { success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      $scope.userlist = json.superiorlist;
      $scope.page.settotlerow(json.rowcount, nthpage);
      $scope.page.setpagenow(nthpage);
      $scope.$apply();
    }});
    window.location.hash="#/frame/expert?usertype=" + enusertype + "&page="+ nthpage;
  }
  $scope.setusertype = function(enusertype, nthpage){
    $scope.page.init();
    setusertype(enusertype, nthpage);
  }
  $scope.gotopage = function(nthpage){
    setusertype($scope.enusertype, nthpage);
  }
  //初始化
  setusertype(GetQueryString("usertype"), toNumber(GetQueryString("page")));
})
CTRL("ServiceShowExpertCtrl", function ($scope) {
  API.module = "service";
  var eid = $scope.eid = toNumber(GetQueryString("userid"));
  $scope.userinfo = {};
  API.get("/user/superiorinfo", {eid: eid}, { success: function( json){
    if(json.errcode !== 0)return;//请求返回错误
    $scope.userinfo = json.userinfo;
    $scope.getQrcode();
    $scope.$apply();
  }});
  
  $scope.getQrcode = function(){
    //获取二维码
    API.get("/wx/qrcodetmp", {sid: $scope.userinfo.id}, { success: function( json){
      if(json.errcode !== 0)return;//请求返回错误
      $scope.qrcodesrc = json.url;
      $scope.$apply();
    }});
  }
})

CTRL("ServiceEditExpertCtrl", function ($scope) {
  API.module = "service";
  var eid = $scope.eid = toNumber(GetQueryString("eid"));
  $scope.userinfo = {};
  API.get("/user/superiorinfo", {eid: eid}, { success: function( json){
    if(json.errcode !== 0)return;//请求返回错误
    $scope.userinfo = json.userinfo;
    $scope.$apply();
  }});
  
  $scope.majorarr= SETTINGS.getmajor();
  
  $scope.btn_save = {
    textnormal: '保存',
    responsing: '正在保存...',
    delay:1000,
    
    ajax:{
      url:API.root + "/user/updatesuperiorinfo",
      type:"POST",
      dataType: "json",
      success: function(json) {
      }
    },
    data: function(){
      return  sign_post( {userinfo:$scope.userinfo} );
    }
  }
  
  responseButton($scope, "btn_save");
  
})

CTRL("ServiceAddExpertCtrl", function ($scope) {
  API.module = "service";
  var eid = $scope.eid = toNumber(GetQueryString("eid"));
  $scope.userinfo = {};
  
  $scope.majorarr= SETTINGS.getmajor();
  
  $scope.btn_save = {
    textnormal: '保存',
    responsing: '正在保存...',
    delay:1000,
    ajax:{
      url:API.root + "/user/addsuperiorinfo",
      type:"POST",
      dataType: "json",
      success: function(json) {
        if(json.errcode == 0){
          window.location.href = "#/frame/editexpert?eid=" + json.eid;
        }
      }
    },
    data: function(){
      return  sign_post( {userinfo:$scope.userinfo} );
    }
  }
  
  responseButton($scope, "btn_save");
})

