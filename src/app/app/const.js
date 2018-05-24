
// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃               常用函数                                                       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function copy_arr(arr){
  if(arr === true) return "1";
  if(arr === false) return "";
  if(typeof arr !='object')return arr;
  if(arr.length){
    var R = [];
    for(var i=0; i<arr.length; i++)R.push(copy_arr(arr[i]));
    return R;
  }
  var R = {};
  for(var k in arr)if(k!="\$\$hashKey")R[k] = copy_arr(arr[k]);
  return R;
}
function is_empty_post($R){
  switch(typeof $R){
    case "number":return false;
    case "string":
    case "boolean": return !$R;
    case "undefined":
    case "function": return true;
    case "object": 
      for(var k in $R)if(k!="\$\$hashKey"){
        if(!is_empty_post($R[k]))return false;
      }
      return true;
  }
}
function copy_post(arr){
  if(arr === true) return "1";
  if(arr === false) return "";
  if(typeof arr !='object')return arr;
  if(arr.length){
    var R = [];
    for(var i=0; i<arr.length; i++)R.push(copy_post(arr[i]));
    return R;
  }
  var R = {}; 
  for(var k in arr)if(k!="\$\$hashKey" && !is_empty_post(arr[k])){
    R[k] = copy_post(arr[k]);
    if( typeof R[k] == 'number') R[k]=""+R[k];
  }
  return R;
}
function var2json($R){
  switch(typeof $R){
    case "number":return $R; //'"' + $R + '"';
    case "string":return '"' + $R.replace(/([\\\/\"])/g, "\\$1") + '"';
    case "boolean": return $R ? '"1"': '""';
    case "undefined":
    case "function": return '""';
    case "object": 
      if($R.length){
        var arr = [];
        for(var i=0; i<$R.length; i++)arr.push(var2json($R[i]));
        return "[" + arr.join(",") + "]";
      }
      var arr = [];
      for(var k in $R)if(k!="\$\$hashKey")arr.push('"'+k+'":'+var2json($R[k]));
      return "{" + arr.join(",") + "}";
  }
}
function var2postjson($R){
  switch(typeof $R){
    case "number":return '"' + $R + '"';
    case "string":return '"' + $R.replace(/([\\\/\"])/g, "\\$1") + '"';
    case "boolean": return $R ? '"1"': '""';
    case "undefined":
    case "function": return '""';
    case "object": 
      if($R.length){
        var arr = [];
        for(var i=0; i<$R.length; i++)arr.push(var2postjson($R[i]));
        return "[" + arr.join(",") + "]";
      }
      var arr = [];
      for(var k in $R)if(k!="\$\$hashKey")arr.push('"'+k+'":'+var2postjson($R[k]));
      return "{" + arr.join(",") + "}";
  }
}
function _number(arg){
	var i,n,R=0;
	for(i = 0; i < arg.length; i++){
		n=arg[i];
		if(typeof(arg[i])!="number")n=parseFloat(arg[i]);
		if(isNaN(n))n= 0;
		R+=n;
	}
	return parseFloat(R.toFixed(8));
}
function toNumber(){return _number(arguments);}

function money() {
    var n = _number(arguments);
    return  n.toFixed(2);
}
function no_undefined(v){if(v==undefined)return '';if(v=='undefined')return '';return v;}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          G                                           ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
var G = {
  //至少要2个参数（不判断）,方便JS的出现无下标的判断
  V:function(){
    var arr = arguments[0];
    if(!arr)return "";
  	for(i = 1; i < arguments.length; i++){
  		arr = arr[arguments[i]];
      if(!arr)return "";
  	}
    return arr;
  }
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃          密码异或                                    ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
function XORMD5(a, b){
  var N={"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15};
  var table = "0123456789ABCDEF".split("");
  var c = [];
  for(var i=0; i<32; i++){
    c[i] = table[N[a.substr(i,1)] ^ N[b.substr(i,1)]];
  }
  return c.join("");
}