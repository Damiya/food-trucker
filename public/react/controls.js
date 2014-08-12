/** @jsx React.DOM */

(function () {
    'use strict';

    var DropdownButton = ReactBootstrap.DropdownButton;
    var MenuItem = ReactBootstrap.MenuItem;
    var OverlayTrigger = ReactBootstrap.OverlayTrigger;
    var Tooltip = ReactBootstrap.Tooltip;
    var Alert = ReactBootstrap.Alert;

    var ClassSet = React.addons.classSet;

    var ENTER_KEY = 13;

    Trucker.React.MapControls = React.createClass({displayName: 'MapControls',
        mixins: [React.addons.LinkedStateMixin],
        componentWillMount: function () {
            var map = this.props.map;
            map.on('locationfound', this.updateMarkers);
            map.on('moveend', this.updateMarkers);
        },
        componentDidMount: function () {
          this.updateMarkers();
        },
        getInitialState: function () {
            return {
                addressValue: '',
                errorText: '',
                hasError: false,
                currentLat: '',
                currentLng: ''
            };
        },
        updateMarkers: function () {
            var viewBounds = this.props.map.getBounds();
            var nePoint = viewBounds.getNorthEast();
            var swPoint = viewBounds.getSouthWest();
            var markerLayer = this.props.markerLayer;
            var self = this;
            $.get('/api/trucks', {neLat: nePoint.lat, neLng: nePoint.lng, swLat: swPoint.lat, swLng: swPoint.lng}, function success(data) {
                markerLayer.clearLayers();
                _.each(data, function (truck) {
                    markerLayer.addLayer(L.marker(truck.location).bindPopup(truck.applicant)).addTo(self.props.map);
                });
            });
        },
        onHomeClick: function (event) {
            this.props.map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
        },
        onAddressInputKeyDown: function (event) {
            if (event.which === ENTER_KEY) {
                this.zoomToEnteredAddress();
            }
        },
        onDismissError: function () {
            this.setState({hasError: false, errorText: ''});
        },
        zoomToEnteredAddress: function () {
            var self = this;
            var geocoder = this.props.geocoder;
            var mapRef = this.props.map;
            geocoder.geocode({'address': this.state.addressValue}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var northEast = results[0].geometry.viewport.getNorthEast();
                    var southWest = results[0].geometry.viewport.getSouthWest();
                    var bounds = [
                        [northEast.lat(), northEast.lng()],
                        [southWest.lat(), southWest.lng()]
                    ];
                    mapRef.fitBounds(bounds);
                    L.marker(mapRef.getCenter(), {title: 'Home'}).addTo(mapRef)
                        .bindPopup('<strong>Home</strong>');
                } else {
                    self.setState({errorText: 'Geocoding for that address failed. Status: ' + status, hasError: true});
                }
            });
        },
        render: function () {
            var self = this;

            var errorText;

            if (this.state.hasError) {
                errorText = (
                    Alert({bsStyle: "danger", onDismiss: this.onDismissError}, 
                    this.state.errorText
                    )
                    )
            }

            return (
                React.DOM.div({id: "map-controls"}, 
                    React.DOM.div({className: "input-group"}, 
                        OverlayTrigger({placement: "top", overlay: Tooltip(null, "Show my current location")}, 
                            React.DOM.span({className: "input-group-addon", onClick: self.onHomeClick}, 
                                React.DOM.i({className: "fa fa-home"})
                            )
                        ), 
                        React.DOM.input({valueLink: this.linkState('addressValue'), className: "form-control", type: "text", placeholder: "Address", onKeyDown: self.onAddressInputKeyDown})
                    ), 
                    errorText
                )
                );
        }
    })
})
();
