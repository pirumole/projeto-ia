(function(t){function e(e){for(var r,a,o=e[0],u=e[1],c=e[2],h=0,p=[];h<o.length;h++)a=o[h],Object.prototype.hasOwnProperty.call(s,a)&&s[a]&&p.push(s[a][0]),s[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(t[r]=u[r]);l&&l(e);while(p.length)p.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,o=1;o<n.length;o++){var u=n[o];0!==s[u]&&(r=!1)}r&&(i.splice(e--,1),t=a(a.s=n[0]))}return t}var r={},s={app:0},i=[];function a(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=r,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var l=u;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},1:function(t,e){},"4ef4":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);var r=n("2b0e"),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("app-menu"),n("router-view",{attrs:{functions:t.functions}})],1)},i=[],a=n("8055"),o=n.n(a),u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"menu"}},[n("button",{staticClass:"menu-button"},[n("router-link",{attrs:{to:"/"}},[t._v("Home")])],1)])},c=[],l={name:"Menu",created(){this.$parent.$on("resize",t=>this.onResize(t))},methods:{getMenuDocument(){return document.getElementById("menu")},onResize(t){let e=this.getMenuDocument();e.style.width=t.innerWidth+"px"}}},h=l,p=(n("ff8e"),n("2877")),d=Object(p["a"])(h,u,c,!1,null,null,null),f=d.exports,m=n("bc3a"),w=n.n(m),v={name:"App",components:{AppMenu:f},created(){this.functions={sendText:this.sendText,sleep:this.sleep},this.io=o()("/"),window.onresize=()=>this.onResize(),this.authorize()},data:()=>({functions:{},auth:null}),methods:{OffSet(){let{innerWidth:t,innerHeight:e}=window;return{innerWidth:t,innerHeight:e}},defaultHeader(){let t={"Content-type":"application/json"};return this.auth&&(t["authorization"]="Bearer "+this.auth),t},async request(t,e,n){try{let r=await w()({method:t.toLocaleUpperCase(),url:e,data:n,headers:this.defaultHeader()});if("error"==r.data.status)throw r.data;return r.data}catch(r){return null}},onResize(){this.$emit("resize",this.OffSet())},async authorize(){let t=await this.request("post","/auth",null);if(!t)return!0;this.auth=t.result.key},async renderError(){},sleep(t){return t=parseFloat(t)||1,t*=1e3,new Promise(e=>{setTimeout(()=>{e(!0)},t)})},sendText(t){var e=this;return new Promise(n=>{this.io.emit("message",{auth:this.auth,text:t},(t,r)=>t?(e.renderError(t),n(null)):"error"!=r.status||r.result.autentication?n(r):(e.authorize(),n(null)))})}}},b=v,y=(n("dbc8"),Object(p["a"])(b,s,i,!1,null,null,null)),x=y.exports,g=n("8c4f"),O=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"home"}},[n("app-text",{attrs:{functions:t.functions},on:{"text-changed":t.showOptions}}),t.show?n("app-option",{attrs:{buttons:t.buttons,functions:t.functions,rect:t.rect},on:{"button-click":t.newValue}}):t._e()],1)},j=[],_=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app-text"}},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.data,expression:"data"}],staticClass:"app-text content-text",attrs:{contenteditable:"true",id:"text-id"},domProps:{value:t.data},on:{input:function(e){e.target.composing||(t.data=e.target.value)}}})])},$=[],z={name:"AppText",async created(){this.input=async()=>this.textInput?this.textInput():(await this.functions.sleep(.3),this.input()),this.$parent.$on("add-value",this.newValue)},data:()=>({data:""}),props:{functions:{type:Object,required:!0}},methods:{getDataLen(){return this.data.length},async textInput(){let t=this.getDataLen();if(this.$emit("text-changed",null),!t)return!0;await this.functions.sleep(.5);this.getDataLen();let e=await this.functions.sendText(this.data);if(!e)return!0;let n=document.getElementById("text-id").getClientRects()[0];return this.$emit("text-changed",{rect:n,response:e}),!0},newValue(t){this.data+=t.text,document.getElementById("text-id").focus()}},watch:{data:function(){this.input()}}},E=z,T=(n("8aaf"),Object(p["a"])(E,_,$,!1,null,null,null)),D=T.exports,P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],attrs:{id:"app-option"}})},B=[],C={name:"AppOption",props:{buttons:{type:Array,required:!0},functions:{type:Object,required:!0},rect:{type:DOMRect,required:!0}},data:()=>({show:!1}),async created(){this.renderButtons()},methods:{async getDocument(){let t=document.getElementById("app-option");return t||(await this.functions.sleep(.5),await this.getDocument())},async removeButtons(t){const e=" "+t.innerText+" ";var n=await this.getDocument();while(n.firstChild)n.removeChild(n.firstChild);this.$emit("button-click",{text:e})},async renderButtons(){var t=await this.getDocument();t.style.left=this.rect.left-5+"px",t.style.width=this.rect.width+10+"px",this.show=!0;var e=this;this.buttons.forEach((function(n){let r=document.createElement("div");r.classList.add("button-text"),r.innerText=n,r.onclick=()=>e.removeButtons(r),t.appendChild(r)}))}}},M=C,R=(n("76ac"),Object(p["a"])(M,P,B,!1,null,null,null)),k=R.exports,q={name:"Home",components:{AppText:D,AppOption:k},props:{functions:{type:Object,required:!0}},created(){this.onResize=async()=>this.showOptions?this.showOptions(null):(await this.functions.sleep(.5),this.onResize()),this.$parent.$on("resize",this.onResize)},data:()=>({show:!1,buttons:null,rect:null}),methods:{showOptions(t){return this.show=!1,this.data=null,this.rect=null,null==t||(!t.response.result||(!t.response.result.options||(!t.response.result.options.length||(this.show=!0,this.buttons=t.response.result.options,void(this.rect=t.rect)))))},newValue(t){this.show=!1,this.data=null,this.$emit("add-value",t)}}},A=q,H=(n("cccb"),Object(p["a"])(A,O,j,!1,null,null,null)),I=H.exports;r["a"].use(g["a"]);const S=[{path:"/",name:"Home",component:I}],L=new g["a"]({mode:"history",base:"/",routes:S});var V=L;r["a"].config.productionTip=!1,new r["a"]({router:V,render:function(t){return t(x)}}).$mount("#app")},"5ced":function(t,e,n){},"76ac":function(t,e,n){"use strict";var r=n("b1c1"),s=n.n(r);s.a},"8aaf":function(t,e,n){"use strict";var r=n("4ef4"),s=n.n(r);s.a},b1c1:function(t,e,n){},cccb:function(t,e,n){"use strict";var r=n("5ced"),s=n.n(r);s.a},dbc8:function(t,e,n){"use strict";var r=n("f939"),s=n.n(r);s.a},eb98:function(t,e,n){},f939:function(t,e,n){},ff8e:function(t,e,n){"use strict";var r=n("eb98"),s=n.n(r);s.a}});
//# sourceMappingURL=app.d0671b17.js.map