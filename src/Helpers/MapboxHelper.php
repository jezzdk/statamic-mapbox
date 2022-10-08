<?php

namespace Jezzdk\StatamicMapbox\Helpers;

use Illuminate\Support\Str;
use Statamic\Facades\Addon;

class MapboxHelper
{
    public static function defaultLatitude()
    {
        return config('mapbox.default_lat');
    }

    public static function defaultLongitude()
    {
        return config('mapbox.default_lng');
    }

    public static function mapboxScriptUrl()
    {
        return 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
    }

    public static function mapboxCssUrl()
    {
        return 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css';
    }

    public static function mapboxGeocoderScriptUrl()
    {
        return 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js';
    }

    public static function mapboxGeocoderCssUrl()
    {
        return 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css';
    }

    public static function getStyleUrl($type)
    {
        return match ($type) {
            'streets', 'streets-v11' => 'mapbox://styles/mapbox/streets-v11',
            'satellite', 'satellite-v9' => 'mapbox://styles/mapbox/satellite-v9',
            'hybrid', 'satellite-streets-v11' => 'mapbox://styles/mapbox/satellite-streets-v11',
            'outdoors', 'outdoors-v11' => 'mapbox://styles/mapbox/outdoors-v11',
            default => 'mapbox://styles/mapbox/streets-v11'
        };
    }

    public static function convertToHtml(array $params)
    {
        $addon = Addon::get('jezzdk/statamic-mapbox');

        // Generate a random ID for the map
        $id = Str::random();

        // Use some sensible defaults
        $params = array_merge([
            'width' => '100%',
            'height' => '100%',
            'markerColor' => '#3FB1CE',
            'markerLng' => null,
            'markerLat' => null,
            'icon' => $addon->edition() === 'pro' && is_file(public_path('/assets/marker.png')) ? '/assets/marker.png' : null,
            'style' => null,
            'showControls' => null,
        ], $params);

        // Destruct the params array into variables
        [
            'lng' => $lng,
            'lat' => $lat,
            'zoom' => $zoom,
            'markerColor' => $markerColor,
            'markerLng' => $markerLng,
            'markerLat' => $markerLat,
            'width' => $width,
            'height' => $height,
            'icon' => $icon,
            'type' => $type,
            'style' => $style,
            'showControls' => $showControls,
        ] = $params;

        $style = $addon->edition() === 'pro' && $style ? $style : self::getStyleUrl($type);

        // Return the HTML
        return '
        <div id="' . $id . '" style="width: ' . $width . '; height: ' . $height . ';"></div>
        <script>
        mapboxgl.accessToken = "' . config('mapbox.api_key') . '";

        var map = new mapboxgl.Map({
            container: "' . $id . '",
            projection: "globe",
            style: "' . $style . '",
            center: [' . $lng . ', ' . $lat . '],
            zoom: ' . $zoom . ',
            interactive: false
        });

        ' . ($showControls ? '
        map.addControl(new mapboxgl.NavigationControl())
        map.addControl(new mapboxgl.FullscreenControl())
        ' : '') . '

        ' . ($icon ? '
        var markerElement = document.createElement("img");
        markerElement.src = "' . $icon . '";
        ' : '
        var markerElement = null;
        ') . '

        ' . ($markerLng && $markerLat ? '
        new mapboxgl.Marker({ color: "' . $markerColor . '", element: markerElement }).setLngLat([' . $markerLng . ', ' . $markerLat . ']).addTo(map);
        ' : '') . '
        </script>
        ';
    }
}
