
angular.module("ngAutocomplete", [])
  .directive('ngAutocomplete', function ($parse) {
      return {

          scope: {
              details: '=',
              ngAutocomplete: '=',
              options: '='
          },

          link: function (scope, element, attrs, model) {

              //create new autocomplete
              //reinitializes on every change of the options provided
              var newAutocomplete = function () {
              }
              newAutocomplete()

              //watch options provided to directive
              scope.watchOptions = function () {
                  return scope.options
              };
              scope.$watch(scope.watchOptions, function () {
                  newAutocomplete()
                  element[0].value = '';
                  scope.ngAutocomplete = element.val();
              }, true);
          }
      };
  });