(this["webpackJsonptravel-map"]=this["webpackJsonptravel-map"]||[]).push([[0],{10:function(e,t){t.MAPBOX_TOKEN="pk.eyJ1IjoiYXVzdGluYm9vdGgiLCJhIjoiY2tmemd3YWxqMDFubTJyc2RkbHU1ZXNteiJ9.um0aocbu9wQQsJaFVZ4S2Q",t.OPENCAGE_TOKEN="189c92f4944e4970a5bfa2a830d79032"},29:function(e,t,n){e.exports=n.p+"static/media/red-pin.43ca6b14.png"},30:function(e,t,n){e.exports=n(55)},35:function(e,t,n){},36:function(e,t,n){},55:function(e,t,n){"use strict";n.r(t);var a=n(2),o=n.n(a),r=n(26),c=n.n(r),u=(n(35),n(14)),i=n(7),l=(n(36),n(27)),s=n.n(l),m=n(10),f=function(e){var t=Object(a.useRef)(null),n=Object(a.useState)(""),r=Object(i.a)(n,2),c=r[0],u=r[1],l=Object(a.useState)(null),f=Object(i.a)(l,2),p=f[0],g=f[1],d=Object(a.useState)(0),b=Object(i.a)(d,2),v=b[0],E=b[1];Object(a.useEffect)((function(){c&&(t.current.selectionStart=t.current.value.length,t.current.selectionEnd=t.current.value.length)})),Object(a.useEffect)((function(){p||E(0)}),[p]);var h=function(t){u(""),function(e){var t="".concat("https://api.opencagedata.com/geocode/v1/json","?key=").concat(m.OPENCAGE_TOKEN,"&q=").concat(e);return s.a.get(t).then((function(e){return e.data.results[0].geometry})).then((function(e){return e}))}(t).then((function(t){var n=t.lat,a=t.lng;return e.setCoords(n,a)}))},O=function(e){var t=e.currentTarget.innerHTML;u(t),h(t),g(null)},j=function(e){var t=e.currentTarget.innerHTML,n=p.indexOf(t);E(n),u(t)};return o.a.createElement("div",{className:"form-and-suggestions-container"},o.a.createElement("form",{onSubmit:function(e){e.preventDefault(),h(c)}},o.a.createElement("input",{type:"text",id:"location",name:"location",ref:t,onChange:function(e){var t=e.target.value,n=["Prague","Berlin","Paris","St Petersburg","Split"].filter((function(e){return e.toLowerCase().includes(t.toLowerCase())}));n.unshift(t),0===t.length?g(null):g(n),u(t)},onKeyDown:function(e){if(null!==p){var t=e.key;"ArrowUp"===t&&(E((function(e){return e>0?e-1:0})),u(p[v-1])),"ArrowDown"===t&&(E((function(e){return e<p.length-1?e+1:p.length-1})),u(p[v+1])),"Enter"===t&&(p.length>0&&u(p[v]),E(0),g(null))}},value:c}),o.a.createElement("button",{type:"submit"},"Find"),p&&o.a.createElement("ul",{className:"suggestions"},p.map((function(e,t){return o.a.createElement("li",{key:e,onClick:O,onMouseEnter:j,className:t===v?"active-suggestion":void 0},e)})))))},p=n(12),g=n(29),d=n.n(g),b=[{name:"Prague",latitude:50.0755,longitude:14.4378,images:[{src:"https://firebasestorage.googleapis.com/v0/b/travel-map-6fc3a.appspot.com/o/color_wheel_4_background.svg?alt=media&token=5e3ac8c6-fa5f-424c-a7d7-4de0c387b3ef",alt:"Image alt text"}]},{name:"Berlin",latitude:52.52,longitude:13.405,images:[{src:"https://firebasestorage.googleapis.com/v0/b/travel-map-6fc3a.appspot.com/o/color_wheel_4_background.svg?alt=media&token=5e3ac8c6-fa5f-424c-a7d7-4de0c387b3ef",alt:"Image alt text"}]}],v=function(e){var t=b.map((function(t){return o.a.createElement(p.a,{key:t.name,longitude:t.longitude,latitude:t.latitude,offsetTop:-25,offsetLeft:-15},o.a.createElement("div",{className:"pin",onClick:function(){return e.setPopupInfo(t.name)}},o.a.createElement("img",{src:d.a,alt:"pin"})))}));return o.a.createElement("div",{className:"map-container"},o.a.createElement(p.c,Object.assign({},e.viewport,{onViewportChange:function(t){return e.setViewport(t)},mapboxApiAccessToken:m.MAPBOX_TOKEN}),t,e.popupInfo&&function(t){var n=b.filter((function(e){return e.name===t}))[0];return console.log(n.name),o.a.createElement(p.b,{tipSize:5,anchor:"top",latitude:n.latitude,longitude:n.longitude,closeOnClick:!1,onClose:function(){return e.setPopupInfo(null)}},n.name,o.a.createElement("img",{src:n.images[0].src,alt:n.images[0].alt}))}(e.popupInfo)))},E=function(){var e=Object(a.useState)({width:800,height:400,latitude:23,longitude:0,zoom:1}),t=Object(i.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)(null),l=Object(i.a)(c,2),s=l[0],m=l[1];return o.a.createElement("div",{className:"App"},o.a.createElement("header",null,o.a.createElement("h1",null,"Travel Map")),o.a.createElement(f,{setCoords:function(e,t){r(Object(u.a)(Object(u.a)({},n),{},{latitude:e,longitude:t,zoom:8}))}}),o.a.createElement(v,{viewport:n,setViewport:r,popupInfo:s,setPopupInfo:m}))};c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(E,null)),document.getElementById("root"))}},[[30,1,2]]]);
//# sourceMappingURL=main.1d2382e5.chunk.js.map