describe("Main Controller", function() {

  beforeEach(module('myApp'));

  var ctrl, scope;
  window.ymaps = {
    ready: function(cb){},
  };

  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('MainController', {$scope: scope});
  }));


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

