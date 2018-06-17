# APP-b 说明


# 各版本的`入口html`及对应的`loader.js`

## 0 自动构建简述
通过gulp自动构建，最终发布时本APP由6个文件组成即可。

1. `入口HTML`文件 `xxx.html`
2. loader文件 `loader.js`
和 `4个主文件`(css或js文件)
`1.lib-xxx.css`
`2.appb-xxx.css`
`3.lib-xxx.js`
`4.appb-xxx.js`



> `入口html`是基本固定不修改的。

> loader文件和 `4个主文件`均由 gulp自动构建 
> 参考gulp.js中的注解

## 1 HTML文件

入口html文件基本不变。

### 仓库中的各版本的入口HTML

仓库文件：在 `/app-b/cmoss-html/` 目录下

+ CMOSS 前期测试 `(暂无)`
+ CMOSS 测试     cmoss.test.html
+ CMOSS 预览版   cmoss.preview.html
+ CMOSS 最新版   cmoss.newest.html
+ CMOSS 正式版   cmoss.master.html
+ CMOSS 小程序   cmoss.xcx.html

### web服务器布署的各版本HTML位置

+ CMOSS 前期测试 `(暂无)`__(/dev/laolin/cmoss-html/cmoss.pre-test.html)__
+ CMOSS 测试     /dev/laolin/cmoss-html/cmoss.test.html
+ CMOSS 预览版   /dev/laolin/cmoss-html/cmoss.preview.html
+ CMOSS 最新版   /dev/laolin/cmoss-html/cmoss.newest.html
+ CMOSS 正式版   /dev/laolin/cmoss-html/cmoss.master.html
+ CMOSS 小程序   /dev/laolin/cmoss-html/cmoss.xcx.html

### web服务器通过 `.htaccess`文件映射到根目录下

```
# CMOSS 前期测试
RewriteRule ^cmoss.pre-test.html$ /dev/laolin/cmoss-html/cmoss.pre-test.html
# CMOSS 测试
RewriteRule ^cmoss.test.html$ /dev/laolin/cmoss-html/cmoss.test.html
# CMOSS 预览版
RewriteRule ^cmoss.preview.html$ /dev/laolin/cmoss-html/cmoss.preview.html
# CMOSS 最新版
RewriteRule ^cmoss.newest.html$ /dev/laolin/cmoss-html/cmoss.newest.html
# CMOSS 正式版
RewriteRule ^cmoss.html$ /dev/laolin/cmoss-html/cmoss.master.html
RewriteRule ^cmoss.master.html$ /dev/laolin/cmoss-html/cmoss.master.html
# CMOSS 小程序
RewriteRule ^gstools/steefac/(index.html)?$ /dev/laolin/cmoss-html/cmoss.xcx.html
RewriteRule ^cmoss.xcx.html$ /dev/laolin/cmoss-html/cmoss.xcx.html
```

## 2 loader.js文件

### loader.js文件位置

+ CMOSS 测试    /app-b/assets/debug/cmoss.test.loader.js
+ CMOSS 预览版  /app-b/loader/preview/cmoss.preview.loader.js
+ CMOSS 最新版  /app-b/assets/debug/cmoss.newest.loader.js
+ CMOSS 正式版  /app-b/loader/cmoss.master.loader.js
+ CMOSS 小程序  /app-b/loader/cmoss.xcx.loader.js


### loader.js里定义的五项内容

loadder的内容`由gulp`每次构建时自动生成
1. window.__assetsPath="https://qgs.oss-cn-shanghai.aliyuncs.com/app-b/assets"
2. localStorage_Token_KEY:"__cmoss_preview_token__",
3. apiRoot:"https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.2/src/cmoss/"
4. apiRootUnit:"https://api.qinggaoshou.com/cmoss-master-vers/ver-1.1.2/src/api-unit/"
5. 以及`4个主文件`的文件名


其中1一般不变，
2一般每一种loader.js对应固定一种，
3，4项对应后端api的版本号及API路径
5即自动构建生成的文件名
详`gulp.js`文件。
