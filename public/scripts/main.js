$(function () {
    'use strict';

    var geocoder = new google.maps.Geocoder();
    var initialView = {
        center: new google.maps.LatLng(37.76572785787643, -122.4382495880127),
        zoom: 13
    };
    var mapContainer = $('#map');
    var googleMap = new google.maps.Map(mapContainer[0], initialView);
    Trucker.Map = googleMap;

    var FacilityModel = Backbone.Model.extend();
    var FacilitiesCollection = Backbone.Collection.extend({
        model: FacilityModel,
        url: '/api/facilities'
    });

    var collection = new FacilitiesCollection([]);

    var controlContainer = $('#control-ct');
    React.renderComponent(
        Trucker.React.MapControls({
            map: googleMap,
            geocoder: geocoder,
            geolocationAvailable: navigator.geolocation
        }),
        controlContainer[0]
    );

    var listContainer = $('#list-ct');

    React.renderComponent(
        Trucker.React.ListControl({
            map: googleMap,
            collection: collection
        }),
        listContainer[0]
    );
});
