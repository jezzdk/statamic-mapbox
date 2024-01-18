function v(s,t,e,o,i,l,h,m){var a=typeof s=="function"?s.options:s;t&&(a.render=t,a.staticRenderFns=e,a._compiled=!0),o&&(a.functional=!0),l&&(a._scopeId="data-v-"+l);var n;if(h?(n=function(r){r=r||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!r&&typeof __VUE_SSR_CONTEXT__<"u"&&(r=__VUE_SSR_CONTEXT__),i&&i.call(this,r),r&&r._registeredComponents&&r._registeredComponents.add(h)},a._ssrRegister=n):i&&(n=m?function(){i.call(this,(a.functional?this.parent:this).$root.$options.shadowRoot)}:i),n)if(a.functional){a._injectStyles=n;var d=a.render;a.render=function(u,p){return n.call(p),d(u,p)}}else{var c=a.beforeCreate;a.beforeCreate=c?[].concat(c,n):[n]}return{exports:s,options:a}}const g={mixins:[Fieldtype],data(){return{lng:null,lat:null,markerLng:null,markerLat:null,zoom:null,type:null,style:null,showControls:!1,map:null,marker:null,hasMarker:!1,geocoder:null,location:null}},watch:{lat(){this.saveLocation()},lng(){this.saveLocation()},markerLat(){this.saveLocation()},markerLng(){this.saveLocation()},zoom(){this.saveLocation()},type(){this.saveLocation(),this.map&&(this.type==="custom"?this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.config.initial_type):this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.type))},style(){this.saveLocation(),this.map&&this.map.setStyle(this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+(this.style==="custom"?this.config.initial_type:this.type))},showControls(){this.saveLocation()}},computed:{hasGeocoder(){return this.config.geocoder},canReset(){return this.meta.defaultLng&&this.meta.defaultLat},mapHasChanged(){return this.lng!=this.meta.defaultLng||this.lat!=this.meta.defaultLat||this.zoom!=this.config.initial_zoom||this.type!=this.config.initial_type},hasGeolocation(){return navigator.geolocation||!1},hasCustomStyle(){return this.meta.pro&&this.type==="custom"&&this.style}},mounted(){this.lng=this.value.lng||this.meta.defaultLng,this.lat=this.value.lat||this.meta.defaultLat,this.markerLng=this.value.markerLng,this.markerLat=this.value.markerLat,this.zoom=this.value.zoom||this.config.initial_zoom||16,this.type=this.value.type||this.config.initial_type||"streets-v11",this.style=this.value.style,this.showControls=this.value.showControls,mapboxgl.accessToken=this.meta.api_key,this.map=new mapboxgl.Map({container:this.$refs.map,projection:"globe",style:this.hasCustomStyle?this.style:"mapbox://styles/mapbox/"+this.type,center:[Number.parseFloat(this.lng),Number.parseFloat(this.lat)],zoom:Number(this.zoom),attributionControl:!1}),this.addMapListeners(),this.config.geocoder&&this.map.addControl(new MapboxGeocoder({accessToken:mapboxgl.accessToken,mapboxgl,minLength:5,clearAndBlurOnEsc:!0,marker:!1,flyTo:{maxDuration:5e3}})),this.map.addControl(new mapboxgl.NavigationControl),this.map.addControl(new mapboxgl.FullscreenControl),this.map.addControl(new f(this.findUserPosition),"bottom-right"),this.config.markers&&(this.marker=new mapboxgl.Marker({clickable:!1,draggable:!0}),this.marker.on("dragend",()=>{this.markerLng=this.marker.getLngLat().lng,this.markerLat=this.marker.getLngLat().lat}),this.markerLat&&this.markerLng&&this.addMarker({lng:Number.parseFloat(this.markerLng),lat:Number.parseFloat(this.markerLat)}))},methods:{addMapListeners(){this.map.on("load",()=>{this.map.resize()}),this.config.markers&&this.map.on("click",s=>{this.addMarker(s.lngLat)}),this.map.on("moveend",()=>{this.lng=this.map.getCenter().lng,this.lat=this.map.getCenter().lat}),this.map.on("zoomend",()=>{this.zoom=Math.round(this.map.getZoom())})},addMarker(s){this.marker.setLngLat(s),this.marker.addTo(this.map),this.markerLat=s.lat,this.markerLng=s.lng,this.hasMarker=!0,this.saveLocation()},addMarkerAtCenter(){this.addMarker(this.map.getCenter())},removeMarker(){this.marker.remove(),this.hasMarker=!1,this.markerLng=null,this.markerLat=null,this.saveLocation()},resetMap(){this.zoom=this.config.initial_zoom||16,this.type=this.config.initial_type||"streets-v11",this.style=null,this.map.setCenter({lng:Number.parseFloat(this.meta.defaultLng),lat:Number.parseFloat(this.meta.defaultLat)}),this.map.setZoom(Number(this.meta.defaultZoom)||16),this.map.setStyle("mapbox://styles/mapbox/"+(this.config.initial_type||"streets-v11")),this.removeMarker()},saveLocation(){this.update({lng:this.lng,lat:this.lat,markerLng:this.markerLng,markerLat:this.markerLat,zoom:this.zoom,type:this.type,style:this.style,showControls:this.showControls})},findPosition(){this.geocoder.geocode({address:this.location}).then(s=>{if(s.results.length>0){this.$toast.success("Location found");let t=s.results[0].geometry.location;this.map.setCenter(t),this.addMarker(t)}else this.$toast.error("Location not found")}).catch(s=>{this.$toast.error(s.message)})},findUserPosition(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(s=>{const t={lng:s.coords.longitude,lat:s.coords.latitude};this.map.setCenter(t)},()=>{console.debug("Error getting user position")})}}};class f{constructor(t){this.onClick=t}onAdd(t){return this._map=t,this._container=document.createElement("button"),this._container.className="mapboxgl-ctrl",this._container.innerHTML=`
<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512; display: block;" xml:space="preserve">
<g><g><path d="M256,0c-48.551,0-95.818,13.675-136.693,39.545l16.044,25.35C171.419,42.066,213.139,30,256,30 c42.861,0,84.581,12.066,120.648,34.895l16.044-25.35C351.818,13.675,304.551,0,256,0z"/></g></g>
<g><g><path d="M376.649,447.105C340.581,469.934,298.861,482,256,482c-42.861,0-84.581-12.066-120.648-34.895l-16.044,25.35 C160.182,498.325,207.449,512,256,512c48.551,0,95.818-13.675,136.693-39.545L376.649,447.105z"/></g></g>
<g><g><path d="M472.455,119.307l-25.35,16.044C469.934,171.419,482,213.139,482,256c0,42.861-12.066,84.581-34.895,120.648l25.35,16.044 C498.325,351.818,512,304.551,512,256C512,207.449,498.325,160.182,472.455,119.307z"/></g></g>
<g><g><path d="M64.895,135.352l-25.35-16.045C13.675,160.182,0,207.449,0,256c0,48.551,13.675,95.818,39.545,136.693l25.35-16.044 C42.066,340.581,30,298.861,30,256C30,213.139,42.066,171.419,64.895,135.352z"/></g></g>
<g><g><path d="M256,204c-28.673,0-52,23.327-52,52c0,28.673,23.327,52,52,52c28.673,0,52-23.327,52-52C308,227.327,284.673,204,256,204z M256,278c-12.131,0-22-9.869-22-22s9.869-22,22-22c12.131,0,22,9.869,22,22S268.131,278,256,278z"/></g></g>
</svg>`,this._container.style.padding="5px",this._container.style.width="29px",this._container.style.height="29px",this._container.style.borderRadius="4px",this._container.style.boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 0px 2px",this._container.style.backgroundColor="#FFFFFF",this._container.addEventListener("mouseover",()=>this._container.style.backgroundColor="#EFEFEF"),this._container.addEventListener("mouseout",()=>this._container.style.backgroundColor="#FFFFFF"),this._container.addEventListener("click",()=>this.onClick()),this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map=void 0}}var y=function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"relative border border-gray-500"},[e("div",{ref:"map",staticClass:"w-full max-w-3xl h-96 overflow-hidden"}),t.config.maptypes?e("div",{staticClass:"absolute top-0 left-0 flex items-center gap-4 bg-gray-200 px-2 py-1",attrs:{id:"menu"}},[e("div",{staticClass:"flex items-center gap-1"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],attrs:{id:"streets-v11",type:"radio",value:"streets-v11"},domProps:{checked:t._q(t.type,"streets-v11")},on:{change:function(o){t.type="streets-v11"}}}),e("label",{attrs:{for:"streets-v11"}},[t._v("streets")])]),e("div",{staticClass:"flex items-center gap-1"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],attrs:{id:"satellite-v9",type:"radio",value:"satellite-v9"},domProps:{checked:t._q(t.type,"satellite-v9")},on:{change:function(o){t.type="satellite-v9"}}}),e("label",{attrs:{for:"satellite-v9"}},[t._v("satellite")])]),e("div",{staticClass:"flex items-center gap-1"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],attrs:{id:"satellite-streets-v11",type:"radio",value:"satellite-streets-v11"},domProps:{checked:t._q(t.type,"satellite-streets-v11")},on:{change:function(o){t.type="satellite-streets-v11"}}}),e("label",{attrs:{for:"satellite-streets-v11"}},[t._v("hybrid")])]),e("div",{staticClass:"flex items-center gap-1"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],attrs:{id:"outdoors-v11",type:"radio",value:"outdoors-v11"},domProps:{checked:t._q(t.type,"outdoors-v11")},on:{change:function(o){t.type="outdoors-v11"}}}),e("label",{attrs:{for:"outdoors-v11"}},[t._v("outdoors")])]),t.meta.pro?e("div",{staticClass:"flex items-center gap-1"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],attrs:{id:"custom",type:"radio",value:"custom"},domProps:{checked:t._q(t.type,"custom")},on:{change:function(o){t.type="custom"}}}),e("label",{attrs:{for:"custom"}},[t._v("custom")])]):t._e()]):t._e()]),e("div",{staticClass:"flex justify-between"},[e("div",[t.hasMarker?e("a",{staticClass:"!text-red-400 text-xs",attrs:{href:"#"},on:{click:function(o){return o.preventDefault(),t.removeMarker.apply(null,arguments)}}},[t._v("[x] Remove marker")]):t.config.markers?e("a",{staticClass:"text-xs",attrs:{href:"#"},on:{click:function(o){return o.preventDefault(),t.addMarkerAtCenter.apply(null,arguments)}}},[t._v("[+] Add marker")]):t._e()]),e("div",[t.canReset&&t.mapHasChanged?e("a",{staticClass:"!text-red-400 text-xs",attrs:{href:"#"},on:{click:function(o){return o.preventDefault(),t.resetMap.apply(null,arguments)}}},[t._v("[-] Reset map")]):t._e()])]),e("div",[e("label",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.showControls,expression:"showControls"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.showControls)?t._i(t.showControls,null)>-1:t.showControls},on:{change:function(o){var i=t.showControls,l=o.target,h=!!l.checked;if(Array.isArray(i)){var m=null,a=t._i(i,m);l.checked?a<0&&(t.showControls=i.concat([m])):a>-1&&(t.showControls=i.slice(0,a).concat(i.slice(a+1)))}else t.showControls=h}}}),t._v(" Map controls")])]),t.type==="custom"?e("div",{staticClass:"my-2"},[t.meta.pro?e("div",[e("div",[t._m(0),e("input",{directives:[{name:"model",rawName:"v-model",value:t.style,expression:"style"}],staticClass:"input-text",attrs:{type:"text",placeholder:`mapbox://styles/mapbox/${t.config.initial_type}`},domProps:{value:t.style},on:{input:function(o){o.target.composing||(t.style=o.target.value)}}}),t._m(1)])]):e("div",[e("div",[t._v("You must have purchased a Pro licence for this feature to be enabled.")])])]):t._e()])},_=[function(){var s=this,t=s._self._c;return t("div",{staticClass:"help-block"},[t("p",[s._v("Paste in the style URL here.")])])},function(){var s=this,t=s._self._c;return t("div",{staticClass:"text-gray-600 text-xs"},[s._v("Need help? Check out the "),t("a",{attrs:{href:"https://studio.mapbox.com/",target:"_blank"}},[s._v("style tool")]),s._v(".")])}],k=v(g,y,_,!1,null,null,null,null);const C=k.exports;Statamic.booting(()=>{Statamic.$components.register("mapbox-fieldtype",C)});