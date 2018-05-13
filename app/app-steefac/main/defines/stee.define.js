!(function (angular, window, undefined) {

  var theConfigModule = angular.module('app-config')

  /**
   * 项目字典
   */
  theConfigModule.run(['$http', '$q', 'sign', function ($http, $q, sign) {

    /** 项目阶段 - 字典 */
    var theSteeDick = {
      "项目阶段": [
        { value: "mode1", title: "中标后分包阶段" },
        { value: "mode2", title: "施工图设计阶段" },
      ],
      "擅长类别": [
        "装配式", "超高层", "大跨空间", "厂房", "桥梁", "火电", "海工", "设备", "船配", "隔减震", "自定义"
      ],
      "项目类别": [
        "装配式", "超高层", "大跨空间", "厂房", "桥梁", "火电", "海工", "设备", "船配", "隔减震", "自定义"
      ],
      "擅长构件": [
        "桥梁", "船配", "减隔震", "压力容器", "钢塔", "轻型", "管结构", "网架", "桁架", "BH",
        "十字柱", "箱型柱", "其它截面", "组合楼板", "柱底板", "钢楼梯",
        "锅炉钢架", "风电塔", "设备支架", "钢平台", "海工", "栏杆扶手爬笼等次结构", "自定义"
      ],
      "业绩获奖": [
        "鲁班奖", "金钢奖", "白玉兰", "自定义"
      ],
      "业绩工法": [
        "国家级", "省部级"
      ],


    };


    sign.registerHttpHook({
      match: /^获取下拉列表$/, // \/stee-(.+)
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        var dick_name = param;
        var list = theSteeDick[dick_name]
        if (list) return mockResponse.resolve({ list });
      }
    });
  }]);


  /**
   * 项目定义
   */
  theConfigModule.run(['$http', '$q', 'sign', function ($http, $q, sign) {
    var theProjStep = [
      { value: "mode1", title: "找分包/外协阶段" },
      { value: "mode2", title: "施工图设计阶段" },
    ];

    var formBoolean = {
      whenNotMode2: {
        mode: "!=",
        v1: { mode: "value", value: "mode2" },
        v2: { mode: "formValue", field: "mode" }
      }
    };

    var theProjType = [];
    var theSteeType = [];


    var theProjDefine = {
      create: {
        mode: [
          { name: 'mode', value: "mode1", title: "找分包/外协阶段" },
          { name: 'mode', value: "mode2", title: "施工图设计阶段" },
        ],

        form: {
          items: [
            { name: 'step', title: '项目所处阶段', type: 'dropdown', mode: 'show' },
            { name: 'name', title: '项目名称', type: 'input', param: { valid: { require: true }, placeholder: "项目名称" } },
            { name: 'address', title: '项目地点', type: 'input', param: { valid: { require: true }, placeholder: "项目地点" } },
            { name: 'm2', title: '项目规模', type: 'input', param: { valid: { min: 0 }, placeholder: "平方米" } },
            { name: 'projtype', title: '项目类型', type: 'dropdown', param: { list: theProjType } },
            { name: 'steetype', title: '钢构类别', type: 'tags', param: { list: theSteeType } },
            { name: 'purchases', title: '总采购量', type: 'input', param: { valid: { min: 0 }, placeholder: "吨" } },



            // { name: 'pics1', title: '图纸目录截图', type: 'imgs-uploader', param: { valid: { min: 0, max: 3 } }, hide: whenNotMode2 },
            // { name: 'pics2', title: '总说明截图', type: 'imgs-uploader', param: { valid: { min: 0, max: 3 } }, hide: whenNotMode2 },
            // { name: 'pics3', title: '清单截图', type: 'imgs-uploader', param: { valid: { min: 0, max: 3 } }, hide: whenNotMode2 },
          ],

        }
      },

      /** */

    }
    sign.registerHttpHook({
      match: /^项目定义$/,
      hookRequest: function (config, mockResponse, match) {
        var param = config.data;
        return mockResponse.resolve({
          fac: FacDefine,
          proj: ProjDefine,
        });
      }
    });
  }]);


})(angular, window);
