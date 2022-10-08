<?php

namespace Jezzdk\StatamicMapbox\Tags;

use Jezzdk\StatamicMapbox\Helpers\MapboxHelper;
use Statamic\Tags\Tags;

class MapboxScript extends Tags
{
    protected static $handle = 'mapbox_script';

    /**
     * The {{ mapbox_script }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        return '
        <!-- The mandatory Mapbox scripts and styles -->
        <script src="' . MapboxHelper::mapboxScriptUrl() . '" type="text/javascript"></script>
        <link href="' . MapboxHelper::mapboxCssUrl() . '" rel="stylesheet" type="text/css" />

        <!-- Scripts and styles for the Geocoder plugin -->
        <script src="' . MapboxHelper::mapboxGeocoderScriptUrl() . '"></script>
        <link href="' . MapboxHelper::mapboxGeocoderCssUrl() . '" rel="stylesheet" type="text/css">
        ';
    }
}
