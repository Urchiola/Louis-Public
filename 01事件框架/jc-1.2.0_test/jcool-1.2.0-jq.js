/* 
* @Author: KimRi
* @Date:   2016-11-08 21:20:48
* @Last Modified by:   KimRi
* @Last Modified time: 2016-11-08 21:21:17
*/
(function(){
    var jCool=window.jc=window.$$ = function(selector,context){
        return new jCool.fn.init(selector, context );
    };
    
    jCool.fn=jCool.prototype = {
        init:function( selector, context ){
            //强制为对象
            // if (!(this instanceof jCool)) {
            //     return new jCool(selector);
            // }
            var elem = document.getElementById(/[^#].*/.exec(selector)[0]);
            this.length = 1;
            this[0] = elem;
            this.context = document;
            this.selector = selector;
            this.get = function(num) {
                return this[num];
            }
            return this;
        },
        //数据类型检测
        isNumber:function (val){
            return typeof val === 'number' && isFinite(val)
        },
        isBoolean:function (val) {
            return typeof val ==="boolean";
        },
        isString:function (val) {
            return typeof val === "string";
        },
        isUndefined:function (val) {
            return typeof val === "undefined";
        },
        isObj:function (str){
            if(str === null || typeof str === 'undefined'){
                return false;
            }
            return typeof str === 'object';
        },
        isNull:function (val){
            return  val === null;
        },
        isArray:function (arr) {
            if(arr === null || typeof arr === 'undefined'){
                return false;
            }
            return arr.constructor === Array;
        },
        //扩充对象
        extend:function(tar,source){
            for(var i in source){
                tar[i] = source[i]
            }
            return tar
        }
        
    };

    /*事件模块*/
    jCool.extend = jCool.fn.extend($$,{
        on:function(id,type,fn){

            //var dom = document.getElementById(id);
            var dom = $$.isString(id)?document.getElementById(id):id;
            //如果支持
            //W3C版本 --火狐 谷歌 等大多数浏览器
            //如果你想检测对象是否支持某个属性，方法，可以通过这种方式
            if(dom.addEventListener ) {
                dom.addEventListener(type, fn, false);
            }else if(dom.attachEvent){
                //如果支持 --IE
                dom.attachEvent('on' + type, fn);
            }
        },
        un:function(){

        }
    })

   
})()