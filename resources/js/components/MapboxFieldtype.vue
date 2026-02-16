<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Fieldtype } from '@statamic/cms'

const emit = defineEmits(Fieldtype.emits)
const props = defineProps(Fieldtype.props)
const { expose, update } = Fieldtype.use(emit, props)
defineExpose(expose)

// Reactive state
const lng = ref(null)
const lat = ref(null)
const markerLng = ref(null)
const markerLat = ref(null)
const zoom = ref(null)
const type = ref(null)
const style = ref(null)
const showControls = ref(false)
const map = ref(null)
const marker = ref(null)
const hasMarker = ref(false)
const geocoder = ref(null)
const location = ref(null)
const mapRef = ref(null)

// Computed properties
const hasGeocoder = computed(() => props.config.geocoder)

const canReset = computed(() => props.meta.defaultLng && props.meta.defaultLat)

const mapHasChanged = computed(() => {
    return lng.value != props.meta.defaultLng
        || lat.value != props.meta.defaultLat
        || zoom.value != props.config.initial_zoom
        || type.value != props.config.initial_type
})

const hasGeolocation = computed(() => navigator.geolocation || false)

const hasCustomStyle = computed(() => props.meta.pro && type.value === 'custom' && style.value)

// Watchers
watch([lat, lng, markerLat, markerLng, zoom, showControls], () => {
    saveLocation()
})

watch(type, () => {
    saveLocation()

    if (map.value) {
        if (type.value === 'custom') {
            map.value.setStyle(hasCustomStyle.value ? style.value : 'mapbox://styles/mapbox/' + props.config.initial_type)
        } else {
            map.value.setStyle(hasCustomStyle.value ? style.value : 'mapbox://styles/mapbox/' + type.value)
        }
    }
})

watch(style, () => {
    saveLocation()

    if (map.value) {
        map.value.setStyle(hasCustomStyle.value ? style.value : 'mapbox://styles/mapbox/' + (style.value === 'custom' ? props.config.initial_type : type.value))
    }
})

// Methods
const addMapListeners = () => {
    map.value.on('load', () => {
        map.value.resize()
    })

    if (props.config.markers) {
        map.value.on('click', (e) => {
            addMarker(e.lngLat)
        })
    }

    map.value.on('moveend', () => {
        lng.value = map.value.getCenter().lng
        lat.value = map.value.getCenter().lat
    })

    map.value.on('zoomend', () => {
        zoom.value = Math.round(map.value.getZoom())
    })
}

const addMarker = (lngLat) => {
    marker.value.setLngLat(lngLat)
    marker.value.addTo(map.value)
    markerLat.value = lngLat.lat
    markerLng.value = lngLat.lng
    hasMarker.value = true

    saveLocation()
}

const addMarkerAtCenter = () => {
    addMarker(map.value.getCenter())
}

const removeMarker = () => {
    marker.value.remove()
    hasMarker.value = false
    markerLng.value = null
    markerLat.value = null

    saveLocation()
}

const resetMap = () => {
    zoom.value = props.config.initial_zoom || 16
    type.value = props.config.initial_type || 'streets-v11'
    style.value = null

    map.value.setCenter({
        lng: Number.parseFloat(props.meta.defaultLng),
        lat: Number.parseFloat(props.meta.defaultLat),
    })

    map.value.setZoom(Number(props.meta.defaultZoom) || 16)
    map.value.setStyle('mapbox://styles/mapbox/' + (props.config.initial_type || 'streets-v11'))

    removeMarker()
}

const saveLocation = () => {
    update({
        lng: lng.value,
        lat: lat.value,
        markerLng: markerLng.value,
        markerLat: markerLat.value,
        zoom: zoom.value,
        type: type.value,
        style: style.value,
        showControls: showControls.value,
    })
}

const findPosition = () => {
    geocoder.value.geocode({
        address: location.value
    }).then((response) => {
        if (response.results.length > 0) {
            console.log('Location found')

            let position = response.results[0].geometry.location
            map.value.setCenter(position)

            addMarker(position)
        } else {
            console.error('Location not found')
        }
    }).catch((error) => {
        console.error(error.message)
    })
}

const findUserPosition = () => {
    if (!navigator.geolocation) {
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
        };

        map.value.setCenter(pos)
    }, () => {
        console.debug('Error getting user position')
    })
}

class UserPositionControl {
    constructor(onClick) {
        this.onClick = onClick
    }

