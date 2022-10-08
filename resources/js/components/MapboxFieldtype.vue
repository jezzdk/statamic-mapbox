<template>
    <div>
        <div class="relative">
            <div class="w-full max-w-3xl h-96 overflow-hidden" ref="map"></div>
            <div v-if="config.maptypes" id="menu" class="absolute top-0 left-0 flex items-center bg-grey-20 px-1">
                <input id="streets-v11" type="radio" v-model="type" value="streets-v11" class="mr-1">
                <label for="streets-v11" class="mr-1">streets</label>
                <input id="satellite-v9" type="radio" v-model="type" value="satellite-v9" class="mr-1">
                <label for="satellite-v9" class="mr-1">satellite</label>
                <input id="satellite-streets-v11" type="radio" v-model="type" value="satellite-streets-v11" class="mr-1">
                <label for="satellite-streets-v11" class="mr-1">hybrid</label>
                <input id="outdoors-v11" type="radio" v-model="type" value="outdoors-v11" class="mr-1">
                <label for="outdoors-v11">outdoors</label>
                <template v-if="meta.pro">
                    <input id="custom" type="radio" v-model="type" value="custom" class="ml-1 mr-1">
                    <label for="custom">custom</label>
                </template>
            </div>
        </div>
        <div class="flex justify-between">
            <div>
                <a v-if="hasMarker" href="#" @click.prevent="removeMarker" class="text-red text-xs">[x] Remove marker</a>
                <a v-else-if="config.markers" href="#" @click.prevent="addMarkerAtCenter" class="text-red text-xs">[x] Add marker</a>
            </div>
            <div><a v-if="canReset && mapHasChanged" href="#" @click.prevent="resetMap" class="text-red text-xs">[-] Reset map</a></div>
        </div>
        <div v-if="type === 'custom'" class="my-2">
            <div v-if="meta.pro">
                <div>
                    <div class="help-block"><p>Paste in the style URL here.</p></div>
                    <input type="text" v-model="style" :placeholder="`mapbox://styles/mapbox/${config.initial_type}`" class="input-text">
                    <div class="text-grey text-xs">Need help? Check out the <a href="https://studio.mapbox.com/" target="_blank">style tool</a>.</div>
                </div>
            </div>
            <div v-else>
                <div>You must have purchased a Pro licence for this feature to be enabled.</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mixins: [Fieldtype],
    data() {
        return {
            lng: null,
            lat: null,
            markerLng: null,
            markerLat: null,
            zoom: null,
            type: null,
            style: null,
            map: null,
            marker: null,
            hasMarker: false,
            geocoder: null,
            location: null,
        }
    },
    watch: {
        lat () {
            this.saveLocation()
        },
        lng () {
            this.saveLocation()
        },
        markerLat () {
            this.saveLocation()
        },
        markerLng () {
            this.saveLocation()
        },
        zoom () {
            this.saveLocation()
        },
        type () {
            this.saveLocation()

            if (this.map) {
                if (this.type === 'custom') {
                    this.map.setStyle(this.hasCustomStyle ? this.style : 'mapbox://styles/mapbox/' + this.config.initial_type)
                } else {
                    this.map.setStyle(this.hasCustomStyle ? this.style : 'mapbox://styles/mapbox/' + this.type)
                }
            }
        },
        style () {
            this.saveLocation()

            if (this.map) {
                this.map.setStyle(this.hasCustomStyle ? this.style : 'mapbox://styles/mapbox/' + (this.style === 'custom' ? this.config.initial_type : this.type))
            }
        },
    },
    computed: {
        hasGeocoder () {
            return this.config.geocoder
        },
        canReset () {
            return this.meta.defaultLng && this.meta.defaultLat
        },
        mapHasChanged () {
            return this.lng != this.meta.defaultLng
                || this.lat != this.meta.defaultLat
                || this.zoom != this.config.initial_zoom
                || this.type != this.config.initial_type
        },
        hasGeolocation () {
            return navigator.geolocation || false
        },
        hasCustomStyle () {
            return this.meta.pro && this.type === 'custom' && this.style
        }
    },
    mounted () {
        this.lng = this.value.lng || this.meta.defaultLng
        this.lat = this.value.lat || this.meta.defaultLat
        this.markerLng = this.value.markerLng
        this.markerLat = this.value.markerLat
        this.zoom = this.value.zoom || this.config.initial_zoom || 16
        this.type = this.value.type || this.config.initial_type || 'streets-v11'
        this.style = this.value.style

        mapboxgl.accessToken = this.meta.api_key

        this.map = new mapboxgl.Map({
            container: this.$refs.map,
            projection: 'globe',
            style: this.hasCustomStyle ? this.style : 'mapbox://styles/mapbox/' + this.type,
            center: [Number.parseFloat(this.lng), Number.parseFloat(this.lat)],
            zoom: Number(this.zoom),
            attributionControl: false
        })

        this.addMapListeners()

        if (this.config.geocoder) {
            this.map.addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                    minLength: 5,
                    clearAndBlurOnEsc: true,
                    marker: false,
                    flyTo: {
                        maxDuration: 5000,
                    },
                })
            )
        }

        this.map.addControl(new mapboxgl.NavigationControl())
        this.map.addControl(new mapboxgl.FullscreenControl())
        this.map.addControl(new UserPositionControl(this.findUserPosition), 'bottom-right')

        if (this.config.markers) {
            this.marker = new mapboxgl.Marker({
                clickable: false,
                draggable: true,
            })

            this.marker.on('dragend', () => {
                this.markerLng = this.marker.getLngLat().lng
                this.markerLat = this.marker.getLngLat().lat
            })

            if (this.markerLat && this.markerLng) {
                this.addMarker({
                    lng: Number.parseFloat(this.markerLng),
                    lat: Number.parseFloat(this.markerLat),
                })
            }
        }
    },
    methods: {
        addMapListeners () {
            this.map.on('load', () => {
                this.map.resize()
            })

            if (this.config.markers) {
                this.map.on('click', (e) => {
                    this.addMarker(e.lngLat)
                    this.markerLng = e.lngLat.lng
                    this.markerLat = e.lngLat.lat
                })
            }

            this.map.on('moveend', () => {
                this.lng = this.map.getCenter().lng
                this.lat = this.map.getCenter().lat
            })

            this.map.on('zoomend', () => {
                this.zoom = Math.round(this.map.getZoom())
            })
        },
        addMarker (lngLat) {
            this.marker.setLngLat(lngLat)
            this.marker.addTo(this.map)
            this.hasMarker = true

            this.saveLocation()
        },
        addMarkerAtCenter () {
            this.markerLng = this.map.getCenter().lng
            this.markerLat = this.map.getCenter().lat

            this.addMarker(this.map.getCenter())
        },
        removeMarker () {
            this.marker.remove()
            this.hasMarker = false
            this.markerLng = null
            this.markerLat = null

            this.saveLocation()
        },
        resetMap () {
            this.zoom = this.config.initial_zoom || 16
            this.type = this.config.initial_type || 'streets-v11'
            this.style = null

            this.map.setCenter({
                lng: Number.parseFloat(this.meta.defaultLng),
                lat: Number.parseFloat(this.meta.defaultLat),
            })

            this.map.setZoom(Number(this.meta.defaultZoom) || 16)
            this.map.setStyle('mapbox://styles/mapbox/' + (this.config.initial_type || 'streets-v11'))

            this.removeMarker()
        },
        saveLocation () {
            this.update({
                lng: this.lng,
                lat: this.lat,
                markerLng: this.markerLng,
                markerLat: this.markerLat,
                zoom: this.zoom,
                type: this.type,
                style: this.style,
            })
        },
        findPosition () {
            this.geocoder.geocode({
                address: this.location
            }).then((response) => {
                if (response.results.length > 0) {
                    this.$toast.success('Location found')

                    let position = response.results[0].geometry.location
                    this.map.setCenter(position)

                    this.addMarker(position)
                } else {
                    this.$toast.error('Location not found')
                }
            }).catch((error) => {
                this.$toast.error(error.message)
            })
        },
        findUserPosition () {
            if (!navigator.geolocation) {
                return;
            }

            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude,
                };

                this.map.setCenter(pos)
            }, () => {
                console.debug('Error getting user position')
            })
        }
    }
};

