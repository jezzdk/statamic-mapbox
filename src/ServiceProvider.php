<?php

namespace Jezzdk\StatamicMapbox;

use Jezzdk\StatamicMapbox\Helpers\MapboxHelper;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $tags = [
        \Jezzdk\StatamicMapbox\Tags\Mapbox::class,
        \Jezzdk\StatamicMapbox\Tags\MapboxScript::class,
    ];

    protected $scripts = [
        __DIR__ . '/../dist/js/mapbox.js',
    ];

    protected $fieldtypes = [
        \Jezzdk\StatamicMapbox\Fieldtypes\Mapbox::class,
    ];

    public function boot()
    {
        $this->externalScripts = [
            MapboxHelper::mapboxScriptUrl(),
            MapboxHelper::mapboxGeocoderScriptUrl(),
        ];

        $this->externalStylesheets = [
            MapboxHelper::mapboxCssUrl(),
            MapboxHelper::mapboxGeocoderCssUrl(),
        ];

        $this->publishes([
          __DIR__.'/../config/mapbox.php' => config_path('mapbox.php'),
        ]);

        parent::boot();
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/mapbox.php',
            'mapbox'
        );
    }
}
