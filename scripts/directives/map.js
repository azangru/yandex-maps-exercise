angular.module('myApp')
  .directive('map', ['routesFactory', function(routesFactory){
    return {
      restrict: 'E',
      templateUrl: '/scripts/templates/map.html',
      link: function(scope){
        scope.routesList = routesFactory.routes;
        // setTimeout(function(){console.log(scope.routesList);}, 1000);

        var myMap;
        
        ymaps.ready(function(){
          init();
        });

        var init = function() {
          myMap = new ymaps.Map('map', {
            center: [55.74954, 37.621587],
            zoom: 10
          });

          ymaps.geocode("Россия, Москва, Печорская улица")
            .then(function(res){
              myMap.geoObjects.add(res.geoObjects);
            });
        };
        
        
      }
    };
  }]);
