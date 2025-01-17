
// Java.perform(() => {
//     var WebView = Java.use('android.webkit.WebView');
//     WebView.setWebContentsDebuggingEnabled.overload("boolean").implementation = function (s) {
//         console.log("强制开启webview调试");
//         this.setWebContentsDebuggingEnabled(true)
//     }
//     WebView.setWebContentsDebuggingEnabled(true)
// })
/*Java.perform(function() {

    // Hook WebView 的 loadUrl 方法 (经测试全部用的是这个)
    // var WebView = Java.use('android.webkit.WebView');
    // WebView.loadUrl.overload('java.lang.String').implementation = function(url) {
    //     console.log("WebView loading URL: " + url);
    //     // 打印栈追踪 (调用链)
    //     var stackTrace = Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Exception').$new());
    //     console.log("调用链: " + stackTrace);
    //     // 继续执行原来的 loadUrl 方法
    //     return this.loadUrl(url);
    // };

    // Hook WebView 的 loadUrl 方法 (经测试全部用的是这个)
    var WebView = Java.use('android.webkit.WebView');
    WebView.setWebContentsDebuggingEnabled.overload("boolean").implementation = function (s) {
        console.log("强制开启webview调试");
        this.setWebContentsDebuggingEnabled(true)
    }
    WebView.loadUrl.overload('java.lang.String').implementation = function(url) {
        console.log("WebView loading URL: " + url);
        if (url.startsWith("javascript:") && url.includes("window.")) {
            // 提取Base64字符串
            var base64EncodedString = url.match(/"([^"]+)"/)[1]; // 匹配出Base64字符串
            // 解码Base64
            var decodedBase64 = Java.use('android.util.Base64').decode(base64EncodedString, 0);
            var decodedString = Java.use('java.lang.String').$new(decodedBase64, "UTF-8");
            // 使用Java的replace方法进行转义字符替换
            decodedString = decodedString.replace(Java.use('java.lang.String').$new("\\u0026"), Java.use('java.lang.String').$new("&"));
            decodedString = decodedString.replace(Java.use('java.lang.String').$new("\\u003d"), Java.use('java.lang.String').$new("="));
            console.log("解码 Base64: " + decodedString)
        }
        // 打印栈追踪 (调用链)
        var stackTrace = Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Exception').$new());
        console.log("调用链: " + stackTrace);
        // 继续执行原来的 loadUrl 方法
        return this.loadUrl(url);
    };
    
    // 解码Unicode字符串的函数
    function decodeUnicode(str) {
        return str.replace(/\\u[\dA-Fa-f]{4}/g, function (match) {
            return String.fromCharCode(parseInt(match.replace("\\u", ""), 16));
        });
    }
    

    // Hook WebViewClient 的 onPageFinished 方法
    var WebViewClient = Java.use('android.webkit.WebViewClient');
    WebViewClient.onPageFinished.overload('android.webkit.WebView', 'java.lang.String').implementation = function(view, url) {
        console.log("WebView finished loading URL: " + url);
        // 可以在这里处理更多逻辑，如获取网页内容
        return this.onPageFinished(view, url);
    };

    // Hook WebView 的 WebResourceRequest
    var WebResourceRequest = Java.use('android.webkit.WebResourceRequest');
    var WebViewClient2 = Java.use('android.webkit.WebViewClient');

    WebViewClient2.shouldInterceptRequest.overload('android.webkit.WebView', 'android.webkit.WebResourceRequest').implementation = function(view, request) {
        var requestUrl = request.getUrl().toString();
        console.log("Intercepting WebResourceRequest: " + requestUrl);

        // 在这里可以执行任何自定义逻辑，如修改请求
        return this.shouldInterceptRequest(view, request);
    };
});*/

let latest_webview_instance = null

