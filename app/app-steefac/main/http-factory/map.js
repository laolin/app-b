!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 地图操作
   */
  theConfigModule.run(['$q', 'sign', 'ProjDefine', 'FacMap', 'AmapMainData', function ($q, sign, ProjDefine, FacMap, AmapMainData) {
    var MAP = {
      objIcons: { steefac: 'cubes', steeproj: 'university' },
      /**
       * 显示产能或项目到地图上
       * 显示内容：图标 + 文字
       * 在地图及UI备妥（承诺）后，才显示
       */
      markObj: (obj, type) => {
        return $q.when(FacMap.AwesomeMarker, () => {
          FacMap.clearAllMark();
          var pos = [obj.lngE7 / 1E7, obj.latE7 / 1E7];
          var mark = FacMap.newMarker('#fff', '16px', MAP.objIcons[type], pos, false, ('' + obj.name).substr(0, 4));
          FacMap.searchMarkers = [mark];
          mark.show();
          mark.selIndex = 0;
          MAP.showObjInfoWindow(obj, type, -32);
          AmapMainData.getMapData().map.setZoomAndCenter(10, pos);
          mark.on('click', function (e) {
            MAP.showObjInfoWindow(obj, type, -32);
          });
        });
      },

      showObjInfoWindow: function (obj, type, offsetY) {
        var da = MAP.infoOfObj(obj, type);
        FacMap.getInfoWindow().then(function (iw) {

          AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {

            FacMap.infoWindow.close();
            FacMap.infoWindow = new SimpleInfoWindow({
              offset: new AMap.Pixel(0, offsetY)
            });

            FacMap.infoWindow.setInfoTitle(da.infoTitle);

            //设置标题内容
            FacMap.infoWindow.setInfoBody(da.infoBody);

            //设置主体内容
            FacMap.infoWindow.setInfoTplData(da.infoTplData);
            FacMap.infoWindow.open(AmapMainData.getMapData().map, [obj.lngE7 / 1e7, obj.latE7 / 1e7]);

            FacMap.infoWindow.on('close', function (e) {
              //MAP.unselectOne();
            })

          })
        })
      },
      unselectOne: function () {
        //FacSearch.searchResultSelected = -1;
        $timeout(function () {
        }, 178);//178.1这里延时不能太短，否则从一个选择换到另一个选择会有闪烁
      },

      infoOfObj: function (o, type) {
        var data = {};
        if (type == 'steefac') {
          data.infoTitle = '<strong><%- name %></strong>';

          //设置标题内容
          data.infoBody =
            '剩余产能<%- cap_6m %>吨，厂房面积<%- area_factory %>㎡<br>' +
            '擅长构件：<%- goodat %><br/>' +
            '<%- update_at %>更新' +
            '<a href="#!/fac-detail/<%- id %>?tabIndex=2">【业绩】</a>'
            //'<a href="#!/fac-detail/<%- id %>">【详细】</a>'
            ;

          //设置主体内容
          var dt = new Date(1000 * o.update_at);
          var u_at = (dt.getYear() + 1900) + '.' + (dt.getMonth() + 1) + '.' + dt.getDate();
          data.infoTplData = {
            name: o.name,
            cap_6m: o.cap_6m,
            update_at: u_at,
            area_factory: o.area_factory,
            goodat: o.goodat,
            id: o.id
          };
        }
        if (type == 'steeproj') {
          data.infoTitle = '<strong><%- name %></strong>';

          //设置标题内容
          //，项目规模<%- size %>㎡
          data.infoBody =
            '采购量<%- need_steel %>吨<br>' +
            '供货时间：<%- in_month %><br/>' +
            '<%- update_at %>更新' +
            '<a href="#!/project-detail/<%- id %>">【详情】</a><br/>'
            ;

          //设置主体内容
          var dt = new Date(1000 * o.update_at);
          var u_at = (dt.getYear() + 1900) + '.' + (dt.getMonth() + 1) + '.' + dt.getDate();
          data.infoTplData = {
            name: o.name,
            need_steel: o.need_steel,
            size: o.size,
            update_at: u_at,
            in_month: ProjDefine.objReqInMonth[o.in_month],
            id: o.id
          };
        }
        return data;

      },

    }



    sign.registerHttpHook({
      match: /^地图\/(.*)$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse.resolve((FacMap[match[1]] || MAP[match[1]]).apply({}, param));
      }
    });
  }]);


})(angular, window);
