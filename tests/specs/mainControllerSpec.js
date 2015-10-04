describe("Main Controller", function() {

  beforeEach(module('myApp'));

  var ctrl, scope;

  // stub for the ymaps global object
  window.ymaps = {
    ready: function(cb){},
    Placemark: function(coords, properties, options){
      this.events = {
        add: function(string, cb){}
      }
    },
    Polyline: function(coords, properties, options){}
  };

  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('MainController', {$scope: scope});
  }));

  beforeEach(function(){
    // stub for the map object that was generated in the controller's init function
    ctrl.map = {
      geoObjects: {
        add: function(geoobject){},
        remove: function(geoobject){}
      },
      setCenter: function(coords, zoom, options){}
    };
  });

  describe("getPointCoordinates function", function() {
    it('returns point coordinates from ymaps.geocode response', function(){
      // using geocoderResponse JSON object from the fixtures file
      expect(ctrl.getPointCoordinates(geocoderResponse)).toEqual([55.753093, 37.587596]);
    });
  });

  describe("addLocationToMap function", function() {
    var location;

    beforeEach(function(){
      location = {name: 'some place', coordinates: [55.753093, 37.587596]};
    });

    it('calls the Placemark constructor', function(){
      spyOn(window.ymaps, 'Placemark').and.callThrough();
      ctrl.addLocationToMap(location);
      expect(window.ymaps.Placemark).toHaveBeenCalled();
    });

    it('passes the instantiated placemark to the map geoObjects add function', function(){
      spyOn(ctrl.map.geoObjects, 'add');
      ctrl.addLocationToMap(location);
      expect(ctrl.map.geoObjects.add).toHaveBeenCalledWith(jasmine.any(ymaps.Placemark));
    });

    it('centers the map using the placemark’s coordinates', function(){
      spyOn(ctrl.map, 'setCenter');
      ctrl.addLocationToMap(location);
      expect(ctrl.map.setCenter).toHaveBeenCalledWith(
        location.coordinates, undefined, {duration: 300}
      );
    });

    it('adds the instantiated placemark to location object', function(){
      ctrl.addLocationToMap(location);
      expect(location.geoObject).toBeDefined();
      expect(location.geoObject).toEqual(jasmine.any(ymaps.Placemark));
    });

    it('calls the updatePolyline function', function(){
      spyOn(ctrl, 'updatePolyline');
      ctrl.addLocationToMap(location);
      expect(ctrl.updatePolyline).toHaveBeenCalled();
    });

  });

  describe("updatePolyline function", function() {

    it('calls the map.geoObjects.remove function to remove the existing polyline', function(){
      spyOn(ctrl.map.geoObjects, 'remove');
      scope.polyline = {name: 'mock polyline'};
      ctrl.updatePolyline();
      expect(ctrl.map.geoObjects.remove).toHaveBeenCalledWith(scope.polyline);
    });

    it('does not call the map.geoObjects.remove function if there is no polyline on the scope', function(){
      spyOn(ctrl.map.geoObjects, 'remove');
      ctrl.updatePolyline();
      expect(ctrl.map.geoObjects.remove).not.toHaveBeenCalled();
    });

    it('does not call the drawPolyline function if $scope.locations array is empty', function(){
      spyOn(ctrl, 'drawPolyline');
      ctrl.updatePolyline();
      expect(ctrl.drawPolyline).not.toHaveBeenCalled();
    });

    it('does not call the drawPolyline function if $scope.locations array contains only one location', function(){
      spyOn(ctrl, 'drawPolyline');
      scope.locations.push({name: 'location1', coordinates: [1.0, 2.0]});
      ctrl.updatePolyline();
      expect(ctrl.drawPolyline).not.toHaveBeenCalled();
    });

    it('calls the drawPolyline function if $scope.locations array contains more than one location', function(){
      spyOn(ctrl, 'drawPolyline');
      var locations = [
        {name: 'location1', coordinates: [1.0, 2.0]},
        {name: 'location2', coordinates: [3.0, 4.0]}
      ]
      scope.locations = scope.locations.concat(locations);
      ctrl.updatePolyline();
      expect(ctrl.drawPolyline).toHaveBeenCalledWith([[1.0, 2.0], [3.0, 4.0]]);
    });

  });

  describe("drawPolyline function", function() {
    var coordinates;

    beforeEach(function(){
      coordinates = [[1.0, 2.0], [3.0, 4.0]];
    });


    it('passes an instance of Polyline to the map geoObjects add function', function(){
      spyOn(ctrl.map.geoObjects, 'add');
      ctrl.drawPolyline(coordinates);
      expect(ctrl.map.geoObjects.add).toHaveBeenCalledWith(jasmine.any(ymaps.Polyline));
    });

    it('adds an instance of Polyline to the $scope', function(){
      expect(scope.polyline).not.toBeDefined();
      ctrl.drawPolyline(coordinates);
      expect(scope.polyline).toBeDefined();
      expect(scope.polyline).toEqual(jasmine.any(ymaps.Polyline));
    });

  });

  describe("removeLocation function", function() {

    beforeEach(function(){
      scope.locations = [
        {name: 'location1', coordinates: [1.0, 2.0], geoObject: {name: 'object1'}},
        {name: 'location2', coordinates: [3.0, 4.0], geoObject: {name: 'object2'}},
        {name: 'location2', coordinates: [6.0, 5.0], geoObject: {name: 'object3'}}
      ];
    });

    it('passes a geoObject to map.geoObjects remove function based on the location index', function(){
      spyOn(ctrl.map.geoObjects, 'remove');
      ctrl.removeLocation(1);
      expect(ctrl.map.geoObjects.remove).toHaveBeenCalledWith({name: 'object2'});
    });

    it('removes a location from the $scope.locations array based on its index', function(){
      // after removing the second location from the scope, expect the locations array to be:
      var expectedLocations = [
        {name: 'location1', coordinates: [1.0, 2.0], geoObject: {name: 'object1'}},
        {name: 'location2', coordinates: [6.0, 5.0], geoObject: {name: 'object3'}}
      ];
      ctrl.removeLocation(1);
      expect(scope.locations).toEqual(expectedLocations);
    });

    it('calls the updatePolyline function', function(){
      spyOn(ctrl, 'updatePolyline');
      ctrl.removeLocation(1);
      expect(ctrl.updatePolyline).toHaveBeenCalled();
    });

  });

  describe("getAllCoordinates function", function() {

    it('returns an array of coordinates of all locations', function(){
      scope.locations = [
        {name: 'location 1', coordinates: [1.0, 2.0]},
        {name: 'location 2', coordinates: [3.0, 4.0]},
        {name: 'location 3', coordinates: [2.0, 5.0]}
      ];
      var expectedCoordinates = [[1.0, 2.0], [3.0, 4.0], [2.0, 5.0]];
      expect(ctrl.getAllCoordinates().length).toEqual(3);
      expect(ctrl.getAllCoordinates()).toEqual(expectedCoordinates);
    });

    it('returns an array with one pair of coordinates if there’s only one location', function(){
      scope.locations = [
        {name: 'location 1', coordinates: [1.0, 2.0]}
      ];
      expect(ctrl.getAllCoordinates().length).toEqual(1);
    });

    it('returns an empty array if there are no locations on the scope', function(){
      expect(ctrl.getAllCoordinates().length).toEqual(0);
    });

  });

});
