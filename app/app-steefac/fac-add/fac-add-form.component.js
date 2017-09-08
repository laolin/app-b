'use strict';

angular.module('steefac')
.component('facAddForm',{
  templateUrl: 'app-steefac/fac-add/fac-add-form.component.template.html',
  bindings: {
    searchData: '='
  },
  controller:['$http','$log','$interval','FacMap',
	  function ($http,$log,$interval,FacMap) {
      var ctrl=this;
      ctrl.FacMap=FacMap;
      
      
      var formModels={}
      function onChange(){}
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
      ];
      ctrl.formDefine={
        formName:'abc124',
        inputs:inputs,
        models:formModels,
        changeModel:onChange,
      }
      
      
      
      
      
      
      
      
      
      
      
    }
  ]
});
