$(window).load(function () {
        'use strict';

        var geocoder = new google.maps.Geocoder();
        var url = 'http://data.sfgov.org/resource/rqzj-sfat.json';
        var leafletMap = L.map('map').setView([37.76572785787643,-122.4382495880127],15);
        var markerLayer = L.layerGroup();
        Trucker.Map = leafletMap;

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap);

        var reactContainer = $('#control-ct');

        React.renderComponent(
            Trucker.React.MapControls({
                map: leafletMap,
                geocoder: geocoder,
                markerLayer: markerLayer
            }),
            reactContainer[0]
        );
    }
);
