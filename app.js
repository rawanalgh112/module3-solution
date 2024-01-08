(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
        .directive('foundItems', FoundItemsDirective);



function FoundItemsDirective() {
    var ddo = {

        scope: {
            items: '<',
            onRemove: '&',
            isValid: '<'
          },
        controller: NarrowItDownDirectiveController,
        controllerAs: 'narrowItDownDirecContr',
        bindToController: false,
        transclude: true,
            Restrict: 'E',
        templateUrl: 'foundItems.html',

      };

    return ddo;
}

function NarrowItDownDirectiveController() {
var list = this;


}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
    var narrowItDown = this;

    narrowItDown.valid = true;
    narrowItDown.searchTerm = "";
    narrowItDown.found = [];

    narrowItDown.search = function() {

        if (searchIsEmpty(narrowItDown.searchTerm))
        {
            narrowItDown.found = [];
            narrowItDown.valid = false;
            return;
        };

// returned value not readable, we need to use then to  get data.
        var searchForItems = MenuSearchService.getAllMenuItems();

        searchForItems.then( function (result) {
            narrowItDown.found = result;

            narrowItDown.valid = (true);
        })
        .catch(function(error) {
            console.log("MenuSearchService.getMatchedMenuItems returned an error");
        });
    };

    narrowItDown.removeItem = function (index) {
      console.log("Controller function >>> " + index);
        MenuSearchService.removeItem(index);
          //narrowItDown.Getall();
    };


//     narrowItDown.Getall = function() {
//
//         if (searchIsEmpty(narrowItDown.searchTerm))
//         {
//             narrowItDown.found = [];
//             narrowItDown.valid = false;
//             return;
//         };
//
// // returned value not readable, we need to use then to  get data.
//         var searchForItems = MenuSearchService.getAllMenuItems();
//
//         searchForItems.then( function (result) {
//             narrowItDown.found = result;
//
//             narrowItDown.valid = (true);
//         })
//         .catch(function(error) {
//             console.log("MenuSearchService.getMatchedMenuItems returned an error");
//         });
//     };



    function searchIsEmpty (searchString)
    {
        return searchString.replace(/\s/g,"").length === 0;
    };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService ($http, ApiBasePath) {
    var service = this;
var allMenuItems = [];
    service.getAllMenuItems = function () {

        return $http({
            method: "GET",
            url: (ApiBasePath + "/menu_items.json")
        }).then(function (response) {

             allMenuItems = response.data;
// console.log(allMenuItems);
           return allMenuItems.filter( function (item) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
           });

        })
        .catch(function(error) {
            console.log("GET menu_items.json returned an error");
        });

    };


    // service.onRemove = function (index) {
    //   allMenuItems.splice(index, 1);
    // };
    // service.onRemove = function (index) {
    //       console.log("Service function >>> " + index);
    //   items.splice(itemIndex, 1);
    // };
    service.removeItem = function (index) {
      console.log("Service function >>> " + index);
  allMenuItems.splice(index, 1);


      console.log(allMenuItems);
    };

}


function ShoppingListFactory() {
  var factory = function (maxItems) {
    return new ShoppingListService(maxItems);
  };

  return factory;
}

})();
