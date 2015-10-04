angular.module('myApp')
  .controller('MainController', function($scope){
    var self = this;

    $scope.locations = [];

    ymaps.ready(function(){
      init();
    });

    var init = function(){
      // add address hints to the input field
      var suggestView = new ymaps.SuggestView('suggest');
      suggestView.events.add('select', function (event) {
        self.processItem(event.get('item'));
        $scope.location = ''; // clean the input field after adding the location
      });

      // add a map
      self.map = new ymaps.Map('map', {
        center: [55.74954, 37.621587], // default center: Moscow
        zoom: 10
      });

    };

    self.processItem = function(item){
      var location = {name: item.displayName};
      ymaps.geocode(item.value, { json: true, results: 1 }).then(function (res) {
        location.coordinates = self.getPointCoordinates(res);
        $scope.locations.push(location);
        $scope.$evalAsync(); // runs a digest cycle on scope to make ng-repeat work
        self.addLocationToMap(location);
      });
    };

    self.getPointCoordinates = function(responseObject) {
      // get a string of point coordinates from a GeoObjectCollection
      var pointCoordinates = responseObject.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
      // transform the string to floats
      pointCoordinates = pointCoordinates.map(function(string){
        return parseFloat(string);
      });
      // for whatever crazy reason, coordinates come in the wrong order
      pointCoordinates = pointCoordinates.reverse();
      return pointCoordinates;
    };

    self.addLocationToMap = function(location) {
      var placemark = new ymaps.Placemark(location.coordinates, {
        balloonContentHeader: 'Адрес',
        balloonContentBody: location.name,
        index: ($scope.locations.length - 1)
      }, {
        preset: 'islands#icon',
        iconColor: '#0095b6',
        draggable: true
      });
      // add event listener that will respond to dragend event
      // and will update coordinates of the location in $scope.locations array
      placemark.events.add('dragend', function(e) {
        var thisPlacemark = e.get('target');
        var newCoordinates = thisPlacemark.geometry.getCoordinates();
        var locationIndex = thisPlacemark.properties.get('index');
        $scope.locations[locationIndex].coordinates = newCoordinates;
        self.updatePolyline();
      });
      // add the placemark to the map
      self.map.geoObjects.add(placemark);
      // center the map to that placemark
      self.map.setCenter(location.coordinates, undefined, {duration: 300});
      // add a reference to the placemark in the location object
      location.geoObject = placemark;
      // (re-)draw the polyline connecting the locations
      self.updatePolyline();
    };

    self.updatePolyline = function() {
      if ($scope.polyline) {
        self.map.geoObjects.remove($scope.polyline);
      }
      var coordinates = self.getAllCoordinates();
      if (coordinates.length > 1) {
        self.drawPolyline(coordinates);
      }
    };

    self.drawPolyline = function(coordinates) {
      var polyline = new ymaps.Polyline(
        coordinates,
        {itemType: 'polyline'},
        {strokeWidth: 4}
      );
      self.map.geoObjects.add(polyline);
      // add the reference to the polyline to the $scope object
      $scope.polyline = polyline;
    };

    self.cleanMap = function() {
      self.map.geoObjects.each(function(object){
        self.map.geoObjects.remove(object);
      })
    };

    self.updateMap = function() {
      $scope.locations.forEach(function(location){
        self.addLocationToMap(location);
      })
    };

    self.removeLocation = function(index) {
      var location = $scope.locations[index];
      self.map.geoObjects.remove(location.geoObject);
      $scope.locations.splice(index, 1);
      self.updatePolyline();
    };

    self.sortableOptions = {
      stop: function(e, ui){
        self.updatePolyline();
      }
    };

    self.getAllCoordinates = function() {
      var coordinates = $scope.locations.reduce(function(previousValue, currentValue) {
        previousValue.push(currentValue.coordinates);
        return previousValue;
      }, []);
      return coordinates;
    };

  });
