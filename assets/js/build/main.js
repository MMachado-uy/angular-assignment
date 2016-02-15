;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license AngularJS v1.2.16
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider);

/**
 * @ngdoc provider
 * @name $routeProvider
 * @function
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * Note that this example is using {@link ng.directive:script inlined templates}
     * to get it working on jsfiddle as well.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = 'string' == typeof m[i]
              ? decodeURIComponent(m[i])
              : m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              // configure html5 to get links working on jsfiddle
              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if(previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement, function() {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

},{}],2:[function(require,module,exports){
(function() {

    ////////////////////////////////////////////////////////////
    // App
    ////////////////////////////////////////////////////////////

    var App = angular.module('YourApp', [
                                    'ngRoute', 
                                    'pasvaz.bindonce', 
                                    'Controllers', 
                                    'Directives', 
                                    'Factories', 
                                    'Filters', 
                                    'Services', 
                                    'ngSanitize'
        ]);

    ////////////////////////////////////////////////////////////
    // CONFIG
    ////////////////////////////////////////////////////////////

    App.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
        
		/*
		 * DataResolve is a function that ends up returning a promise.
		 * This function is then passed to every route that needs it.
	     * Views won't be loaded until the promise is resolved, allowing to 
         * initialize data with a request.
		*/

        /*
         * "Helper" is a service with a method that returns 
         * a promise which loads some data when resolved.
         */
        // var dataResolve = function(Helper, $route) {
        //     return Helper.helperMethod(param1, param2);
        // }

        $routeProvider.when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            // resolve: {teams: dataResolve}
        });
		
        $routeProvider.when('/create', {
            templateUrl: 'pages/create.html',
            controller: 'CreateController'
        });

        $routeProvider.when('/edit', {
            templateUrl: 'pages/edit.html',
            controller: 'EditController'
        });

        $routeProvider.when('/edit', {
            templateUrl: 'pages/edit.html',
            controller: 'EditController'
        });        

        $routeProvider.when('/', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController'
        });

        $routeProvider.otherwise({
            redirectTo: '/#login'
            // resolve: {teams: dataResolve}
        });

    }]);
})();

},{}],3:[function(require,module,exports){
angular.module('Controllers', []);

// ADD EVERY CONTROLLER YOU CREATE TO THIS FILE. EX:
require('./controllers/HomeController.js');
require('./controllers/CreateController.js');
require('./controllers/EditController.js');
require('./controllers/LoginController.js');
},{"./controllers/CreateController.js":4,"./controllers/EditController.js":5,"./controllers/HomeController.js":6,"./controllers/LoginController.js":7}],4:[function(require,module,exports){
angular.module('Controllers')
    .controller('CreateController', ['$scope', 'Helper',function ($scope, Helper) {

        $scope.submit = function() {

            ContactCRUDController.createContact($scope.name, $scope.lastname, currUser, currToken, function (result, event) {
                if (event.status && result != null) {
                    $scope.name = null;
                    $scope.lastname = null;
                    alert('Done!')
                }
                if (result == null) {
                    alert('Something went wrong');
                }
            });
            $scope.name = null; 
            $scope.lastname = null; 
        }
    }]);

},{}],5:[function(require,module,exports){
angular.module('Controllers')
    .controller('EditController', ['$scope', 'Helper',function ($scope, Helper) {


        $scope.submit = function() {
            ContactCRUDController.createContact($scope.id, $scope.name, $scope.lastname, currUser, currToken, function (result, event) {
                if (event.status && result != null) {
                    $scope.name = null;
                    $scope.lastname = null;
                    $scope.id = null;
                    alert('Done!')
                }
                if (result == null) {
                    alert('Something went wrong');
                }
            });
            $scope.name = null; 
            $scope.lastname = null; 
            $scope.id = null;
        }
    }]);

},{}],6:[function(require,module,exports){
angular.module('Controllers')
    .controller('HomeController', ['$scope', 'Helper',function ($scope, Helper) {

        $scope.contacts = [];

        ContactCRUDController.listUsers(currUser, currToken, function(result, event) {
            if (event.status && result != null) {
                $scope.contacts = JSON.stringify(result);
                console.log($scope.contacts);
            }
        });        
    }]);

},{}],7:[function(require,module,exports){
angular.module('Controllers')
    .controller('LoginController', ['$scope', 'Helper', '$location', 
                                        function ($scope, Helper, $location) {

        $scope.submit = function() {

            authController.userLogin($scope.username, $scope.password, function(result, event) {
                if (event.status && result != null) {
                    $("nav").show();
                    $location.path('/home');
                    currUser = $scope.username;
                    currToken = result;
                    document.getElementById("user-menu").innerHTML = currUser;
                } else {
                    $scope.username = null;
                    $scope.password = null;
                    alert('You sure those are your credentials?');
                };
            });
        };
    }]);

},{}],8:[function(require,module,exports){
angular.module('Directives', []);

// ADD EVERY DIRECTIVE YOU CREATE TO THIS FILE. EX:

require('./directives/someDirective.js');

},{"./directives/someDirective.js":9}],9:[function(require,module,exports){
angular.module('Directives')

	// Utilities is being injected (dependency injection), for being used in this directive. It could be a service, factory, etc.
    .directive('someDirective', ['Utilities', function(Manager, Utilities) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'some-directive.html',
            link: function(scope, element, attrs) {

            }
        };
    }])

},{}],10:[function(require,module,exports){
angular.module('Factories', []);

// Add every factory you create to this file.

require('./factories/someFactory.js');

},{"./factories/someFactory.js":11}],11:[function(require,module,exports){
angular.module('Factories').factory('SomeFactory', ['$q', function($q) {

    var getSomeData = function(someParam) {
        var deferred = $q.defer();
		
		// Interact with some data from the server. 
		// This example calls a remote action defined in an APEX class called SomeController.
		
		SomeController.SomeMethod(someParam, function(result,event){
            if (event.status) {
                deferred.resolve(result); 
            } else {
                deferred.reject(event);
            }           
        },
        { buffer: false, escape: true, timeout: 30000 });
        
        return deferred.promise;   
    }
	
    // Add every method defined in this factory to the return object
    return {
        getSomeData: getSomeData
    }

}]);

},{}],12:[function(require,module,exports){
angular.module('Filters', []);

// Add every filter you create to this file

require('./filters/filters.js');

},{"./filters/filters.js":13}],13:[function(require,module,exports){
angular.module('Filters')
    
    ////////////////////////////////////////////////////////////
    // Your filters
    ////////////////////////////////////////////////////////////

    .filter('someFilter', function() {
        return function(someParam, otherParam) {
			// Return the result of the filtering.
        };
    })

},{}],14:[function(require,module,exports){
require('./vendor/bindonce.js');
require('../lib/angular-route.js');

require('./controllers.js');
require('./directives.js');
require('./factories.js');
require('./filters.js');
require('./services.js');

require('./app.js');
require('../../templates/templates.js');
require('../../styles/bootstrap/dist/js/bootstrap.min.js');

$ = jQuery.noConflict();
$(document).ready(function() {

    var currUser;
    var currToken;
    $("nav").hide();

    /*
     * Navigation
     */
    $("nav .menu-item").click(function (e) {
        $("nav .menu-item").removeClass("active");
        $(this).addClass("active");
    });

    /*
     * Logout
     */
    $("#logout").click(function (e) {
        currToken = null;
        currUser = null;
        $("nav").hide();
    });
});
},{"../../styles/bootstrap/dist/js/bootstrap.min.js":18,"../../templates/templates.js":19,"../lib/angular-route.js":1,"./app.js":2,"./controllers.js":3,"./directives.js":8,"./factories.js":10,"./filters.js":12,"./services.js":15,"./vendor/bindonce.js":17}],15:[function(require,module,exports){
angular.module('Services', []);

// Add every service you create to this file.

require('./services/helper.js');

},{"./services/helper.js":16}],16:[function(require,module,exports){
angular.module('Services').service('Helper', ['$q', function ($q, Utilities) {

    this.helperMethod = function (param1, param2) {
		// Return whatever. Each service is a singleton, so this could be used to define methods to perform 
		// AJAX request to the server and return a promise.
	
        var something = "test";
        return something;
    }

}]);

},{}],17:[function(require,module,exports){
'use strict';
/**
 * Bindonce - Zero watches binding for AngularJs
 * @version v0.1.1 - 2013-05-07
 * @link https://github.com/Pasvaz/bindonce
 * @author Pasquale Vazzana <pasqualevazzana@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

 angular.module('pasvaz.bindonce', [])

 .directive('bindonce', function() {
 	var toBoolean = function(value) {
 		if (value && value.length !== 0) {
 			var v = angular.lowercase("" + value);
 			value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
 		} else {
 			value = false;
 		}
 		return value;
 	}

 	return {
 		restrict: "AM",
 		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
 			var showHideBinder = function(elm, attr, value) 
 			{
 				var show = (attr == 'show') ? '' : 'none';
 				var hide = (attr == 'hide') ? '' : 'none';
 				elm.css('display', toBoolean(value) ? show : hide);
 			}
 			var classBinder = function(elm, value)
 			{
 				if (angular.isObject(value) && !angular.isArray(value)) {
 					var results = [];
 					angular.forEach(value, function(value, index) {
 						if (value) results.push(index);
 					});
 					value = results;
 				}
 				if (value) {
 					elm.addClass(angular.isArray(value) ? value.join(' ') : value);
 				}
 			}

 			var ctrl =
 			{
 				watcherRemover : undefined,
 				binders : [],
 				group : $attrs.boName,
 				element : $element,
 				ran : false,

 				addBinder : function(binder) 
 				{
 					this.binders.push(binder);

 					// In case of late binding (when using the directive bo-name/bo-parent)
 					// it happens only when you use nested bindonce, if the bo-children
 					// are not dom children the linking can follow another order
 					if (this.ran)
 					{
 						this.runBinders();
 					}
 				},

 				setupWatcher : function(bindonceValue) 
 				{
 					var that = this;
 					this.watcherRemover = $scope.$watch(bindonceValue, function(newValue) 
 					{
 						if (newValue == undefined) return;
 						that.removeWatcher();
 						that.runBinders();
 					}, true);
 				},

 				removeWatcher : function() 
 				{
 					if (this.watcherRemover != undefined)
 					{
 						this.watcherRemover();
 						this.watcherRemover = undefined;
 					}
 				},

 				runBinders : function()
 				{
 					for (var data in this.binders)
 					{
 						var binder = this.binders[data];
 						var value;

 						if (this.group && this.group != binder.group ) continue;
 							
 						if (binder.attr === 'data') {

 							angular.forEach(Object.keys(binder.attrs), function(attr) {
 								var newAttr, newValue;
 								if (attr.match(/^boData/) && binder.attrs[attr]) {
 									newAttr = attr.replace(/^bo/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
 									newValue = $scope.$eval(binder.attrs[attr]);
 									binder.element.attr(newAttr, newValue);
 								}
 							});
 						
 						} else {
 						
 							value = $scope.$eval(binder.value);
 						
	 						switch(binder.attr)
							{
								case 'hide':
								case 'show':
								showHideBinder(binder.element, binder.attr, value);
								break;
								case 'class':
								classBinder(binder.element, value);
								break;
								case 'text':
								binder.element.text(value);
								break;
								case 'html':
								binder.element.html(value);
								break;
								case 'src':
								case 'href':
								case 'alt':
								case 'title':
								case 'id':
								case 'style':
								case 'value':
								binder.element.attr(binder.attr, value);
								break;
							}

 						}
					}
 					this.ran = true;
 					this.binders = [];
				}
			}

			return ctrl;
		}],

		link: function(scope, elm, attrs, bindonceController) {
			var value = (attrs.bindonce) ? scope.$eval(attrs.bindonce) : true;
			if (value != undefined)
			{
				bindonceController.runBinders();
			}
			else
			{
				bindonceController.setupWatcher(attrs.bindonce);
				elm.bind("$destroy", bindonceController.removeWatcher);
			}
		}
	};
});

angular.forEach({
	'boShow' : 'show',
	'boHide' : 'hide',
	'boClass' : 'class',
	'boText' : 'text',
	'boHtml' : 'html',
	'boSrc' : 'src',
	'boHref' : 'href',
	'boAlt' : 'alt',
	'boTitle' : 'title',
	'boId' : 'id',
	'boStyle' : 'style',
	'boValue' : 'value',
	'boData' : 'data'
},
function(tag, attribute)
{
	var childPriority = 200;
	return angular.module('pasvaz.bindonce').directive(attribute, function() 
	{
		return { 
			priority: childPriority,
			require: '^bindonce', 
			link: function(scope, elm, attrs, bindonceController)
			{
				var name = attrs.boParent;
				if (name && bindonceController.group != name)
				{
					var element = bindonceController.element.parent();
					bindonceController = undefined;
					var parentValue;

					while (element[0].nodeType != 9 && element.length)
					{
						if ((parentValue = element.data('$bindonceController')) 
							&& parentValue.group == name)
						{
							bindonceController = parentValue
							break;
						}
						element = element.parent();
					}
					if (!bindonceController)
					{
						throw Error("No bindonce controller: " + name);
					}
				}
				bindonceController.addBinder({element: elm, attr:tag, value: attrs[attribute], group: name, attrs:attrs});
			}
		}
	});
});

},{}],18:[function(require,module,exports){
/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.6",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.6",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.6",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.6",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.6",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.6",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");
d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.6",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
},{}],19:[function(require,module,exports){
angular.module("YourApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("pages/create.html",
    "<section id=\"create\" bindonce=\"some.model.object\">\r" +
    "\n" +
    "    <h4>'Sup? HEY! This is the template for Contact Creation</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <div class=\"col-sm-6 text-center\">\r" +
    "\n" +
    "                <h1>\r" +
    "\n" +
    "                    Psst! Hey kid, wanna create some Contacts?\r" +
    "\n" +
    "                </h1>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <form novalidate \r" +
    "\n" +
    "              name=\"createForm\" \r" +
    "\n" +
    "              class=\"form-inline col-sm-6 creating-form\" \r" +
    "\n" +
    "              ng-submit=submit()>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Name\">Name</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\" \r" +
    "\n" +
    "                       ng-model=\"name\"\r" +
    "\n" +
    "                       id=\"Name\" \r" +
    "\n" +
    "                       placeholder=\"Here goes the Name...\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"LastName\">Last Name</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\" \r" +
    "\n" +
    "                       ng-model=\"lastname\"\r" +
    "\n" +
    "                       id=\"LastName\" \r" +
    "\n" +
    "                       placeholder=\"And the Last Name here\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button type=\"submit\" id=\"createBtn\" class=\"btn btn-default\">Create it!</button>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</section>"
  );

  $templateCache.put("pages/edit.html",
    "<section id=\"edit\" bindonce=\"some.model.object\">\r" +
    "\n" +
    "    <h4>'Sup? This is the template for the Contact Edition</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <div class=\"col-sm-6 text-center\">\r" +
    "\n" +
    "                <h1>\r" +
    "\n" +
    "                    Dude! That entry looks weird, wanna change it?\r" +
    "\n" +
    "                </h1>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <form novalidate class=\"form-inline col-sm-6 editing-form\" ng-submit=submit()>\r" +
    "\n" +
    "            <div class=\"row text-center\">\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Id\">Id</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\" \r" +
    "\n" +
    "                       id=\"id\" \r" +
    "\n" +
    "                       ng-model=\"id\"\r" +
    "\n" +
    "                       placeholder=\"The Id goes here, please\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Name\">Name</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\" \r" +
    "\n" +
    "                       id=\"name\" \r" +
    "\n" +
    "                       ng-model=\"name\"\r" +
    "\n" +
    "                       placeholder=\"Here goes the Name...\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"LastName\">Last Name</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\" \r" +
    "\n" +
    "                       id=\"lastName\" \r" +
    "\n" +
    "                       ng-model=\"lastname\"\r" +
    "\n" +
    "                       placeholder=\"And the Last Name here\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button type=\"submit\" class=\"btn btn-default\">Change it!</button>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- \r" +
    "\n" +
    "    *\r" +
    "\n" +
    "    * Here goes the Edit\r" +
    "\n" +
    "    * \r" +
    "\n" +
    "     -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</section>"
  );

  $templateCache.put("pages/home.html",
    "<section id=\"home\" bindonce=\"some.model.object\">\n" +
    "\t<h4>'Sup? HEY! This is the template for the Home</h4>\n" +
    "\n" +
    "\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-6 text-center\">\n" +
    "                <h1>\n" +
    "                    So, here's the Contact list:\n" +
    "                </h1>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row col-sm-8\">\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th>Id</th>\n" +
    "                    <th>Name</th>\n" +
    "                    <th>Last Name</th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"contact in contacts\">\n" +
    "                    <td>{{contact.Id}}</td>\n" +
    "                    <td>{{contact.FirstName}}</td>\n" +
    "                    <td>{{contact.LastName}}</td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</section>\n"
  );

  $templateCache.put("pages/login.html",
    "<section id=\"login\" bindonce=\"some.model.object\">\r" +
    "\n" +
    "    <div class=\"container row\">\r" +
    "\n" +
    "        <div class=\"col-sm-6 push-sm-3 text-center\">\r" +
    "\n" +
    "            <h1>Ammmm... Who are you?</h1>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"container row\">\r" +
    "\n" +
    "        <form novalidate name=\"loginForm\" class=\"form-inline col-sm-6 login-form\" ng-submit=submit()>   \r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Username\">Username</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\"\r" +
    "\n" +
    "                       ng-model=\"username\" \r" +
    "\n" +
    "                       id=\"username\" \r" +
    "\n" +
    "                       placeholder=\"Your username, please\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Password\">Password</label>\r" +
    "\n" +
    "                <input type=\"password\"\r" +
    "\n" +
    "                       class=\"form-control\"\r" +
    "\n" +
    "                       ng-model=\"password\"\r" +
    "\n" +
    "                       id=\"password\" \r" +
    "\n" +
    "                       placeholder=\"••••••••••••\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <button id=\"login-btn\" \r" +
    "\n" +
    "                    type=\"submit\" \r" +
    "\n" +
    "                    class=\"btn btn-default pull-right\">\r" +
    "\n" +
    "                      Log in!\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</section>"
  );

  $templateCache.put("some-directive.html",
    "<section bindonce=\"some.model.object\">\n" +
    "\n" +
    "</section>\n"
  );

}]);

},{}]},{},[14])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9saWIvYW5ndWxhci1yb3V0ZS5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2FwcC5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2NvbnRyb2xsZXJzLmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvY29udHJvbGxlcnMvQ3JlYXRlQ29udHJvbGxlci5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2NvbnRyb2xsZXJzL0VkaXRDb250cm9sbGVyLmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJDOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9jb250cm9sbGVycy9Mb2dpbkNvbnRyb2xsZXIuanMiLCJDOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9kaXJlY3RpdmVzLmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZGlyZWN0aXZlcy9zb21lRGlyZWN0aXZlLmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmFjdG9yaWVzLmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmFjdG9yaWVzL3NvbWVGYWN0b3J5LmpzIiwiQzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmlsdGVycy5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2ZpbHRlcnMvZmlsdGVycy5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL21haW4uanMiLCJDOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9zZXJ2aWNlcy5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL3NlcnZpY2VzL2hlbHBlci5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL3ZlbmRvci9iaW5kb25jZS5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9zdHlsZXMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcyIsIkM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXJKUyB2MS4yLjE2XG4gKiAoYykgMjAxMC0yMDE0IEdvb2dsZSwgSW5jLiBodHRwOi8vYW5ndWxhcmpzLm9yZ1xuICogTGljZW5zZTogTUlUXG4gKi9cbihmdW5jdGlvbih3aW5kb3csIGFuZ3VsYXIsIHVuZGVmaW5lZCkgeyd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ1JvdXRlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAjIG5nUm91dGVcbiAqXG4gKiBUaGUgYG5nUm91dGVgIG1vZHVsZSBwcm92aWRlcyByb3V0aW5nIGFuZCBkZWVwbGlua2luZyBzZXJ2aWNlcyBhbmQgZGlyZWN0aXZlcyBmb3IgYW5ndWxhciBhcHBzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZSAkcm91dGV9IGZvciBhbiBleGFtcGxlIG9mIGNvbmZpZ3VyaW5nIGFuZCB1c2luZyBgbmdSb3V0ZWAuXG4gKlxuICpcbiAqIDxkaXYgZG9jLW1vZHVsZS1jb21wb25lbnRzPVwibmdSb3V0ZVwiPjwvZGl2PlxuICovXG4gLyogZ2xvYmFsIC1uZ1JvdXRlTW9kdWxlICovXG52YXIgbmdSb3V0ZU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlJywgWyduZyddKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyKCckcm91dGUnLCAkUm91dGVQcm92aWRlcik7XG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkcm91dGVQcm92aWRlclxuICogQGZ1bmN0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVXNlZCBmb3IgY29uZmlndXJpbmcgcm91dGVzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZSAkcm91dGV9IGZvciBhbiBleGFtcGxlIG9mIGNvbmZpZ3VyaW5nIGFuZCB1c2luZyBgbmdSb3V0ZWAuXG4gKlxuICogIyMgRGVwZW5kZW5jaWVzXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICovXG5mdW5jdGlvbiAkUm91dGVQcm92aWRlcigpe1xuICBmdW5jdGlvbiBpbmhlcml0KHBhcmVudCwgZXh0cmEpIHtcbiAgICByZXR1cm4gYW5ndWxhci5leHRlbmQobmV3IChhbmd1bGFyLmV4dGVuZChmdW5jdGlvbigpIHt9LCB7cHJvdG90eXBlOnBhcmVudH0pKSgpLCBleHRyYSk7XG4gIH1cblxuICB2YXIgcm91dGVzID0ge307XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjd2hlblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBSb3V0ZSBwYXRoIChtYXRjaGVkIGFnYWluc3QgYCRsb2NhdGlvbi5wYXRoYCkuIElmIGAkbG9jYXRpb24ucGF0aGBcbiAgICogICAgY29udGFpbnMgcmVkdW5kYW50IHRyYWlsaW5nIHNsYXNoIG9yIGlzIG1pc3Npbmcgb25lLCB0aGUgcm91dGUgd2lsbCBzdGlsbCBtYXRjaCBhbmQgdGhlXG4gICAqICAgIGAkbG9jYXRpb24ucGF0aGAgd2lsbCBiZSB1cGRhdGVkIHRvIGFkZCBvciBkcm9wIHRoZSB0cmFpbGluZyBzbGFzaCB0byBleGFjdGx5IG1hdGNoIHRoZVxuICAgKiAgICByb3V0ZSBkZWZpbml0aW9uLlxuICAgKlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uOiBlLmcuIGA6bmFtZWAuIEFsbCBjaGFyYWN0ZXJzIHVwXG4gICAqICAgICAgICB0byB0aGUgbmV4dCBzbGFzaCBhcmUgbWF0Y2hlZCBhbmQgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb24gYW5kIGVuZGluZyB3aXRoIGEgc3RhcjpcbiAgICogICAgICAgIGUuZy5gOm5hbWUqYC4gQWxsIGNoYXJhY3RlcnMgYXJlIGVhZ2VybHkgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG9wdGlvbmFsIG5hbWVkIGdyb3VwcyB3aXRoIGEgcXVlc3Rpb24gbWFyazogZS5nLmA6bmFtZT9gLlxuICAgKlxuICAgKiAgICBGb3IgZXhhbXBsZSwgcm91dGVzIGxpa2UgYC9jb2xvci86Y29sb3IvbGFyZ2Vjb2RlLzpsYXJnZWNvZGUqXFwvZWRpdGAgd2lsbCBtYXRjaFxuICAgKiAgICBgL2NvbG9yL2Jyb3duL2xhcmdlY29kZS9jb2RlL3dpdGgvc2xhc2hlcy9lZGl0YCBhbmQgZXh0cmFjdDpcbiAgICpcbiAgICogICAgKiBgY29sb3I6IGJyb3duYFxuICAgKiAgICAqIGBsYXJnZWNvZGU6IGNvZGUvd2l0aC9zbGFzaGVzYC5cbiAgICpcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJvdXRlIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YCBvbiByb3V0ZVxuICAgKiAgICBtYXRjaC5cbiAgICpcbiAgICogICAgT2JqZWN0IHByb3BlcnRpZXM6XG4gICAqXG4gICAqICAgIC0gYGNvbnRyb2xsZXJgIOKAkyBgeyhzdHJpbmd8ZnVuY3Rpb24oKT19YCDigJMgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgICBuZXdseSBjcmVhdGVkIHNjb3BlIG9yIHRoZSBuYW1lIG9mIGEge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbnRyb2xsZXIgcmVnaXN0ZXJlZFxuICAgKiAgICAgIGNvbnRyb2xsZXJ9IGlmIHBhc3NlZCBhcyBhIHN0cmluZy5cbiAgICogICAgLSBgY29udHJvbGxlckFzYCDigJMgYHtzdHJpbmc9fWAg4oCTIEEgY29udHJvbGxlciBhbGlhcyBuYW1lLiBJZiBwcmVzZW50IHRoZSBjb250cm9sbGVyIHdpbGwgYmVcbiAgICogICAgICBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGBjb250cm9sbGVyQXNgIG5hbWUuXG4gICAqICAgIC0gYHRlbXBsYXRlYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqICAgICAgcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSB1c2VkIGJ5IHtAbGlua1xuICAgKiAgICAgIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IG9yIHtAbGluayBuZy5kaXJlY3RpdmU6bmdJbmNsdWRlIG5nSW5jbHVkZX0gZGlyZWN0aXZlcy5cbiAgICogICAgICBUaGlzIHByb3BlcnR5IHRha2VzIHByZWNlZGVuY2Ugb3ZlciBgdGVtcGxhdGVVcmxgLlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgLSBgdGVtcGxhdGVVcmxgIOKAkyBge3N0cmluZz18ZnVuY3Rpb24oKT19YCDigJMgcGF0aCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXRoIHRvIGFuIGh0bWxcbiAgICogICAgICB0ZW1wbGF0ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGJ5IHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fS5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVVcmxgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHJlc29sdmVgIC0gYHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+PX1gIC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBzaG91bGRcbiAgICogICAgICBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBJZiBhbnkgb2YgdGhlc2UgZGVwZW5kZW5jaWVzIGFyZSBwcm9taXNlcywgdGhlIHJvdXRlclxuICAgKiAgICAgIHdpbGwgd2FpdCBmb3IgdGhlbSBhbGwgdG8gYmUgcmVzb2x2ZWQgb3Igb25lIHRvIGJlIHJlamVjdGVkIGJlZm9yZSB0aGUgY29udHJvbGxlciBpc1xuICAgKiAgICAgIGluc3RhbnRpYXRlZC5cbiAgICogICAgICBJZiBhbGwgdGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBzdWNjZXNzZnVsbHksIHRoZSB2YWx1ZXMgb2YgdGhlIHJlc29sdmVkIHByb21pc2VzIGFyZVxuICAgKiAgICAgIGluamVjdGVkIGFuZCB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2VzcyAkcm91dGVDaGFuZ2VTdWNjZXNzfSBldmVudCBpc1xuICAgKiAgICAgIGZpcmVkLiBJZiBhbnkgb2YgdGhlIHByb21pc2VzIGFyZSByZWplY3RlZCB0aGVcbiAgICogICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3IgJHJvdXRlQ2hhbmdlRXJyb3J9IGV2ZW50IGlzIGZpcmVkLiBUaGUgbWFwIG9iamVjdFxuICAgKiAgICAgIGlzOlxuICAgKlxuICAgKiAgICAgIC0gYGtleWAg4oCTIGB7c3RyaW5nfWA6IGEgbmFtZSBvZiBhIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci5cbiAgICogICAgICAtIGBmYWN0b3J5YCAtIGB7c3RyaW5nfGZ1bmN0aW9ufWA6IElmIGBzdHJpbmdgIHRoZW4gaXQgaXMgYW4gYWxpYXMgZm9yIGEgc2VydmljZS5cbiAgICogICAgICAgIE90aGVyd2lzZSBpZiBmdW5jdGlvbiwgdGhlbiBpdCBpcyB7QGxpbmsgYXV0by4kaW5qZWN0b3IjaW52b2tlIGluamVjdGVkfVxuICAgKiAgICAgICAgYW5kIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJlYXRlZCBhcyB0aGUgZGVwZW5kZW5jeS4gSWYgdGhlIHJlc3VsdCBpcyBhIHByb21pc2UsIGl0IGlzXG4gICAqICAgICAgICByZXNvbHZlZCBiZWZvcmUgaXRzIHZhbHVlIGlzIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIEJlIGF3YXJlIHRoYXRcbiAgICogICAgICAgIGBuZ1JvdXRlLiRyb3V0ZVBhcmFtc2Agd2lsbCBzdGlsbCByZWZlciB0byB0aGUgcHJldmlvdXMgcm91dGUgd2l0aGluIHRoZXNlIHJlc29sdmVcbiAgICogICAgICAgIGZ1bmN0aW9ucy4gIFVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSBwYXJhbWV0ZXJzLCBpbnN0ZWFkLlxuICAgKlxuICAgKiAgICAtIGByZWRpcmVjdFRvYCDigJMgeyhzdHJpbmd8ZnVuY3Rpb24oKSk9fSDigJMgdmFsdWUgdG8gdXBkYXRlXG4gICAqICAgICAge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IHBhdGggd2l0aCBhbmQgdHJpZ2dlciByb3V0ZSByZWRpcmVjdGlvbi5cbiAgICpcbiAgICogICAgICBJZiBgcmVkaXJlY3RUb2AgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge09iamVjdC48c3RyaW5nPn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlVXJsLlxuICAgKiAgICAgIC0gYHtzdHJpbmd9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5wYXRoKClgXG4gICAqICAgICAgLSBge09iamVjdH1gIC0gY3VycmVudCBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKlxuICAgKiAgICAgIFRoZSBjdXN0b20gYHJlZGlyZWN0VG9gIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIHJldHVybiBhIHN0cmluZyB3aGljaCB3aWxsIGJlIHVzZWRcbiAgICogICAgICB0byB1cGRhdGUgYCRsb2NhdGlvbi5wYXRoKClgIGFuZCBgJGxvY2F0aW9uLnNlYXJjaCgpYC5cbiAgICpcbiAgICogICAgLSBgW3JlbG9hZE9uU2VhcmNoPXRydWVdYCAtIHtib29sZWFuPX0gLSByZWxvYWQgcm91dGUgd2hlbiBvbmx5IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqICAgICAgb3IgYCRsb2NhdGlvbi5oYXNoKClgIGNoYW5nZXMuXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYGZhbHNlYCBhbmQgdXJsIGluIHRoZSBicm93c2VyIGNoYW5nZXMsIHRoZW5cbiAgICogICAgICBgJHJvdXRlVXBkYXRlYCBldmVudCBpcyBicm9hZGNhc3RlZCBvbiB0aGUgcm9vdCBzY29wZS5cbiAgICpcbiAgICogICAgLSBgW2Nhc2VJbnNlbnNpdGl2ZU1hdGNoPWZhbHNlXWAgLSB7Ym9vbGVhbj19IC0gbWF0Y2ggcm91dGVzIHdpdGhvdXQgYmVpbmcgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogICAgICBJZiB0aGUgb3B0aW9uIGlzIHNldCB0byBgdHJ1ZWAsIHRoZW4gdGhlIHBhcnRpY3VsYXIgcm91dGUgY2FuIGJlIG1hdGNoZWQgd2l0aG91dCBiZWluZ1xuICAgKiAgICAgIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgcm91dGUgZGVmaW5pdGlvbiB0byB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAgICovXG4gIHRoaXMud2hlbiA9IGZ1bmN0aW9uKHBhdGgsIHJvdXRlKSB7XG4gICAgcm91dGVzW3BhdGhdID0gYW5ndWxhci5leHRlbmQoXG4gICAgICB7cmVsb2FkT25TZWFyY2g6IHRydWV9LFxuICAgICAgcm91dGUsXG4gICAgICBwYXRoICYmIHBhdGhSZWdFeHAocGF0aCwgcm91dGUpXG4gICAgKTtcblxuICAgIC8vIGNyZWF0ZSByZWRpcmVjdGlvbiBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgIGlmIChwYXRoKSB7XG4gICAgICB2YXIgcmVkaXJlY3RQYXRoID0gKHBhdGhbcGF0aC5sZW5ndGgtMV0gPT0gJy8nKVxuICAgICAgICAgICAgPyBwYXRoLnN1YnN0cigwLCBwYXRoLmxlbmd0aC0xKVxuICAgICAgICAgICAgOiBwYXRoICsnLyc7XG5cbiAgICAgIHJvdXRlc1tyZWRpcmVjdFBhdGhdID0gYW5ndWxhci5leHRlbmQoXG4gICAgICAgIHtyZWRpcmVjdFRvOiBwYXRofSxcbiAgICAgICAgcGF0aFJlZ0V4cChyZWRpcmVjdFBhdGgsIHJvdXRlKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAgLyoqXG4gICAgKiBAcGFyYW0gcGF0aCB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0gb3B0cyB7T2JqZWN0fSBvcHRpb25zXG4gICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICpcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogTm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgKiBhbmQgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAgKlxuICAgICogSW5zcGlyZWQgYnkgcGF0aFJleHAgaW4gdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvdXRpbHMuanMuXG4gICAgKi9cbiAgZnVuY3Rpb24gcGF0aFJlZ0V4cChwYXRoLCBvcHRzKSB7XG4gICAgdmFyIGluc2Vuc2l0aXZlID0gb3B0cy5jYXNlSW5zZW5zaXRpdmVNYXRjaCxcbiAgICAgICAgcmV0ID0ge1xuICAgICAgICAgIG9yaWdpbmFsUGF0aDogcGF0aCxcbiAgICAgICAgICByZWdleHA6IHBhdGhcbiAgICAgICAgfSxcbiAgICAgICAga2V5cyA9IHJldC5rZXlzID0gW107XG5cbiAgICBwYXRoID0gcGF0aFxuICAgICAgLnJlcGxhY2UoLyhbKCkuXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/OihcXHcrKShbXFw/XFwqXSk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBrZXksIG9wdGlvbil7XG4gICAgICAgIHZhciBvcHRpb25hbCA9IG9wdGlvbiA9PT0gJz8nID8gb3B0aW9uIDogbnVsbDtcbiAgICAgICAgdmFyIHN0YXIgPSBvcHRpb24gPT09ICcqJyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIGtleXMucHVzaCh7IG5hbWU6IGtleSwgb3B0aW9uYWw6ICEhb3B0aW9uYWwgfSk7XG4gICAgICAgIHNsYXNoID0gc2xhc2ggfHwgJyc7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gJycgOiBzbGFzaClcbiAgICAgICAgICArICcoPzonXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyBzbGFzaCA6ICcnKVxuICAgICAgICAgICsgKHN0YXIgJiYgJyguKz8pJyB8fCAnKFteL10rKScpXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpXG4gICAgICAgICAgKyAnKSdcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJyk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyhbXFwvJFxcKl0pL2csICdcXFxcJDEnKTtcblxuICAgIHJldC5yZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAnJCcsIGluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciNvdGhlcndpc2VcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgcm91dGUgZGVmaW5pdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCBvbiByb3V0ZSBjaGFuZ2Ugd2hlbiBubyBvdGhlciByb3V0ZSBkZWZpbml0aW9uXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqL1xuICB0aGlzLm90aGVyd2lzZSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHRoaXMud2hlbihudWxsLCBwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgdGhpcy4kZ2V0ID0gWyckcm9vdFNjb3BlJyxcbiAgICAgICAgICAgICAgICckbG9jYXRpb24nLFxuICAgICAgICAgICAgICAgJyRyb3V0ZVBhcmFtcycsXG4gICAgICAgICAgICAgICAnJHEnLFxuICAgICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICAgICAnJGh0dHAnLFxuICAgICAgICAgICAgICAgJyR0ZW1wbGF0ZUNhY2hlJyxcbiAgICAgICAgICAgICAgICckc2NlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCAkcSwgJGluamVjdG9yLCAkaHR0cCwgJHRlbXBsYXRlQ2FjaGUsICRzY2UpIHtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBzZXJ2aWNlXG4gICAgICogQG5hbWUgJHJvdXRlXG4gICAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgICAqIEByZXF1aXJlcyAkcm91dGVQYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50IFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqIFRoZSByb3V0ZSBkZWZpbml0aW9uIGNvbnRhaW5zOlxuICAgICAqXG4gICAgICogICAtIGBjb250cm9sbGVyYDogVGhlIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgYXMgZGVmaW5lIGluIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICogICAtIGBsb2NhbHNgOiBBIG1hcCBvZiBsb2NhbHMgd2hpY2ggaXMgdXNlZCBieSB7QGxpbmsgbmcuJGNvbnRyb2xsZXIgJGNvbnRyb2xsZXJ9IHNlcnZpY2UgZm9yXG4gICAgICogICAgIGNvbnRyb2xsZXIgaW5zdGFudGlhdGlvbi4gVGhlIGBsb2NhbHNgIGNvbnRhaW5cbiAgICAgKiAgICAgdGhlIHJlc29sdmVkIHZhbHVlcyBvZiB0aGUgYHJlc29sdmVgIG1hcC4gQWRkaXRpb25hbGx5IHRoZSBgbG9jYWxzYCBhbHNvIGNvbnRhaW46XG4gICAgICpcbiAgICAgKiAgICAgLSBgJHNjb3BlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHNjb3BlLlxuICAgICAqICAgICAtIGAkdGVtcGxhdGVgIC0gVGhlIGN1cnJlbnQgcm91dGUgdGVtcGxhdGUgSFRNTC5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSByb3V0ZXMgT2JqZWN0IHdpdGggYWxsIHJvdXRlIGNvbmZpZ3VyYXRpb24gT2JqZWN0cyBhcyBpdHMgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIGAkcm91dGVgIGlzIHVzZWQgZm9yIGRlZXAtbGlua2luZyBVUkxzIHRvIGNvbnRyb2xsZXJzIGFuZCB2aWV3cyAoSFRNTCBwYXJ0aWFscykuXG4gICAgICogSXQgd2F0Y2hlcyBgJGxvY2F0aW9uLnVybCgpYCBhbmQgdHJpZXMgdG8gbWFwIHRoZSBwYXRoIHRvIGFuIGV4aXN0aW5nIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICAgICAqXG4gICAgICogWW91IGNhbiBkZWZpbmUgcm91dGVzIHRocm91Z2gge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9J3MgQVBJLlxuICAgICAqXG4gICAgICogVGhlIGAkcm91dGVgIHNlcnZpY2UgaXMgdHlwaWNhbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IGBuZ1ZpZXdgfSBkaXJlY3RpdmUgYW5kIHRoZVxuICAgICAqIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVBhcmFtcyBgJHJvdXRlUGFyYW1zYH0gc2VydmljZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyBjaGFuZ2luZyB0aGUgVVJMIGhhc2ggY2F1c2VzIHRoZSBgJHJvdXRlYCB0byBtYXRjaCBhIHJvdXRlIGFnYWluc3QgdGhlXG4gICAgICogVVJMLCBhbmQgdGhlIGBuZ1ZpZXdgIHB1bGxzIGluIHRoZSBwYXJ0aWFsLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IHRoaXMgZXhhbXBsZSBpcyB1c2luZyB7QGxpbmsgbmcuZGlyZWN0aXZlOnNjcmlwdCBpbmxpbmVkIHRlbXBsYXRlc31cbiAgICAgKiB0byBnZXQgaXQgd29ya2luZyBvbiBqc2ZpZGRsZSBhcyB3ZWxsLlxuICAgICAqXG4gICAgICogPGV4YW1wbGUgbmFtZT1cIiRyb3V0ZS1zZXJ2aWNlXCIgbW9kdWxlPVwibmdSb3V0ZUV4YW1wbGVcIlxuICAgICAqICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICogICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5Db250cm9sbGVyXCI+XG4gICAgICogICAgICAgQ2hvb3NlOlxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxkaXYgbmctdmlldz48L2Rpdj5cbiAgICAgKlxuICAgICAqICAgICAgIDxociAvPlxuICAgICAqXG4gICAgICogICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3skbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3skcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7eyRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3skcm91dGUuY3VycmVudC5zY29wZS5uYW1lfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7JHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgKiAgICAgPC9kaXY+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAqICAgICBjb250cm9sbGVyOiB7e25hbWV9fTxiciAvPlxuICAgICAqICAgICBCb29rIElkOiB7e3BhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAqICAgICBDaGFwdGVyIElkOiB7e3BhcmFtcy5jaGFwdGVySWR9fVxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICogICAgIGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlRXhhbXBsZScsIFsnbmdSb3V0ZSddKVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJHJvdXRlID0gJHJvdXRlO1xuICAgICAqICAgICAgICAgICRzY29wZS4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdCb29rQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkJvb2tDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkNoYXB0ZXJDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgKiAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAqICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ29udHJvbGxlcicsXG4gICAgICogICAgICAgICByZXNvbHZlOiB7XG4gICAgICogICAgICAgICAgIC8vIEkgd2lsbCBjYXVzZSBhIDEgc2Vjb25kIGRlbGF5XG4gICAgICogICAgICAgICAgIGRlbGF5OiBmdW5jdGlvbigkcSwgJHRpbWVvdXQpIHtcbiAgICAgKiAgICAgICAgICAgICB2YXIgZGVsYXkgPSAkcS5kZWZlcigpO1xuICAgICAqICAgICAgICAgICAgICR0aW1lb3V0KGRlbGF5LnJlc29sdmUsIDEwMDApO1xuICAgICAqICAgICAgICAgICAgIHJldHVybiBkZWxheS5wcm9taXNlO1xuICAgICAqICAgICAgICAgICB9XG4gICAgICogICAgICAgICB9XG4gICAgICogICAgICAgfSlcbiAgICAgKiAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAqICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAqICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDb250cm9sbGVyJ1xuICAgICAqICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICogICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICogICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICogICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG4gICAgICpcbiAgICAgKiAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuICAgICAqXG4gICAgICogICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDb250cm9sbGVyLyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAqICAgICB9KTtcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKiA8L2V4YW1wbGU+XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3RhcnRcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYmVmb3JlIGEgcm91dGUgY2hhbmdlLiBBdCB0aGlzICBwb2ludCB0aGUgcm91dGUgc2VydmljZXMgc3RhcnRzXG4gICAgICogcmVzb2x2aW5nIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIG5lZWRlZCBmb3IgdGhlIHJvdXRlIGNoYW5nZSB0byBvY2N1ci5cbiAgICAgKiBUeXBpY2FsbHkgdGhpcyBpbnZvbHZlcyBmZXRjaGluZyB0aGUgdmlldyB0ZW1wbGF0ZSBhcyB3ZWxsIGFzIGFueSBkZXBlbmRlbmNpZXNcbiAgICAgKiBkZWZpbmVkIGluIGByZXNvbHZlYCByb3V0ZSBwcm9wZXJ0eS4gT25jZSAgYWxsIG9mIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHJlc29sdmVkXG4gICAgICogYCRyb3V0ZUNoYW5nZVN1Y2Nlc3NgIGlzIGZpcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IG5leHQgRnV0dXJlIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGFmdGVyIGEgcm91dGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZC5cbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gbGlzdGVucyBmb3IgdGhlIGRpcmVjdGl2ZVxuICAgICAqIHRvIGluc3RhbnRpYXRlIHRoZSBjb250cm9sbGVyIGFuZCByZW5kZXIgdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV8VW5kZWZpbmVkfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbiwgb3IgdW5kZWZpbmVkIGlmIGN1cnJlbnQgaXNcbiAgICAgKiBmaXJzdCByb3V0ZSBlbnRlcmVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGlmIGFueSBvZiB0aGUgcmVzb2x2ZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcmVqZWN0aW9uIFJlamVjdGlvbiBvZiB0aGUgcHJvbWlzZS4gVXN1YWxseSB0aGUgZXJyb3Igb2YgdGhlIGZhaWxlZCBwcm9taXNlLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZVVwZGF0ZVxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIFRoZSBgcmVsb2FkT25TZWFyY2hgIHByb3BlcnR5IGhhcyBiZWVuIHNldCB0byBmYWxzZSwgYW5kIHdlIGFyZSByZXVzaW5nIHRoZSBzYW1lXG4gICAgICogaW5zdGFuY2Ugb2YgdGhlIENvbnRyb2xsZXIuXG4gICAgICovXG5cbiAgICB2YXIgZm9yY2VSZWxvYWQgPSBmYWxzZSxcbiAgICAgICAgJHJvdXRlID0ge1xuICAgICAgICAgIHJvdXRlczogcm91dGVzLFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAqIEBuYW1lICRyb3V0ZSNyZWxvYWRcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAqIENhdXNlcyBgJHJvdXRlYCBzZXJ2aWNlIHRvIHJlbG9hZCB0aGUgY3VycmVudCByb3V0ZSBldmVuIGlmXG4gICAgICAgICAgICoge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IGhhc24ndCBjaGFuZ2VkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQXMgYSByZXN1bHQgb2YgdGhhdCwge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9XG4gICAgICAgICAgICogY3JlYXRlcyBuZXcgc2NvcGUsIHJlaW5zdGFudGlhdGVzIHRoZSBjb250cm9sbGVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3JjZVJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmModXBkYXRlUm91dGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgdXBkYXRlUm91dGUpO1xuXG4gICAgcmV0dXJuICRyb3V0ZTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb24ge3N0cmluZ30gY3VycmVudCB1cmxcbiAgICAgKiBAcGFyYW0gcm91dGUge09iamVjdH0gcm91dGUgcmVnZXhwIHRvIG1hdGNoIHRoZSB1cmwgYWdhaW5zdFxuICAgICAqIEByZXR1cm4gez9PYmplY3R9XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDaGVjayBpZiB0aGUgcm91dGUgbWF0Y2hlcyB0aGUgY3VycmVudCB1cmwuXG4gICAgICpcbiAgICAgKiBJbnNwaXJlZCBieSBtYXRjaCBpblxuICAgICAqIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3JvdXRlci9yb3V0ZXIuanMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3dpdGNoUm91dGVNYXRjaGVyKG9uLCByb3V0ZSkge1xuICAgICAgdmFyIGtleXMgPSByb3V0ZS5rZXlzLFxuICAgICAgICAgIHBhcmFtcyA9IHt9O1xuXG4gICAgICBpZiAoIXJvdXRlLnJlZ2V4cCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIHZhciBtID0gcm91dGUucmVnZXhwLmV4ZWMob24pO1xuICAgICAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICAgIHZhciB2YWwgPSAnc3RyaW5nJyA9PSB0eXBlb2YgbVtpXVxuICAgICAgICAgICAgICA/IGRlY29kZVVSSUNvbXBvbmVudChtW2ldKVxuICAgICAgICAgICAgICA6IG1baV07XG5cbiAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVJvdXRlKCkge1xuICAgICAgdmFyIG5leHQgPSBwYXJzZVJvdXRlKCksXG4gICAgICAgICAgbGFzdCA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICBpZiAobmV4dCAmJiBsYXN0ICYmIG5leHQuJCRyb3V0ZSA9PT0gbGFzdC4kJHJvdXRlXG4gICAgICAgICAgJiYgYW5ndWxhci5lcXVhbHMobmV4dC5wYXRoUGFyYW1zLCBsYXN0LnBhdGhQYXJhbXMpXG4gICAgICAgICAgJiYgIW5leHQucmVsb2FkT25TZWFyY2ggJiYgIWZvcmNlUmVsb2FkKSB7XG4gICAgICAgIGxhc3QucGFyYW1zID0gbmV4dC5wYXJhbXM7XG4gICAgICAgIGFuZ3VsYXIuY29weShsYXN0LnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVVcGRhdGUnLCBsYXN0KTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dCB8fCBsYXN0KSB7XG4gICAgICAgIGZvcmNlUmVsb2FkID0gZmFsc2U7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3RhcnQnLCBuZXh0LCBsYXN0KTtcbiAgICAgICAgJHJvdXRlLmN1cnJlbnQgPSBuZXh0O1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIGlmIChuZXh0LnJlZGlyZWN0VG8pIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG5leHQucmVkaXJlY3RUbykpIHtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoaW50ZXJwb2xhdGUobmV4dC5yZWRpcmVjdFRvLCBuZXh0LnBhcmFtcykpLnNlYXJjaChuZXh0LnBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi51cmwobmV4dC5yZWRpcmVjdFRvKG5leHQucGF0aFBhcmFtcywgJGxvY2F0aW9uLnBhdGgoKSwgJGxvY2F0aW9uLnNlYXJjaCgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkcS53aGVuKG5leHQpLlxuICAgICAgICAgIHRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB2YXIgbG9jYWxzID0gYW5ndWxhci5leHRlbmQoe30sIG5leHQucmVzb2x2ZSksXG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSwgdGVtcGxhdGVVcmw7XG5cbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxvY2FscywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIGxvY2Fsc1trZXldID0gYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkgP1xuICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KHZhbHVlKSA6ICRpbmplY3Rvci5pbnZva2UodmFsdWUpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUgPSBuZXh0LnRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlKG5leHQucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwgPSBuZXh0LnRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsKG5leHQucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSAkc2NlLmdldFRydXN0ZWRSZXNvdXJjZVVybCh0ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgbmV4dC5sb2FkZWRUZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsO1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSAkaHR0cC5nZXQodGVtcGxhdGVVcmwsIHtjYWNoZTogJHRlbXBsYXRlQ2FjaGV9KS5cbiAgICAgICAgICAgICAgICAgICAgICB0aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5kYXRhOyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGxvY2Fsc1snJHRlbXBsYXRlJ10gPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKGxvY2Fscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuXG4gICAgICAgICAgLy8gYWZ0ZXIgcm91dGUgY2hhbmdlXG4gICAgICAgICAgdGhlbihmdW5jdGlvbihsb2NhbHMpIHtcbiAgICAgICAgICAgIGlmIChuZXh0ID09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgbmV4dC5sb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KG5leHQucGFyYW1zLCAkcm91dGVQYXJhbXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3VjY2VzcycsIG5leHQsIGxhc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAobmV4dCA9PSAkcm91dGUuY3VycmVudCkge1xuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZUVycm9yJywgbmV4dCwgbGFzdCwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge09iamVjdH0gdGhlIGN1cnJlbnQgYWN0aXZlIHJvdXRlLCBieSBtYXRjaGluZyBpdCBhZ2FpbnN0IHRoZSBVUkxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVJvdXRlKCkge1xuICAgICAgLy8gTWF0Y2ggYSByb3V0ZVxuICAgICAgdmFyIHBhcmFtcywgbWF0Y2g7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocm91dGVzLCBmdW5jdGlvbihyb3V0ZSwgcGF0aCkge1xuICAgICAgICBpZiAoIW1hdGNoICYmIChwYXJhbXMgPSBzd2l0Y2hSb3V0ZU1hdGNoZXIoJGxvY2F0aW9uLnBhdGgoKSwgcm91dGUpKSkge1xuICAgICAgICAgIG1hdGNoID0gaW5oZXJpdChyb3V0ZSwge1xuICAgICAgICAgICAgcGFyYW1zOiBhbmd1bGFyLmV4dGVuZCh7fSwgJGxvY2F0aW9uLnNlYXJjaCgpLCBwYXJhbXMpLFxuICAgICAgICAgICAgcGF0aFBhcmFtczogcGFyYW1zfSk7XG4gICAgICAgICAgbWF0Y2guJCRyb3V0ZSA9IHJvdXRlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIE5vIHJvdXRlIG1hdGNoZWQ7IGZhbGxiYWNrIHRvIFwib3RoZXJ3aXNlXCIgcm91dGVcbiAgICAgIHJldHVybiBtYXRjaCB8fCByb3V0ZXNbbnVsbF0gJiYgaW5oZXJpdChyb3V0ZXNbbnVsbF0sIHtwYXJhbXM6IHt9LCBwYXRoUGFyYW1zOnt9fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGlvbiBvZiB0aGUgcmVkaXJlY3QgcGF0aCB3aXRoIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyaW5nLCBwYXJhbXMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgoc3RyaW5nfHwnJykuc3BsaXQoJzonKSwgZnVuY3Rpb24oc2VnbWVudCwgaSkge1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWdtZW50TWF0Y2ggPSBzZWdtZW50Lm1hdGNoKC8oXFx3KykoLiopLyk7XG4gICAgICAgICAgdmFyIGtleSA9IHNlZ21lbnRNYXRjaFsxXTtcbiAgICAgICAgICByZXN1bHQucHVzaChwYXJhbXNba2V5XSk7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudE1hdGNoWzJdIHx8ICcnKTtcbiAgICAgICAgICBkZWxldGUgcGFyYW1zW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICB9XG4gIH1dO1xufVxuXG5uZ1JvdXRlTW9kdWxlLnByb3ZpZGVyKCckcm91dGVQYXJhbXMnLCAkUm91dGVQYXJhbXNQcm92aWRlcik7XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHJvdXRlUGFyYW1zXG4gKiBAcmVxdWlyZXMgJHJvdXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYCRyb3V0ZVBhcmFtc2Agc2VydmljZSBhbGxvd3MgeW91IHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldCBvZiByb3V0ZSBwYXJhbWV0ZXJzLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogVGhlIHJvdXRlIHBhcmFtZXRlcnMgYXJlIGEgY29tYmluYXRpb24gb2Yge0BsaW5rIG5nLiRsb2NhdGlvbiBgJGxvY2F0aW9uYH0nc1xuICoge0BsaW5rIG5nLiRsb2NhdGlvbiNzZWFyY2ggYHNlYXJjaCgpYH0gYW5kIHtAbGluayBuZy4kbG9jYXRpb24jcGF0aCBgcGF0aCgpYH0uXG4gKiBUaGUgYHBhdGhgIHBhcmFtZXRlcnMgYXJlIGV4dHJhY3RlZCB3aGVuIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgYCRyb3V0ZWB9IHBhdGggaXMgbWF0Y2hlZC5cbiAqXG4gKiBJbiBjYXNlIG9mIHBhcmFtZXRlciBuYW1lIGNvbGxpc2lvbiwgYHBhdGhgIHBhcmFtcyB0YWtlIHByZWNlZGVuY2Ugb3ZlciBgc2VhcmNoYCBwYXJhbXMuXG4gKlxuICogVGhlIHNlcnZpY2UgZ3VhcmFudGVlcyB0aGF0IHRoZSBpZGVudGl0eSBvZiB0aGUgYCRyb3V0ZVBhcmFtc2Agb2JqZWN0IHdpbGwgcmVtYWluIHVuY2hhbmdlZFxuICogKGJ1dCBpdHMgcHJvcGVydGllcyB3aWxsIGxpa2VseSBjaGFuZ2UpIGV2ZW4gd2hlbiBhIHJvdXRlIGNoYW5nZSBvY2N1cnMuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgJHJvdXRlUGFyYW1zYCBhcmUgb25seSB1cGRhdGVkICphZnRlciogYSByb3V0ZSBjaGFuZ2UgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAqIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2Fubm90IHJlbHkgb24gYCRyb3V0ZVBhcmFtc2AgYmVpbmcgY29ycmVjdCBpbiByb3V0ZSByZXNvbHZlIGZ1bmN0aW9ucy5cbiAqIEluc3RlYWQgeW91IGNhbiB1c2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUncyBwYXJhbWV0ZXJzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogIC8vIEdpdmVuOlxuICogIC8vIFVSTDogaHR0cDovL3NlcnZlci5jb20vaW5kZXguaHRtbCMvQ2hhcHRlci8xL1NlY3Rpb24vMj9zZWFyY2g9bW9ieVxuICogIC8vIFJvdXRlOiAvQ2hhcHRlci86Y2hhcHRlcklkL1NlY3Rpb24vOnNlY3Rpb25JZFxuICogIC8vXG4gKiAgLy8gVGhlblxuICogICRyb3V0ZVBhcmFtcyA9PT4ge2NoYXB0ZXJJZDoxLCBzZWN0aW9uSWQ6Miwgc2VhcmNoOidtb2J5J31cbiAqIGBgYFxuICovXG5mdW5jdGlvbiAkUm91dGVQYXJhbXNQcm92aWRlcigpIHtcbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfTtcbn1cblxubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZhY3RvcnkpO1xubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSk7XG5cblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSBuZ1ZpZXdcbiAqIEByZXN0cmljdCBFQ0FcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgT3ZlcnZpZXdcbiAqIGBuZ1ZpZXdgIGlzIGEgZGlyZWN0aXZlIHRoYXQgY29tcGxlbWVudHMgdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSAkcm91dGV9IHNlcnZpY2UgYnlcbiAqIGluY2x1ZGluZyB0aGUgcmVuZGVyZWQgdGVtcGxhdGUgb2YgdGhlIGN1cnJlbnQgcm91dGUgaW50byB0aGUgbWFpbiBsYXlvdXQgKGBpbmRleC5odG1sYCkgZmlsZS5cbiAqIEV2ZXJ5IHRpbWUgdGhlIGN1cnJlbnQgcm91dGUgY2hhbmdlcywgdGhlIGluY2x1ZGVkIHZpZXcgY2hhbmdlcyB3aXRoIGl0IGFjY29yZGluZyB0byB0aGVcbiAqIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBAYW5pbWF0aW9uc1xuICogZW50ZXIgLSBhbmltYXRpb24gaXMgdXNlZCB0byBicmluZyBuZXcgY29udGVudCBpbnRvIHRoZSBicm93c2VyLlxuICogbGVhdmUgLSBhbmltYXRpb24gaXMgdXNlZCB0byBhbmltYXRlIGV4aXN0aW5nIGNvbnRlbnQgYXdheS5cbiAqXG4gKiBUaGUgZW50ZXIgYW5kIGxlYXZlIGFuaW1hdGlvbiBvY2N1ciBjb25jdXJyZW50bHkuXG4gKlxuICogQHNjb3BlXG4gKiBAcHJpb3JpdHkgNDAwXG4gKiBAcGFyYW0ge3N0cmluZz19IG9ubG9hZCBFeHByZXNzaW9uIHRvIGV2YWx1YXRlIHdoZW5ldmVyIHRoZSB2aWV3IHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSBhdXRvc2Nyb2xsIFdoZXRoZXIgYG5nVmlld2Agc2hvdWxkIGNhbGwge0BsaW5rIG5nLiRhbmNob3JTY3JvbGxcbiAqICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbH0gdG8gc2Nyb2xsIHRoZSB2aWV3cG9ydCBhZnRlciB0aGUgdmlldyBpcyB1cGRhdGVkLlxuICpcbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBzZXQsIGRpc2FibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgc2V0IHdpdGhvdXQgdmFsdWUsIGVuYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gT3RoZXJ3aXNlIGVuYWJsZSBzY3JvbGxpbmcgb25seSBpZiB0aGUgYGF1dG9zY3JvbGxgIGF0dHJpYnV0ZSB2YWx1ZSBldmFsdWF0ZWRcbiAqICAgICAgICAgICAgICAgICAgICBhcyBhbiBleHByZXNzaW9uIHlpZWxkcyBhIHRydXRoeSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gICAgPGV4YW1wbGUgbmFtZT1cIm5nVmlldy1kaXJlY3RpdmVcIiBtb2R1bGU9XCJuZ1ZpZXdFeGFtcGxlXCJcbiAgICAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qczthbmd1bGFyLWFuaW1hdGUuanNcIlxuICAgICAgICAgICAgIGFuaW1hdGlvbnM9XCJ0cnVlXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5DdHJsIGFzIG1haW5cIj5cbiAgICAgICAgICBDaG9vc2U6XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieVwiPk1vYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5L2NoLzFcIj5Nb2J5OiBDaDE8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnlcIj5HYXRzYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnkvY2gvND9rZXk9dmFsdWVcIj5HYXRzYnk6IENoNDwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL1NjYXJsZXRcIj5TY2FybGV0IExldHRlcjwvYT48YnIvPlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXctYW5pbWF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgbmctdmlldyBjbGFzcz1cInZpZXctYW5pbWF0ZVwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxociAvPlxuXG4gICAgICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3ttYWluLiRsb2NhdGlvbi5wYXRoKCl9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmwgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnNjb3BlLm5hbWV9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlUGFyYW1zID0ge3ttYWluLiRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tib29rLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Ym9vay5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2NoYXB0ZXIubmFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tjaGFwdGVyLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICAgIENoYXB0ZXIgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJhbmltYXRpb25zLmNzc1wiPlxuICAgICAgICAudmlldy1hbmltYXRlLWNvbnRhaW5lciB7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgaGVpZ2h0OjEwMHB4IWltcG9ydGFudDtcbiAgICAgICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgICAgICBiYWNrZ3JvdW5kOndoaXRlO1xuICAgICAgICAgIGJvcmRlcjoxcHggc29saWQgYmxhY2s7XG4gICAgICAgICAgaGVpZ2h0OjQwcHg7XG4gICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZSB7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciwgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZSB7XG4gICAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOmFsbCBjdWJpYy1iZXppZXIoMC4yNTAsIDAuNDYwLCAwLjQ1MCwgMC45NDApIDEuNXM7XG4gICAgICAgICAgdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuXG4gICAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgIGJvcmRlci1sZWZ0OjFweCBzb2xpZCBibGFjaztcblxuICAgICAgICAgIHBvc2l0aW9uOmFic29sdXRlO1xuICAgICAgICAgIHRvcDowO1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgICByaWdodDowO1xuICAgICAgICAgIGJvdHRvbTowO1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIge1xuICAgICAgICAgIGxlZnQ6MTAwJTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLm5nLWVudGVyLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctbGVhdmUubmctbGVhdmUtYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0Oi0xMDAlO1xuICAgICAgICB9XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJzY3JpcHQuanNcIj5cbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ25nVmlld0V4YW1wbGUnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pXG4gICAgICAgICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoYXB0ZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRyb3V0ZScsICckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGUgPSAkcm91dGU7XG4gICAgICAgICAgICAgIHRoaXMuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQm9va0N0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJCb29rQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXB0ZXJDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiQ2hhcHRlckN0cmxcIjtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKTtcblxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG5cbiAgICAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuXG4gICAgICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAgICB9KTtcbiAgICAgIDwvZmlsZT5cbiAgICA8L2V4YW1wbGU+XG4gKi9cblxuXG4vKipcbiAqIEBuZ2RvYyBldmVudFxuICogQG5hbWUgbmdWaWV3IyR2aWV3Q29udGVudExvYWRlZFxuICogQGV2ZW50VHlwZSBlbWl0IG9uIHRoZSBjdXJyZW50IG5nVmlldyBzY29wZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIG5nVmlldyBjb250ZW50IGlzIHJlbG9hZGVkLlxuICovXG5uZ1ZpZXdGYWN0b3J5LiRpbmplY3QgPSBbJyRyb3V0ZScsICckYW5jaG9yU2Nyb2xsJywgJyRhbmltYXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGYWN0b3J5KCAgICRyb3V0ZSwgICAkYW5jaG9yU2Nyb2xsLCAgICRhbmltYXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAsXG4gICAgdHJhbnNjbHVkZTogJ2VsZW1lbnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgYXR0ciwgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRTY29wZSxcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50LFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHIuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIG9ubG9hZEV4cCA9IGF0dHIub25sb2FkIHx8ICcnO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZihwcmV2aW91c0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihjdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgJGFuaW1hdGUubGVhdmUoY3VycmVudEVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBjdXJyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgdmFyIGxvY2FscyA9ICRyb3V0ZS5jdXJyZW50ICYmICRyb3V0ZS5jdXJyZW50LmxvY2FscyxcbiAgICAgICAgICAgICAgdGVtcGxhdGUgPSBsb2NhbHMgJiYgbG9jYWxzLiR0ZW1wbGF0ZTtcblxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdTY29wZSA9IHNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgd2lsbCBhbHNvIGxpbmsgYWxsIGNoaWxkcmVuIG9mIG5nLXZpZXcgdGhhdCB3ZXJlIGNvbnRhaW5lZCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgIC8vIGh0bWwuIElmIHRoYXQgY29udGVudCBjb250YWlucyBjb250cm9sbGVycywgLi4uIHRoZXkgY291bGQgcG9sbHV0ZS9jaGFuZ2UgdGhlIHNjb3BlLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgdXNpbmcgbmctdmlldyBvbiBhbiBlbGVtZW50IHdpdGggYWRkaXRpb25hbCBjb250ZW50IGRvZXMgbm90IG1ha2Ugc2Vuc2UuLi5cbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGNhbid0IHJlbW92ZSB0aGVtIGluIHRoZSBjbG9uZUF0dGNoRm4gb2YgJHRyYW5zY2x1ZGUgYXMgdGhhdFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gaXMgY2FsbGVkIGJlZm9yZSBsaW5raW5nIHRoZSBjb250ZW50LCB3aGljaCB3b3VsZCBhcHBseSBjaGlsZFxuICAgICAgICAgICAgLy8gZGlyZWN0aXZlcyB0byBub24gZXhpc3RpbmcgZWxlbWVudHMuXG4gICAgICAgICAgICB2YXIgY2xvbmUgPSAkdHJhbnNjbHVkZShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgJGFuaW1hdGUuZW50ZXIoY2xvbmUsIG51bGwsIGN1cnJlbnRFbGVtZW50IHx8ICRlbGVtZW50LCBmdW5jdGlvbiBvbk5nVmlld0VudGVyICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cClcbiAgICAgICAgICAgICAgICAgICYmICghYXV0b1Njcm9sbEV4cCB8fCBzY29wZS4kZXZhbChhdXRvU2Nyb2xsRXhwKSkpIHtcbiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGNsb25lO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudC5zY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRlbWl0KCckdmlld0NvbnRlbnRMb2FkZWQnKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZXZhbChvbmxvYWRFeHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIFRoaXMgZGlyZWN0aXZlIGlzIGNhbGxlZCBkdXJpbmcgdGhlICR0cmFuc2NsdWRlIGNhbGwgb2YgdGhlIGZpcnN0IGBuZ1ZpZXdgIGRpcmVjdGl2ZS5cbi8vIEl0IHdpbGwgcmVwbGFjZSBhbmQgY29tcGlsZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSBsb2FkZWQgdGVtcGxhdGUuXG4vLyBXZSBuZWVkIHRoaXMgZGlyZWN0aXZlIHNvIHRoYXQgdGhlIGVsZW1lbnQgY29udGVudCBpcyBhbHJlYWR5IGZpbGxlZCB3aGVuXG4vLyB0aGUgbGluayBmdW5jdGlvbiBvZiBhbm90aGVyIGRpcmVjdGl2ZSBvbiB0aGUgc2FtZSBlbGVtZW50IGFzIG5nVmlld1xuLy8gaXMgY2FsbGVkLlxubmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5LiRpbmplY3QgPSBbJyRjb21waWxlJywgJyRjb250cm9sbGVyJywgJyRyb3V0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KCRjb21waWxlLCAkY29udHJvbGxlciwgJHJvdXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHByaW9yaXR5OiAtNDAwLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudCxcbiAgICAgICAgICBsb2NhbHMgPSBjdXJyZW50LmxvY2FscztcblxuICAgICAgJGVsZW1lbnQuaHRtbChsb2NhbHMuJHRlbXBsYXRlKTtcblxuICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlcikge1xuICAgICAgICBsb2NhbHMuJHNjb3BlID0gc2NvcGU7XG4gICAgICAgIHZhciBjb250cm9sbGVyID0gJGNvbnRyb2xsZXIoY3VycmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyQXMpIHtcbiAgICAgICAgICBzY29wZVtjdXJyZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG4gICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCkuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgbGluayhzY29wZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQXBwXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICB2YXIgQXBwID0gYW5ndWxhci5tb2R1bGUoJ1lvdXJBcHAnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbmdSb3V0ZScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bhc3Zhei5iaW5kb25jZScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRyb2xsZXJzJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRGlyZWN0aXZlcycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhY3RvcmllcycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZpbHRlcnMnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlcycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25nU2FuaXRpemUnXG4gICAgICAgIF0pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ09ORklHXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICBBcHAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCAnJHByb3ZpZGUnLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIsICRwcm92aWRlKSB7XG4gICAgICAgIFxuXHRcdC8qXG5cdFx0ICogRGF0YVJlc29sdmUgaXMgYSBmdW5jdGlvbiB0aGF0IGVuZHMgdXAgcmV0dXJuaW5nIGEgcHJvbWlzZS5cblx0XHQgKiBUaGlzIGZ1bmN0aW9uIGlzIHRoZW4gcGFzc2VkIHRvIGV2ZXJ5IHJvdXRlIHRoYXQgbmVlZHMgaXQuXG5cdCAgICAgKiBWaWV3cyB3b24ndCBiZSBsb2FkZWQgdW50aWwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQsIGFsbG93aW5nIHRvIFxuICAgICAgICAgKiBpbml0aWFsaXplIGRhdGEgd2l0aCBhIHJlcXVlc3QuXG5cdFx0Ki9cblxuICAgICAgICAvKlxuICAgICAgICAgKiBcIkhlbHBlclwiIGlzIGEgc2VydmljZSB3aXRoIGEgbWV0aG9kIHRoYXQgcmV0dXJucyBcbiAgICAgICAgICogYSBwcm9taXNlIHdoaWNoIGxvYWRzIHNvbWUgZGF0YSB3aGVuIHJlc29sdmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgLy8gdmFyIGRhdGFSZXNvbHZlID0gZnVuY3Rpb24oSGVscGVyLCAkcm91dGUpIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBIZWxwZXIuaGVscGVyTWV0aG9kKHBhcmFtMSwgcGFyYW0yKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9ob21lJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgICAgIC8vIHJlc29sdmU6IHt0ZWFtczogZGF0YVJlc29sdmV9XG4gICAgICAgIH0pO1xuXHRcdFxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvY3JlYXRlJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9jcmVhdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlQ29udHJvbGxlcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL2VkaXQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2VkaXQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdENvbnRyb2xsZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9lZGl0Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9lZGl0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRDb250cm9sbGVyJ1xuICAgICAgICB9KTsgICAgICAgIFxuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvI2xvZ2luJ1xuICAgICAgICAgICAgLy8gcmVzb2x2ZToge3RlYW1zOiBkYXRhUmVzb2x2ZX1cbiAgICAgICAgfSk7XG5cbiAgICB9XSk7XG59KSgpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0NvbnRyb2xsZXJzJywgW10pO1xuXG4vLyBBREQgRVZFUlkgQ09OVFJPTExFUiBZT1UgQ1JFQVRFIFRPIFRISVMgRklMRS4gRVg6XG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzJyk7XG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NyZWF0ZUNvbnRyb2xsZXIuanMnKTtcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMvRWRpdENvbnRyb2xsZXIuanMnKTtcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMvTG9naW5Db250cm9sbGVyLmpzJyk7IiwiYW5ndWxhci5tb2R1bGUoJ0NvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQ3JlYXRlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0hlbHBlcicsZnVuY3Rpb24gKCRzY29wZSwgSGVscGVyKSB7XG5cbiAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBDb250YWN0Q1JVRENvbnRyb2xsZXIuY3JlYXRlQ29udGFjdCgkc2NvcGUubmFtZSwgJHNjb3BlLmxhc3RuYW1lLCBjdXJyVXNlciwgY3VyclRva2VuLCBmdW5jdGlvbiAocmVzdWx0LCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMgJiYgcmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGFzdG5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnRG9uZSEnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUubmFtZSA9IG51bGw7IFxuICAgICAgICAgICAgJHNjb3BlLmxhc3RuYW1lID0gbnVsbDsgXG4gICAgICAgIH1cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnQ29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0hlbHBlcicsZnVuY3Rpb24gKCRzY29wZSwgSGVscGVyKSB7XG5cblxuICAgICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBDb250YWN0Q1JVRENvbnRyb2xsZXIuY3JlYXRlQ29udGFjdCgkc2NvcGUuaWQsICRzY29wZS5uYW1lLCAkc2NvcGUubGFzdG5hbWUsIGN1cnJVc2VyLCBjdXJyVG9rZW4sIGZ1bmN0aW9uIChyZXN1bHQsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cyAmJiByZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sYXN0bmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdEb25lIScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS5uYW1lID0gbnVsbDsgXG4gICAgICAgICAgICAkc2NvcGUubGFzdG5hbWUgPSBudWxsOyBcbiAgICAgICAgICAgICRzY29wZS5pZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnQ29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0hlbHBlcicsZnVuY3Rpb24gKCRzY29wZSwgSGVscGVyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbnRhY3RzID0gW107XG5cbiAgICAgICAgQ29udGFjdENSVURDb250cm9sbGVyLmxpc3RVc2VycyhjdXJyVXNlciwgY3VyclRva2VuLCBmdW5jdGlvbihyZXN1bHQsIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzICYmIHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbnRhY3RzID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY29udGFjdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgICAgICAgIFxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdDb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0hlbHBlcicsICckbG9jYXRpb24nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBIZWxwZXIsICRsb2NhdGlvbikge1xuXG4gICAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgYXV0aENvbnRyb2xsZXIudXNlckxvZ2luKCRzY29wZS51c2VybmFtZSwgJHNjb3BlLnBhc3N3b3JkLCBmdW5jdGlvbihyZXN1bHQsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cyAmJiByZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwibmF2XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJyk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJVc2VyID0gJHNjb3BlLnVzZXJuYW1lO1xuICAgICAgICAgICAgICAgICAgICBjdXJyVG9rZW4gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1tZW51XCIpLmlubmVySFRNTCA9IGN1cnJVc2VyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VybmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYXNzd29yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdZb3Ugc3VyZSB0aG9zZSBhcmUgeW91ciBjcmVkZW50aWFscz8nKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0RpcmVjdGl2ZXMnLCBbXSk7XG5cbi8vIEFERCBFVkVSWSBESVJFQ1RJVkUgWU9VIENSRUFURSBUTyBUSElTIEZJTEUuIEVYOlxuXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvc29tZURpcmVjdGl2ZS5qcycpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0RpcmVjdGl2ZXMnKVxuXG5cdC8vIFV0aWxpdGllcyBpcyBiZWluZyBpbmplY3RlZCAoZGVwZW5kZW5jeSBpbmplY3Rpb24pLCBmb3IgYmVpbmcgdXNlZCBpbiB0aGlzIGRpcmVjdGl2ZS4gSXQgY291bGQgYmUgYSBzZXJ2aWNlLCBmYWN0b3J5LCBldGMuXG4gICAgLmRpcmVjdGl2ZSgnc29tZURpcmVjdGl2ZScsIFsnVXRpbGl0aWVzJywgZnVuY3Rpb24oTWFuYWdlciwgVXRpbGl0aWVzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc29tZS1kaXJlY3RpdmUuaHRtbCcsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuIiwiYW5ndWxhci5tb2R1bGUoJ0ZhY3RvcmllcycsIFtdKTtcblxuLy8gQWRkIGV2ZXJ5IGZhY3RvcnkgeW91IGNyZWF0ZSB0byB0aGlzIGZpbGUuXG5cbnJlcXVpcmUoJy4vZmFjdG9yaWVzL3NvbWVGYWN0b3J5LmpzJyk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnRmFjdG9yaWVzJykuZmFjdG9yeSgnU29tZUZhY3RvcnknLCBbJyRxJywgZnVuY3Rpb24oJHEpIHtcblxuICAgIHZhciBnZXRTb21lRGF0YSA9IGZ1bmN0aW9uKHNvbWVQYXJhbSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXHRcdFxuXHRcdC8vIEludGVyYWN0IHdpdGggc29tZSBkYXRhIGZyb20gdGhlIHNlcnZlci4gXG5cdFx0Ly8gVGhpcyBleGFtcGxlIGNhbGxzIGEgcmVtb3RlIGFjdGlvbiBkZWZpbmVkIGluIGFuIEFQRVggY2xhc3MgY2FsbGVkIFNvbWVDb250cm9sbGVyLlxuXHRcdFxuXHRcdFNvbWVDb250cm9sbGVyLlNvbWVNZXRob2Qoc29tZVBhcmFtLCBmdW5jdGlvbihyZXN1bHQsZXZlbnQpe1xuICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTsgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChldmVudCk7XG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgeyBidWZmZXI6IGZhbHNlLCBlc2NhcGU6IHRydWUsIHRpbWVvdXQ6IDMwMDAwIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7ICAgXG4gICAgfVxuXHRcbiAgICAvLyBBZGQgZXZlcnkgbWV0aG9kIGRlZmluZWQgaW4gdGhpcyBmYWN0b3J5IHRvIHRoZSByZXR1cm4gb2JqZWN0XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U29tZURhdGE6IGdldFNvbWVEYXRhXG4gICAgfVxuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnRmlsdGVycycsIFtdKTtcblxuLy8gQWRkIGV2ZXJ5IGZpbHRlciB5b3UgY3JlYXRlIHRvIHRoaXMgZmlsZVxuXG5yZXF1aXJlKCcuL2ZpbHRlcnMvZmlsdGVycy5qcycpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpbHRlcnMnKVxuICAgIFxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFlvdXIgZmlsdGVyc1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLmZpbHRlcignc29tZUZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc29tZVBhcmFtLCBvdGhlclBhcmFtKSB7XG5cdFx0XHQvLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgZmlsdGVyaW5nLlxuICAgICAgICB9O1xuICAgIH0pXG4iLCJyZXF1aXJlKCcuL3ZlbmRvci9iaW5kb25jZS5qcycpO1xucmVxdWlyZSgnLi4vbGliL2FuZ3VsYXItcm91dGUuanMnKTtcblxucmVxdWlyZSgnLi9jb250cm9sbGVycy5qcycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzLmpzJyk7XG5yZXF1aXJlKCcuL2ZhY3Rvcmllcy5qcycpO1xucmVxdWlyZSgnLi9maWx0ZXJzLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzLmpzJyk7XG5cbnJlcXVpcmUoJy4vYXBwLmpzJyk7XG5yZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzJyk7XG5yZXF1aXJlKCcuLi8uLi9zdHlsZXMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcycpO1xuXG4kID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGN1cnJVc2VyO1xuICAgIHZhciBjdXJyVG9rZW47XG4gICAgJChcIm5hdlwiKS5oaWRlKCk7XG5cbiAgICAvKlxuICAgICAqIE5hdmlnYXRpb25cbiAgICAgKi9cbiAgICAkKFwibmF2IC5tZW51LWl0ZW1cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJChcIm5hdiAubWVudS1pdGVtXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIH0pO1xuXG4gICAgLypcbiAgICAgKiBMb2dvdXRcbiAgICAgKi9cbiAgICAkKFwiI2xvZ291dFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICBjdXJyVG9rZW4gPSBudWxsO1xuICAgICAgICBjdXJyVXNlciA9IG51bGw7XG4gICAgICAgICQoXCJuYXZcIikuaGlkZSgpO1xuICAgIH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pO1xuXG4vLyBBZGQgZXZlcnkgc2VydmljZSB5b3UgY3JlYXRlIHRvIHRoaXMgZmlsZS5cblxucmVxdWlyZSgnLi9zZXJ2aWNlcy9oZWxwZXIuanMnKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdTZXJ2aWNlcycpLnNlcnZpY2UoJ0hlbHBlcicsIFsnJHEnLCBmdW5jdGlvbiAoJHEsIFV0aWxpdGllcykge1xuXG4gICAgdGhpcy5oZWxwZXJNZXRob2QgPSBmdW5jdGlvbiAocGFyYW0xLCBwYXJhbTIpIHtcblx0XHQvLyBSZXR1cm4gd2hhdGV2ZXIuIEVhY2ggc2VydmljZSBpcyBhIHNpbmdsZXRvbiwgc28gdGhpcyBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBtZXRob2RzIHRvIHBlcmZvcm0gXG5cdFx0Ly8gQUpBWCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgYW5kIHJldHVybiBhIHByb21pc2UuXG5cdFxuICAgICAgICB2YXIgc29tZXRoaW5nID0gXCJ0ZXN0XCI7XG4gICAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuXG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEJpbmRvbmNlIC0gWmVybyB3YXRjaGVzIGJpbmRpbmcgZm9yIEFuZ3VsYXJKc1xuICogQHZlcnNpb24gdjAuMS4xIC0gMjAxMy0wNS0wN1xuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1Bhc3Zhei9iaW5kb25jZVxuICogQGF1dGhvciBQYXNxdWFsZSBWYXp6YW5hIDxwYXNxdWFsZXZhenphbmFAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UsIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuIGFuZ3VsYXIubW9kdWxlKCdwYXN2YXouYmluZG9uY2UnLCBbXSlcblxuIC5kaXJlY3RpdmUoJ2JpbmRvbmNlJywgZnVuY3Rpb24oKSB7XG4gXHR2YXIgdG9Cb29sZWFuID0gZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0aWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCAhPT0gMCkge1xuIFx0XHRcdHZhciB2ID0gYW5ndWxhci5sb3dlcmNhc2UoXCJcIiArIHZhbHVlKTtcbiBcdFx0XHR2YWx1ZSA9ICEodiA9PSAnZicgfHwgdiA9PSAnMCcgfHwgdiA9PSAnZmFsc2UnIHx8IHYgPT0gJ25vJyB8fCB2ID09ICduJyB8fCB2ID09ICdbXScpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhbHVlID0gZmFsc2U7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIHZhbHVlO1xuIFx0fVxuXG4gXHRyZXR1cm4ge1xuIFx0XHRyZXN0cmljdDogXCJBTVwiLFxuIFx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiBcdFx0XHR2YXIgc2hvd0hpZGVCaW5kZXIgPSBmdW5jdGlvbihlbG0sIGF0dHIsIHZhbHVlKSBcbiBcdFx0XHR7XG4gXHRcdFx0XHR2YXIgc2hvdyA9IChhdHRyID09ICdzaG93JykgPyAnJyA6ICdub25lJztcbiBcdFx0XHRcdHZhciBoaWRlID0gKGF0dHIgPT0gJ2hpZGUnKSA/ICcnIDogJ25vbmUnO1xuIFx0XHRcdFx0ZWxtLmNzcygnZGlzcGxheScsIHRvQm9vbGVhbih2YWx1ZSkgPyBzaG93IDogaGlkZSk7XG4gXHRcdFx0fVxuIFx0XHRcdHZhciBjbGFzc0JpbmRlciA9IGZ1bmN0aW9uKGVsbSwgdmFsdWUpXG4gXHRcdFx0e1xuIFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNPYmplY3QodmFsdWUpICYmICFhbmd1bGFyLmlzQXJyYXkodmFsdWUpKSB7XG4gXHRcdFx0XHRcdHZhciByZXN1bHRzID0gW107XG4gXHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gXHRcdFx0XHRcdFx0aWYgKHZhbHVlKSByZXN1bHRzLnB1c2goaW5kZXgpO1xuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHRzO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKHZhbHVlKSB7XG4gXHRcdFx0XHRcdGVsbS5hZGRDbGFzcyhhbmd1bGFyLmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbignICcpIDogdmFsdWUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHZhciBjdHJsID1cbiBcdFx0XHR7XG4gXHRcdFx0XHR3YXRjaGVyUmVtb3ZlciA6IHVuZGVmaW5lZCxcbiBcdFx0XHRcdGJpbmRlcnMgOiBbXSxcbiBcdFx0XHRcdGdyb3VwIDogJGF0dHJzLmJvTmFtZSxcbiBcdFx0XHRcdGVsZW1lbnQgOiAkZWxlbWVudCxcbiBcdFx0XHRcdHJhbiA6IGZhbHNlLFxuXG4gXHRcdFx0XHRhZGRCaW5kZXIgOiBmdW5jdGlvbihiaW5kZXIpIFxuIFx0XHRcdFx0e1xuIFx0XHRcdFx0XHR0aGlzLmJpbmRlcnMucHVzaChiaW5kZXIpO1xuXG4gXHRcdFx0XHRcdC8vIEluIGNhc2Ugb2YgbGF0ZSBiaW5kaW5nICh3aGVuIHVzaW5nIHRoZSBkaXJlY3RpdmUgYm8tbmFtZS9iby1wYXJlbnQpXG4gXHRcdFx0XHRcdC8vIGl0IGhhcHBlbnMgb25seSB3aGVuIHlvdSB1c2UgbmVzdGVkIGJpbmRvbmNlLCBpZiB0aGUgYm8tY2hpbGRyZW5cbiBcdFx0XHRcdFx0Ly8gYXJlIG5vdCBkb20gY2hpbGRyZW4gdGhlIGxpbmtpbmcgY2FuIGZvbGxvdyBhbm90aGVyIG9yZGVyXG4gXHRcdFx0XHRcdGlmICh0aGlzLnJhbilcbiBcdFx0XHRcdFx0e1xuIFx0XHRcdFx0XHRcdHRoaXMucnVuQmluZGVycygpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9LFxuXG4gXHRcdFx0XHRzZXR1cFdhdGNoZXIgOiBmdW5jdGlvbihiaW5kb25jZVZhbHVlKSBcbiBcdFx0XHRcdHtcbiBcdFx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuIFx0XHRcdFx0XHR0aGlzLndhdGNoZXJSZW1vdmVyID0gJHNjb3BlLiR3YXRjaChiaW5kb25jZVZhbHVlLCBmdW5jdGlvbihuZXdWYWx1ZSkgXG4gXHRcdFx0XHRcdHtcbiBcdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gXHRcdFx0XHRcdFx0dGhhdC5yZW1vdmVXYXRjaGVyKCk7XG4gXHRcdFx0XHRcdFx0dGhhdC5ydW5CaW5kZXJzKCk7XG4gXHRcdFx0XHRcdH0sIHRydWUpO1xuIFx0XHRcdFx0fSxcblxuIFx0XHRcdFx0cmVtb3ZlV2F0Y2hlciA6IGZ1bmN0aW9uKCkgXG4gXHRcdFx0XHR7XG4gXHRcdFx0XHRcdGlmICh0aGlzLndhdGNoZXJSZW1vdmVyICE9IHVuZGVmaW5lZClcbiBcdFx0XHRcdFx0e1xuIFx0XHRcdFx0XHRcdHRoaXMud2F0Y2hlclJlbW92ZXIoKTtcbiBcdFx0XHRcdFx0XHR0aGlzLndhdGNoZXJSZW1vdmVyID0gdW5kZWZpbmVkO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9LFxuXG4gXHRcdFx0XHRydW5CaW5kZXJzIDogZnVuY3Rpb24oKVxuIFx0XHRcdFx0e1xuIFx0XHRcdFx0XHRmb3IgKHZhciBkYXRhIGluIHRoaXMuYmluZGVycylcbiBcdFx0XHRcdFx0e1xuIFx0XHRcdFx0XHRcdHZhciBiaW5kZXIgPSB0aGlzLmJpbmRlcnNbZGF0YV07XG4gXHRcdFx0XHRcdFx0dmFyIHZhbHVlO1xuXG4gXHRcdFx0XHRcdFx0aWYgKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cCAhPSBiaW5kZXIuZ3JvdXAgKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdFxuIFx0XHRcdFx0XHRcdGlmIChiaW5kZXIuYXR0ciA9PT0gJ2RhdGEnKSB7XG5cbiBcdFx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChPYmplY3Qua2V5cyhiaW5kZXIuYXR0cnMpLCBmdW5jdGlvbihhdHRyKSB7XG4gXHRcdFx0XHRcdFx0XHRcdHZhciBuZXdBdHRyLCBuZXdWYWx1ZTtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKGF0dHIubWF0Y2goL15ib0RhdGEvKSAmJiBiaW5kZXIuYXR0cnNbYXR0cl0pIHtcbiBcdFx0XHRcdFx0XHRcdFx0XHRuZXdBdHRyID0gYXR0ci5yZXBsYWNlKC9eYm8vLCAnJykucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiBcdFx0XHRcdFx0XHRcdFx0XHRuZXdWYWx1ZSA9ICRzY29wZS4kZXZhbChiaW5kZXIuYXR0cnNbYXR0cl0pO1xuIFx0XHRcdFx0XHRcdFx0XHRcdGJpbmRlci5lbGVtZW50LmF0dHIobmV3QXR0ciwgbmV3VmFsdWUpO1xuIFx0XHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcbiBcdFx0XHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRcdFxuIFx0XHRcdFx0XHRcdFx0dmFsdWUgPSAkc2NvcGUuJGV2YWwoYmluZGVyLnZhbHVlKTtcbiBcdFx0XHRcdFx0XHRcblx0IFx0XHRcdFx0XHRcdHN3aXRjaChiaW5kZXIuYXR0cilcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2hpZGUnOlxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3Nob3cnOlxuXHRcdFx0XHRcdFx0XHRcdHNob3dIaWRlQmluZGVyKGJpbmRlci5lbGVtZW50LCBiaW5kZXIuYXR0ciwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2NsYXNzJzpcblx0XHRcdFx0XHRcdFx0XHRjbGFzc0JpbmRlcihiaW5kZXIuZWxlbWVudCwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3RleHQnOlxuXHRcdFx0XHRcdFx0XHRcdGJpbmRlci5lbGVtZW50LnRleHQodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2h0bWwnOlxuXHRcdFx0XHRcdFx0XHRcdGJpbmRlci5lbGVtZW50Lmh0bWwodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaHJlZic6XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnYWx0Jzpcblx0XHRcdFx0XHRcdFx0XHRjYXNlICd0aXRsZSc6XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3N0eWxlJzpcblx0XHRcdFx0XHRcdFx0XHRjYXNlICd2YWx1ZSc6XG5cdFx0XHRcdFx0XHRcdFx0YmluZGVyLmVsZW1lbnQuYXR0cihiaW5kZXIuYXR0ciwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cbiBcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR0aGlzLnJhbiA9IHRydWU7XG4gXHRcdFx0XHRcdHRoaXMuYmluZGVycyA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjdHJsO1xuXHRcdH1dLFxuXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIGJpbmRvbmNlQ29udHJvbGxlcikge1xuXHRcdFx0dmFyIHZhbHVlID0gKGF0dHJzLmJpbmRvbmNlKSA/IHNjb3BlLiRldmFsKGF0dHJzLmJpbmRvbmNlKSA6IHRydWU7XG5cdFx0XHRpZiAodmFsdWUgIT0gdW5kZWZpbmVkKVxuXHRcdFx0e1xuXHRcdFx0XHRiaW5kb25jZUNvbnRyb2xsZXIucnVuQmluZGVycygpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRiaW5kb25jZUNvbnRyb2xsZXIuc2V0dXBXYXRjaGVyKGF0dHJzLmJpbmRvbmNlKTtcblx0XHRcdFx0ZWxtLmJpbmQoXCIkZGVzdHJveVwiLCBiaW5kb25jZUNvbnRyb2xsZXIucmVtb3ZlV2F0Y2hlcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufSk7XG5cbmFuZ3VsYXIuZm9yRWFjaCh7XG5cdCdib1Nob3cnIDogJ3Nob3cnLFxuXHQnYm9IaWRlJyA6ICdoaWRlJyxcblx0J2JvQ2xhc3MnIDogJ2NsYXNzJyxcblx0J2JvVGV4dCcgOiAndGV4dCcsXG5cdCdib0h0bWwnIDogJ2h0bWwnLFxuXHQnYm9TcmMnIDogJ3NyYycsXG5cdCdib0hyZWYnIDogJ2hyZWYnLFxuXHQnYm9BbHQnIDogJ2FsdCcsXG5cdCdib1RpdGxlJyA6ICd0aXRsZScsXG5cdCdib0lkJyA6ICdpZCcsXG5cdCdib1N0eWxlJyA6ICdzdHlsZScsXG5cdCdib1ZhbHVlJyA6ICd2YWx1ZScsXG5cdCdib0RhdGEnIDogJ2RhdGEnXG59LFxuZnVuY3Rpb24odGFnLCBhdHRyaWJ1dGUpXG57XG5cdHZhciBjaGlsZFByaW9yaXR5ID0gMjAwO1xuXHRyZXR1cm4gYW5ndWxhci5tb2R1bGUoJ3Bhc3Zhei5iaW5kb25jZScpLmRpcmVjdGl2ZShhdHRyaWJ1dGUsIGZ1bmN0aW9uKCkgXG5cdHtcblx0XHRyZXR1cm4geyBcblx0XHRcdHByaW9yaXR5OiBjaGlsZFByaW9yaXR5LFxuXHRcdFx0cmVxdWlyZTogJ15iaW5kb25jZScsIFxuXHRcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIGJpbmRvbmNlQ29udHJvbGxlcilcblx0XHRcdHtcblx0XHRcdFx0dmFyIG5hbWUgPSBhdHRycy5ib1BhcmVudDtcblx0XHRcdFx0aWYgKG5hbWUgJiYgYmluZG9uY2VDb250cm9sbGVyLmdyb3VwICE9IG5hbWUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgZWxlbWVudCA9IGJpbmRvbmNlQ29udHJvbGxlci5lbGVtZW50LnBhcmVudCgpO1xuXHRcdFx0XHRcdGJpbmRvbmNlQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR2YXIgcGFyZW50VmFsdWU7XG5cblx0XHRcdFx0XHR3aGlsZSAoZWxlbWVudFswXS5ub2RlVHlwZSAhPSA5ICYmIGVsZW1lbnQubGVuZ3RoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmICgocGFyZW50VmFsdWUgPSBlbGVtZW50LmRhdGEoJyRiaW5kb25jZUNvbnRyb2xsZXInKSkgXG5cdFx0XHRcdFx0XHRcdCYmIHBhcmVudFZhbHVlLmdyb3VwID09IG5hbWUpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGJpbmRvbmNlQ29udHJvbGxlciA9IHBhcmVudFZhbHVlXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghYmluZG9uY2VDb250cm9sbGVyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRocm93IEVycm9yKFwiTm8gYmluZG9uY2UgY29udHJvbGxlcjogXCIgKyBuYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YmluZG9uY2VDb250cm9sbGVyLmFkZEJpbmRlcih7ZWxlbWVudDogZWxtLCBhdHRyOnRhZywgdmFsdWU6IGF0dHJzW2F0dHJpYnV0ZV0sIGdyb3VwOiBuYW1lLCBhdHRyczphdHRyc30pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcbiIsIi8qIVxuICogQm9vdHN0cmFwIHYzLjMuNiAoaHR0cDovL2dldGJvb3RzdHJhcC5jb20pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgalF1ZXJ5KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5XCIpOytmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjt2YXIgYj1hLmZuLmpxdWVyeS5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIuXCIpO2lmKGJbMF08MiYmYlsxXTw5fHwxPT1iWzBdJiY5PT1iWzFdJiZiWzJdPDF8fGJbMF0+Mil0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiAzXCIpfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvb3RzdHJhcFwiKSxiPXtXZWJraXRUcmFuc2l0aW9uOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLE1velRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCIsT1RyYW5zaXRpb246XCJvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZFwiLHRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCJ9O2Zvcih2YXIgYyBpbiBiKWlmKHZvaWQgMCE9PWEuc3R5bGVbY10pcmV0dXJue2VuZDpiW2NdfTtyZXR1cm4hMX1hLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPWZ1bmN0aW9uKGIpe3ZhciBjPSExLGQ9dGhpczthKHRoaXMpLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7Yz0hMH0pO3ZhciBlPWZ1bmN0aW9uKCl7Y3x8YShkKS50cmlnZ2VyKGEuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCl9O3JldHVybiBzZXRUaW1lb3V0KGUsYiksdGhpc30sYShmdW5jdGlvbigpe2Euc3VwcG9ydC50cmFuc2l0aW9uPWIoKSxhLnN1cHBvcnQudHJhbnNpdGlvbiYmKGEuZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQ9e2JpbmRUeXBlOmEuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxkZWxlZ2F0ZVR5cGU6YS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGhhbmRsZTpmdW5jdGlvbihiKXtyZXR1cm4gYShiLnRhcmdldCkuaXModGhpcyk/Yi5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dm9pZCAwfX0pfSl9KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcyksZT1jLmRhdGEoXCJicy5hbGVydFwiKTtlfHxjLmRhdGEoXCJicy5hbGVydFwiLGU9bmV3IGQodGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZlW2JdLmNhbGwoYyl9KX12YXIgYz0nW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyxkPWZ1bmN0aW9uKGIpe2EoYikub24oXCJjbGlja1wiLGMsdGhpcy5jbG9zZSl9O2QuVkVSU0lPTj1cIjMuMy42XCIsZC5UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxkLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7Zy5kZXRhY2goKS50cmlnZ2VyKFwiY2xvc2VkLmJzLmFsZXJ0XCIpLnJlbW92ZSgpfXZhciBlPWEodGhpcyksZj1lLmF0dHIoXCJkYXRhLXRhcmdldFwiKTtmfHwoZj1lLmF0dHIoXCJocmVmXCIpLGY9ZiYmZi5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLFwiXCIpKTt2YXIgZz1hKGYpO2ImJmIucHJldmVudERlZmF1bHQoKSxnLmxlbmd0aHx8KGc9ZS5jbG9zZXN0KFwiLmFsZXJ0XCIpKSxnLnRyaWdnZXIoYj1hLkV2ZW50KFwiY2xvc2UuYnMuYWxlcnRcIikpLGIuaXNEZWZhdWx0UHJldmVudGVkKCl8fChnLnJlbW92ZUNsYXNzKFwiaW5cIiksYS5zdXBwb3J0LnRyYW5zaXRpb24mJmcuaGFzQ2xhc3MoXCJmYWRlXCIpP2cub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYykuZW11bGF0ZVRyYW5zaXRpb25FbmQoZC5UUkFOU0lUSU9OX0RVUkFUSU9OKTpjKCkpfTt2YXIgZT1hLmZuLmFsZXJ0O2EuZm4uYWxlcnQ9YixhLmZuLmFsZXJ0LkNvbnN0cnVjdG9yPWQsYS5mbi5hbGVydC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uYWxlcnQ9ZSx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpXCIsYyxkLnByb3RvdHlwZS5jbG9zZSl9KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy5idXR0b25cIiksZj1cIm9iamVjdFwiPT10eXBlb2YgYiYmYjtlfHxkLmRhdGEoXCJicy5idXR0b25cIixlPW5ldyBjKHRoaXMsZikpLFwidG9nZ2xlXCI9PWI/ZS50b2dnbGUoKTpiJiZlLnNldFN0YXRlKGIpfSl9dmFyIGM9ZnVuY3Rpb24oYixkKXt0aGlzLiRlbGVtZW50PWEoYiksdGhpcy5vcHRpb25zPWEuZXh0ZW5kKHt9LGMuREVGQVVMVFMsZCksdGhpcy5pc0xvYWRpbmc9ITF9O2MuVkVSU0lPTj1cIjMuMy42XCIsYy5ERUZBVUxUUz17bG9hZGluZ1RleHQ6XCJsb2FkaW5nLi4uXCJ9LGMucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKGIpe3ZhciBjPVwiZGlzYWJsZWRcIixkPXRoaXMuJGVsZW1lbnQsZT1kLmlzKFwiaW5wdXRcIik/XCJ2YWxcIjpcImh0bWxcIixmPWQuZGF0YSgpO2IrPVwiVGV4dFwiLG51bGw9PWYucmVzZXRUZXh0JiZkLmRhdGEoXCJyZXNldFRleHRcIixkW2VdKCkpLHNldFRpbWVvdXQoYS5wcm94eShmdW5jdGlvbigpe2RbZV0obnVsbD09ZltiXT90aGlzLm9wdGlvbnNbYl06ZltiXSksXCJsb2FkaW5nVGV4dFwiPT1iPyh0aGlzLmlzTG9hZGluZz0hMCxkLmFkZENsYXNzKGMpLmF0dHIoYyxjKSk6dGhpcy5pc0xvYWRpbmcmJih0aGlzLmlzTG9hZGluZz0hMSxkLnJlbW92ZUNsYXNzKGMpLnJlbW92ZUF0dHIoYykpfSx0aGlzKSwwKX0sYy5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dmFyIGE9ITAsYj10aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKTtpZihiLmxlbmd0aCl7dmFyIGM9dGhpcy4kZWxlbWVudC5maW5kKFwiaW5wdXRcIik7XCJyYWRpb1wiPT1jLnByb3AoXCJ0eXBlXCIpPyhjLnByb3AoXCJjaGVja2VkXCIpJiYoYT0hMSksYi5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLiRlbGVtZW50LmFkZENsYXNzKFwiYWN0aXZlXCIpKTpcImNoZWNrYm94XCI9PWMucHJvcChcInR5cGVcIikmJihjLnByb3AoXCJjaGVja2VkXCIpIT09dGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSYmKGE9ITEpLHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIikpLGMucHJvcChcImNoZWNrZWRcIix0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiYWN0aXZlXCIpKSxhJiZjLnRyaWdnZXIoXCJjaGFuZ2VcIil9ZWxzZSB0aGlzLiRlbGVtZW50LmF0dHIoXCJhcmlhLXByZXNzZWRcIiwhdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSksdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKX07dmFyIGQ9YS5mbi5idXR0b247YS5mbi5idXR0b249YixhLmZuLmJ1dHRvbi5Db25zdHJ1Y3Rvcj1jLGEuZm4uYnV0dG9uLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5idXR0b249ZCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJyxmdW5jdGlvbihjKXt2YXIgZD1hKGMudGFyZ2V0KTtkLmhhc0NsYXNzKFwiYnRuXCIpfHwoZD1kLmNsb3Nlc3QoXCIuYnRuXCIpKSxiLmNhbGwoZCxcInRvZ2dsZVwiKSxhKGMudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyl8fGEoYy50YXJnZXQpLmlzKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKXx8Yy5wcmV2ZW50RGVmYXVsdCgpfSkub24oXCJmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsZnVuY3Rpb24oYil7YShiLnRhcmdldCkuY2xvc2VzdChcIi5idG5cIikudG9nZ2xlQ2xhc3MoXCJmb2N1c1wiLC9eZm9jdXMoaW4pPyQvLnRlc3QoYi50eXBlKSl9KX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGQ9YSh0aGlzKSxlPWQuZGF0YShcImJzLmNhcm91c2VsXCIpLGY9YS5leHRlbmQoe30sYy5ERUZBVUxUUyxkLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYiksZz1cInN0cmluZ1wiPT10eXBlb2YgYj9iOmYuc2xpZGU7ZXx8ZC5kYXRhKFwiYnMuY2Fyb3VzZWxcIixlPW5ldyBjKHRoaXMsZikpLFwibnVtYmVyXCI9PXR5cGVvZiBiP2UudG8oYik6Zz9lW2ddKCk6Zi5pbnRlcnZhbCYmZS5wYXVzZSgpLmN5Y2xlKCl9KX12YXIgYz1mdW5jdGlvbihiLGMpe3RoaXMuJGVsZW1lbnQ9YShiKSx0aGlzLiRpbmRpY2F0b3JzPXRoaXMuJGVsZW1lbnQuZmluZChcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIpLHRoaXMub3B0aW9ucz1jLHRoaXMucGF1c2VkPW51bGwsdGhpcy5zbGlkaW5nPW51bGwsdGhpcy5pbnRlcnZhbD1udWxsLHRoaXMuJGFjdGl2ZT1udWxsLHRoaXMuJGl0ZW1zPW51bGwsdGhpcy5vcHRpb25zLmtleWJvYXJkJiZ0aGlzLiRlbGVtZW50Lm9uKFwia2V5ZG93bi5icy5jYXJvdXNlbFwiLGEucHJveHkodGhpcy5rZXlkb3duLHRoaXMpKSxcImhvdmVyXCI9PXRoaXMub3B0aW9ucy5wYXVzZSYmIShcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSYmdGhpcy4kZWxlbWVudC5vbihcIm1vdXNlZW50ZXIuYnMuY2Fyb3VzZWxcIixhLnByb3h5KHRoaXMucGF1c2UsdGhpcykpLm9uKFwibW91c2VsZWF2ZS5icy5jYXJvdXNlbFwiLGEucHJveHkodGhpcy5jeWNsZSx0aGlzKSl9O2MuVkVSU0lPTj1cIjMuMy42XCIsYy5UUkFOU0lUSU9OX0RVUkFUSU9OPTYwMCxjLkRFRkFVTFRTPXtpbnRlcnZhbDo1ZTMscGF1c2U6XCJob3ZlclwiLHdyYXA6ITAsa2V5Ym9hcmQ6ITB9LGMucHJvdG90eXBlLmtleWRvd249ZnVuY3Rpb24oYSl7aWYoIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoYS50YXJnZXQudGFnTmFtZSkpe3N3aXRjaChhLndoaWNoKXtjYXNlIDM3OnRoaXMucHJldigpO2JyZWFrO2Nhc2UgMzk6dGhpcy5uZXh0KCk7YnJlYWs7ZGVmYXVsdDpyZXR1cm59YS5wcmV2ZW50RGVmYXVsdCgpfX0sYy5wcm90b3R5cGUuY3ljbGU9ZnVuY3Rpb24oYil7cmV0dXJuIGJ8fCh0aGlzLnBhdXNlZD0hMSksdGhpcy5pbnRlcnZhbCYmY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwmJiF0aGlzLnBhdXNlZCYmKHRoaXMuaW50ZXJ2YWw9c2V0SW50ZXJ2YWwoYS5wcm94eSh0aGlzLm5leHQsdGhpcyksdGhpcy5vcHRpb25zLmludGVydmFsKSksdGhpc30sYy5wcm90b3R5cGUuZ2V0SXRlbUluZGV4PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLiRpdGVtcz1hLnBhcmVudCgpLmNoaWxkcmVuKFwiLml0ZW1cIiksdGhpcy4kaXRlbXMuaW5kZXgoYXx8dGhpcy4kYWN0aXZlKX0sYy5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbj1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuZ2V0SXRlbUluZGV4KGIpLGQ9XCJwcmV2XCI9PWEmJjA9PT1jfHxcIm5leHRcIj09YSYmYz09dGhpcy4kaXRlbXMubGVuZ3RoLTE7aWYoZCYmIXRoaXMub3B0aW9ucy53cmFwKXJldHVybiBiO3ZhciBlPVwicHJldlwiPT1hPy0xOjEsZj0oYytlKSV0aGlzLiRpdGVtcy5sZW5ndGg7cmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGYpfSxjLnByb3RvdHlwZS50bz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM9dGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlPXRoaXMuJGVsZW1lbnQuZmluZChcIi5pdGVtLmFjdGl2ZVwiKSk7cmV0dXJuIGE+dGhpcy4kaXRlbXMubGVuZ3RoLTF8fDA+YT92b2lkIDA6dGhpcy5zbGlkaW5nP3RoaXMuJGVsZW1lbnQub25lKFwic2xpZC5icy5jYXJvdXNlbFwiLGZ1bmN0aW9uKCl7Yi50byhhKX0pOmM9PWE/dGhpcy5wYXVzZSgpLmN5Y2xlKCk6dGhpcy5zbGlkZShhPmM/XCJuZXh0XCI6XCJwcmV2XCIsdGhpcy4kaXRlbXMuZXEoYSkpfSxjLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihiKXtyZXR1cm4gYnx8KHRoaXMucGF1c2VkPSEwKSx0aGlzLiRlbGVtZW50LmZpbmQoXCIubmV4dCwgLnByZXZcIikubGVuZ3RoJiZhLnN1cHBvcnQudHJhbnNpdGlvbiYmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihhLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpLHRoaXMuY3ljbGUoITApKSx0aGlzLmludGVydmFsPWNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCksdGhpc30sYy5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNsaWRpbmc/dm9pZCAwOnRoaXMuc2xpZGUoXCJuZXh0XCIpfSxjLnByb3RvdHlwZS5wcmV2PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2xpZGluZz92b2lkIDA6dGhpcy5zbGlkZShcInByZXZcIil9LGMucHJvdG90eXBlLnNsaWRlPWZ1bmN0aW9uKGIsZCl7dmFyIGU9dGhpcy4kZWxlbWVudC5maW5kKFwiLml0ZW0uYWN0aXZlXCIpLGY9ZHx8dGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKGIsZSksZz10aGlzLmludGVydmFsLGg9XCJuZXh0XCI9PWI/XCJsZWZ0XCI6XCJyaWdodFwiLGk9dGhpcztpZihmLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXJldHVybiB0aGlzLnNsaWRpbmc9ITE7dmFyIGo9ZlswXSxrPWEuRXZlbnQoXCJzbGlkZS5icy5jYXJvdXNlbFwiLHtyZWxhdGVkVGFyZ2V0OmosZGlyZWN0aW9uOmh9KTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIoayksIWsuaXNEZWZhdWx0UHJldmVudGVkKCkpe2lmKHRoaXMuc2xpZGluZz0hMCxnJiZ0aGlzLnBhdXNlKCksdGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpe3RoaXMuJGluZGljYXRvcnMuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7dmFyIGw9YSh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoZildKTtsJiZsLmFkZENsYXNzKFwiYWN0aXZlXCIpfXZhciBtPWEuRXZlbnQoXCJzbGlkLmJzLmNhcm91c2VsXCIse3JlbGF0ZWRUYXJnZXQ6aixkaXJlY3Rpb246aH0pO3JldHVybiBhLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcInNsaWRlXCIpPyhmLmFkZENsYXNzKGIpLGZbMF0ub2Zmc2V0V2lkdGgsZS5hZGRDbGFzcyhoKSxmLmFkZENsYXNzKGgpLGUub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZnVuY3Rpb24oKXtmLnJlbW92ZUNsYXNzKFtiLGhdLmpvaW4oXCIgXCIpKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxlLnJlbW92ZUNsYXNzKFtcImFjdGl2ZVwiLGhdLmpvaW4oXCIgXCIpKSxpLnNsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe2kuJGVsZW1lbnQudHJpZ2dlcihtKX0sMCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLlRSQU5TSVRJT05fRFVSQVRJT04pKTooZS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxmLmFkZENsYXNzKFwiYWN0aXZlXCIpLHRoaXMuc2xpZGluZz0hMSx0aGlzLiRlbGVtZW50LnRyaWdnZXIobSkpLGcmJnRoaXMuY3ljbGUoKSx0aGlzfX07dmFyIGQ9YS5mbi5jYXJvdXNlbDthLmZuLmNhcm91c2VsPWIsYS5mbi5jYXJvdXNlbC5Db25zdHJ1Y3Rvcj1jLGEuZm4uY2Fyb3VzZWwubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmNhcm91c2VsPWQsdGhpc307dmFyIGU9ZnVuY3Rpb24oYyl7dmFyIGQsZT1hKHRoaXMpLGY9YShlLmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8KGQ9ZS5hdHRyKFwiaHJlZlwiKSkmJmQucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLyxcIlwiKSk7aWYoZi5oYXNDbGFzcyhcImNhcm91c2VsXCIpKXt2YXIgZz1hLmV4dGVuZCh7fSxmLmRhdGEoKSxlLmRhdGEoKSksaD1lLmF0dHIoXCJkYXRhLXNsaWRlLXRvXCIpO2gmJihnLmludGVydmFsPSExKSxiLmNhbGwoZixnKSxoJiZmLmRhdGEoXCJicy5jYXJvdXNlbFwiKS50byhoKSxjLnByZXZlbnREZWZhdWx0KCl9fTthKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpXCIsXCJbZGF0YS1zbGlkZV1cIixlKS5vbihcImNsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpXCIsXCJbZGF0YS1zbGlkZS10b11cIixlKSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9YSh0aGlzKTtiLmNhbGwoYyxjLmRhdGEoKSl9KX0pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3ZhciBjLGQ9Yi5hdHRyKFwiZGF0YS10YXJnZXRcIil8fChjPWIuYXR0cihcImhyZWZcIikpJiZjLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIik7cmV0dXJuIGEoZCl9ZnVuY3Rpb24gYyhiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9YSh0aGlzKSxlPWMuZGF0YShcImJzLmNvbGxhcHNlXCIpLGY9YS5leHRlbmQoe30sZC5ERUZBVUxUUyxjLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7IWUmJmYudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KGIpJiYoZi50b2dnbGU9ITEpLGV8fGMuZGF0YShcImJzLmNvbGxhcHNlXCIsZT1uZXcgZCh0aGlzLGYpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZVtiXSgpfSl9dmFyIGQ9ZnVuY3Rpb24oYixjKXt0aGlzLiRlbGVtZW50PWEoYiksdGhpcy5vcHRpb25zPWEuZXh0ZW5kKHt9LGQuREVGQVVMVFMsYyksdGhpcy4kdHJpZ2dlcj1hKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrYi5pZCsnXCJdLFtkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycrYi5pZCsnXCJdJyksdGhpcy50cmFuc2l0aW9uaW5nPW51bGwsdGhpcy5vcHRpb25zLnBhcmVudD90aGlzLiRwYXJlbnQ9dGhpcy5nZXRQYXJlbnQoKTp0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLiRlbGVtZW50LHRoaXMuJHRyaWdnZXIpLHRoaXMub3B0aW9ucy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9O2QuVkVSU0lPTj1cIjMuMy42XCIsZC5UUkFOU0lUSU9OX0RVUkFUSU9OPTM1MCxkLkRFRkFVTFRTPXt0b2dnbGU6ITB9LGQucHJvdG90eXBlLmRpbWVuc2lvbj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJ3aWR0aFwiKTtyZXR1cm4gYT9cIndpZHRoXCI6XCJoZWlnaHRcIn0sZC5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe2lmKCF0aGlzLnRyYW5zaXRpb25pbmcmJiF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiaW5cIikpe3ZhciBiLGU9dGhpcy4kcGFyZW50JiZ0aGlzLiRwYXJlbnQuY2hpbGRyZW4oXCIucGFuZWxcIikuY2hpbGRyZW4oXCIuaW4sIC5jb2xsYXBzaW5nXCIpO2lmKCEoZSYmZS5sZW5ndGgmJihiPWUuZGF0YShcImJzLmNvbGxhcHNlXCIpLGImJmIudHJhbnNpdGlvbmluZykpKXt2YXIgZj1hLkV2ZW50KFwic2hvdy5icy5jb2xsYXBzZVwiKTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIoZiksIWYuaXNEZWZhdWx0UHJldmVudGVkKCkpe2UmJmUubGVuZ3RoJiYoYy5jYWxsKGUsXCJoaWRlXCIpLGJ8fGUuZGF0YShcImJzLmNvbGxhcHNlXCIsbnVsbCkpO3ZhciBnPXRoaXMuZGltZW5zaW9uKCk7dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNlXCIpLmFkZENsYXNzKFwiY29sbGFwc2luZ1wiKVtnXSgwKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLiR0cmlnZ2VyLnJlbW92ZUNsYXNzKFwiY29sbGFwc2VkXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMudHJhbnNpdGlvbmluZz0xO3ZhciBoPWZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNpbmdcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZSBpblwiKVtnXShcIlwiKSx0aGlzLnRyYW5zaXRpb25pbmc9MCx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJzaG93bi5icy5jb2xsYXBzZVwiKX07aWYoIWEuc3VwcG9ydC50cmFuc2l0aW9uKXJldHVybiBoLmNhbGwodGhpcyk7dmFyIGk9YS5jYW1lbENhc2UoW1wic2Nyb2xsXCIsZ10uam9pbihcIi1cIikpO3RoaXMuJGVsZW1lbnQub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYS5wcm94eShoLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkLlRSQU5TSVRJT05fRFVSQVRJT04pW2ddKHRoaXMuJGVsZW1lbnRbMF1baV0pfX19fSxkLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKCl7aWYoIXRoaXMudHJhbnNpdGlvbmluZyYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImluXCIpKXt2YXIgYj1hLkV2ZW50KFwiaGlkZS5icy5jb2xsYXBzZVwiKTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIoYiksIWIuaXNEZWZhdWx0UHJldmVudGVkKCkpe3ZhciBjPXRoaXMuZGltZW5zaW9uKCk7dGhpcy4kZWxlbWVudFtjXSh0aGlzLiRlbGVtZW50W2NdKCkpWzBdLm9mZnNldEhlaWdodCx0aGlzLiRlbGVtZW50LmFkZENsYXNzKFwiY29sbGFwc2luZ1wiKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlIGluXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuJHRyaWdnZXIuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy50cmFuc2l0aW9uaW5nPTE7dmFyIGU9ZnVuY3Rpb24oKXt0aGlzLnRyYW5zaXRpb25pbmc9MCx0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiY29sbGFwc2luZ1wiKS5hZGRDbGFzcyhcImNvbGxhcHNlXCIpLnRyaWdnZXIoXCJoaWRkZW4uYnMuY29sbGFwc2VcIil9O3JldHVybiBhLnN1cHBvcnQudHJhbnNpdGlvbj92b2lkIHRoaXMuJGVsZW1lbnRbY10oMCkub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYS5wcm94eShlLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChkLlRSQU5TSVRJT05fRFVSQVRJT04pOmUuY2FsbCh0aGlzKX19fSxkLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJpblwiKT9cImhpZGVcIjpcInNob3dcIl0oKX0sZC5wcm90b3R5cGUuZ2V0UGFyZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGEodGhpcy5vcHRpb25zLnBhcmVudCkuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInK3RoaXMub3B0aW9ucy5wYXJlbnQrJ1wiXScpLmVhY2goYS5wcm94eShmdW5jdGlvbihjLGQpe3ZhciBlPWEoZCk7dGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoYihlKSxlKX0sdGhpcykpLmVuZCgpfSxkLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLmhhc0NsYXNzKFwiaW5cIik7YS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLGMpLGIudG9nZ2xlQ2xhc3MoXCJjb2xsYXBzZWRcIiwhYykuYXR0cihcImFyaWEtZXhwYW5kZWRcIixjKX07dmFyIGU9YS5mbi5jb2xsYXBzZTthLmZuLmNvbGxhcHNlPWMsYS5mbi5jb2xsYXBzZS5Db25zdHJ1Y3Rvcj1kLGEuZm4uY29sbGFwc2Uubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmNvbGxhcHNlPWUsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5jb2xsYXBzZS5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsZnVuY3Rpb24oZCl7dmFyIGU9YSh0aGlzKTtlLmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8ZC5wcmV2ZW50RGVmYXVsdCgpO3ZhciBmPWIoZSksZz1mLmRhdGEoXCJicy5jb2xsYXBzZVwiKSxoPWc/XCJ0b2dnbGVcIjplLmRhdGEoKTtjLmNhbGwoZixoKX0pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3ZhciBjPWIuYXR0cihcImRhdGEtdGFyZ2V0XCIpO2N8fChjPWIuYXR0cihcImhyZWZcIiksYz1jJiYvI1tBLVphLXpdLy50ZXN0KGMpJiZjLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sXCJcIikpO3ZhciBkPWMmJmEoYyk7cmV0dXJuIGQmJmQubGVuZ3RoP2Q6Yi5wYXJlbnQoKX1mdW5jdGlvbiBjKGMpe2MmJjM9PT1jLndoaWNofHwoYShlKS5yZW1vdmUoKSxhKGYpLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9YihkKSxmPXtyZWxhdGVkVGFyZ2V0OnRoaXN9O2UuaGFzQ2xhc3MoXCJvcGVuXCIpJiYoYyYmXCJjbGlja1wiPT1jLnR5cGUmJi9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoYy50YXJnZXQudGFnTmFtZSkmJmEuY29udGFpbnMoZVswXSxjLnRhcmdldCl8fChlLnRyaWdnZXIoYz1hLkV2ZW50KFwiaGlkZS5icy5kcm9wZG93blwiLGYpKSxjLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwoZC5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLFwiZmFsc2VcIiksZS5yZW1vdmVDbGFzcyhcIm9wZW5cIikudHJpZ2dlcihhLkV2ZW50KFwiaGlkZGVuLmJzLmRyb3Bkb3duXCIsZikpKSkpfSkpfWZ1bmN0aW9uIGQoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcyksZD1jLmRhdGEoXCJicy5kcm9wZG93blwiKTtkfHxjLmRhdGEoXCJicy5kcm9wZG93blwiLGQ9bmV3IGcodGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZkW2JdLmNhbGwoYyl9KX12YXIgZT1cIi5kcm9wZG93bi1iYWNrZHJvcFwiLGY9J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxnPWZ1bmN0aW9uKGIpe2EoYikub24oXCJjbGljay5icy5kcm9wZG93blwiLHRoaXMudG9nZ2xlKX07Zy5WRVJTSU9OPVwiMy4zLjZcIixnLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oZCl7dmFyIGU9YSh0aGlzKTtpZighZS5pcyhcIi5kaXNhYmxlZCwgOmRpc2FibGVkXCIpKXt2YXIgZj1iKGUpLGc9Zi5oYXNDbGFzcyhcIm9wZW5cIik7aWYoYygpLCFnKXtcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhZi5jbG9zZXN0KFwiLm5hdmJhci1uYXZcIikubGVuZ3RoJiZhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLmFkZENsYXNzKFwiZHJvcGRvd24tYmFja2Ryb3BcIikuaW5zZXJ0QWZ0ZXIoYSh0aGlzKSkub24oXCJjbGlja1wiLGMpO3ZhciBoPXtyZWxhdGVkVGFyZ2V0OnRoaXN9O2lmKGYudHJpZ2dlcihkPWEuRXZlbnQoXCJzaG93LmJzLmRyb3Bkb3duXCIsaCkpLGQuaXNEZWZhdWx0UHJldmVudGVkKCkpcmV0dXJuO2UudHJpZ2dlcihcImZvY3VzXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsXCJ0cnVlXCIpLGYudG9nZ2xlQ2xhc3MoXCJvcGVuXCIpLnRyaWdnZXIoYS5FdmVudChcInNob3duLmJzLmRyb3Bkb3duXCIsaCkpfXJldHVybiExfX0sZy5wcm90b3R5cGUua2V5ZG93bj1mdW5jdGlvbihjKXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdChjLndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoYy50YXJnZXQudGFnTmFtZSkpe3ZhciBkPWEodGhpcyk7aWYoYy5wcmV2ZW50RGVmYXVsdCgpLGMuc3RvcFByb3BhZ2F0aW9uKCksIWQuaXMoXCIuZGlzYWJsZWQsIDpkaXNhYmxlZFwiKSl7dmFyIGU9YihkKSxnPWUuaGFzQ2xhc3MoXCJvcGVuXCIpO2lmKCFnJiYyNyE9Yy53aGljaHx8ZyYmMjc9PWMud2hpY2gpcmV0dXJuIDI3PT1jLndoaWNoJiZlLmZpbmQoZikudHJpZ2dlcihcImZvY3VzXCIpLGQudHJpZ2dlcihcImNsaWNrXCIpO3ZhciBoPVwiIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYVwiLGk9ZS5maW5kKFwiLmRyb3Bkb3duLW1lbnVcIitoKTtpZihpLmxlbmd0aCl7dmFyIGo9aS5pbmRleChjLnRhcmdldCk7Mzg9PWMud2hpY2gmJmo+MCYmai0tLDQwPT1jLndoaWNoJiZqPGkubGVuZ3RoLTEmJmorKyx+anx8KGo9MCksaS5lcShqKS50cmlnZ2VyKFwiZm9jdXNcIil9fX19O3ZhciBoPWEuZm4uZHJvcGRvd247YS5mbi5kcm9wZG93bj1kLGEuZm4uZHJvcGRvd24uQ29uc3RydWN0b3I9ZyxhLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5kcm9wZG93bj1oLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGlcIixjKS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsXCIuZHJvcGRvd24gZm9ybVwiLGZ1bmN0aW9uKGEpe2Euc3RvcFByb3BhZ2F0aW9uKCl9KS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsZixnLnByb3RvdHlwZS50b2dnbGUpLm9uKFwia2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaVwiLGYsZy5wcm90b3R5cGUua2V5ZG93bikub24oXCJrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsXCIuZHJvcGRvd24tbWVudVwiLGcucHJvdG90eXBlLmtleWRvd24pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIsZCl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoXCJicy5tb2RhbFwiKSxnPWEuZXh0ZW5kKHt9LGMuREVGQVVMVFMsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2Z8fGUuZGF0YShcImJzLm1vZGFsXCIsZj1uZXcgYyh0aGlzLGcpKSxcInN0cmluZ1wiPT10eXBlb2YgYj9mW2JdKGQpOmcuc2hvdyYmZi5zaG93KGQpfSl9dmFyIGM9ZnVuY3Rpb24oYixjKXt0aGlzLm9wdGlvbnM9Yyx0aGlzLiRib2R5PWEoZG9jdW1lbnQuYm9keSksdGhpcy4kZWxlbWVudD1hKGIpLHRoaXMuJGRpYWxvZz10aGlzLiRlbGVtZW50LmZpbmQoXCIubW9kYWwtZGlhbG9nXCIpLHRoaXMuJGJhY2tkcm9wPW51bGwsdGhpcy5pc1Nob3duPW51bGwsdGhpcy5vcmlnaW5hbEJvZHlQYWQ9bnVsbCx0aGlzLnNjcm9sbGJhcldpZHRoPTAsdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrPSExLHRoaXMub3B0aW9ucy5yZW1vdGUmJnRoaXMuJGVsZW1lbnQuZmluZChcIi5tb2RhbC1jb250ZW50XCIpLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSxhLnByb3h5KGZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC50cmlnZ2VyKFwibG9hZGVkLmJzLm1vZGFsXCIpfSx0aGlzKSl9O2MuVkVSU0lPTj1cIjMuMy42XCIsYy5UUkFOU0lUSU9OX0RVUkFUSU9OPTMwMCxjLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT049MTUwLGMuREVGQVVMVFM9e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLHNob3c6ITB9LGMucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5pc1Nob3duP3RoaXMuaGlkZSgpOnRoaXMuc2hvdyhhKX0sYy5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbihiKXt2YXIgZD10aGlzLGU9YS5FdmVudChcInNob3cuYnMubW9kYWxcIix7cmVsYXRlZFRhcmdldDpifSk7dGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpLHRoaXMuaXNTaG93bnx8ZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHRoaXMuaXNTaG93bj0hMCx0aGlzLmNoZWNrU2Nyb2xsYmFyKCksdGhpcy5zZXRTY3JvbGxiYXIoKSx0aGlzLiRib2R5LmFkZENsYXNzKFwibW9kYWwtb3BlblwiKSx0aGlzLmVzY2FwZSgpLHRoaXMucmVzaXplKCksdGhpcy4kZWxlbWVudC5vbihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIiwnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxhLnByb3h5KHRoaXMuaGlkZSx0aGlzKSksdGhpcy4kZGlhbG9nLm9uKFwibW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWxcIixmdW5jdGlvbigpe2QuJGVsZW1lbnQub25lKFwibW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsXCIsZnVuY3Rpb24oYil7YShiLnRhcmdldCkuaXMoZC4kZWxlbWVudCkmJihkLmlnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uKCl7dmFyIGU9YS5zdXBwb3J0LnRyYW5zaXRpb24mJmQuJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpO2QuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RofHxkLiRlbGVtZW50LmFwcGVuZFRvKGQuJGJvZHkpLGQuJGVsZW1lbnQuc2hvdygpLnNjcm9sbFRvcCgwKSxkLmFkanVzdERpYWxvZygpLGUmJmQuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGgsZC4kZWxlbWVudC5hZGRDbGFzcyhcImluXCIpLGQuZW5mb3JjZUZvY3VzKCk7dmFyIGY9YS5FdmVudChcInNob3duLmJzLm1vZGFsXCIse3JlbGF0ZWRUYXJnZXQ6Yn0pO2U/ZC4kZGlhbG9nLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7ZC4kZWxlbWVudC50cmlnZ2VyKFwiZm9jdXNcIikudHJpZ2dlcihmKX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuVFJBTlNJVElPTl9EVVJBVElPTik6ZC4kZWxlbWVudC50cmlnZ2VyKFwiZm9jdXNcIikudHJpZ2dlcihmKX0pKX0sYy5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihiKXtiJiZiLnByZXZlbnREZWZhdWx0KCksYj1hLkV2ZW50KFwiaGlkZS5icy5tb2RhbFwiKSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoYiksdGhpcy5pc1Nob3duJiYhYi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuaXNTaG93bj0hMSx0aGlzLmVzY2FwZSgpLHRoaXMucmVzaXplKCksYShkb2N1bWVudCkub2ZmKFwiZm9jdXNpbi5icy5tb2RhbFwiKSx0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiaW5cIikub2ZmKFwiY2xpY2suZGlzbWlzcy5icy5tb2RhbFwiKS5vZmYoXCJtb3VzZXVwLmRpc21pc3MuYnMubW9kYWxcIiksdGhpcy4kZGlhbG9nLm9mZihcIm1vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIpLGEuc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKT90aGlzLiRlbGVtZW50Lm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkodGhpcy5oaWRlTW9kYWwsdGhpcykpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuVFJBTlNJVElPTl9EVVJBVElPTik6dGhpcy5oaWRlTW9kYWwoKSl9LGMucHJvdG90eXBlLmVuZm9yY2VGb2N1cz1mdW5jdGlvbigpe2EoZG9jdW1lbnQpLm9mZihcImZvY3VzaW4uYnMubW9kYWxcIikub24oXCJmb2N1c2luLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbihhKXt0aGlzLiRlbGVtZW50WzBdPT09YS50YXJnZXR8fHRoaXMuJGVsZW1lbnQuaGFzKGEudGFyZ2V0KS5sZW5ndGh8fHRoaXMuJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpfSx0aGlzKSl9LGMucHJvdG90eXBlLmVzY2FwZT1mdW5jdGlvbigpe3RoaXMuaXNTaG93biYmdGhpcy5vcHRpb25zLmtleWJvYXJkP3RoaXMuJGVsZW1lbnQub24oXCJrZXlkb3duLmRpc21pc3MuYnMubW9kYWxcIixhLnByb3h5KGZ1bmN0aW9uKGEpezI3PT1hLndoaWNoJiZ0aGlzLmhpZGUoKX0sdGhpcykpOnRoaXMuaXNTaG93bnx8dGhpcy4kZWxlbWVudC5vZmYoXCJrZXlkb3duLmRpc21pc3MuYnMubW9kYWxcIil9LGMucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbigpe3RoaXMuaXNTaG93bj9hKHdpbmRvdykub24oXCJyZXNpemUuYnMubW9kYWxcIixhLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLHRoaXMpKTphKHdpbmRvdykub2ZmKFwicmVzaXplLmJzLm1vZGFsXCIpfSxjLnByb3RvdHlwZS5oaWRlTW9kYWw9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO3RoaXMuJGVsZW1lbnQuaGlkZSgpLHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24oKXthLiRib2R5LnJlbW92ZUNsYXNzKFwibW9kYWwtb3BlblwiKSxhLnJlc2V0QWRqdXN0bWVudHMoKSxhLnJlc2V0U2Nyb2xsYmFyKCksYS4kZWxlbWVudC50cmlnZ2VyKFwiaGlkZGVuLmJzLm1vZGFsXCIpfSl9LGMucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wPWZ1bmN0aW9uKCl7dGhpcy4kYmFja2Ryb3AmJnRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpLHRoaXMuJGJhY2tkcm9wPW51bGx9LGMucHJvdG90eXBlLmJhY2tkcm9wPWZ1bmN0aW9uKGIpe3ZhciBkPXRoaXMsZT10aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKT9cImZhZGVcIjpcIlwiO2lmKHRoaXMuaXNTaG93biYmdGhpcy5vcHRpb25zLmJhY2tkcm9wKXt2YXIgZj1hLnN1cHBvcnQudHJhbnNpdGlvbiYmZTtpZih0aGlzLiRiYWNrZHJvcD1hKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLmFkZENsYXNzKFwibW9kYWwtYmFja2Ryb3AgXCIrZSkuYXBwZW5kVG8odGhpcy4kYm9keSksdGhpcy4kZWxlbWVudC5vbihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIixhLnByb3h5KGZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2s/dm9pZCh0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2s9ITEpOnZvaWQoYS50YXJnZXQ9PT1hLmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT10aGlzLm9wdGlvbnMuYmFja2Ryb3A/dGhpcy4kZWxlbWVudFswXS5mb2N1cygpOnRoaXMuaGlkZSgpKSl9LHRoaXMpKSxmJiZ0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCx0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcyhcImluXCIpLCFiKXJldHVybjtmP3RoaXMuJGJhY2tkcm9wLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGIpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTik6YigpfWVsc2UgaWYoIXRoaXMuaXNTaG93biYmdGhpcy4kYmFja2Ryb3Ape3RoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKFwiaW5cIik7dmFyIGc9ZnVuY3Rpb24oKXtkLnJlbW92ZUJhY2tkcm9wKCksYiYmYigpfTthLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/dGhpcy4kYmFja2Ryb3Aub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKTpnKCl9ZWxzZSBiJiZiKCl9LGMucHJvdG90eXBlLmhhbmRsZVVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuYWRqdXN0RGlhbG9nKCl9LGMucHJvdG90eXBlLmFkanVzdERpYWxvZz1mdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0PmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7dGhpcy4kZWxlbWVudC5jc3Moe3BhZGRpbmdMZWZ0OiF0aGlzLmJvZHlJc092ZXJmbG93aW5nJiZhP3RoaXMuc2Nyb2xsYmFyV2lkdGg6XCJcIixwYWRkaW5nUmlnaHQ6dGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmIWE/dGhpcy5zY3JvbGxiYXJXaWR0aDpcIlwifSl9LGMucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHM9ZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LmNzcyh7cGFkZGluZ0xlZnQ6XCJcIixwYWRkaW5nUmlnaHQ6XCJcIn0pfSxjLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhcj1mdW5jdGlvbigpe3ZhciBhPXdpbmRvdy5pbm5lcldpZHRoO2lmKCFhKXt2YXIgYj1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7YT1iLnJpZ2h0LU1hdGguYWJzKGIubGVmdCl9dGhpcy5ib2R5SXNPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPGEsdGhpcy5zY3JvbGxiYXJXaWR0aD10aGlzLm1lYXN1cmVTY3JvbGxiYXIoKX0sYy5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIGE9cGFyc2VJbnQodGhpcy4kYm9keS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpfHwwLDEwKTt0aGlzLm9yaWdpbmFsQm9keVBhZD1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIix0aGlzLmJvZHlJc092ZXJmbG93aW5nJiZ0aGlzLiRib2R5LmNzcyhcInBhZGRpbmctcmlnaHRcIixhK3RoaXMuc2Nyb2xsYmFyV2lkdGgpfSxjLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhcj1mdW5jdGlvbigpe3RoaXMuJGJvZHkuY3NzKFwicGFkZGluZy1yaWdodFwiLHRoaXMub3JpZ2luYWxCb2R5UGFkKX0sYy5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7YS5jbGFzc05hbWU9XCJtb2RhbC1zY3JvbGxiYXItbWVhc3VyZVwiLHRoaXMuJGJvZHkuYXBwZW5kKGEpO3ZhciBiPWEub2Zmc2V0V2lkdGgtYS5jbGllbnRXaWR0aDtyZXR1cm4gdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChhKSxifTt2YXIgZD1hLmZuLm1vZGFsO2EuZm4ubW9kYWw9YixhLmZuLm1vZGFsLkNvbnN0cnVjdG9yPWMsYS5mbi5tb2RhbC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ubW9kYWw9ZCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLm1vZGFsLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxmdW5jdGlvbihjKXt2YXIgZD1hKHRoaXMpLGU9ZC5hdHRyKFwiaHJlZlwiKSxmPWEoZC5hdHRyKFwiZGF0YS10YXJnZXRcIil8fGUmJmUucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLyxcIlwiKSksZz1mLmRhdGEoXCJicy5tb2RhbFwiKT9cInRvZ2dsZVwiOmEuZXh0ZW5kKHtyZW1vdGU6IS8jLy50ZXN0KGUpJiZlfSxmLmRhdGEoKSxkLmRhdGEoKSk7ZC5pcyhcImFcIikmJmMucHJldmVudERlZmF1bHQoKSxmLm9uZShcInNob3cuYnMubW9kYWxcIixmdW5jdGlvbihhKXthLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxmLm9uZShcImhpZGRlbi5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7ZC5pcyhcIjp2aXNpYmxlXCIpJiZkLnRyaWdnZXIoXCJmb2N1c1wiKX0pfSksYi5jYWxsKGYsZyx0aGlzKX0pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKFwiYnMudG9vbHRpcFwiKSxmPVwib2JqZWN0XCI9PXR5cGVvZiBiJiZiOyhlfHwhL2Rlc3Ryb3l8aGlkZS8udGVzdChiKSkmJihlfHxkLmRhdGEoXCJicy50b29sdGlwXCIsZT1uZXcgYyh0aGlzLGYpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZVtiXSgpKX0pfXZhciBjPWZ1bmN0aW9uKGEsYil7dGhpcy50eXBlPW51bGwsdGhpcy5vcHRpb25zPW51bGwsdGhpcy5lbmFibGVkPW51bGwsdGhpcy50aW1lb3V0PW51bGwsdGhpcy5ob3ZlclN0YXRlPW51bGwsdGhpcy4kZWxlbWVudD1udWxsLHRoaXMuaW5TdGF0ZT1udWxsLHRoaXMuaW5pdChcInRvb2x0aXBcIixhLGIpfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsYy5ERUZBVUxUUz17YW5pbWF0aW9uOiEwLHBsYWNlbWVudDpcInRvcFwiLHNlbGVjdG9yOiExLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsY29udGFpbmVyOiExLHZpZXdwb3J0OntzZWxlY3RvcjpcImJvZHlcIixwYWRkaW5nOjB9fSxjLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGIsYyxkKXtpZih0aGlzLmVuYWJsZWQ9ITAsdGhpcy50eXBlPWIsdGhpcy4kZWxlbWVudD1hKGMpLHRoaXMub3B0aW9ucz10aGlzLmdldE9wdGlvbnMoZCksdGhpcy4kdmlld3BvcnQ9dGhpcy5vcHRpb25zLnZpZXdwb3J0JiZhKGEuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpP3RoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsdGhpcy4kZWxlbWVudCk6dGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yfHx0aGlzLm9wdGlvbnMudmlld3BvcnQpLHRoaXMuaW5TdGF0ZT17Y2xpY2s6ITEsaG92ZXI6ITEsZm9jdXM6ITF9LHRoaXMuJGVsZW1lbnRbMF1pbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yJiYhdGhpcy5vcHRpb25zLnNlbGVjdG9yKXRocm93IG5ldyBFcnJvcihcImBzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIFwiK3RoaXMudHlwZStcIiBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCFcIik7Zm9yKHZhciBlPXRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KFwiIFwiKSxmPWUubGVuZ3RoO2YtLTspe3ZhciBnPWVbZl07aWYoXCJjbGlja1wiPT1nKXRoaXMuJGVsZW1lbnQub24oXCJjbGljay5cIit0aGlzLnR5cGUsdGhpcy5vcHRpb25zLnNlbGVjdG9yLGEucHJveHkodGhpcy50b2dnbGUsdGhpcykpO2Vsc2UgaWYoXCJtYW51YWxcIiE9Zyl7dmFyIGg9XCJob3ZlclwiPT1nP1wibW91c2VlbnRlclwiOlwiZm9jdXNpblwiLGk9XCJob3ZlclwiPT1nP1wibW91c2VsZWF2ZVwiOlwiZm9jdXNvdXRcIjt0aGlzLiRlbGVtZW50Lm9uKGgrXCIuXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixhLnByb3h5KHRoaXMuZW50ZXIsdGhpcykpLHRoaXMuJGVsZW1lbnQub24oaStcIi5cIit0aGlzLnR5cGUsdGhpcy5vcHRpb25zLnNlbGVjdG9yLGEucHJveHkodGhpcy5sZWF2ZSx0aGlzKSl9fXRoaXMub3B0aW9ucy5zZWxlY3Rvcj90aGlzLl9vcHRpb25zPWEuZXh0ZW5kKHt9LHRoaXMub3B0aW9ucyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLmZpeFRpdGxlKCl9LGMucHJvdG90eXBlLmdldERlZmF1bHRzPWZ1bmN0aW9uKCl7cmV0dXJuIGMuREVGQVVMVFN9LGMucHJvdG90eXBlLmdldE9wdGlvbnM9ZnVuY3Rpb24oYil7cmV0dXJuIGI9YS5leHRlbmQoe30sdGhpcy5nZXREZWZhdWx0cygpLHRoaXMuJGVsZW1lbnQuZGF0YSgpLGIpLGIuZGVsYXkmJlwibnVtYmVyXCI9PXR5cGVvZiBiLmRlbGF5JiYoYi5kZWxheT17c2hvdzpiLmRlbGF5LGhpZGU6Yi5kZWxheX0pLGJ9LGMucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucz1mdW5jdGlvbigpe3ZhciBiPXt9LGM9dGhpcy5nZXREZWZhdWx0cygpO3JldHVybiB0aGlzLl9vcHRpb25zJiZhLmVhY2godGhpcy5fb3B0aW9ucyxmdW5jdGlvbihhLGQpe2NbYV0hPWQmJihiW2FdPWQpfSksYn0sYy5wcm90b3R5cGUuZW50ZXI9ZnVuY3Rpb24oYil7dmFyIGM9YiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I/YjphKGIuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSk7cmV0dXJuIGN8fChjPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGIuY3VycmVudFRhcmdldCx0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKSxhKGIuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSxjKSksYiBpbnN0YW5jZW9mIGEuRXZlbnQmJihjLmluU3RhdGVbXCJmb2N1c2luXCI9PWIudHlwZT9cImZvY3VzXCI6XCJob3ZlclwiXT0hMCksYy50aXAoKS5oYXNDbGFzcyhcImluXCIpfHxcImluXCI9PWMuaG92ZXJTdGF0ZT92b2lkKGMuaG92ZXJTdGF0ZT1cImluXCIpOihjbGVhclRpbWVvdXQoYy50aW1lb3V0KSxjLmhvdmVyU3RhdGU9XCJpblwiLGMub3B0aW9ucy5kZWxheSYmYy5vcHRpb25zLmRlbGF5LnNob3c/dm9pZChjLnRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1wiaW5cIj09Yy5ob3ZlclN0YXRlJiZjLnNob3coKX0sYy5vcHRpb25zLmRlbGF5LnNob3cpKTpjLnNob3coKSl9LGMucHJvdG90eXBlLmlzSW5TdGF0ZVRydWU9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5pblN0YXRlKWlmKHRoaXMuaW5TdGF0ZVthXSlyZXR1cm4hMDtyZXR1cm4hMX0sYy5wcm90b3R5cGUubGVhdmU9ZnVuY3Rpb24oYil7dmFyIGM9YiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I/YjphKGIuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSk7cmV0dXJuIGN8fChjPW5ldyB0aGlzLmNvbnN0cnVjdG9yKGIuY3VycmVudFRhcmdldCx0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKSxhKGIuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSxjKSksYiBpbnN0YW5jZW9mIGEuRXZlbnQmJihjLmluU3RhdGVbXCJmb2N1c291dFwiPT1iLnR5cGU/XCJmb2N1c1wiOlwiaG92ZXJcIl09ITEpLGMuaXNJblN0YXRlVHJ1ZSgpP3ZvaWQgMDooY2xlYXJUaW1lb3V0KGMudGltZW91dCksYy5ob3ZlclN0YXRlPVwib3V0XCIsYy5vcHRpb25zLmRlbGF5JiZjLm9wdGlvbnMuZGVsYXkuaGlkZT92b2lkKGMudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XCJvdXRcIj09Yy5ob3ZlclN0YXRlJiZjLmhpZGUoKX0sYy5vcHRpb25zLmRlbGF5LmhpZGUpKTpjLmhpZGUoKSl9LGMucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgYj1hLkV2ZW50KFwic2hvdy5icy5cIit0aGlzLnR5cGUpO2lmKHRoaXMuaGFzQ29udGVudCgpJiZ0aGlzLmVuYWJsZWQpe3RoaXMuJGVsZW1lbnQudHJpZ2dlcihiKTt2YXIgZD1hLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy4kZWxlbWVudFswXSk7aWYoYi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8IWQpcmV0dXJuO3ZhciBlPXRoaXMsZj10aGlzLnRpcCgpLGc9dGhpcy5nZXRVSUQodGhpcy50eXBlKTt0aGlzLnNldENvbnRlbnQoKSxmLmF0dHIoXCJpZFwiLGcpLHRoaXMuJGVsZW1lbnQuYXR0cihcImFyaWEtZGVzY3JpYmVkYnlcIixnKSx0aGlzLm9wdGlvbnMuYW5pbWF0aW9uJiZmLmFkZENsYXNzKFwiZmFkZVwiKTt2YXIgaD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50P3RoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLGZbMF0sdGhpcy4kZWxlbWVudFswXSk6dGhpcy5vcHRpb25zLnBsYWNlbWVudCxpPS9cXHM/YXV0bz9cXHM/L2ksaj1pLnRlc3QoaCk7aiYmKGg9aC5yZXBsYWNlKGksXCJcIil8fFwidG9wXCIpLGYuZGV0YWNoKCkuY3NzKHt0b3A6MCxsZWZ0OjAsZGlzcGxheTpcImJsb2NrXCJ9KS5hZGRDbGFzcyhoKS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLHRoaXMpLHRoaXMub3B0aW9ucy5jb250YWluZXI/Zi5hcHBlbmRUbyh0aGlzLm9wdGlvbnMuY29udGFpbmVyKTpmLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpLHRoaXMuJGVsZW1lbnQudHJpZ2dlcihcImluc2VydGVkLmJzLlwiK3RoaXMudHlwZSk7dmFyIGs9dGhpcy5nZXRQb3NpdGlvbigpLGw9ZlswXS5vZmZzZXRXaWR0aCxtPWZbMF0ub2Zmc2V0SGVpZ2h0O2lmKGope3ZhciBuPWgsbz10aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KTtoPVwiYm90dG9tXCI9PWgmJmsuYm90dG9tK20+by5ib3R0b20/XCJ0b3BcIjpcInRvcFwiPT1oJiZrLnRvcC1tPG8udG9wP1wiYm90dG9tXCI6XCJyaWdodFwiPT1oJiZrLnJpZ2h0K2w+by53aWR0aD9cImxlZnRcIjpcImxlZnRcIj09aCYmay5sZWZ0LWw8by5sZWZ0P1wicmlnaHRcIjpoLGYucmVtb3ZlQ2xhc3MobikuYWRkQ2xhc3MoaCl9dmFyIHA9dGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KGgsayxsLG0pO3RoaXMuYXBwbHlQbGFjZW1lbnQocCxoKTt2YXIgcT1mdW5jdGlvbigpe3ZhciBhPWUuaG92ZXJTdGF0ZTtlLiRlbGVtZW50LnRyaWdnZXIoXCJzaG93bi5icy5cIitlLnR5cGUpLGUuaG92ZXJTdGF0ZT1udWxsLFwib3V0XCI9PWEmJmUubGVhdmUoZSl9O2Euc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiR0aXAuaGFzQ2xhc3MoXCJmYWRlXCIpP2Yub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIscSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5UUkFOU0lUSU9OX0RVUkFUSU9OKTpxKCl9fSxjLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudD1mdW5jdGlvbihiLGMpe3ZhciBkPXRoaXMudGlwKCksZT1kWzBdLm9mZnNldFdpZHRoLGY9ZFswXS5vZmZzZXRIZWlnaHQsZz1wYXJzZUludChkLmNzcyhcIm1hcmdpbi10b3BcIiksMTApLGg9cGFyc2VJbnQoZC5jc3MoXCJtYXJnaW4tbGVmdFwiKSwxMCk7aXNOYU4oZykmJihnPTApLGlzTmFOKGgpJiYoaD0wKSxiLnRvcCs9ZyxiLmxlZnQrPWgsYS5vZmZzZXQuc2V0T2Zmc2V0KGRbMF0sYS5leHRlbmQoe3VzaW5nOmZ1bmN0aW9uKGEpe2QuY3NzKHt0b3A6TWF0aC5yb3VuZChhLnRvcCksbGVmdDpNYXRoLnJvdW5kKGEubGVmdCl9KX19LGIpLDApLGQuYWRkQ2xhc3MoXCJpblwiKTt2YXIgaT1kWzBdLm9mZnNldFdpZHRoLGo9ZFswXS5vZmZzZXRIZWlnaHQ7XCJ0b3BcIj09YyYmaiE9ZiYmKGIudG9wPWIudG9wK2Ytaik7dmFyIGs9dGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEoYyxiLGksaik7ay5sZWZ0P2IubGVmdCs9ay5sZWZ0OmIudG9wKz1rLnRvcDt2YXIgbD0vdG9wfGJvdHRvbS8udGVzdChjKSxtPWw/MiprLmxlZnQtZStpOjIqay50b3AtZitqLG49bD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjtkLm9mZnNldChiKSx0aGlzLnJlcGxhY2VBcnJvdyhtLGRbMF1bbl0sbCl9LGMucHJvdG90eXBlLnJlcGxhY2VBcnJvdz1mdW5jdGlvbihhLGIsYyl7dGhpcy5hcnJvdygpLmNzcyhjP1wibGVmdFwiOlwidG9wXCIsNTAqKDEtYS9iKStcIiVcIikuY3NzKGM/XCJ0b3BcIjpcImxlZnRcIixcIlwiKX0sYy5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciBhPXRoaXMudGlwKCksYj10aGlzLmdldFRpdGxlKCk7YS5maW5kKFwiLnRvb2x0aXAtaW5uZXJcIilbdGhpcy5vcHRpb25zLmh0bWw/XCJodG1sXCI6XCJ0ZXh0XCJdKGIpLGEucmVtb3ZlQ2xhc3MoXCJmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodFwiKX0sYy5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbihiKXtmdW5jdGlvbiBkKCl7XCJpblwiIT1lLmhvdmVyU3RhdGUmJmYuZGV0YWNoKCksZS4kZWxlbWVudC5yZW1vdmVBdHRyKFwiYXJpYS1kZXNjcmliZWRieVwiKS50cmlnZ2VyKFwiaGlkZGVuLmJzLlwiK2UudHlwZSksYiYmYigpfXZhciBlPXRoaXMsZj1hKHRoaXMuJHRpcCksZz1hLkV2ZW50KFwiaGlkZS5icy5cIit0aGlzLnR5cGUpO3JldHVybiB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZyksZy5pc0RlZmF1bHRQcmV2ZW50ZWQoKT92b2lkIDA6KGYucmVtb3ZlQ2xhc3MoXCJpblwiKSxhLnN1cHBvcnQudHJhbnNpdGlvbiYmZi5oYXNDbGFzcyhcImZhZGVcIik/Zi5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixkKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLlRSQU5TSVRJT05fRFVSQVRJT04pOmQoKSx0aGlzLmhvdmVyU3RhdGU9bnVsbCx0aGlzKX0sYy5wcm90b3R5cGUuZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50OyhhLmF0dHIoXCJ0aXRsZVwiKXx8XCJzdHJpbmdcIiE9dHlwZW9mIGEuYXR0cihcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpJiZhLmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIsYS5hdHRyKFwidGl0bGVcIil8fFwiXCIpLmF0dHIoXCJ0aXRsZVwiLFwiXCIpfSxjLnByb3RvdHlwZS5oYXNDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKX0sYy5wcm90b3R5cGUuZ2V0UG9zaXRpb249ZnVuY3Rpb24oYil7Yj1ifHx0aGlzLiRlbGVtZW50O3ZhciBjPWJbMF0sZD1cIkJPRFlcIj09Yy50YWdOYW1lLGU9Yy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtudWxsPT1lLndpZHRoJiYoZT1hLmV4dGVuZCh7fSxlLHt3aWR0aDplLnJpZ2h0LWUubGVmdCxoZWlnaHQ6ZS5ib3R0b20tZS50b3B9KSk7dmFyIGY9ZD97dG9wOjAsbGVmdDowfTpiLm9mZnNldCgpLGc9e3Njcm9sbDpkP2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3B8fGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wOmIuc2Nyb2xsVG9wKCl9LGg9ZD97d2lkdGg6YSh3aW5kb3cpLndpZHRoKCksaGVpZ2h0OmEod2luZG93KS5oZWlnaHQoKX06bnVsbDtyZXR1cm4gYS5leHRlbmQoe30sZSxnLGgsZil9LGMucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQ9ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuXCJib3R0b21cIj09YT97dG9wOmIudG9wK2IuaGVpZ2h0LGxlZnQ6Yi5sZWZ0K2Iud2lkdGgvMi1jLzJ9OlwidG9wXCI9PWE/e3RvcDpiLnRvcC1kLGxlZnQ6Yi5sZWZ0K2Iud2lkdGgvMi1jLzJ9OlwibGVmdFwiPT1hP3t0b3A6Yi50b3ArYi5oZWlnaHQvMi1kLzIsbGVmdDpiLmxlZnQtY306e3RvcDpiLnRvcCtiLmhlaWdodC8yLWQvMixsZWZ0OmIubGVmdCtiLndpZHRofX0sYy5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPXt0b3A6MCxsZWZ0OjB9O2lmKCF0aGlzLiR2aWV3cG9ydClyZXR1cm4gZTt2YXIgZj10aGlzLm9wdGlvbnMudmlld3BvcnQmJnRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nfHwwLGc9dGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydCk7aWYoL3JpZ2h0fGxlZnQvLnRlc3QoYSkpe3ZhciBoPWIudG9wLWYtZy5zY3JvbGwsaT1iLnRvcCtmLWcuc2Nyb2xsK2Q7aDxnLnRvcD9lLnRvcD1nLnRvcC1oOmk+Zy50b3ArZy5oZWlnaHQmJihlLnRvcD1nLnRvcCtnLmhlaWdodC1pKX1lbHNle3ZhciBqPWIubGVmdC1mLGs9Yi5sZWZ0K2YrYztqPGcubGVmdD9lLmxlZnQ9Zy5sZWZ0LWo6az5nLnJpZ2h0JiYoZS5sZWZ0PWcubGVmdCtnLndpZHRoLWspfXJldHVybiBlfSxjLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciBhLGI9dGhpcy4kZWxlbWVudCxjPXRoaXMub3B0aW9ucztyZXR1cm4gYT1iLmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgYy50aXRsZT9jLnRpdGxlLmNhbGwoYlswXSk6Yy50aXRsZSl9LGMucHJvdG90eXBlLmdldFVJRD1mdW5jdGlvbihhKXtkbyBhKz1+figxZTYqTWF0aC5yYW5kb20oKSk7d2hpbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYSkpO3JldHVybiBhfSxjLnByb3RvdHlwZS50aXA9ZnVuY3Rpb24oKXtpZighdGhpcy4kdGlwJiYodGhpcy4kdGlwPWEodGhpcy5vcHRpb25zLnRlbXBsYXRlKSwxIT10aGlzLiR0aXAubGVuZ3RoKSl0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlK1wiIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhXCIpO3JldHVybiB0aGlzLiR0aXB9LGMucHJvdG90eXBlLmFycm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGFycm93PXRoaXMuJGFycm93fHx0aGlzLnRpcCgpLmZpbmQoXCIudG9vbHRpcC1hcnJvd1wiKX0sYy5wcm90b3R5cGUuZW5hYmxlPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSEwfSxjLnByb3RvdHlwZS5kaXNhYmxlPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSExfSxjLnByb3RvdHlwZS50b2dnbGVFbmFibGVkPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSF0aGlzLmVuYWJsZWR9LGMucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihiKXt2YXIgYz10aGlzO2ImJihjPWEoYi5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlKSxjfHwoYz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihiLmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksYShiLmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsYykpKSxiPyhjLmluU3RhdGUuY2xpY2s9IWMuaW5TdGF0ZS5jbGljayxjLmlzSW5TdGF0ZVRydWUoKT9jLmVudGVyKGMpOmMubGVhdmUoYykpOmMudGlwKCkuaGFzQ2xhc3MoXCJpblwiKT9jLmxlYXZlKGMpOmMuZW50ZXIoYyl9LGMucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2NsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpLHRoaXMuaGlkZShmdW5jdGlvbigpe2EuJGVsZW1lbnQub2ZmKFwiLlwiK2EudHlwZSkucmVtb3ZlRGF0YShcImJzLlwiK2EudHlwZSksYS4kdGlwJiZhLiR0aXAuZGV0YWNoKCksYS4kdGlwPW51bGwsYS4kYXJyb3c9bnVsbCxhLiR2aWV3cG9ydD1udWxsfSl9O3ZhciBkPWEuZm4udG9vbHRpcDthLmZuLnRvb2x0aXA9YixhLmZuLnRvb2x0aXAuQ29uc3RydWN0b3I9YyxhLmZuLnRvb2x0aXAubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnRvb2x0aXA9ZCx0aGlzfX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGQ9YSh0aGlzKSxlPWQuZGF0YShcImJzLnBvcG92ZXJcIiksZj1cIm9iamVjdFwiPT10eXBlb2YgYiYmYjsoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QoYikpJiYoZXx8ZC5kYXRhKFwiYnMucG9wb3ZlclwiLGU9bmV3IGModGhpcyxmKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmVbYl0oKSl9KX12YXIgYz1mdW5jdGlvbihhLGIpe3RoaXMuaW5pdChcInBvcG92ZXJcIixhLGIpfTtpZighYS5mbi50b29sdGlwKXRocm93IG5ldyBFcnJvcihcIlBvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qc1wiKTtjLlZFUlNJT049XCIzLjMuNlwiLGMuREVGQVVMVFM9YS5leHRlbmQoe30sYS5mbi50b29sdGlwLkNvbnN0cnVjdG9yLkRFRkFVTFRTLHtwbGFjZW1lbnQ6XCJyaWdodFwiLHRyaWdnZXI6XCJjbGlja1wiLGNvbnRlbnQ6XCJcIix0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nfSksYy5wcm90b3R5cGU9YS5leHRlbmQoe30sYS5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSksYy5wcm90b3R5cGUuY29uc3RydWN0b3I9YyxjLnByb3RvdHlwZS5nZXREZWZhdWx0cz1mdW5jdGlvbigpe3JldHVybiBjLkRFRkFVTFRTfSxjLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy50aXAoKSxiPXRoaXMuZ2V0VGl0bGUoKSxjPXRoaXMuZ2V0Q29udGVudCgpO2EuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpW3RoaXMub3B0aW9ucy5odG1sP1wiaHRtbFwiOlwidGV4dFwiXShiKSxhLmZpbmQoXCIucG9wb3Zlci1jb250ZW50XCIpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbdGhpcy5vcHRpb25zLmh0bWw/XCJzdHJpbmdcIj09dHlwZW9mIGM/XCJodG1sXCI6XCJhcHBlbmRcIjpcInRleHRcIl0oYyksYS5yZW1vdmVDbGFzcyhcImZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluXCIpLGEuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLmh0bWwoKXx8YS5maW5kKFwiLnBvcG92ZXItdGl0bGVcIikuaGlkZSgpfSxjLnByb3RvdHlwZS5oYXNDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKXx8dGhpcy5nZXRDb250ZW50KCl9LGMucHJvdG90eXBlLmdldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LGI9dGhpcy5vcHRpb25zO3JldHVybiBhLmF0dHIoXCJkYXRhLWNvbnRlbnRcIil8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiBiLmNvbnRlbnQ/Yi5jb250ZW50LmNhbGwoYVswXSk6Yi5jb250ZW50KX0sYy5wcm90b3R5cGUuYXJyb3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kYXJyb3c9dGhpcy4kYXJyb3d8fHRoaXMudGlwKCkuZmluZChcIi5hcnJvd1wiKX07dmFyIGQ9YS5mbi5wb3BvdmVyO2EuZm4ucG9wb3Zlcj1iLGEuZm4ucG9wb3Zlci5Db25zdHJ1Y3Rvcj1jLGEuZm4ucG9wb3Zlci5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ucG9wb3Zlcj1kLHRoaXN9fShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGMsZCl7dGhpcy4kYm9keT1hKGRvY3VtZW50LmJvZHkpLHRoaXMuJHNjcm9sbEVsZW1lbnQ9YShhKGMpLmlzKGRvY3VtZW50LmJvZHkpP3dpbmRvdzpjKSx0aGlzLm9wdGlvbnM9YS5leHRlbmQoe30sYi5ERUZBVUxUUyxkKSx0aGlzLnNlbGVjdG9yPSh0aGlzLm9wdGlvbnMudGFyZ2V0fHxcIlwiKStcIiAubmF2IGxpID4gYVwiLHRoaXMub2Zmc2V0cz1bXSx0aGlzLnRhcmdldHM9W10sdGhpcy5hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLnNjcm9sbEhlaWdodD0wLHRoaXMuJHNjcm9sbEVsZW1lbnQub24oXCJzY3JvbGwuYnMuc2Nyb2xsc3B5XCIsYS5wcm94eSh0aGlzLnByb2Nlc3MsdGhpcykpLHRoaXMucmVmcmVzaCgpLHRoaXMucHJvY2VzcygpfWZ1bmN0aW9uIGMoYyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy5zY3JvbGxzcHlcIiksZj1cIm9iamVjdFwiPT10eXBlb2YgYyYmYztlfHxkLmRhdGEoXCJicy5zY3JvbGxzcHlcIixlPW5ldyBiKHRoaXMsZikpLFwic3RyaW5nXCI9PXR5cGVvZiBjJiZlW2NdKCl9KX1iLlZFUlNJT049XCIzLjMuNlwiLGIuREVGQVVMVFM9e29mZnNldDoxMH0sYi5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0sYi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBiPXRoaXMsYz1cIm9mZnNldFwiLGQ9MDt0aGlzLm9mZnNldHM9W10sdGhpcy50YXJnZXRzPVtdLHRoaXMuc2Nyb2xsSGVpZ2h0PXRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KCksYS5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKXx8KGM9XCJwb3NpdGlvblwiLGQ9dGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSksdGhpcy4kYm9keS5maW5kKHRoaXMuc2VsZWN0b3IpLm1hcChmdW5jdGlvbigpe3ZhciBiPWEodGhpcyksZT1iLmRhdGEoXCJ0YXJnZXRcIil8fGIuYXR0cihcImhyZWZcIiksZj0vXiMuLy50ZXN0KGUpJiZhKGUpO3JldHVybiBmJiZmLmxlbmd0aCYmZi5pcyhcIjp2aXNpYmxlXCIpJiZbW2ZbY10oKS50b3ArZCxlXV18fG51bGx9KS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF0tYlswXX0pLmVhY2goZnVuY3Rpb24oKXtiLm9mZnNldHMucHVzaCh0aGlzWzBdKSxiLnRhcmdldHMucHVzaCh0aGlzWzFdKX0pfSxiLnByb3RvdHlwZS5wcm9jZXNzPWZ1bmN0aW9uKCl7dmFyIGEsYj10aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpK3RoaXMub3B0aW9ucy5vZmZzZXQsYz10aGlzLmdldFNjcm9sbEhlaWdodCgpLGQ9dGhpcy5vcHRpb25zLm9mZnNldCtjLXRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KCksZT10aGlzLm9mZnNldHMsZj10aGlzLnRhcmdldHMsZz10aGlzLmFjdGl2ZVRhcmdldDtpZih0aGlzLnNjcm9sbEhlaWdodCE9YyYmdGhpcy5yZWZyZXNoKCksYj49ZClyZXR1cm4gZyE9KGE9ZltmLmxlbmd0aC0xXSkmJnRoaXMuYWN0aXZhdGUoYSk7aWYoZyYmYjxlWzBdKXJldHVybiB0aGlzLmFjdGl2ZVRhcmdldD1udWxsLHRoaXMuY2xlYXIoKTtmb3IoYT1lLmxlbmd0aDthLS07KWchPWZbYV0mJmI+PWVbYV0mJih2b2lkIDA9PT1lW2ErMV18fGI8ZVthKzFdKSYmdGhpcy5hY3RpdmF0ZShmW2FdKX0sYi5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oYil7dGhpcy5hY3RpdmVUYXJnZXQ9Yix0aGlzLmNsZWFyKCk7dmFyIGM9dGhpcy5zZWxlY3RvcisnW2RhdGEtdGFyZ2V0PVwiJytiKydcIl0sJyt0aGlzLnNlbGVjdG9yKydbaHJlZj1cIicrYisnXCJdJyxkPWEoYykucGFyZW50cyhcImxpXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuZC5wYXJlbnQoXCIuZHJvcGRvd24tbWVudVwiKS5sZW5ndGgmJihkPWQuY2xvc2VzdChcImxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpKSxkLnRyaWdnZXIoXCJhY3RpdmF0ZS5icy5zY3JvbGxzcHlcIil9LGIucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7YSh0aGlzLnNlbGVjdG9yKS5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCxcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIil9O3ZhciBkPWEuZm4uc2Nyb2xsc3B5O2EuZm4uc2Nyb2xsc3B5PWMsYS5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3I9YixhLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uc2Nyb2xsc3B5PWQsdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGlcIixmdW5jdGlvbigpe2EoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24oKXt2YXIgYj1hKHRoaXMpO2MuY2FsbChiLGIuZGF0YSgpKX0pfSl9KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy50YWJcIik7ZXx8ZC5kYXRhKFwiYnMudGFiXCIsZT1uZXcgYyh0aGlzKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmVbYl0oKX0pfXZhciBjPWZ1bmN0aW9uKGIpe3RoaXMuZWxlbWVudD1hKGIpfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsYy5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciBiPXRoaXMuZWxlbWVudCxjPWIuY2xvc2VzdChcInVsOm5vdCguZHJvcGRvd24tbWVudSlcIiksZD1iLmRhdGEoXCJ0YXJnZXRcIik7aWYoZHx8KGQ9Yi5hdHRyKFwiaHJlZlwiKSxkPWQmJmQucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLyxcIlwiKSksIWIucGFyZW50KFwibGlcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe3ZhciBlPWMuZmluZChcIi5hY3RpdmU6bGFzdCBhXCIpLGY9YS5FdmVudChcImhpZGUuYnMudGFiXCIse3JlbGF0ZWRUYXJnZXQ6YlswXX0pLGc9YS5FdmVudChcInNob3cuYnMudGFiXCIse3JlbGF0ZWRUYXJnZXQ6ZVswXX0pO2lmKGUudHJpZ2dlcihmKSxiLnRyaWdnZXIoZyksIWcuaXNEZWZhdWx0UHJldmVudGVkKCkmJiFmLmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgaD1hKGQpO3RoaXMuYWN0aXZhdGUoYi5jbG9zZXN0KFwibGlcIiksYyksdGhpcy5hY3RpdmF0ZShoLGgucGFyZW50KCksZnVuY3Rpb24oKXtlLnRyaWdnZXIoe3R5cGU6XCJoaWRkZW4uYnMudGFiXCIscmVsYXRlZFRhcmdldDpiWzBdfSksYi50cmlnZ2VyKHt0eXBlOlwic2hvd24uYnMudGFiXCIscmVsYXRlZFRhcmdldDplWzBdfSl9KX19fSxjLnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbihiLGQsZSl7ZnVuY3Rpb24gZigpe2cucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuZmluZChcIj4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmVuZCgpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLGIuYWRkQ2xhc3MoXCJhY3RpdmVcIikuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksaD8oYlswXS5vZmZzZXRXaWR0aCxiLmFkZENsYXNzKFwiaW5cIikpOmIucmVtb3ZlQ2xhc3MoXCJmYWRlXCIpLGIucGFyZW50KFwiLmRyb3Bkb3duLW1lbnVcIikubGVuZ3RoJiZiLmNsb3Nlc3QoXCJsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5lbmQoKS5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSxlJiZlKCl9dmFyIGc9ZC5maW5kKFwiPiAuYWN0aXZlXCIpLGg9ZSYmYS5zdXBwb3J0LnRyYW5zaXRpb24mJihnLmxlbmd0aCYmZy5oYXNDbGFzcyhcImZhZGVcIil8fCEhZC5maW5kKFwiPiAuZmFkZVwiKS5sZW5ndGgpO2cubGVuZ3RoJiZoP2cub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZikuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5UUkFOU0lUSU9OX0RVUkFUSU9OKTpmKCksZy5yZW1vdmVDbGFzcyhcImluXCIpfTt2YXIgZD1hLmZuLnRhYjthLmZuLnRhYj1iLGEuZm4udGFiLkNvbnN0cnVjdG9yPWMsYS5mbi50YWIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnRhYj1kLHRoaXN9O3ZhciBlPWZ1bmN0aW9uKGMpe2MucHJldmVudERlZmF1bHQoKSxiLmNhbGwoYSh0aGlzKSxcInNob3dcIil9O2EoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMudGFiLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsZSkub24oXCJjbGljay5icy50YWIuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsZSl9KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy5hZmZpeFwiKSxmPVwib2JqZWN0XCI9PXR5cGVvZiBiJiZiO2V8fGQuZGF0YShcImJzLmFmZml4XCIsZT1uZXcgYyh0aGlzLGYpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZVtiXSgpfSl9dmFyIGM9ZnVuY3Rpb24oYixkKXt0aGlzLm9wdGlvbnM9YS5leHRlbmQoe30sYy5ERUZBVUxUUyxkKSx0aGlzLiR0YXJnZXQ9YSh0aGlzLm9wdGlvbnMudGFyZ2V0KS5vbihcInNjcm9sbC5icy5hZmZpeC5kYXRhLWFwaVwiLGEucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLHRoaXMpKS5vbihcImNsaWNrLmJzLmFmZml4LmRhdGEtYXBpXCIsYS5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLHRoaXMpKSx0aGlzLiRlbGVtZW50PWEoYiksdGhpcy5hZmZpeGVkPW51bGwsdGhpcy51bnBpbj1udWxsLHRoaXMucGlubmVkT2Zmc2V0PW51bGwsdGhpcy5jaGVja1Bvc2l0aW9uKCl9O2MuVkVSU0lPTj1cIjMuMy42XCIsYy5SRVNFVD1cImFmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b21cIixjLkRFRkFVTFRTPXtvZmZzZXQ6MCx0YXJnZXQ6d2luZG93fSxjLnByb3RvdHlwZS5nZXRTdGF0ZT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT10aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKCksZj10aGlzLiRlbGVtZW50Lm9mZnNldCgpLGc9dGhpcy4kdGFyZ2V0LmhlaWdodCgpO2lmKG51bGwhPWMmJlwidG9wXCI9PXRoaXMuYWZmaXhlZClyZXR1cm4gYz5lP1widG9wXCI6ITE7aWYoXCJib3R0b21cIj09dGhpcy5hZmZpeGVkKXJldHVybiBudWxsIT1jP2UrdGhpcy51bnBpbjw9Zi50b3A/ITE6XCJib3R0b21cIjphLWQ+PWUrZz8hMTpcImJvdHRvbVwiO3ZhciBoPW51bGw9PXRoaXMuYWZmaXhlZCxpPWg/ZTpmLnRvcCxqPWg/ZzpiO3JldHVybiBudWxsIT1jJiZjPj1lP1widG9wXCI6bnVsbCE9ZCYmaStqPj1hLWQ/XCJib3R0b21cIjohMX0sYy5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0PWZ1bmN0aW9uKCl7aWYodGhpcy5waW5uZWRPZmZzZXQpcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0O3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoYy5SRVNFVCkuYWRkQ2xhc3MoXCJhZmZpeFwiKTt2YXIgYT10aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKCksYj10aGlzLiRlbGVtZW50Lm9mZnNldCgpO3JldHVybiB0aGlzLnBpbm5lZE9mZnNldD1iLnRvcC1hfSxjLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcD1mdW5jdGlvbigpe3NldFRpbWVvdXQoYS5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sdGhpcyksMSl9LGMucHJvdG90eXBlLmNoZWNrUG9zaXRpb249ZnVuY3Rpb24oKXtpZih0aGlzLiRlbGVtZW50LmlzKFwiOnZpc2libGVcIikpe3ZhciBiPXRoaXMuJGVsZW1lbnQuaGVpZ2h0KCksZD10aGlzLm9wdGlvbnMub2Zmc2V0LGU9ZC50b3AsZj1kLmJvdHRvbSxnPU1hdGgubWF4KGEoZG9jdW1lbnQpLmhlaWdodCgpLGEoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpO1wib2JqZWN0XCIhPXR5cGVvZiBkJiYoZj1lPWQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihlPWQudG9wKHRoaXMuJGVsZW1lbnQpKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiYoZj1kLmJvdHRvbSh0aGlzLiRlbGVtZW50KSk7dmFyIGg9dGhpcy5nZXRTdGF0ZShnLGIsZSxmKTtpZih0aGlzLmFmZml4ZWQhPWgpe251bGwhPXRoaXMudW5waW4mJnRoaXMuJGVsZW1lbnQuY3NzKFwidG9wXCIsXCJcIik7dmFyIGk9XCJhZmZpeFwiKyhoP1wiLVwiK2g6XCJcIiksaj1hLkV2ZW50KGkrXCIuYnMuYWZmaXhcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGopLGouaXNEZWZhdWx0UHJldmVudGVkKCkpcmV0dXJuO3RoaXMuYWZmaXhlZD1oLHRoaXMudW5waW49XCJib3R0b21cIj09aD90aGlzLmdldFBpbm5lZE9mZnNldCgpOm51bGwsdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhjLlJFU0VUKS5hZGRDbGFzcyhpKS50cmlnZ2VyKGkucmVwbGFjZShcImFmZml4XCIsXCJhZmZpeGVkXCIpK1wiLmJzLmFmZml4XCIpfVwiYm90dG9tXCI9PWgmJnRoaXMuJGVsZW1lbnQub2Zmc2V0KHt0b3A6Zy1iLWZ9KX19O3ZhciBkPWEuZm4uYWZmaXg7YS5mbi5hZmZpeD1iLGEuZm4uYWZmaXguQ29uc3RydWN0b3I9YyxhLmZuLmFmZml4Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5hZmZpeD1kLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcyksZD1jLmRhdGEoKTtkLm9mZnNldD1kLm9mZnNldHx8e30sbnVsbCE9ZC5vZmZzZXRCb3R0b20mJihkLm9mZnNldC5ib3R0b209ZC5vZmZzZXRCb3R0b20pLG51bGwhPWQub2Zmc2V0VG9wJiYoZC5vZmZzZXQudG9wPWQub2Zmc2V0VG9wKSxiLmNhbGwoYyxkKX0pfSl9KGpRdWVyeSk7IiwiYW5ndWxhci5tb2R1bGUoXCJZb3VyQXBwXCIpLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xyXG5cclxuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJwYWdlcy9jcmVhdGUuaHRtbFwiLFxyXG4gICAgXCI8c2VjdGlvbiBpZD1cXFwiY3JlYXRlXFxcIiBiaW5kb25jZT1cXFwic29tZS5tb2RlbC5vYmplY3RcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPGg0PidTdXA/IEhFWSEgVGhpcyBpcyB0aGUgdGVtcGxhdGUgZm9yIENvbnRhY3QgQ3JlYXRpb248L2g0PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS02IHRleHQtY2VudGVyXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxoMT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICBQc3N0ISBIZXkga2lkLCB3YW5uYSBjcmVhdGUgc29tZSBDb250YWN0cz9cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDwvaDE+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8Zm9ybSBub3ZhbGlkYXRlIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgIG5hbWU9XFxcImNyZWF0ZUZvcm1cXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWlubGluZSBjb2wtc20tNiBjcmVhdGluZy1mb3JtXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICBuZy1zdWJtaXQ9c3VibWl0KCk+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIk5hbWVcXFwiPk5hbWU8L2xhYmVsPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJuYW1lXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJOYW1lXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiSGVyZSBnb2VzIHRoZSBOYW1lLi4uXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiTGFzdE5hbWVcXFwiPkxhc3QgTmFtZTwvbGFiZWw+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XFxcImxhc3RuYW1lXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJMYXN0TmFtZVxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkFuZCB0aGUgTGFzdCBOYW1lIGhlcmVcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGlkPVxcXCJjcmVhdGVCdG5cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPkNyZWF0ZSBpdCE8L2J1dHRvbj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Zvcm0+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIjwvc2VjdGlvbj5cIlxyXG4gICk7XHJcblxyXG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhZ2VzL2VkaXQuaHRtbFwiLFxyXG4gICAgXCI8c2VjdGlvbiBpZD1cXFwiZWRpdFxcXCIgYmluZG9uY2U9XFxcInNvbWUubW9kZWwub2JqZWN0XFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDxoND4nU3VwPyBUaGlzIGlzIHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIENvbnRhY3QgRWRpdGlvbjwvaDQ+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDxkaXYgY2xhc3M9XFxcImNvbnRhaW5lclxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTYgdGV4dC1jZW50ZXJcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGgxPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIER1ZGUhIFRoYXQgZW50cnkgbG9va3Mgd2VpcmQsIHdhbm5hIGNoYW5nZSBpdD9cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDwvaDE+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8Zm9ybSBub3ZhbGlkYXRlIGNsYXNzPVxcXCJmb3JtLWlubGluZSBjb2wtc20tNiBlZGl0aW5nLWZvcm1cXFwiIG5nLXN1Ym1pdD1zdWJtaXQoKT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93IHRleHQtY2VudGVyXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJJZFxcXCI+SWQ8L2xhYmVsPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJpZFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XFxcImlkXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJUaGUgSWQgZ29lcyBoZXJlLCBwbGVhc2VcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiTmFtZVxcXCI+TmFtZTwvbGFiZWw+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcIm5hbWVcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJuYW1lXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJIZXJlIGdvZXMgdGhlIE5hbWUuLi5cXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJMYXN0TmFtZVxcXCI+TGFzdCBOYW1lPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwibGFzdE5hbWVcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJsYXN0bmFtZVxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiQW5kIHRoZSBMYXN0IE5hbWUgaGVyZVxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCI+Q2hhbmdlIGl0ITwvYnV0dG9uPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDwvZm9ybT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8IS0tIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgKlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgKiBIZXJlIGdvZXMgdGhlIEVkaXRcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICogXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgLS0+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiPC9zZWN0aW9uPlwiXHJcbiAgKTtcclxuXHJcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwicGFnZXMvaG9tZS5odG1sXCIsXHJcbiAgICBcIjxzZWN0aW9uIGlkPVxcXCJob21lXFxcIiBiaW5kb25jZT1cXFwic29tZS5tb2RlbC5vYmplY3RcXFwiPlxcblwiICtcclxuICAgIFwiXFx0PGg0PidTdXA/IEhFWSEgVGhpcyBpcyB0aGUgdGVtcGxhdGUgZm9yIHRoZSBIb21lPC9oND5cXG5cIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyLWZsdWlkXFxcIj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS02IHRleHQtY2VudGVyXFxcIj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aDE+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIFNvLCBoZXJlJ3MgdGhlIENvbnRhY3QgbGlzdDpcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8L2gxPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDwvZGl2PlxcblwiICtcclxuICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3cgY29sLXNtLThcXFwiPlxcblwiICtcclxuICAgIFwiICAgICAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlIHRhYmxlLWhvdmVyXFxcIj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDx0aGVhZD5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIDx0aD5JZDwvdGg+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgPHRoPkxhc3QgTmFtZTwvdGg+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvdGhlYWQ+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8dGJvZHk+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cXFwiY29udGFjdCBpbiBjb250YWN0c1xcXCI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIDx0ZD57e2NvbnRhY3QuSWR9fTwvdGQ+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIDx0ZD57e2NvbnRhY3QuRmlyc3ROYW1lfX08L3RkPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICA8dGQ+e3tjb250YWN0Lkxhc3ROYW1lfX08L3RkPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L3Rib2R5PlxcblwiICtcclxuICAgIFwiICAgICAgICA8L3RhYmxlPlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXHJcbiAgICBcIiAgICA8L2Rpdj5cXG5cIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiPC9zZWN0aW9uPlxcblwiXHJcbiAgKTtcclxuXHJcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwicGFnZXMvbG9naW4uaHRtbFwiLFxyXG4gICAgXCI8c2VjdGlvbiBpZD1cXFwibG9naW5cXFwiIGJpbmRvbmNlPVxcXCJzb21lLm1vZGVsLm9iamVjdFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8ZGl2IGNsYXNzPVxcXCJjb250YWluZXIgcm93XFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tNiBwdXNoLXNtLTMgdGV4dC1jZW50ZXJcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8aDE+QW1tbW0uLi4gV2hvIGFyZSB5b3U/PC9oMT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyIHJvd1xcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGZvcm0gbm92YWxpZGF0ZSBuYW1lPVxcXCJsb2dpbkZvcm1cXFwiIGNsYXNzPVxcXCJmb3JtLWlubGluZSBjb2wtc20tNiBsb2dpbi1mb3JtXFxcIiBuZy1zdWJtaXQ9c3VibWl0KCk+ICAgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiVXNlcm5hbWVcXFwiPlVzZXJuYW1lPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VybmFtZVxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcInVzZXJuYW1lXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiWW91ciB1c2VybmFtZSwgcGxlYXNlXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiUGFzc3dvcmRcXFwiPlBhc3N3b3JkPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJwYXNzd29yZFxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwicGFzc3dvcmRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCLigKLigKLigKLigKLigKLigKLigKLigKLigKLigKLigKLigKJcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGJ1dHRvbiBpZD1cXFwibG9naW4tYnRuXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICB0eXBlPVxcXCJzdWJtaXRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgcHVsbC1yaWdodFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICBMb2cgaW4hXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvYnV0dG9uPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDwvZm9ybT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiPC9zZWN0aW9uPlwiXHJcbiAgKTtcclxuXHJcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwic29tZS1kaXJlY3RpdmUuaHRtbFwiLFxyXG4gICAgXCI8c2VjdGlvbiBiaW5kb25jZT1cXFwic29tZS5tb2RlbC5vYmplY3RcXFwiPlxcblwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCI8L3NlY3Rpb24+XFxuXCJcclxuICApO1xyXG5cclxufV0pO1xyXG4iXX0=
;