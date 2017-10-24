'use strict';
(function(){

angular.module('steefac')
.factory('FacDefine', ['$log','$timeout','AppbData',
function ($log,$timeout,AppbData){


  var goodatOptions=['轻型','管结构','十字柱','箱形柱','BH','桁架','网架','减震产品','其它'];

  var inputs=[
    /*{
      name: 'name',
      desc: '厂名',
      type: 'text',
      placeholder:'4-16字',
      required: 1,
      minlength: 4,
      maxlength: 16
    },*/
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
      desc: '证书编号',
      type: 'text',
      placeholder:'4-16字',
      required: 0,
      minlength: 4,
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
      required: 1,
      min: 0,
      max: 999999
    },
    
    
    
    /*{
      name: 'goodat',
      desc: '擅长构件',
      type: 'radio',
      required: 1,
      keys: goodatOptions,
      values: goodatOptions
    },*/
    
    
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
      placeholder:'0-99(m)',
      type: 'number',
      required: 0,
      min: 0,
      max: 99
    },
    {
      name: 'max_duxin',
      desc: '最大镀锌构件',
      placeholder:'0-99(m)',
      type: 'number',
      required: 0,
      min: 0,
      max: 99
    },
    {
      name: 'dist_expressway',
      desc: '最近高速距离',
      placeholder:'0-9999(km)',
      type: 'number',
      required: 0,
      min: 0,
      max: 9999
    },
    {
      name: 'dist_port',
      desc: '最近港口距离',
      placeholder:'0-9999(km)',
      type: 'number',
      required: 0,
      min: 0,
      max: 9999
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

    


  ];
  var changeMarks={};
  function onChange(key){
    changeMarks[key]= 1;
  }


  function formatObj(obj){
    
    //计算平均加工费
    var sum=0;
    if(obj.fee) {
      obj.feeObj=JSON.parse(obj.fee);
      for(var i=goodatOptions.length;i--; ) {
        sum+= +obj.feeObj[i];
      }
      obj.feeObj.aver= Math.round(sum/goodatOptions.length);
    }
    else
      obj.feeObj={aver:''}
    
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
    inputs:inputs,//字段定义
    onChange:onChange,
    
    
    formatObj:formatObj,//根据字段定义，转换数据格式
    
    changeMarks:changeMarks,//字段修改标记
    goodatOptions:goodatOptions,
  }
  
}]);


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
})();
