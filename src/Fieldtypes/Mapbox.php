<?php

namespace Jezzdk\StatamicMapbox\Fieldtypes;

use Jezzdk\StatamicMapbox\Helpers\MapboxHelper;
use Statamic\Facades\Addon;
use Statamic\Fields\Fieldtype;

class Mapbox extends Fieldtype
{
    protected $icon = 'earth';

    protected $categories = ['text'];

    /**
     * @return string
     */
    public static function title()
    {
        return 'Mapbox map';
    }

    public function selectable(): bool
    {
        $addon = Addon::get('jezzdk/statamic-mapbox');

        if ($addon->edition() !== 'pro') {
            return false;
        }

        return parent::selectable();
    }

    public function augment($value)
    {
        $value['showControls'] = $this->config('showControls', false);

        return MapboxHelper::convertToHtml($value);
    }

    public function preload()
    {
        $addon = Addon::get('jezzdk/statamic-mapbox');

        return [
            'defaultLng' => MapboxHelper::defaultLongitude(),
            'defaultLat' => MapboxHelper::defaultLatitude(),
            'pro' => $addon->edition() === 'pro',
            'api_key' => config('mapbox.api_key')
        ];
    }

    /**
     * Pre-process the data before it gets sent to the publish page.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function preProcess($data)
    {
        if (empty($data)) {
            return [
                'lng' => MapboxHelper::defaultLongitude(),
                'lat' => MapboxHelper::defaultLatitude(),
            ];
        }

        return $data;
    }

    /**
     * Process the data before it gets saved.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function process($data)
    {
        return $data;
    }

    protected function configFieldItems(): array
    {
        return [
            'initial_type' => [
                'display' => 'Initial map type',
                'instructions' => 'Choose which map type should be selected as default.',
                'type' => 'select',
                'default' => 'streets-v11',
                'options' => [
                    'streets-v11' => __('Streets'),
                    'satellite-v9' => __('Satellite'),
                    'satellite-streets-v11' => __('Hybrid'),
                    'outdoors-v11' => __('Outdoors'),
                ],
                'width' => 50
            ],
            'initial_zoom' => [
                'display' => 'Initial zoom level',
                'instructions' => 'Set a zoom level from 1 (far) to 21 (near).',
                'type' => 'text',
                'default' => '16',
                'width' => 50
            ],
            'maptypes' => [
                'display' => 'Enable maptype selector',
                'instructions' => 'Allow the user to select the map type.',
                'type' => 'toggle',
                'default' => true,
                'width' => 50
            ],
            'markers' => [
                'display' => 'Enable marker creation',
                'instructions' => 'The user can create and remove a marker on the map.',
                'type' => 'toggle',
                'default' => true,
                'width' => 50
            ],
            'geocoder' => [
                'display' => 'Enable Geocoder',
                'instructions' => 'Display a search field on the map for finding locations.',
                'type' => 'toggle',
                'default' => false,
                'width' => 50
            ],
            'showControls' => [
                'display' => 'Show controls',
                'instructions' => 'Display the map with the default Mapbox controls.',
                'type' => 'toggle',
                'default' => false,
                'width' => 50
            ]
        ];
    }
}
