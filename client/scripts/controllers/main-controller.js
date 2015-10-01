angular.module('myApp')
  .controller('MainController', function($scope){
    var self = this;
    var suggestView, map;

    $scope.locations = [{name: 'пример'}];

    ymaps.ready(function(){
      init();
    });

    var init = function(){
      // add address hints to the input field
      suggestView = new ymaps.SuggestView('suggest');
      suggestView.events.add('select', function (event) {
        self.processItem(event.get('item'));
      });
      // add a map
      map = new ymaps.Map('map', {
        center: [55.74954, 37.621587],
        zoom: 10
      });
    };

    self.processItem = function(item){
      var location = {name: item.displayName};
      ymaps.geocode(item.value, { json: true, results: 1 }).then(function (res) {
        location.coordinates = self.getPointCoordinates(res);
        $scope.locations.push(location);
        $scope.$evalAsync(); // runs a digest cycle on scope to make ng-repeat work
        // map.geoObjects.add(res.geoObjects);
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
      // for whatever crazy reason, the array of coordinates needs to be reversed
      pointCoordinates = pointCoordinates.reverse();
      return pointCoordinates;
    };

    self.addLocationToMap = function(location) {
      console.log(location.coordinates);
      var placemark = new ymaps.Placemark(location.coordinates, {
        balloonContent: 'цвет <strong>воды пляжа бонди</strong>'
      }, {
        preset: 'islands#icon',
        iconColor: '#0095b6',
        draggable: true
      });
      map.geoObjects.add(placemark);
      setTimeout(self.cleanMap, 2000);
    };

    self.cleanMap = function(){
      map.geoObjects.each(function(object){
        map.geoObjects.remove(object);
      })
    };

  });
