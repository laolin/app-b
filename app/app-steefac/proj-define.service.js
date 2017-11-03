'use strict';
(function(){

angular.module('steefac')
.factory('ProjDefine', ['$log',
function ($log){

  var goodatOptions=['轻型','管结构','十字柱','箱形柱','BH','桁架','网架','减震产品','其它'];
  var steelTypes=['Q235','Q345','Q390','Q420','Q460','其他'];
  var objReqInMonth={ 0.5:'两周内',1:'一个月内',2:'两个月内',
    3:'三个月内',6:'半年内',12:'一年内',24:'两年内',60:'五年内'}

  var inputs=[
    /*{
      name: 'name',
      desc: '项目名称',
      type: 'text',
      placeholder:'4-16字',
      required: 1,
      minlength: 4,
      maxlength: 16
    },*/
    {
      name: 'size',
      desc: '项目规模(㎡)',
      placeholder:'100-999999',
      type: 'number',
      required: 1,
      min: 100,
      max: 999999
    },
    { 
      name: 'type',
      desc: '项目类型',
      type: 'radio',
      required: 1,
      keys: ['商业','办公','住宅','酒店','剧院','体育建筑','医疗建筑','厂房','其他'],
      values: ['商业','办公','住宅','酒店','剧院','体育建筑','医疗建筑','厂房','其他']
    },
    {
      name: 'need_steel',
      desc: '采购量(t)',
      placeholder:'1-999999(t)',
      type: 'number',
      required: 1,
      min: 1,
      max: 999999
    },
    {//----------------------------
      name: 'steel_shape',
      desc: '主要构件形式',
      type: 'radio',
      required: 1,
      keys: goodatOptions,
      values: goodatOptions
    },
    {//----------------------------
      name: 'steel_Qxxx',
      desc: '主材牌号',
      type: 'radio',
      required: 1,
      keys: steelTypes,
      values: steelTypes
    },
    {
      name: 'in_month',
      desc: '首批供货时间',
      type: 'radio',
      required: 1,
      keys: ['0.5','1','2','3','6','12','24','60'],
      values: ['两周内','一个月内','两个月内','三个月内','半年内','一年内','两年内','五年内']
    },
    {
      name: 'provide_raw',
      desc: '供主材',
      type: 'radio',
      required: 1,
      keys: ['1','0'],
      values: ['是','否']
    },
    {
      name: 'stee_price',
      desc: '基准单吨价',
      placeholder:'供主材时为加工费(99-90000)',
      type: 'number',
      required: 1,
      min: 99,
      max: 90000
    },
    {
      name: 'advance_pay',
      desc: '预付款比例',
      type: 'radio',
      required: 1,
      keys: ['0','0.05','0.1','0.15','0.2','0.3','0.4','0.5'],
      values: ['0%','5%','10%','15%','20%','30%','40%','50%']
    },
    
    {
      name: 'require_check',
      desc: '合格供应商',
      type: 'radio',
      required: 1,
      keys: ['需要','补办','不需要'],
      values: ['需要','补办','不需要']
    },

    
    {//----------------------------
      name: 'contact_person',
      desc: '联系人',
      type: 'text',
      placeholder:'请输入联系人',
      required: 1,
      minlength: 2,
      maxlength: 16
    },
    {
      name: 'contact_tel',
      desc: '联系电话',
      type: 'tel',
      placeholder:'建议输入手机号',
      required: 1
    },
    {
      name: 'contact_email',
      desc: '联系邮箱',
      type: 'email',
      placeholder:'请输入邮箱地址',
      required: 1
    },
    {//----------------------------
      name: 'notes',
      desc: '补充说明',
      type: 'mtext',
      placeholder:'补充说明',
      required: 0,
      minlength: 0,
      maxlength: 999
    },
  ];
  var changeMarks={};
  function onChange(key){
    changeMarks[key]= 1;
  }


  function formatObj(obj){
    inputs.forEach(function(inp) {
      if(!obj.hasOwnProperty(inp.name)){
        return;
      }
      if(inp.type=='number') {
        obj[inp.name]= + obj[inp.name];
      }
    });
  }
  
  return {
    formatObj:formatObj,//根据字段定义，转换数据格式
    
    inputs:inputs,//字段定义
    changeMarks:changeMarks,//字段修改标记
    
    onChange:onChange,
    
    objReqInMonth : objReqInMonth,
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
