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
            var collection = this.props.collection;
            collection.on('sync', this.onCollectionChange, this);
            var map = this.props.map;
            google.maps.event.addListener(map, 'idle', this.fetchNearestFacilities);
        },
        onCollectionChange: function () {
            this.forceUpdate();
            this.refreshMarkers();
        },
        refreshMarkers: function () {
            _.each(this.state.markers, function (marker) {
                marker.setMap(null);
            });

            var map = this.props.map;
            var collection = this.props.collection;

            var markerObjects = collection.map(function (facility) {
                var loc = facility.get('location');
                var lat = loc[0];
                var lng = loc[1];
                return new google.maps.Marker({
                    position: new google.maps.LatLng(lat,lng),
                    map: map,
                    title: facility.get('applicant')
                });
            });

            var currentLocIds = collection.pluck('location_id');
            var newMarkers = _.object(currentLocIds, markerObjects);

            this.setState({markers: newMarkers});
        },
        fetchNearestFacilities: function () {
            var collection = this.props.collection;
            var map = this.props.map;
            var center = map.getCenter();
            collection.fetch({
                reset: true,
                data: {
                    lat: center.lat(),
                    lng: center.lng(),
                    limit: 10
                }
            });
        },
        render: function () {
            var collection = this.props.collection;
            var tableContents = collection.map(function (facility, index) {
                return (
                    React.DOM.tr({key: facility.get('location_id')}, 
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
