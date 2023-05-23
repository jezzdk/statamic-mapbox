import Fieldtype from './components/MapboxFieldtype.vue';

Statamic.booting(() => {
    Statamic.$components.register('mapbox-fieldtype', Fieldtype);
});