    onAdd(map) {
        this._map = map

        this._container = document.createElement("button")
        this._container.className = 'mapboxgl-ctrl'
        this._container.innerHTML = `
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

onMounted(() => {
    lng.value = props.value.lng || props.meta.defaultLng
    lat.value = props.value.lat || props.meta.defaultLat
    markerLng.value = props.value.markerLng
    markerLat.value = props.value.markerLat
    zoom.value = props.value.zoom || props.config.initial_zoom || 16
    type.value = props.value.type || props.config.initial_type || 'streets-v11'
    style.value = props.value.style
    showControls.value = props.value.showControls

    mapboxgl.accessToken = props.meta.api_key

    map.value = new mapboxgl.Map({
        container: mapRef.value,
        projection: 'globe',
        style: hasCustomStyle.value ? style.value : 'mapbox://styles/mapbox/' + type.value,
        center: [Number.parseFloat(lng.value), Number.parseFloat(lat.value)],
        zoom: Number(zoom.value),
        attributionControl: false
    })

    addMapListeners()

    if (props.config.geocoder) {
        map.value.addControl(
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

    map.value.addControl(new mapboxgl.NavigationControl())
    map.value.addControl(new mapboxgl.FullscreenControl())
    map.value.addControl(new UserPositionControl(findUserPosition), 'bottom-right')

    if (props.config.markers) {
        marker.value = new mapboxgl.Marker({
            clickable: false,
            draggable: true,
        })

        marker.value.on('dragend', () => {
            markerLng.value = marker.value.getLngLat().lng
            markerLat.value = marker.value.getLngLat().lat
        })

        if (markerLat.value && markerLng.value) {
            addMarker({
                lng: Number.parseFloat(markerLng.value),
                lat: Number.parseFloat(markerLat.value),
            })
        }
    }
})
</script>

<template>
    <div>
        <div class="relative border border-gray-500">
            <div class="w-full max-w-3xl h-96 overflow-hidden mapbox-container" ref="mapRef"></div>
            <div v-if="config.maptypes" id="menu" class="absolute top-0 left-0 flex items-center gap-4 bg-gray-200 px-2 py-1">
                <div class="flex items-center gap-1">
                    <input id="streets-v11" type="radio" v-model="type" value="streets-v11">
                    <label for="streets-v11">streets</label>
                </div>
                <div class="flex items-center gap-1">
                    <input id="satellite-v9" type="radio" v-model="type" value="satellite-v9">
                    <label for="satellite-v9">satellite</label>
                </div>
                <div class="flex items-center gap-1">
                    <input id="satellite-streets-v11" type="radio" v-model="type" value="satellite-streets-v11">
                    <label for="satellite-streets-v11">hybrid</label>
                </div>
                <div class="flex items-center gap-1">
                    <input id="outdoors-v11" type="radio" v-model="type" value="outdoors-v11">
                    <label for="outdoors-v11">outdoors</label>
                </div>
                <div v-if="meta.pro" class="flex items-center gap-1">
                    <input id="custom" type="radio" v-model="type" value="custom">
                    <label for="custom">custom</label>
                </div>
            </div>
        </div>
        <div class="flex justify-between">
            <div>
                <a v-if="hasMarker" href="#" @click.prevent="removeMarker" class="text-red-400! text-xs">[x] Remove marker</a>
                <a v-else-if="config.markers" href="#" @click.prevent="addMarkerAtCenter" class="text-xs">[+] Add marker</a>
            </div>
            <div><a v-if="canReset && mapHasChanged" href="#" @click.prevent="resetMap" class="text-red-400! text-xs">[-] Reset map</a></div>
        </div>
        <div><label><input type="checkbox" v-model="showControls" /> Map controls</label></div>
        <div v-if="type === 'custom'" class="my-2">
            <div v-if="meta.pro">
                <div>
                    <div class="help-block"><p>Paste in style URL here.</p></div>
                    <input type="text" v-model="style" :placeholder="`mapbox://styles/mapbox/${config.initial_type}`" class="input-text">
                    <div class="text-gray-600 text-xs">Need help? Check out the <a href="https://studio.mapbox.com/" target="_blank">style tool</a>.</div>
                </div>
            </div>
            <div v-else>
                <div>You must have purchased a Pro licence for this feature to be enabled.</div>
            </div>
        </div>
    </div>
</template>
