import Fieldtype from './components/MapboxFieldtype';

Statamic.booting(() => {
    Statamic.$components.register('mapbox-fieldtype', Fieldtype);
});