function catchDecryptedData() {
    const DataDecryptCommand$execute$1$decryptData$1 = Java.use("com.fenbi.android.leo.webapp.secure.commands.DataDecryptCommand$execute$1$decryptData$1");
    const DataDecryptCommand$execute$1 = Java.use("com.fenbi.android.leo.webapp.secure.commands.DataDecryptCommand$execute$1");
    const DataDecryptCommand = Java.use("com.fenbi.android.leo.webapp.secure.commands.DataDecryptCommand");

    DataDecryptCommand$execute$1$decryptData$1["invokeSuspend"].implementation = function (obj) {
        // console.log(`DataDecryptCommand$execute$1$decryptData$1.invokeSuspend is called: obj=${obj}`);
        // console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
        let ret = this["invokeSuspend"](obj);
        // console.log(`DataDecryptCommand$execute$1$decryptData$1.invokeSuspend ret=${ret}`);
        send({ 'from': 'DataDecryptCommand$execute$1$decryptData$1.invokeSuspend', 'data': ret.toString() });
        // var result = Java.use('java.lang.String').$new(ret, "UTF-8");

        return ret;
    };

    // DataDecryptCommand$execute$1$decryptData$1["$init"].implementation = function (dataDecryptBean, cVar) {
    //     console.log(`DataDecryptCommand$execute$1$decryptData$1.$init is called: dataDecryptBean=${dataDecryptBean}, cVar=${cVar}`);
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     this["$init"](dataDecryptBean, cVar);
    // };

    // DataDecryptCommand$execute$1["$init"].implementation = function (dataDecryptBean, pVar, cVar) {
    //     console.log(`DataDecryptCommand$execute$1.$init is called: dataDecryptBean=${dataDecryptBean}, pVar=${pVar}, cVar=${cVar}`);
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     this["$init"](dataDecryptBean, pVar, cVar);
    // };

    // DataDecryptCommand["$init"].implementation = function () {
    //     console.log("[HOOK] constructing DataDecryptCommand")
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     return this['$init']();
    // }

    // DataDecryptCommand['a'].implementation = function (bean, callback) {
    //     console.log(`[HOOK] DataDecryptCommand.a is called`);
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     return this['a'](bean, callback);
    // };
}

function catchEncryptData() {
    const DataEncryptCommand$execute$1$encryptData$1 = Java.use("com.fenbi.android.leo.webapp.secure.commands.DataEncryptCommand$execute$1$encryptData$1");
    DataEncryptCommand$execute$1$encryptData$1["$init"].implementation = function (dataEncryptBean, cVar) {
        console.log(`[HOOK] DataEncryptCommand$execute$1$encryptData$1.$init is called: dataEncryptBean=${dataEncryptBean}, cVar=${cVar}`);
        send({ 'from': 'DataEncryptCommand$execute$1$encryptData$1.$init', 'data': dataEncryptBean["getBase64"]().toString() });
        this["$init"](dataEncryptBean, cVar);
    };
    DataEncryptCommand$execute$1$encryptData$1["invokeSuspend"].implementation = function (obj) {
        console.log(`DataEncryptCommand$execute$1$encryptData$1.invokeSuspend is called: obj=${obj}`);
        // send({'from': 'DataEncryptCommand$execute$1$encryptData$1.invokeSuspend', 'data': ret.toString()});
        let result = this["invokeSuspend"](obj);
        console.log(`DataEncryptCommand$execute$1$encryptData$1.invokeSuspend result=${result}`);
        return result;
    };
}

