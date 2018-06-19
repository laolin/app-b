'use strict';

angular.module('steefac')
.component('placeAddrInput',{
  templateUrl: 'app-steefac/place-input/place-addr-input.component.template.html',
  bindings: {
  },
  controller:['$http','$log','$interval','AppbData','FacMap',
	  function ($http,$log,$interval,AppbData,FacMap) {
      
      var appData=AppbData.getAppData();

      var ctrl=this;
      ctrl.searchAddr = function() {
        FacMap.searchAddr(ctrl.addrInput.addr);
      }
      ctrl.addrInput=FacMap.addrInput;

      this.useAddress = () => {
        if(ctrl.addrInput.addr == ctrl.addrInput.formatted_address) return;
        $http.post("显示对话框/confirm", { body: `即将替换地址为“${ctrl.addrInput.formatted_address}”。确认？`, title: "即将替换地址文本，请确认：" }).then(()=>{
          ctrl.addrInput.addr = ctrl.addrInput.formatted_address;
        })
      }
    }
  ]
});
