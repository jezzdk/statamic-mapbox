<?php

namespace Jezzdk\StatamicMapbox\Tags;

use Illuminate\Support\Str;
use Jezzdk\StatamicMapbox\Helpers\MapboxHelper;
use Statamic\Facades\Addon;
use Statamic\Tags\Tags;

class Mapbox extends Tags
{
    protected static $handle = 'mapbox';

    /**
     * The {{ mapbox }} tag.
     *
     * Usage:
     * {{ mapbox lng="12.1234" lat="52.1234" zoom="8" marker="true" markerLng="12.1243" markerLat="52.1243" type="streets" showControls="true" }}
     *
     * @return string|array
     */
    public function index()
    {
        if (!config('mapbox.api_key')) {
            return 'Please add a MAPBOX_API_KEY to the .env file';
        }

        $lat = $this->params->get('lat');
        $lng = $this->params->get('lng');

        if (!$lat || !$lng) {
            return 'Please set both latitude and longitude';
        }

        return MapboxHelper::convertToHtml(array_filter([
            'lng' => $lng,
            'lat' => $lat,
            'zoom' => $this->getZoom(),
            'markerColor' => $this->getMarkerColor(),
            'markerLat' => $this->getMarkerLat(),
            'markerLng' => $this->getMarkerLng(),
            'width' => $this->getWidth(),
            'height' => $this->getHeight(),
            'icon' => $this->getIcon(),
            'type' => $this->getType(),
            'style' => $this->getStyle(),
            'showControls' => $this->getShowControls(),
        ]));
    }

    protected function getZoom()
    {
        return $this->params->get('zoom', 16);
    }

    protected function getMarkerColor()
    {
        return $this->params->get('markerColor');
    }

    protected function getMarkerLat()
    {
        if ($this->params->get('marker', false)) {
            return $this->params->get('markerLat') ?: $this->params->get('lat');
        }

        return null;
    }

    protected function getMarkerLng()
    {
        if ($this->params->get('marker', false)) {
            return $this->params->get('markerLng') ?: $this->params->get('lng');
        }

        return null;
    }

    protected function getWidth()
    {
        $width = $this->params->get('width', '100%');

        if (!Str::endsWith($width, '%')) {
            $width .= 'px';
        }

        return $width;
    }

    protected function getHeight()
    {
        $height = $this->params->get('height', '100%');

        if (!Str::endsWith($height, '%')) {
            $height .= 'px';
        }

        return $height;
    }

    protected function getType()
    {
        return $this->params->get('type', 'streets');
    }

    protected function getIcon()
    {
        $addon = Addon::get('jezzdk/statamic-mapbox');

        if ($addon->edition() !== 'pro') {
            return null;
        }

        return $this->params->get('icon');
    }

    protected function getStyle()
    {
        $addon = Addon::get('jezzdk/statamic-mapbox');

        if ($addon->edition() === 'pro' && $this->params->get('style')) {
            return $this->params->get('style');
        }

        return MapboxHelper::getStyleUrl($this->getType());
    }

    protected function getShowControls()
    {
        return $this->params->get('showControls', false);
    }
}
