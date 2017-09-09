'use strict';
(function(){

angular.module('steefac')
.factory('FacDefine', ['$log','$timeout','AppbData',
function ($log,$timeout,AppbData){



  var inputs=[
    {
      name: 'name',
      desc: '厂名',
      type: 'text',
      required: 1,
      minlength: 2,
      maxlength: 16
    },
    {
      name: 'level',
      desc: '资质',
      type: 'radio',
      required: 1,
      keys: ['0','1','2','3'],
      values: ['特级','一级','二级','三级']
    },
    {
      name: 'license',
      desc: '证号',
      type: 'text',
      required: 1,
      minlength: 2,
      maxlength: 16
    },
    
    
    {
      name: 'cap_y',
      desc: '年产能(t)',
      placeholder:'0-999999(t)',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    {
      name: 'cap_1m',
      desc: '下月剩余产能',
      placeholder:'0-999999(t)',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    {
      name: 'cap_2m',
      desc: '下两月剩余',
      placeholder:'0-999999(t)',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    {
      name: 'cap_3m',
      desc: '下三月剩余',
      placeholder:'0-999999(t)',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    {
      name: 'cap_6m',
      desc: '下六月剩余',
      placeholder:'0-999999(t)',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    
    {
      name: 'workers',
      desc: '工人总数',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'workers_hangong',
      desc: '焊工人数',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'workers_maogong',
      desc: '铆工人数',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'workers_gongyi',
      desc: '工艺人员',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'workers_xiangtu',
      desc: '详图人员',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'workers_other',
      desc: '其他人员',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },

    
    
    {
      name: 'goodat',
      desc: '擅长构件',
      type: 'radio',
      required: 1,
      keys: ['轻型','管结构','十字柱','箱形柱','BH','桁架','网架','减震产品','其它'],
      values: ['轻型','管结构','十字柱','箱形柱','BH','桁架','网架','减震产品','其它']
    },
    
    
    {
      name: 'area_factory',
      desc: '厂房面积(㎡)',
      placeholder:'0-999999',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    {
      name: 'area_duichang',
      desc: '堆场面积(㎡)',
      placeholder:'0-999999',
      type: 'number',
      required: 0,
      min: 0,
      max: 999999
    },
    
    {
      name: 'max_hangche',
      desc: '最大行车(T)',
      placeholder:'0-99999',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    
    {
      name: 'max_paowan',
      desc: '最大抛丸构件',
      placeholder:'0-99999(mm)',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'max_duxin',
      desc: '最大镀锌构件',
      placeholder:'0-99999(mm)',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    {
      name: 'near_port',
      desc: '最近港口',
      placeholder:'',
      type: 'text',
      required: 0,
      min: 2,
      max: 16
    },
    {
      name: 'dist_expressway',
      desc: '最近高速距离',
      placeholder:'0-999(km)',
      type: 'number',
      required: 0,
      min: 0,
      max: 99999
    },
    
    
    


  ];
  var models={};
  var changeMarks={};
  function onChange(key){
    changeMarks[key]= 1;
  }
  
  return {
    inputs:inputs,//字段定义
    models:models,//保存字段当前数值    
    changeMarks:changeMarks,//字段修改标记
    
    onChange:onChange
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