function interceptJSBridge() {
    const WebView = Java.use("com.tencent.smtt.sdk.WebView");
    WebView["addJavascriptInterface"].implementation = function (obj, str) {
        if (str == "LeoSecureWebView") {
            var myClass = Java.use(obj.$className)
            myClass['dataEncrypt'].implementation = function (b64data) {
                console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
                // var bytes = Java.use('android.util.Base64').decode(b64data, 0);
                // var data = Java.use('java.lang.String').$new(bytes, "UTF-8");
                // console.log(data)
                send({ 'from': 'dataEncrypt', 'data': b64data })
                const op = recv('continue', (m) => {
                    // console.log(m);
                    b64data = m['data']
                });
                op.wait();
                this['dataEncrypt'](b64data);
                return
            }
        }

        if (str == "MathExerciseWebView") {
            var myClass = Java.use(obj.$className)
            myClass['recognize'].implementation = function (b64data) {
                console.log(`[HOOK] recognize(${b64data}) called from webview`)
                let ret = this['recognize'](b64data)
                console.log(`[HOOK] recognize returned ${ret}`)
                return ret
            }
        }
        console.log(`WebView.addJavascriptInterface is called: obj=${obj}, str=${str}`);
        this["addJavascriptInterface"](obj, str);

    };

    WebView['loadUrl'].overload('java.lang.String').implementation = function (url) {
        this.setWebContentsDebuggingEnabled(true)
        latest_webview_instance = Java.retain(this)

        // if (url.includes("exercise.html")) {
        //     console.log(`[HOOK] reset __local_NoVerifyPKTimesKey`)
        //     // console.log(this['loadUrl'])
        //     // console.log(this['loadUrl']('javascript:alert("a")'))
        //     return this['loadUrl']('javascript:alert(localStorage.setItem("__local_NoVerifyPKTimesKey", "MTAwMA=="))')
        //     // return this['loadUrl'](url);
        // }

        if (url.startsWith("javascript:")) {
            // console.log(`[HOOK] JS executed from WebView.loadUrl(${url})`);
            return this['loadUrl'](url);
        }

        console.log(`[HOOK] WebView.loadUrl(${url})`);
        return this[`loadUrl`](url);
    }
    const JsBridgeBean = Java.use("com.yuanfudao.android.common.webview.base.JsBridgeBean");
    // const JsBridgeBeanCallback = Java.use("com.yuanfudao.android.common.webview.base.JsBridgeBean$a");
    // console.log(JsBridgeBean, JsBridgeBeanCallback)


    // JsBridgeBean['$init'].implementation = function() {
    //     console.log("[HOOK] constructing JsBridgeBean")
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     return this['$init']();
    // }

    // JsBridgeBeanCallback["$init"].overload('com.yuanfudao.android.common.webview.base.a', 'java.lang.String', 'java.lang.String').implementation = function(a, b, c) {
    //     console.log(`[HOOK] constructing JsBridgeBean callback ${a}, ${b}, ${c}`)
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     return this["$init"](a,b,c);
    // }

    // JsBridgeBean["trigger"].overload('java.lang.String', 'com.yuanfudao.android.common.webview.base.a', 'java.lang.Integer', '[Ljava.lang.Object;').implementation = function (trigger, webView, error, data) {
    //     console.log(`[HOOK] JsBridgeBean.trigger is called: trigger=${trigger}, webView=${webView}, error=${error}, data=${data}`);
    //     // console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     let result = this["trigger"](trigger, webView, error, data);
    //     console.log(`[HOOK] JsBridgeBean.trigger result=${result}`);
    //     return result;
    // };
}

function interceptRecognizer() {
    // let d = Java.use("yx.d");
    // d["recognize"].implementation = function (base64) {
    //     console.log(`[HOOK] d.recognize is called: base64=${base64}`);
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     this["recognize"](base64);
    // };
    const MathScriptRecognizer = Java.use("com.fenbi.android.leo.recognization.math.MathScriptRecognizer");
    // MathScriptRecognizer["$init"].overload('android.content.Context', 'com.fenbi.android.leo.recognization.common.CommonModelConfig', 'com.fenbi.android.leo.recognization.common.b').implementation = function (context, commonModelConfig, bVar) {
    //     console.log(`[HOOK] MathScriptRecognizer.$init is called: context=${context}, commonModelConfig=${commonModelConfig}, bVar=${bVar}`);
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     this["$init"](context, commonModelConfig, bVar);
    // };
    MathScriptRecognizer["a"].implementation = function (keypoint, strokes, answers) {
        console.log(`[HOOK] MathScriptRecognizer.a is called: keypoint=${keypoint}, strokes=${strokes}, answers=${answers}`);
        // let result = this["a"](keypoint, strokes, answers);
        let result = answers.toArray()[0];
        console.log(`[HOOK] MathScriptRecognizer.a result=${result}`);
        return result;
    };
}

Java.perform(() => {
    // catchDecryptedData();
    // catchEncryptData();
    interceptJSBridge();
    interceptRecognizer();
    console.log("[HOOK] All hooks loaded.")

    // const MtopRequest = Java.use("mtopsdk.mtop.domain.MtopRequest");
    // MtopRequest["setData"].implementation = function (s) {
    //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
    //     this["setData"](s)
    // }
})

const Runnable = Java.use('java.lang.Runnable');
const Looper = Java.use('android.os.Looper');
const Handler = Java.use('android.os.Handler');
const LoadURLRunnable = Java.registerClass({
    name: 'pkpk.LoadURLRunnable',
    implements: [Runnable],
    fields: {
        url: 'java.lang.String',
        webview: 'com.tencent.smtt.sdk.WebView'
    },
    methods: {
        run: function () {
            this.webview.value['loadUrl'](this.url.value);
        }
    }
});

rpc.exports = {
    openurl: function (url) {

        if (latest_webview_instance == null) {
            console.log('[RPC] webview instance not set!')
            return
        }
        let r = LoadURLRunnable.$new()
        r.webview.value = latest_webview_instance
        r.url.value = url
        let l = Looper.getMainLooper()
        let h = Handler.$new(l)

        h.post(r)
        return
    }
}