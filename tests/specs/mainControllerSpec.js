describe("Main Controller", function() {

  beforeEach(module('myApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));


  describe("something very basic", function() {
    it('works', function(){
      var controller = $controller('MainController');
      expect(controller.test).toBe(2);
    });
  });
  
});

