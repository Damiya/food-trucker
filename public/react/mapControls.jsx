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

    Trucker.React.MapControls = React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function () {
            return {
                addressValue: '',
                errorText: '',
                hasError: false
            };
        },
        onHomeClick: function (event) {
            if (this.props.geolocationAvailable) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(point);
                });
            }

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
                if (status === google.maps.GeocoderStatus.OK) { // Ideally we'd allow the user to select the result.
                    mapRef.fitBounds(results[0].geometry.viewport);
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
                    <Alert bsStyle="danger" onDismiss={this.onDismissError}>
                    {this.state.errorText}
                    </Alert>
                    )
            }

            var homeTooltip = 'Geolocate';

            if (!this.props.geolocationAvailable) {
                homeTooltip = 'Unavailable';
            }

            return (
                <div id="map-controls">
                    <div className="input-group">
                        <OverlayTrigger placement="right" overlay={<Tooltip>{homeTooltip}</Tooltip>}>
                            <span className="input-group-addon" onClick={self.onHomeClick} disabled={!this.props.geolocationAvailable}>
                                <i className="fa fa-home"></i>
                            </span>
                        </OverlayTrigger>
                        <input valueLink={this.linkState('addressValue')} className="form-control" type="text" placeholder="Address" onKeyDown={self.onAddressInputKeyDown}/>
                    </div>
                    {errorText}
                </div>
                );
        }
    })
})();
