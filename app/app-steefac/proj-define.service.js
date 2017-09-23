'use strict';
(function(){

angular.module('steefac')
.factory('ProjDefine', ['$log',
function ($log){



  var inputs=[
    {
      name: 'name',
      desc: '项目名称',
      type: 'text',
      placeholder:'4-16字',
      required: 1,
      minlength: 4,
      maxlength: 16
    },
    {
      name: 'size',
      desc: '项目规模(㎡)',
      placeholder:'100-9999999',
      type: 'number',
      required: 1,
      min: 100,
      max: 9999999
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
      name: 'in_month',
      desc: '用钢周期',
      type: 'radio',
      required: 1,
      keys: ['3','6','12','24','36'],
      values: ['三月内','半年内','一年内','两年内','五年内']
    },
    {
      name: 'need_steel',
      desc: '估计用钢量(t)',
      placeholder:'1-999999(t)',
      type: 'number',
      required: 1,
      min: 1,
      max: 999999
    }
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
    
    onChange:onChange
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
