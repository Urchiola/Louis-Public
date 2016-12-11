/* 
* @Author: KimRi
* @Date:   2016-11-08 21:21:31
* @Last Modified by:   KimRi
* @Last Modified time: 2016-11-11 13:22:22
*/

//定义一个对象 - 名字是$
var $$ = function() {};
//第二种写法
$$.prototype = {
    //table栏
    tab:function(id) {
        //如何获取某个父元素下面的子元素
        var box = document.getElementById(id);
        var spans = box.getElementsByTagName('span');
        var lis = box.getElementsByTagName('li');


        //两步走
        //第一步: 先把上半部分实现
        //群体绑定事件  -- 对所有的span绑定事件
        //群体绑定事件
        for(var i=0;i<spans.length;i++) {
            //相亲法则  -- 给男一号一个代号  --  怎么给 -- 自定义属性
            spans[i].index=i;
            spans[i].onmouseover = function() {
                //排他思想 --  将所有的span置为默认状态  --- 然后再将当前鼠标移上的span置为class -- select
                for(var i=0;i<spans.length;i++) {
                    spans[i].className='';
                    lis[i].className='';
                }
                this.className='select';
                lis[this.index].className='select';
            }
        }
    },
    //给一个对象扩充功能//传统方法
    extendMany:function() {
        var key,i = 0,len = arguments.length,target = null,copy;
        if(len === 0){
            return;
        }else if(len === 1){
            target = this;
        }else{
            i++;
            target = arguments[0];
        }
        for(; i < len; i++){
            for(key in arguments[i]){
                copy = arguments[i][key];
                target[key] = copy;
            }
        }
        return target;
    },
    extend:function(tar,source) {
        //遍历对象
        for(var i in source){
            tar[i] = source[i];
        }
        return tar;
    },
}
//在框架中实例化，这样外面使用的使用就不用实例化了
$$ = new $$();

/**选择模块**/
$$.extend($$,{
    /*获取ID*/
    $id:function (str){
        return document.getElementById(str)
    },
    /*获取target*/
    // $tag:function(pbox,tag){
    //     if(typeof pbox == 'string')
    //     {
    //         pbox = this.$id(pbox);
    //     }
    //     if(pbox){
    //         return pbox.document.getElementsByTagName(tag)
    //     }else{
    //         return document.getElementsByTagName(tag)
    //     }
        
    // },
    $tag:function(pid,tag){
        var arglen = arguments.length
        if(arglen===1){
                return  document.getElementsByTagName(pid)
        }else if(arglen===2){
            if(typeof pid =='string'){
                pid=this.$id(pid)
            }
            if(pid){
                return pid.getElementsByTagName(tag)
            }else{
                return  document.getElementsByTagName(tag)
            }
        }
        
       
    }
})

/*事件模块*/
$$.extend($$,{
    /*绑定事件*/
    on: function (id, type, fn) {
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
    /*解除事件*/
    un:function(id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.isString(id)?document.getElementById(id):id;
        if(dom.removeEventListener){
            dom.removeEventListener(type, fn);
        }else if(dom.detachEvent){
            dom.detachEvent(type, fn);
        }

    },
    /*点击*/
    click : function(id,fn){
        this.on(id,'click',fn);
    },
    /*鼠标移上*/
    mouseover:function(id,fn){
        this.on(id,'mouseover',fn);
    },
    /*鼠标离开*/
    mouseout:function(id,fn){
        this.on(id,'mouseout',fn);
    },
    /*悬浮*/
    hover : function(id,fnOver,fnOut){
        if(fnOver){
            this.on(id,"mouseover",fnOver);
        }
        if(fnOut){
            this.on(id,"mouseout",fnOut);
        }
    },
    /*获取事件Event对象*/
    getEvent:function (e){

        return e?e:window.event
    },
    /**根据事件Event对象获取到目标元素**/
    getTarget:function (event){
        var e  = this.getEvent(event)
        return e .target || e .srcElement
    },
    //阻止默认行为
    preventDefault:function(e){
        var event= this.getEvent(e);
        if(event.preventDefault){
            event.preventDefault();
        }else{
            //兼容ie 
            event.returnValue =false
        }
    },
    //阻止冒泡
    stopPropagation:function(e){
        var event= this.getEvent(e);
        if(event.propagation){
            event.propagation();
        }else{
            //兼容ie 
            event.cancelBubble =true
        }
    },
    delegate:function(pid, eventType, selector, fn) {
        var that = this
        //参数处理
        var parent = this.$id(pid);
         function handle(e){
            var target = that.getTarget(e);
            if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                // 为什么使用call，因为call可以改变this指向
                // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                fn.call(target);
            }
        } 
        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
        //这里是是给元素对象绑定一个事件
         parent[eventType]=handle;
    }
})

/**字符串操作模块**/
$$.extend($$,{
    //去除左边空格
    ltrim:function(str){
        return str.replace(/(^\s*)/g,'');
    },
    //去除右边空格
    rtrim:function(str){
        return str.replace(/(\s*$)/g,'');
    },
    //去除空格
    trim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    //简单的数据绑定formateString
    formateString:function(str, data){
        return str.replace(/@\((\w+)\)/g, function(match, key){
        return typeof data[key] === "undefined" ? '' : data[key]});
    },
})

/**ajax模块**/
$$.extend($$,{
    //ajax - 前面我们学习的
    myAjax:function(URL,fn){
        var xhr = createXHR();  //返回了一个对象，这个对象IE6兼容。
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                    fn(xhr.responseText);
                }else{
                    alert("错误的文件！");
                }
            }
        };
        xhr.open("get",URL,true);
        xhr.send();

        //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
        function createXHR() {
            //本函数来自于《JavaScript高级程序设计 第3版》第21章
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    },
})

/**数字操作模块**/
$$.extend($$,{
    //随机数
    random: function (begin, end) {
        return Math.floor(Math.random() * (end - begin)) + begin;
    },
})

/**数据类型检测模块**/
$$.extend($$,{
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
    }
})

/* 模块*/
$$.extend($$,{
    
})