class UserPositionControl {
    constructor(onClick) {
        this.onClick = onClick
    }

    onAdd(map) {
        this._map = map

        this._container = document.createElement("button")
        this._container.className = 'mapboxgl-ctrl'
        this._container.innerHTML = `
<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512; display: block;" xml:space="preserve">
<g><g><path d="M256,0c-48.551,0-95.818,13.675-136.693,39.545l16.044,25.35C171.419,42.066,213.139,30,256,30 c42.861,0,84.581,12.066,120.648,34.895l16.044-25.35C351.818,13.675,304.551,0,256,0z"/></g></g>
<g><g><path d="M376.649,447.105C340.581,469.934,298.861,482,256,482c-42.861,0-84.581-12.066-120.648-34.895l-16.044,25.35 C160.182,498.325,207.449,512,256,512c48.551,0,95.818-13.675,136.693-39.545L376.649,447.105z"/></g></g>
<g><g><path d="M472.455,119.307l-25.35,16.044C469.934,171.419,482,213.139,482,256c0,42.861-12.066,84.581-34.895,120.648l25.35,16.044 C498.325,351.818,512,304.551,512,256C512,207.449,498.325,160.182,472.455,119.307z"/></g></g>
<g><g><path d="M64.895,135.352l-25.35-16.045C13.675,160.182,0,207.449,0,256c0,48.551,13.675,95.818,39.545,136.693l25.35-16.044 C42.066,340.581,30,298.861,30,256C30,213.139,42.066,171.419,64.895,135.352z"/></g></g>
<g><g><path d="M256,204c-28.673,0-52,23.327-52,52c0,28.673,23.327,52,52,52c28.673,0,52-23.327,52-52C308,227.327,284.673,204,256,204z M256,278c-12.131,0-22-9.869-22-22s9.869-22,22-22c12.131,0,22,9.869,22,22S268.131,278,256,278z"/></g></g>
</svg>`
        this._container.style.padding = '5px'
        this._container.style.width = '29px'
        this._container.style.height = '29px'
        this._container.style.borderRadius = '4px'
        this._container.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 0px 0px 2px'
        this._container.style.backgroundColor = '#FFFFFF'
        this._container.addEventListener("mouseover", () => this._container.style.backgroundColor = '#EFEFEF')
        this._container.addEventListener("mouseout", () => this._container.style.backgroundColor = '#FFFFFF')
        this._container.addEventListener("click", () => this.onClick())

        return this._container
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container)
        this._map = undefined
    }
}
</script>
