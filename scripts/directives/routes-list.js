angular.module('myApp')
  .directive('routesList', ['routesFactory', function(routesFactory){
    return {
      restrict: 'E',
      templateUrl: '/scripts/templates/routes-list.html',
      link: function(scope){
        scope.routesList = routesFactory.routes;
        ymaps.ready(function () {
          var suggestView = new ymaps.SuggestView('suggest');
          suggestView.events.add('select', function (event) {
            console.log('О, событие!');
            console.log(event.get('item'));
            ymaps.geocode(event.get('item').value)
              .then(
                function (res) {
                  // map.geoObjects.add(res.geoObjects);
                  console.log(res);
                },
                function (err) {
                  // обработка ошибки
                }
              );
          });
        });
      }
    };
  }]);
