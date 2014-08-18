/** @jsx React.DOM */

(function () {
    'use strict';

    var Table = ReactBootstrap.Table;

    Trucker.React.ListControl = React.createClass({displayName: 'ListControl',
        getInitialState: function () {
            return {
                markers: {}
            };
        },
        componentDidMount: function () {
            // Lifecycle event when the ListControl  initially renders.
            var collection = this.props.collection;
            collection.on('sync', this.onCollectionChange, this); // Since we're only using the collection with server data,
                                                                  // sync covers all our bases
            var map = this.props.map;
            // Idle event indicates that the map has stopped panning and zooming, so we need to re-sync our collection
            google.maps.event.addListener(map, 'idle', this.fetchNearestFacilities);
        },
        onCollectionChange: function () {
            this.forceUpdate(); // Compels React to diff and potentially rerender the component
            this.refreshMarkers();
        },
        refreshMarkers: function () {
            _.each(this.state.markers, function (marker) { // Remove each marker from the map.
                marker.setMap(null);
            });

            var map = this.props.map;
            var collection = this.props.collection;

            // Translate model collection to an Array of Google Maps Markers
            var markerObjects = collection.map(function (facility) {
                var loc = facility.get('location');
                var lat = loc[0];
                var lng = loc[1];
                return new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map,
                    title: facility.get('applicant'),
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
            });

            var currentLocIds = collection.pluck('location_id');
            var newMarkers = _.object(currentLocIds, markerObjects);

            // Retain references to the markers so we can do updates later
            this.setState({markers: newMarkers});
        },
        fetchNearestFacilities: function () {
            var collection = this.props.collection;
            var map = this.props.map;
            var center = map.getCenter();
            // In an ideal world we'd add a dropdown to choose the limit but for now this'll do
            collection.fetch({
                reset: true,
                data: {
                    lat: center.lat(),
                    lng: center.lng(),
                    limit: 10
                }
            });

        },
        onFacilityMouseEnter: function (event) {
            var locationId = $(event.currentTarget).data('key');
            var relevantMarker = this.state.markers[locationId];
            relevantMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        },
        onFacilityMouseLeave: function (event) {
            var locationId = $(event.currentTarget).data('key');
            var relevantMarker = this.state.markers[locationId];
            relevantMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        },
        render: function () {
            var self = this;
            var collection = this.props.collection;
            var tableContents = collection.map(function (facility, index) {
                return ( // 'Key' is for ReactJS diffing, data-key will be used as a quick way to find the marker
                    // associated with the table row elem. It's not ideal but time constraints
                    React.DOM.tr({'data-key': facility.get('location_id'), 
                    key: facility.get('location_id'), onMouseEnter: self.onFacilityMouseEnter, 
                    onMouseLeave: self.onFacilityMouseLeave}, 
                        React.DOM.td(null, facility.get('applicant'))
                    )
                    )
            });
            return (
                Table({striped: true, hover: true}, 
                    React.DOM.thead(null, 
                        React.DOM.tr(null, 
                            React.DOM.th(null, "Operator Name")
                        )
                    ), 
                    React.DOM.tbody(null, 
                    tableContents
                    )
                )
                );
        }
    })
})();
