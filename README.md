# Statamic Mapbox
![Statamic 3.0+](https://img.shields.io/badge/Statamic-3.0+-FF269E?style=for-the-badge&link=https://statamic.com)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/jezzdk/statamic-mapbox.svg?style=for-the-badge)](https://packagist.org/packages/jezzdk/statamic-mapbox)

A Mapbox addon for Statamic V3 for creating and displaying a Mapbox map on your website.

## Installation

Require it using Composer.

```
composer require jezzdk/statamic-mapbox
```

Publish the config file

```
php artisan vendor:publish --provider="Jezzdk\StatamicMapbox\ServiceProvider"
```

Add an environment variable, since this library uses [Mapbox](https://www.mapbox.com/) under the hood for displaying maps.

```
MAPBOX_API_KEY=""
```

Lastly, insert this tag in the header in order to load the Mapbox JavaScript on the frontend:

```
{{ mapbox_script }}
```

**\*Disclaimer\*** You will need a Mapbox account if you want to create an API key.

## Usage

This addon provides a Mapbox field (Pro feature). You can use that in your blueprints which will enable your users to dynamically insert maps onto your website.

There is also a tag that you can use directly in your Antlers template. I'll explain both use cases below.

### Mapbox Tag

The simplest way to insert a map is by inserting the tag with longitude and latitude:

```
<div style="width: 500px; height: 400px">
    {{ mapbox lng="12.1234" lat="52.1234" zoom="8" marker="true" showControls="true" }}
</div>
```

This will insert a map centered on the given coordinates and display a marker.
The Mapbox tag supports the following attributes:

| Attribute | Type | Default | Description |
|---|---|---|---|
| lng | float | _none_ | The longitude (required) |
| lat | float | _none_ | The latitude (required) |
| zoom | integer | 16 | The map zoom level |
| marker | bool | false | Display a marker in the latitude and longitude from above |
| markerLng | float | _none_ | The longitude for the marker (the `marker` attribute must be true) |
| markerLat | float | _none_ | The latitude for the marker (the `marker` attribute must be true) |
| markerColor | string | #3FB1CE | Set the color of the marker. Accepts a hex, rgb or rgba value |
| type | string | streets | Valid values are: `streets`, `satellite`, `hybrid`, `outdoor` |
| icon | string | /assets/marker.png | (Pro feature) Use a path relative to the public folder. If the file doesn't exist, the default Mapbox pin will be used. |
| style | string | _none_ | (Pro feature) The map styles as a style URL |
| showControls | boolean | false | Show the default map controls |

### Mapbox Field (Pro feature)

Simply select the fieldtype when creating a blueprint. When a user pans around the map, changes zoom level or changes the map type, the settings are saved and the output will display the same view as selected in the control panel.

The field has a few settings:

* Initial map type - choose which map type should be selected when the map is loaded initially in the control panel
* Initial zoom level - choose the zoom level when the map is loaded initially in the control panel
* Enable maptype selector - Allow the user to select the map type
* Enable marker creation - The user can create and remove a marker on the map
* Enable Geocoder - This adds a search field on the map, enabling the user to search for ie. an address

When using markers, the script will look for an icon at `/public/assets/marker.png`. If it exist it will be used, otherwise it will use the default Mapbox pin.

## Styles (Pro feature)

The map can be styled using a specific Mapbox style URL. You can generate the style and get the URL for free at [https://studio.mapbox.com/](https://studio.mapbox.com/).

The field has an input field where the style URL can be inserted, when the map type is set to `custom`. The mapbox tag has a `style` attribute for the same purpose.
