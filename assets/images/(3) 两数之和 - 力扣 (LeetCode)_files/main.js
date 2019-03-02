!function(window){"use strict";function walkDomTree(t,e){if(1===t.nodeType)for(var n=t.firstChild;n;)1===n.nodeType&&(e(n),walkDomTree(n,e)),n=n.nextSibling}function getElementsByClassName(t,e){var n=[];return walkDomTree(t,function(t){for(var i="string"==typeof t.className?t.className.split(/\s/):[],o=0;o<i.length;++o)i[o]===e&&n.push(t)}),n}function renderTemplate(t,e,n){var i,o=document.createElement("div");o.innerHTML=t;for(var s in e)e.hasOwnProperty(s)&&(i=o.getElementsByClassName?o.getElementsByClassName("kf5-tpl-"+s):getElementsByClassName(o,"kf5-tpl-"+s),(i=i.length?i[0]:null)&&(n&&"function"==typeof n[s]?n[s](i,e[s]):"string"==typeof i.textContent?i.textContent=e[s]:i.innerText=e[s]));return o}function KF5SupportBox(t){this.config=t||{},this.config.is_overdue||(this.config.version=this.config.version||2,2===this.config.version&&(this.config.facade={0:2,1:3,2:1,3:4}[this.config.facade]),this.events={},this.init())}function bindEvent(t,e,n){if(t.addEventListener)return t.addEventListener(e,n,!1);if(t.attachEvent)return t.attachEvent(e,n,!1);throw new Error("Error with binding Event!")}function embed(t,e){var n,i,o,s=window.document.createElement("iframe");s.src="javascript:false",s.title="",s.role="presentation",(s.frameElement||s).style.cssText="display: none",window.document.body.appendChild(s),o=s.contentWindow;try{i=o.document}catch(t){n=window.document.domain,s.src='javascript:var doc=document.open();doc.domain="'+n+'";void(0);',i=o.document}i.open().start=function(){e&&("object"==typeof e?e.iframeWindow=o:"function"==typeof e&&e(o))},i.write('<body onload="document.start();">'),i.write('<script src="'+t+'""><\/script>'),i.close()}function getStyle(t,e){var n,i,o=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,s=/^margin/,r=/^(top|right|bottom|left)$/,a=new RegExp("^("+o+")(?!px)[a-z%]+$","i");return window.getComputedStyle?(n=function(t){return t.ownerDocument.defaultView.getComputedStyle(t,null)},i=function(t,e,i){var o,r,p,c,u=t.style;return i=i||n(t),c=i?i.getPropertyValue(e)||i[e]:void 0,i&&a.test(c)&&s.test(e)&&(o=u.width,r=u.minWidth,p=u.maxWidth,u.minWidth=u.maxWidth=u.width=c,c=i.width,u.width=o,u.minWidth=r,u.maxWidth=p),void 0===c?c:c+""}):document.documentElement.currentStyle&&(n=function(t){return t.currentStyle},i=function(t,e,i){var o,s,p,c,u=t.style;return i=i||n(t),c=i?i[e]:void 0,null==c&&u&&u[e]&&(c=u[e]),a.test(c)&&!r.test(e)&&(o=u.left,s=t.runtimeStyle,p=s&&s.left,p&&(s.left=t.currentStyle.left),u.left="fontSize"===e?"1em":c,c=u.pixelLeft+"px",u.left=o,p&&(s.left=p)),void 0===c?c:c+""||"auto"}),i&&i(t,e)}function animate(t,e,n){function i(){if(clearInterval(c),c=null,!n.carryOn){for(var i in e)t.style[i]=e[i]+"px";"function"==typeof n.callback&&n.callback.call(t)}t._finishAnimation=null}var o={};for(var s in e)o[s]=parseInt(getStyle(t,s));var r=n.duration||500,a=Date.now(),p=0,c=setInterval(function(){p=(Date.now()-a)/r,p=p>1?1:p;var s=easing[n.easing||"swing"](p);for(var c in e)t.style[c]=o[c]+(e[c]-o[c])*s+"px";p>=1&&i()},1e3/60);t._finishAnimation=i}function slideUp(t,e){t._finishAnimation&&t._finishAnimation(),e=e||{};var n,i=e.by||"height";t.style.display="block",n=parseInt(getStyle(t,i)),t.style[i]=(e.from||0)+"px";var o={};o[i]=n,animate(t,o,e)}function slideDown(t,e){t._finishAnimation&&t._finishAnimation(),e=e||{};var n=e.by||"height",i=getStyle(t,n),o=e.callback;e.callback="function"==typeof o?function(){this.style.display="none",this.style[n]=i,o.call(this)}:function(){this.style.display="none",this.style[n]=i};var s={};s[n]=e.to||0,animate(t,s,e)}function hideElement(t){t.style.display="none"}function showElement(t){t.style.display="block"}function cookie(t,e,n){if(void 0===e){var i=null;if(document.cookie&&""!=document.cookie)for(var o=document.cookie.split(";"),s=0;s<o.length;s++){var r=o[s].replace(/^\s+|\s+$/g,"");if(r.substring(0,t.length+1)==t+"="){i=decodeURIComponent(r.substring(t.length+1));break}}return i}n=n||{},null===e&&(e="",n.expires=-1);var a="";if(n.expires&&("number"==typeof n.expires||n.expires.toUTCString)){var p;"number"==typeof n.expires?(p=new Date,p.setTime(p.getTime()+24*n.expires*60*60*1e3)):p=n.expires,a="; expires="+p.toUTCString()}var c=n.path?"; path="+n.path:"",u=n.domain?"; domain="+n.domain:"",l=n.secure?"; secure":"";document.cookie=[t,"=",encodeURIComponent(e),a,c,u,l].join("")}function setup(){bindEvent(window,"DOMContentLoaded",KF5SupportBox.loadConfig),bindEvent(window,"load",KF5SupportBox.loadConfig),bindEvent(window.document,"page:load",KF5SupportBox.loadConfig),bindEvent(window.document,"onreadystatechange",function(){"complete"===window.document.readyState&&KF5SupportBox.loadConfig()}),window.initializeKF5SupportBox||(window.initializeKF5SupportBox=KF5SupportBox.loadConfig),bindEvent(window,"message",function(t){var e,n,i;if(t.origin.match(/^https?:\/\/(.*)$/)[1]===kf5Domain)if(t.data&&"string"==typeof t.data&&(e=t.data.match(/^([^ ]+)(?: +(.*))?/),n=e[1],i=e[2]),"CMD::showSupportbox"===n)KF5SupportBox.instance&&(KF5SupportBox.instance.open(),KF5SupportBox.instance.hideButton());else if("CMD::hideSupportbox"===n)KF5SupportBox.instance&&KF5SupportBox.instance.close(function(){KF5SupportBox.instance.showButton()});else if("CMD::resizeIframe"===n);else if("CMD::kf5Notice"===n)KF5SupportBox.instance&&KF5SupportBox.instance.showNotice(i&&JSON.parse(i));else if("CMD::newMsgCountNotice"===n){if(KF5SupportBox.instance){var o=KF5SupportBox.instance.getElement("#msg-number");i=parseInt(i),i?(o.style.display="block",o.innerHTML=i<10?i:"..."):(o.style.display="none",o.innerHTML="")}}else if("CMD::showImage"===n){if(KF5SupportBox.instance){var s=KF5SupportBox.instance.getElement("#kf5-view-image"),r=KF5SupportBox.instance.getElement("#kf5-backdrop"),a=s.parentNode||s.parentElement;i=i?JSON.parse(i):{},r.style.display="block",a.setAttribute("href",i.url),a.setAttribute("title",i.name||""),s.setAttribute("src",i.url),s.setAttribute("alt",i.name||"")}}else"CMD::iframeReady"===n&&KF5SupportBox.instance.onIframeReady()}),"string"==typeof lang&&lang&&KF5SupportBoxAPI.ready(function(){KF5SupportBoxAPI.useLang(lang)})}if(window.KF5SupportBoxAPI)return void console.error("KF5SupportBoxAPI already loaded");var privateData={},script=window.document.getElementById("kf5-provide-supportBox"),parts=script.src.split("//"),assetsHost=parts.length>1?parts[1].split("/")[0]:"assets.kf5.com",kf5Domain=script.getAttribute("kf5-domain"),lang=script.getAttribute("lang"),supportboxConfigURL="//"+kf5Domain+"/supportbox/buttonconfig",date=(new Date).getDay(),_config={btn_name:"在线咨询",facade:4,icon:0,color:"#5d94f3",position:"left",vertical:!1,iframeURL:"//"+kf5Domain+"/kchat?supportbox=1&active_in_iframe=0",styleURL:"//"+assetsHost+"/supportbox_v2/css/supportBtn.css",template:'<div id="kf5-support-block" class="kf5-supportBox" style="display: none"><a id="kf5-close-btn" class="kf5-support-chat_close kf5-waves" href="javascript:;"></a><div id="kf5-loading" class="kf5-loading kf5-loading-md kf5-center"></div><div id="kf5-iframe-holder"></div></div><div id="kf5-support-btn" style="{{text_color}}; {{bg_color}};" class="kf5-chatSupport-btn kf5-chatSupport-style{{facade}} kf5-chatSupport-icon{{icon}} kf5-waves waves-effect waves-light"><span>{{title}}</span><div id="msg-number" class="kf5-chatSupport_msgNumber" style="display: none"></div></div><div id="kf5-backdrop" class="kf5-backdrop" style="display: none;"><a class="kf5-backdrop-close">关闭</a><a href="" target="_blink"><img id="kf5-view-image" class="kf5-backdrop-img" src=""></a></div>',noticeTemplate:'<div class="kf5-support-message" style="right:30px;bottom: 30px"> <div class="kf5-support-message-left"> <img class="kf5-tpl-noticeAvatar" src="" alt=""> </div> <div class="kf5-support-message-content"> <div class="kf5-support-message-name kf5-tpl-noticeTitle"></div> <div class="kf5-support-message-info kf5-tpl-noticeContent"></div> </div> <div class="kf5-support-message-right"> <a id="kf5-support-message-accept" class="kf5-support-message-accept kf5-tpl-noticeAccept">接受</a> <a id="kf5-support-message-reject" class="kf5-support-message-reject kf5-tpl-noticeReject">拒绝</a> </div> </div>',defaultNoticeAvatar:"//"+assetsHost+"/supportbox/images/kf5-icon-talk.png",autoLoadIframe:!0,autoOpen:!1},_old_config={has_aside:!1,btn_icon:"//"+assetsHost+"/supportbox/images/icon2.png",styleURL:"//"+assetsHost+"/supportbox/css/btn.css",template:'<div id="kf5-support-btn" class="kf5-support-btn" style="{{bg_color}}"> <img src="{{btn_icon}}" alt=""><span>{{title}}</span> </div> <div id="kf5-support-block" class="kf5-support kf5-support-show {{blockClassNames}}" style="display: none;"> <a id="kf5-close-btn" class="kf5-close" title="最小化"><i class="kf5-icon-clear"></i></a> <div id="kf5-loading" class="kf5-loading"> </div> <div id="kf5-iframe-holder" style="display:none;"></div> </div>'};Date.now=Date.now||function(){return(new Date).getTime()};var noticeTemplateHolders={noticeAvatar:function(t,e){t.src=e}},JSON=window.JSON||{stringify:function(t){var e,n="";if(null===t)return String(t);switch(typeof t){case"number":case"boolean":return String(t);case"string":return'"'+t+'"';case"undefined":case"function":return}switch(Object.prototype.toString.call(t)){case"[object Array]":n+="[";for(var i=0,o=t.length;i<o;i++)e=JSON.stringify(t[i]),n+=(void 0===e?null:e)+",";return"["!==n&&(n=n.slice(0,-1)),n+="]";case"[object Date]":return'"'+(t.toJSON?t.toJSON():t.toString())+'"';case"[object RegExp]":return"{}";case"[object Object]":n+="{";for(i in t)t.hasOwnProperty(i)&&void 0!==(e=JSON.stringify(t[i]))&&(n+='"'+i+'":'+e+",");return"{"!==n&&(n=n.slice(0,-1)),n+="}";case"[object String]":return'"'+t.toString()+'"';case"[object Number]":case"[object Boolean]":return t.toString()}},parse:function(jsonStr){return eval("("+jsonStr+")")}};KF5SupportBox.prototype={el:null,url:function(){var t=this.getOpt("iframeURL"),e=[];return this.AgentGroupData&&(this.AgentGroupData.agent_ids&&e.push("agent_ids="+this.AgentGroupData.agent_ids),this.AgentGroupData.force&&e.push("force="+this.AgentGroupData.force)),this.CategoryType&&this.CategoryType.category_ids&&e.push("category_ids="+this.CategoryType.category_ids),this.AIQuestionBankType&&this.AIQuestionBankType.forum_ids&&e.push("forum_ids="+this.AIQuestionBankType.forum_ids),t+"&"+e.join("&")},on:function(t,e){return void 0===this.events[t]&&(this.events[t]=[]),"function"==typeof e&&this.events[t].push(e),this},emit:function(t){for(var e=this.events[t]||[],n=Array.prototype.slice.call(arguments,1),i=e.length,o=0;o<i;o++)e[o].apply(null,n)},getElement:function(t){return window.document.getElementById(t.replace("#",""))},getOpt:function(t){var e=this.config||{};return void 0!==e[t]?e[t]:1===e.version&&void 0!==_old_config[t]?_old_config[t]:_config[t]},init:function(){return this.initElements(),this},initElements:function(){1===this.getOpt("version")?this._prepareOldElement():this._prepareElement(),this.render()},render:function(){var t=this;this._prepareStyle(),t.link.onload=function(){document.body.appendChild(t.el),t.onDidInsertElement(),t._bindEvents(),t.link.onload=null},document.body.appendChild(t.link)},onDidInsertElement:function(){if(this.waitingQueue)for(;this.waitingQueue.length;)this.waitingQueue.shift()(this)},waitingQueue:null,ready:function(t){this.el&&this.el.parentNode?t(this):(this.waitingQueue||(this.waitingQueue=[]),this.waitingQueue.push(t))},_prepareStyle:function(){var t=this.link=window.document.createElement("link");return t.rel="styleSheet",t.type="text/css",t.href=this.getOpt("styleURL")+"?v="+date,this},_prepareElement:function(){var t="kf5-support-chat";"left"===this.getOpt("position")?t+=" kf5-chatSupport-left-bottom":"right"===this.getOpt("position")?t+=" kf5-chatSupport-right-bottom":t+=" "+this.getOpt("position");var e=this.getOpt("facade")||4;return this.getOpt("is_mobile")&&(t+=" kf5-mobile"),this.el=window.document.createElement("div"),this.el.setAttribute("class",t),this.el.setAttribute("style","position: relative;z-index: 2147483000"),this.el.innerHTML=this.getOpt("template").replace("{{title}}",this.getOpt("btn_name")).replace("{{facade}}",e).replace("{{icon}}",this.getOpt("icon")).replace("{{text_color}}",this.getOpt("text_color")?"color:"+this.getOpt("text_color"):"").replace("{{bg_color}}",this.getOpt("color")?"background:"+this.getOpt("color"):""),this},_prepareOldElement:function(){var t="kf5-support-123456789";return"left"===this.getOpt("position")?t+=" kf5-left":"right"===this.getOpt("position")?t+=" kf5-right":t+=" "+this.getOpt("position"),isNaN(+this.getOpt("facade"))?t+=" "+this.getOpt("facade"):t+=" kf5-style"+(parseInt(this.getOpt("facade"))||1),this.getOpt("is_mobile")&&(t+=" kf5-mobile"),this.el=window.document.createElement("div"),this.el.setAttribute("class",t),this.el.setAttribute("id","kf5-support-123456789"),this.el.innerHTML=this.getOpt("template").replace("{{title}}",this.getOpt("btn_name")||"获取帮助").replace("{{btn_icon}}",this.getOpt("btn_icon")+"?v="+date).replace("{{bg_color}}",this.getOpt("color")?"background:"+this.getOpt("color"):"").replace("{{blockClassNames}}",this.getOpt("has_aside")?"kf5-has-aside":""),this},addEventCreater:function(){var t=function(t,e){for(var n=t.split(/\s+/g),i=0;i<n.length;i++){var o=n[i];e.call(this,o)}};return"function"==typeof window.addEventListener?function(e,n,i){t(n,function(t){e.addEventListener(t,i,!1)})}:"function"==typeof window.attachEvent?function(e,n,i){t(n,function(t){e.attachEvent("on"+t,i)})}:function(e,n,i){t(n,function(t){e["on"+t]=i})}},_bindEvents:function(){var t=this,e=this.addEventCreater();if(!this.el.eventBinded){var n=this.getElement("#kf5-support-btn"),i=this.getElement("#kf5-close-btn"),o=this.getElement("#kf5-backdrop");e(n,"click touchstart",function(){t.open(),t.hideButton()}),e(i,"click touchstart",function(){t.close(function(){t.showButton()})}),o&&e(o,"click touchstart",function(){o.style.display="none"}),this.el.eventBinded=!0}return this.ready(function(){t.getOpt("autoLoadIframe")?t.loadIframe():cookie("kf5-supportBox-autoOpen",null,{path:"/"}),t.isAutoOpen()&&(t.open(),t.hideButton())}),this},isAutoOpen:function(){return!this.getOpt("is_mobile")&&(this.getOpt("autoOpen")||cookie("kf5-supportBox-autoOpen"))},onIframeReady:function(){var t=this;this.getElement("#kf5-loading").style.display="none";var e=this.iframe;this.emit("iframeReady",e),this.identifyData&&this.identify(this.identifyData),t.iframe&&t.iframe.contentWindow&&t.iframe.contentWindow.postMessage&&(t.iframe.contentWindow.postMessage("CMD::referrerInfo "+JSON.stringify({title:document.title,url:location.href,referrer:document.referrer}),"*"),t.postMessage("CMD::toggleIframePanel",{opened:t.isOpened})),this.iframeIsReady=!0},loadIframe:function(){var t=this.getElement("#kf5-widget-iframe"),e=this.getElement("kf5-iframe-holder");return t||(this.iframe=t=document.createElement("iframe"),t.setAttribute("id","kf5-widget-iframe"),t.setAttribute("class","kf5-supportBox_iframe"),t.setAttribute("frameborder","0"),t.setAttribute("scrolling","no")),t.getAttribute("src")||t.setAttribute("src",this.url()),e&&(e.parentNode.insertBefore(t,e),e.parentNode.removeChild(e)),this},reloadIframe:function(){return this.iframe.setAttribute("src",this.url()),this},removeButton:function(){return hideElement(this.getElement("#kf5-support-btn")),this.buttonRemoved=!0,this},showButton:function(t){if(!this.buttonRemoved){var e={duration:300,easing:"swing",callback:t,from:-80};this.getOpt("vertical")?/left/.test(this.getOpt("position"))?e.by="left":e.by="right":e.by="bottom",slideUp(this.getElement("#kf5-support-btn"),e)}},hideButton:function(t){if(!this.buttonRemoved&&!this.getOpt("is_mobile")){var e={duration:300,easing:"swing",callback:t,to:-80};this.getOpt("vertical")?/left/.test(this.getOpt("position"))?e.by="left":e.by="right":e.by="bottom",slideDown(this.getElement("#kf5-support-btn"),e)}},keepIframe:!1,useIframe:function(t){this.keepIframe=void 0===t||Boolean(t)},shouldOpenNewPage:function(){return this.getOpt("is_mobile")&&!this.keepIframe},open:function(t){if(this.shouldOpenNewPage())return void this.openNewPage();this.isOpened||(this.loadIframe(),slideUp(this.getElement("#kf5-support-block"),{duration:300,easing:"swing",callback:t,by:"bottom",from:-450}),this.getOpt("is_mobile")||cookie("kf5-supportBox-autoOpen",1,{expires:.125,path:"/"}),this.isOpened=!0,this.postMessage("CMD::toggleIframePanel",{opened:!0}))},postMessage:function(t,e){this.iframe&&this.iframe.contentWindow&&this.iframe.contentWindow.postMessage&&this.iframe.contentWindow.postMessage(t+" "+JSON.stringify(e),"*")},openNewPage:function(){var t,e,n=this.getOpt("iframeURL"),i={identifyData:this.identifyData,AgentGroupData:this.AgentGroupData,AIQuestionBankType:this.AIQuestionBankType,CategoryType:this.CategoryType},o=["lang="+(this.getOpt("lang")||"")];for(var s in i){var r=i[s];if(r&&"object"==typeof r)for(t in r)e=r[t],"object"==typeof e&&(e=e instanceof Array&&"metadata"!==t?e.join(","):JSON.stringify(e)),o.push(t+"="+e)}window.location.href=n+"&"+o.join("&")},close:function(t){slideDown(this.getElement("#kf5-support-block"),{duration:300,easing:"swing",callback:t,by:"bottom",to:-450}),cookie("kf5-supportBox-autoOpen",null,{path:"/"}),this.isOpened=!1,this.postMessage("CMD::toggleIframePanel",{opened:!1})},hide:function(){hideElement(this.el)},show:function(){showElement(this.el)},identify:function(t){if(t){var e=JSON.stringify(t);this.iframe&&this.iframe.contentWindow&&this.iframe.contentWindow.postMessage&&this.iframe.contentWindow.postMessage("CMD::identify "+e,"*"),this.identifyData=t}},setAgents:function(t){t&&(this.AgentGroupData=t)},setKnowledgeStore:function(t){t&&(this.CategoryType=t)},setAIStore:function(t){t&&(this.AIQuestionBankType=t)},appendMessageCard:function(t){var e=this;this.referrerLink=t;var n=function(){e.postMessage("CMD::appendMessageCard",{url:t.url||"",title:t.title||"",description:t.description||"",thumbnail:t.thumbnail})};this.iframeIsReady?n():this.on("iframeReady",n)},showNotice:function(t){var e,n=this;return t="object"==typeof t?t:{},e=renderTemplate(this.getOpt("noticeTemplate"),{noticeTitle:t.title||"提示信息",noticeContent:t.content||"",noticeAvatar:t.avatar||this.getOpt("defaultNoticeAvatar"),noticeAccept:t.submitText||"接受",noticeReject:t.cancelText||"拒绝"},noticeTemplateHolders),this.closeNotice(),this.noticeElement=e,1===this.getOpt("version")?document.body.appendChild(e):this.el&&this.el.appendChild(e),bindEvent(document.getElementById("kf5-support-message-accept"),"click",function(){n.open(),n.hideButton(),n.iframe&&n.iframe.contentWindow&&n.iframe.contentWindow.postMessage("CMD::kf5NoticeAccepted "+JSON.stringify(t.data),"*"),n.closeNotice()}),bindEvent(document.getElementById("kf5-support-message-reject"),"click",function(){n.iframe&&n.iframe.contentWindow&&n.iframe.contentWindow.postMessage("CMD::kf5NoticeRejected "+JSON.stringify(t.data),"*"),n.closeNotice()}),e},closeNotice:function(){this.noticeElement&&(this.noticeElement.parentNode.removeChild(this.noticeElement),this.noticeElement=null)}},KF5SupportBox.waitingQueue=[],KF5SupportBox.onConfigReady=function(){if(!KF5SupportBox.instance)for(KF5SupportBox.init();KF5SupportBox.waitingQueue.length;)KF5SupportBox.waitingQueue.shift()()},KF5SupportBox.ready=function(t){KF5SupportBox.instance?t():KF5SupportBox.waitingQueue.push(t)},KF5SupportBox.init=function(){if(!KF5SupportBox.instance)return KF5SupportBox.instance=new KF5SupportBox(privateData.KF5_SUPPORTBOX_BUTTON),KF5SupportBox.instance},KF5SupportBox.destroy=function(){KF5SupportBox.instance.el.parent.removeChild(KF5SupportBox.instance.el),KF5SupportBox.instance=null},KF5SupportBox.loadConfig=function(){KF5SupportBox.instance||embed(supportboxConfigURL,function(t){t.KF5_SUPPORTBOX_BUTTON&&t.KF5_SUPPORTBOX_BUTTON.show&&(privateData.KF5_SUPPORTBOX_BUTTON=t.KF5_SUPPORTBOX_BUTTON,KF5SupportBox.onConfigReady())})};var easing={swing:function(t){return.5-Math.cos(t*Math.PI)/2},linear:function(t){return t}};setup(),window.KF5SupportBoxAPI={init:KF5SupportBox.loadConfig,ready:KF5SupportBox.ready,removeButton:function(){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.removeButton()})},showButton:function(t){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.showButton()})},hideButton:function(t){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.hideButton()})},refresh:function(){KF5SupportBox.instance&&KF5SupportBox.instance.render()},open:function(t){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.open(t)})},close:function(t){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.close(t)})},identify:function(t){KF5SupportBox.instance&&t&&KF5SupportBox.instance.identify(t)},registerLang:function(t,e){var n=KF5SupportBox.instance;if(n){var i=function(){n.postMessage("CMD::registerLang",{name:t,map:e})};if(n.iframe)return i();n.on("iframeReady",i)}},useLang:function(t){var e=KF5SupportBox.instance;if(e){var n=function(){e.postMessage("CMD::useLang",{name:t})};e.iframe&&n(),e.on("iframeReady",n)}},setParams:function(t){this.setAIStore(t.forum_ids),this.setAgents(t.agent_ids,+!!t.force),this.setKnowledgeStore(t.category_ids)},setAgents:function(t,e){if("[object Array]"!==Object.prototype.toString.call(t))throw TypeError("agent_ids is expected to be an array");KF5SupportBox.instance&&t.length>0&&KF5SupportBox.instance.setAgents({agent_ids:t,force:e})},setKnowledgeStore:function(t){if("[object Array]"!==Object.prototype.toString.call(t))throw TypeError("category_ids is expected to be an array");KF5SupportBox.instance&&t.length>0&&KF5SupportBox.instance.setKnowledgeStore({category_ids:t})},setAIStore:function(t){if("[object Array]"!==Object.prototype.toString.call(t))throw TypeError("forum_ids is expected to be an array");KF5SupportBox.instance&&t.length>0&&KF5SupportBox.instance.setAIStore({forum_ids:t})},appendMessageCard:function(t){KF5SupportBox.instance&&KF5SupportBox.instance.ready(function(){KF5SupportBox.instance.appendMessageCard(t)})}}}(window);