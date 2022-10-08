!function(t){var e={};function a(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)a.d(n,s,function(e){return t[e]}.bind(null,s));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/",a(a.s=0)}([function(t,e,a){t.exports=a(1)},function(t,e,a){"use strict";a.r(e);function n(t,e){for(var a=0;a<e.length;a++){var n=e[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var s={mixins:[Fieldtype],data:function(){return{lng:null,lat:null,markerLng:null,markerLat:null,zoom:null,type:null,style:null,map:null,marker:null,hasMarker:!1,geocoder:null,location:null}},watch:{lat:function(){this.saveLocation()},lng:function(){this.saveLocation()},markerLat:function(){this.saveLocation()},markerLng:function(){this.saveLocation()},zoom:function(){this.saveLocation()},type:function(){this.saveLocation(),this.map&&("custom"===this.type?this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.config.initial_type):this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.type))},style:function(){this.saveLocation(),this.map&&this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+("custom"===this.style?this.config.initial_type:this.type))}},computed:{hasGeocoder:function(){return this.config.geocoder},canReset:function(){return this.meta.defaultLng&&this.meta.defaultLat},mapHasChanged:function(){return this.lng!=this.meta.defaultLng||this.lat!=this.meta.defaultLat||this.zoom!=this.config.initial_zoom||this.type!=this.config.initial_type},hasGeolocation:function(){return navigator.geolocation||!1},hasCustomStyle:function(){return this.meta.pro&&"custom"===this.type&&this.style}},mounted:function(){var t=this;this.lng=this.value.lng||this.meta.defaultLng,this.lat=this.value.lat||this.meta.defaultLat,this.markerLng=this.value.markerLng,this.markerLat=this.value.markerLat,this.zoom=this.value.zoom||this.config.initial_zoom||16,this.type=this.value.type||this.config.initial_type||"streets-v11",this.style=this.value.style,mapboxgl.accessToken=this.meta.api_key,this.map=new mapboxgl.Map({container:this.$refs.map,projection:"globe",style:this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.type,center:[Number.parseFloat(this.lng),Number.parseFloat(this.lat)],zoom:Number(this.zoom),attributionControl:!1}),this.addMapListeners(),this.config.geocoder&&this.map.addControl(new MapboxGeocoder({accessToken:mapboxgl.accessToken,mapboxgl:mapboxgl,minLength:5,clearAndBlurOnEsc:!0,marker:!1,flyTo:{maxDuration:5e3}})),this.map.addControl(new mapboxgl.NavigationControl),this.map.addControl(new mapboxgl.FullscreenControl),this.map.addControl(new i(this.findUserPosition),"bottom-right"),this.config.markers&&(this.marker=new mapboxgl.Marker({clickable:!1,draggable:!0}),this.marker.on("dragend",(function(){t.markerLng=t.marker.getLngLat().lng,t.markerLat=t.marker.getLngLat().lat})),this.markerLat&&this.markerLng&&this.addMarker({lng:Number.parseFloat(this.markerLng),lat:Number.parseFloat(this.markerLat)}))},methods:{addMapListeners:function(){var t=this;this.map.on("load",(function(){t.map.resize()})),this.config.markers&&this.map.on("click",(function(e){t.addMarker(e.lngLat),t.markerLng=e.lngLat.lng,t.markerLat=e.lngLat.lat})),this.map.on("moveend",(function(){t.lng=t.map.getCenter().lng,t.lat=t.map.getCenter().lat})),this.map.on("zoomend",(function(){t.zoom=Math.round(t.map.getZoom())}))},addMarker:function(t){this.marker.setLngLat(t),this.marker.addTo(this.map),this.hasMarker=!0,this.saveLocation()},addMarkerAtCenter:function(){this.markerLng=this.map.getCenter().lng,this.markerLat=this.map.getCenter().lat,this.addMarker(this.map.getCenter())},removeMarker:function(){this.marker.remove(),this.hasMarker=!1,this.markerLng=null,this.markerLat=null,this.saveLocation()},resetMap:function(){this.zoom=this.config.initial_zoom||16,this.type=this.config.initial_type||"streets-v11",this.style=null,this.map.setCenter({lng:Number.parseFloat(this.meta.defaultLng),lat:Number.parseFloat(this.meta.defaultLat)}),this.map.setZoom(Number(this.meta.defaultZoom)||16),this.map.setStyle("mapbox://styles/mapbox/"+(this.config.initial_type||"streets-v11")),this.removeMarker()},saveLocation:function(){this.update({lng:this.lng,lat:this.lat,markerLng:this.markerLng,markerLat:this.markerLat,zoom:this.zoom,type:this.type,style:this.style})},findPosition:function(){var t=this;this.geocoder.geocode({address:this.location}).then((function(e){if(e.results.length>0){t.$toast.success("Location found");var a=e.results[0].geometry.location;t.map.setCenter(a),t.addMarker(a)}else t.$toast.error("Location not found")})).catch((function(e){t.$toast.error(e.message)}))},findUserPosition:function(){var t=this;navigator.geolocation&&navigator.geolocation.getCurrentPosition((function(e){var a={lng:e.coords.longitude,lat:e.coords.latitude};t.map.setCenter(a)}),(function(){console.debug("Error getting user position")}))}}},i=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.onClick=e}var e,a,s;return e=t,(a=[{key:"onAdd",value:function(t){var e=this;return this._map=t,this._container=document.createElement("button"),this._container.className="mapboxgl-ctrl",this._container.innerHTML='\n<?xml version="1.0" encoding="iso-8859-1"?>\n<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512; display: block;" xml:space="preserve">\n<g><g><path d="M256,0c-48.551,0-95.818,13.675-136.693,39.545l16.044,25.35C171.419,42.066,213.139,30,256,30 c42.861,0,84.581,12.066,120.648,34.895l16.044-25.35C351.818,13.675,304.551,0,256,0z"/></g></g>\n<g><g><path d="M376.649,447.105C340.581,469.934,298.861,482,256,482c-42.861,0-84.581-12.066-120.648-34.895l-16.044,25.35 C160.182,498.325,207.449,512,256,512c48.551,0,95.818-13.675,136.693-39.545L376.649,447.105z"/></g></g>\n<g><g><path d="M472.455,119.307l-25.35,16.044C469.934,171.419,482,213.139,482,256c0,42.861-12.066,84.581-34.895,120.648l25.35,16.044 C498.325,351.818,512,304.551,512,256C512,207.449,498.325,160.182,472.455,119.307z"/></g></g>\n<g><g><path d="M64.895,135.352l-25.35-16.045C13.675,160.182,0,207.449,0,256c0,48.551,13.675,95.818,39.545,136.693l25.35-16.044 C42.066,340.581,30,298.861,30,256C30,213.139,42.066,171.419,64.895,135.352z"/></g></g>\n<g><g><path d="M256,204c-28.673,0-52,23.327-52,52c0,28.673,23.327,52,52,52c28.673,0,52-23.327,52-52C308,227.327,284.673,204,256,204z M256,278c-12.131,0-22-9.869-22-22s9.869-22,22-22c12.131,0,22,9.869,22,22S268.131,278,256,278z"/></g></g>\n</svg>',this._container.style.padding="5px",this._container.style.width="29px",this._container.style.height="29px",this._container.style.borderRadius="4px",this._container.style.boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 0px 2px",this._container.style.backgroundColor="#FFFFFF",this._container.addEventListener("mouseover",(function(){return e._container.style.backgroundColor="#EFEFEF"})),this._container.addEventListener("mouseout",(function(){return e._container.style.backgroundColor="#FFFFFF"})),this._container.addEventListener("click",(function(){return e.onClick()})),this._container}},{key:"onRemove",value:function(){this._container.parentNode.removeChild(this._container),this._map=void 0}}])&&n(e.prototype,a),s&&n(e,s),t}();var o=function(t,e,a,n,s,i,o,r){var l,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=a,c._compiled=!0),n&&(c.functional=!0),i&&(c._scopeId="data-v-"+i),o?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),s&&s.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},c._ssrRegister=l):s&&(l=r?function(){s.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:s),l)if(c.functional){c._injectStyles=l;var u=c.render;c.render=function(t,e){return l.call(e),u(t,e)}}else{var m=c.beforeCreate;c.beforeCreate=m?[].concat(m,l):[l]}return{exports:t,options:c}}(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"relative"},[a("div",{ref:"map",staticClass:"w-full max-w-3xl h-96 overflow-hidden"}),t._v(" "),t.config.maptypes?a("div",{staticClass:"absolute top-0 left-0 flex items-center bg-grey-20 px-1",attrs:{id:"menu"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],staticClass:"mr-1",attrs:{id:"streets-v11",type:"radio",value:"streets-v11"},domProps:{checked:t._q(t.type,"streets-v11")},on:{change:function(e){t.type="streets-v11"}}}),t._v(" "),a("label",{staticClass:"mr-1",attrs:{for:"streets-v11"}},[t._v("streets")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],staticClass:"mr-1",attrs:{id:"satellite-v9",type:"radio",value:"satellite-v9"},domProps:{checked:t._q(t.type,"satellite-v9")},on:{change:function(e){t.type="satellite-v9"}}}),t._v(" "),a("label",{staticClass:"mr-1",attrs:{for:"satellite-v9"}},[t._v("satellite")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],staticClass:"mr-1",attrs:{id:"satellite-streets-v11",type:"radio",value:"satellite-streets-v11"},domProps:{checked:t._q(t.type,"satellite-streets-v11")},on:{change:function(e){t.type="satellite-streets-v11"}}}),t._v(" "),a("label",{staticClass:"mr-1",attrs:{for:"satellite-streets-v11"}},[t._v("hybrid")]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],staticClass:"mr-1",attrs:{id:"outdoors-v11",type:"radio",value:"outdoors-v11"},domProps:{checked:t._q(t.type,"outdoors-v11")},on:{change:function(e){t.type="outdoors-v11"}}}),t._v(" "),a("label",{attrs:{for:"outdoors-v11"}},[t._v("outdoors")]),t._v(" "),t.meta.pro?[a("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],staticClass:"ml-1 mr-1",attrs:{id:"custom",type:"radio",value:"custom"},domProps:{checked:t._q(t.type,"custom")},on:{change:function(e){t.type="custom"}}}),t._v(" "),a("label",{attrs:{for:"custom"}},[t._v("custom")])]:t._e()],2):t._e()]),t._v(" "),a("div",{staticClass:"flex justify-between"},[a("div",[t.hasMarker?a("a",{staticClass:"text-red text-xs",attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.removeMarker.apply(null,arguments)}}},[t._v("[x] Remove marker")]):t.config.markers?a("a",{staticClass:"text-red text-xs",attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.addMarkerAtCenter.apply(null,arguments)}}},[t._v("[x] Add marker")]):t._e()]),t._v(" "),a("div",[t.canReset&&t.mapHasChanged?a("a",{staticClass:"text-red text-xs",attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.resetMap.apply(null,arguments)}}},[t._v("[-] Reset map")]):t._e()])]),t._v(" "),"custom"===t.type?a("div",{staticClass:"my-2"},[t.meta.pro?a("div",[a("div",[t._m(0),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.style,expression:"style"}],staticClass:"input-text",attrs:{type:"text",placeholder:"mapbox://styles/mapbox/"+t.config.initial_type},domProps:{value:t.style},on:{input:function(e){e.target.composing||(t.style=e.target.value)}}}),t._v(" "),t._m(1)])]):a("div",[a("div",[t._v("You must have purchased a Pro licence for this feature to be enabled.")])])]):t._e()])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"help-block"},[e("p",[this._v("Paste in the style URL here.")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"text-grey text-xs"},[this._v("Need help? Check out the "),e("a",{attrs:{href:"https://studio.mapbox.com/",target:"_blank"}},[this._v("style tool")]),this._v(".")])}],!1,null,null,null).exports;Statamic.booting((function(){Statamic.$components.register("mapbox-fieldtype",o)}))}]);