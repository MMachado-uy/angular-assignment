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


        Helper.get().success(function(data){
            var call = data;
        });

        console.log(call);


        //$scope.contacts = [{"Id":"003610000067Ag4AAE","FirstName":"John","LastName":"Downes"},{"Id":"003610000067Ag5AAE","FirstName":"Xavier","LastName":"Birch"},{"Id":"003610000067Ag6AAE","FirstName":"Basil","LastName":"Wenceslas"},{"Id":"003610000067Ag7AAE","FirstName":"Alice","LastName":"Black"},{"Id":"003610000067AfoAAE","FirstName":"John","LastName":"Dodge"},{"Id":"003610000067AfqAAE","FirstName":"George","LastName":"Dapper"},{"Id":"003610000067AfrAAE","FirstName":"Jack","LastName":"Dodge"},{"Id":"003610000067AfsAAE","FirstName":"Jessica","LastName":"Jones"},{"Id":"003610000067AftAAE","FirstName":"Dragon","LastName":"Davich"},{"Id":"003610000067AfuAAE","FirstName":"Steve","LastName":"Curio"},{"Id":"003610000067AfvAAE","FirstName":"Laura","LastName":"Black"},{"Id":"003610000067AfwAAE","FirstName":"Wilhelm","LastName":"Blake"},{"Id":"003610000067AfxAAE","FirstName":"Winter","LastName":"Drake"},{"Id":"003610000067AfyAAE","FirstName":"Sal","LastName":"Sands"},{"Id":"003610000067AfzAAE","FirstName":"Julia","LastName":"Wilds"},{"Id":"003610000067Ag0AAE","FirstName":"Juniper","LastName":"Birsch"},{"Id":"003610000067Ag1AAE","FirstName":"Valerie","LastName":"Duncan"},{"Id":"003610000067Ag2AAE","FirstName":"Patti","LastName":"Patel"},{"Id":"003610000067Ag3AAE","FirstName":"Justin","LastName":"Short"},{"Id":"0036100000NBQkQAAX","FirstName":"Xander","LastName":"Example"},{"Id":"00361000006Lr7TAAS","FirstName":"Rose","LastName":"Gonzalez"},{"Id":"00361000006Lr7gAAC","FirstName":"Ashley","LastName":"James"},{"Id":"00361000006Lr7hAAC","FirstName":"Tom","LastName":"Ripley"},{"Id":"00361000006Lr7iAAC","FirstName":"Liz","LastName":"D&#39;Cruz"},{"Id":"00361000006Lr7jAAC","FirstName":"Edna","LastName":"Frank"},{"Id":"00361000006Lr7kAAC","FirstName":"Avi","LastName":"Green"},{"Id":"00361000006Lr7lAAC","FirstName":"Siddartha","LastName":"Nedaerk"},{"Id":"00361000006Lr7mAAC","FirstName":"Jake","LastName":"Llorrac"},{"Id":"00361000006Lr7UAAS","FirstName":"Sean","LastName":"Forbes"},{"Id":"00361000006Lr7VAAS","FirstName":"Jack","LastName":"Rogers"},{"Id":"00361000006Lr7WAAS","FirstName":"Pat","LastName":"Stumuller"},{"Id":"00361000006Lr7XAAS","FirstName":"Andy","LastName":"Young"},{"Id":"00361000006Lr7YAAS","FirstName":"Tim","LastName":"Barr"},{"Id":"00361000006Lr7ZAAS","FirstName":"John","LastName":"Bond"},{"Id":"00361000006Lr7aAAC","FirstName":"Stella","LastName":"Pavlova"},{"Id":"00361000006Lr7bAAC","FirstName":"Lauren","LastName":"Boyle"},{"Id":"00361000006Lr7cAAC","FirstName":"Babara","LastName":"Levy"},{"Id":"00361000006Lr7dAAC","FirstName":"Josh","LastName":"Davis"},{"Id":"00361000006Lr7eAAC","FirstName":"Jane","LastName":"Grey"},{"Id":"00361000006Lr7fAAC","FirstName":"Arthur","LastName":"Song"},{"Id":"003610000067ZkzAAE","FirstName":"Joe","LastName":"Smith"},{"Id":"003610000067Zl0AAE","FirstName":"Kathy","LastName":"Smith"},{"Id":"003610000067Zl1AAE","FirstName":"Caroline","LastName":"Roth"},{"Id":"003610000067ZkcAAE","FirstName":"Josh","LastName":"Kaplan"},{"Id":"003610000067ZkdAAE","FirstName":"Kathy","LastName":"Brown"},{"Id":"003610000067ZUZAA2","FirstName":"Josh","LastName":"Kaplan"},{"Id":"003610000067ZUaAAM","FirstName":"Kathy","LastName":"Brown"},{"Id":"003610000067ZkPAAU","FirstName":"Caroline","LastName":"Roth"},{"Id":"003610000067ZkQAAU","FirstName":"Kim","LastName":"Shain"},{"Id":"003610000067ZQ5AAM","FirstName":"Caroline","LastName":"Roth"},{"Id":"003610000067ZQ6AAM","FirstName":"Kim","LastName":"Shain"},{"Id":"003610000067a1iAAA","FirstName":"Carol","LastName":"Ruiz"},{"Id":"003610000067aOSAAY","FirstName":"Carol","LastName":"Ruiz"},{"Id":"0036100000JskEeAAJ","FirstName":"Mauricio","LastName":"Machado"},{"Id":"0036100000ONhHAAA1","FirstName":"Test","LastName":"20160202"}];

        // ContactCRUDController.listUsers(currUser, currToken, function(result, event) {
        //     if (event.status && result != null) {
        //         $scope.contacts = JSON.stringify(result);
        //         console.log('Hello World');
        //     }
        // });
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
     
        // ContactCRUDController.listUsers(currUser, currToken, function(result, event) {
        //     if (event.status && result != null) {
        //         $scope.contacts = JSON.stringify(result);
        //         console.log('Hello World');
        //     }
        // });
	
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
    "        <form novalidate name=\"loginForm\" \r" +
    "\n" +
    "                         class=\"form-inline col-sm-6 login-form\" \r" +
    "\n" +
    "                         ng-submit=\"loginForm.$valid && submit()\">   \r" +
    "\n" +
    "            <div class=\"form-group\">\r" +
    "\n" +
    "                <label for=\"Username\">Username</label>\r" +
    "\n" +
    "                <input type=\"text\" \r" +
    "\n" +
    "                       class=\"form-control\"\r" +
    "\n" +
    "                       ng-model=\"username\"\r" +
    "\n" +
    "                       id=\"username\" \r" +
    "\n" +
    "                       placeholder=\"Your username, please\"\r" +
    "\n" +
    "                       required>\r" +
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
    "                       placeholder=\"••••••••••••\"\r" +
    "\n" +
    "                       required>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div> loginForm is {{loginForm.$valid}} </div>\r" +
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9saWIvYW5ndWxhci1yb3V0ZS5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2FwcC5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2NvbnRyb2xsZXJzLmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvY29udHJvbGxlcnMvQ3JlYXRlQ29udHJvbGxlci5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2NvbnRyb2xsZXJzL0VkaXRDb250cm9sbGVyLmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9jb250cm9sbGVycy9Mb2dpbkNvbnRyb2xsZXIuanMiLCJjOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9kaXJlY3RpdmVzLmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZGlyZWN0aXZlcy9zb21lRGlyZWN0aXZlLmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmFjdG9yaWVzLmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmFjdG9yaWVzL3NvbWVGYWN0b3J5LmpzIiwiYzoveGFtcHAvaHRkb2NzL2Fzc2lnbm1lbnQvYXNzZXRzL2pzL21vZHVsZXMvZmlsdGVycy5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL2ZpbHRlcnMvZmlsdGVycy5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL21haW4uanMiLCJjOi94YW1wcC9odGRvY3MvYXNzaWdubWVudC9hc3NldHMvanMvbW9kdWxlcy9zZXJ2aWNlcy5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL3NlcnZpY2VzL2hlbHBlci5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9qcy9tb2R1bGVzL3ZlbmRvci9iaW5kb25jZS5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy9zdHlsZXMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcyIsImM6L3hhbXBwL2h0ZG9jcy9hc3NpZ25tZW50L2Fzc2V0cy90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFySlMgdjEuMi4xNlxuICogKGMpIDIwMTAtMjAxNCBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4oZnVuY3Rpb24od2luZG93LCBhbmd1bGFyLCB1bmRlZmluZWQpIHsndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdSb3V0ZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogIyBuZ1JvdXRlXG4gKlxuICogVGhlIGBuZ1JvdXRlYCBtb2R1bGUgcHJvdmlkZXMgcm91dGluZyBhbmQgZGVlcGxpbmtpbmcgc2VydmljZXMgYW5kIGRpcmVjdGl2ZXMgZm9yIGFuZ3VsYXIgYXBwcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqXG4gKiA8ZGl2IGRvYy1tb2R1bGUtY29tcG9uZW50cz1cIm5nUm91dGVcIj48L2Rpdj5cbiAqL1xuIC8qIGdsb2JhbCAtbmdSb3V0ZU1vZHVsZSAqL1xudmFyIG5nUm91dGVNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZScsIFsnbmcnXSkuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcignJHJvdXRlJywgJFJvdXRlUHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBwcm92aWRlclxuICogQG5hbWUgJHJvdXRlUHJvdmlkZXJcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKXtcbiAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKG5ldyAoYW5ndWxhci5leHRlbmQoZnVuY3Rpb24oKSB7fSwge3Byb3RvdHlwZTpwYXJlbnR9KSkoKSwgZXh0cmEpO1xuICB9XG5cbiAgdmFyIHJvdXRlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI3doZW5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggUm91dGUgcGF0aCAobWF0Y2hlZCBhZ2FpbnN0IGAkbG9jYXRpb24ucGF0aGApLiBJZiBgJGxvY2F0aW9uLnBhdGhgXG4gICAqICAgIGNvbnRhaW5zIHJlZHVuZGFudCB0cmFpbGluZyBzbGFzaCBvciBpcyBtaXNzaW5nIG9uZSwgdGhlIHJvdXRlIHdpbGwgc3RpbGwgbWF0Y2ggYW5kIHRoZVxuICAgKiAgICBgJGxvY2F0aW9uLnBhdGhgIHdpbGwgYmUgdXBkYXRlZCB0byBhZGQgb3IgZHJvcCB0aGUgdHJhaWxpbmcgc2xhc2ggdG8gZXhhY3RseSBtYXRjaCB0aGVcbiAgICogICAgcm91dGUgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbjogZS5nLiBgOm5hbWVgLiBBbGwgY2hhcmFjdGVycyB1cFxuICAgKiAgICAgICAgdG8gdGhlIG5leHQgc2xhc2ggYXJlIG1hdGNoZWQgYW5kIHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uIGFuZCBlbmRpbmcgd2l0aCBhIHN0YXI6XG4gICAqICAgICAgICBlLmcuYDpuYW1lKmAuIEFsbCBjaGFyYWN0ZXJzIGFyZSBlYWdlcmx5IHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBvcHRpb25hbCBuYW1lZCBncm91cHMgd2l0aCBhIHF1ZXN0aW9uIG1hcms6IGUuZy5gOm5hbWU/YC5cbiAgICpcbiAgICogICAgRm9yIGV4YW1wbGUsIHJvdXRlcyBsaWtlIGAvY29sb3IvOmNvbG9yL2xhcmdlY29kZS86bGFyZ2Vjb2RlKlxcL2VkaXRgIHdpbGwgbWF0Y2hcbiAgICogICAgYC9jb2xvci9icm93bi9sYXJnZWNvZGUvY29kZS93aXRoL3NsYXNoZXMvZWRpdGAgYW5kIGV4dHJhY3Q6XG4gICAqXG4gICAqICAgICogYGNvbG9yOiBicm93bmBcbiAgICogICAgKiBgbGFyZ2Vjb2RlOiBjb2RlL3dpdGgvc2xhc2hlc2AuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByb3V0ZSBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAgb24gcm91dGVcbiAgICogICAgbWF0Y2guXG4gICAqXG4gICAqICAgIE9iamVjdCBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiAgICAtIGBjb250cm9sbGVyYCDigJMgYHsoc3RyaW5nfGZ1bmN0aW9uKCk9fWAg4oCTIENvbnRyb2xsZXIgZm4gdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICAgbmV3bHkgY3JlYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHtAbGluayBhbmd1bGFyLk1vZHVsZSNjb250cm9sbGVyIHJlZ2lzdGVyZWRcbiAgICogICAgICBjb250cm9sbGVyfSBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqICAgIC0gYGNvbnRyb2xsZXJBc2Ag4oCTIGB7c3RyaW5nPX1gIOKAkyBBIGNvbnRyb2xsZXIgYWxpYXMgbmFtZS4gSWYgcHJlc2VudCB0aGUgY29udHJvbGxlciB3aWxsIGJlXG4gICAqICAgICAgcHVibGlzaGVkIHRvIHNjb3BlIHVuZGVyIHRoZSBgY29udHJvbGxlckFzYCBuYW1lLlxuICAgKiAgICAtIGB0ZW1wbGF0ZWAg4oCTIGB7c3RyaW5nPXxmdW5jdGlvbigpPX1gIOKAkyBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdFxuICAgKiAgICAgIHJldHVybnMgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyB3aGljaCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmtcbiAgICogICAgICBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBvciB7QGxpbmsgbmcuZGlyZWN0aXZlOm5nSW5jbHVkZSBuZ0luY2x1ZGV9IGRpcmVjdGl2ZXMuXG4gICAqICAgICAgVGhpcyBwcm9wZXJ0eSB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgYHRlbXBsYXRlVXJsYC5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHRlbXBsYXRlVXJsYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sXG4gICAqICAgICAgdGVtcGxhdGUgdGhhdCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30uXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlVXJsYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlYCAtIGB7T2JqZWN0LjxzdHJpbmcsIGZ1bmN0aW9uPj19YCAtIEFuIG9wdGlvbmFsIG1hcCBvZiBkZXBlbmRlbmNpZXMgd2hpY2ggc2hvdWxkXG4gICAqICAgICAgYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gSWYgYW55IG9mIHRoZXNlIGRlcGVuZGVuY2llcyBhcmUgcHJvbWlzZXMsIHRoZSByb3V0ZXJcbiAgICogICAgICB3aWxsIHdhaXQgZm9yIHRoZW0gYWxsIHRvIGJlIHJlc29sdmVkIG9yIG9uZSB0byBiZSByZWplY3RlZCBiZWZvcmUgdGhlIGNvbnRyb2xsZXIgaXNcbiAgICogICAgICBpbnN0YW50aWF0ZWQuXG4gICAqICAgICAgSWYgYWxsIHRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LCB0aGUgdmFsdWVzIG9mIHRoZSByZXNvbHZlZCBwcm9taXNlcyBhcmVcbiAgICogICAgICBpbmplY3RlZCBhbmQge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3MgJHJvdXRlQ2hhbmdlU3VjY2Vzc30gZXZlbnQgaXNcbiAgICogICAgICBmaXJlZC4gSWYgYW55IG9mIHRoZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQgdGhlXG4gICAqICAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yICRyb3V0ZUNoYW5nZUVycm9yfSBldmVudCBpcyBmaXJlZC4gVGhlIG1hcCBvYmplY3RcbiAgICogICAgICBpczpcbiAgICpcbiAgICogICAgICAtIGBrZXlgIOKAkyBge3N0cmluZ31gOiBhIG5hbWUgb2YgYSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgLSBgZmFjdG9yeWAgLSBge3N0cmluZ3xmdW5jdGlvbn1gOiBJZiBgc3RyaW5nYCB0aGVuIGl0IGlzIGFuIGFsaWFzIGZvciBhIHNlcnZpY2UuXG4gICAqICAgICAgICBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIHRoZW4gaXQgaXMge0BsaW5rIGF1dG8uJGluamVjdG9yI2ludm9rZSBpbmplY3RlZH1cbiAgICogICAgICAgIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRyZWF0ZWQgYXMgdGhlIGRlcGVuZGVuY3kuIElmIHRoZSByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpc1xuICAgKiAgICAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBCZSBhd2FyZSB0aGF0XG4gICAqICAgICAgICBgbmdSb3V0ZS4kcm91dGVQYXJhbXNgIHdpbGwgc3RpbGwgcmVmZXIgdG8gdGhlIHByZXZpb3VzIHJvdXRlIHdpdGhpbiB0aGVzZSByZXNvbHZlXG4gICAqICAgICAgICBmdW5jdGlvbnMuICBVc2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUgcGFyYW1ldGVycywgaW5zdGVhZC5cbiAgICpcbiAgICogICAgLSBgcmVkaXJlY3RUb2Ag4oCTIHsoc3RyaW5nfGZ1bmN0aW9uKCkpPX0g4oCTIHZhbHVlIHRvIHVwZGF0ZVxuICAgKiAgICAgIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBwYXRoIHdpdGggYW5kIHRyaWdnZXIgcm91dGUgcmVkaXJlY3Rpb24uXG4gICAqXG4gICAqICAgICAgSWYgYHJlZGlyZWN0VG9gIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtPYmplY3QuPHN0cmluZz59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZVVybC5cbiAgICogICAgICAtIGB7c3RyaW5nfWAgLSBjdXJyZW50IGAkbG9jYXRpb24ucGF0aCgpYFxuICAgKiAgICAgIC0gYHtPYmplY3R9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5zZWFyY2goKWBcbiAgICpcbiAgICogICAgICBUaGUgY3VzdG9tIGByZWRpcmVjdFRvYCBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkXG4gICAqICAgICAgdG8gdXBkYXRlIGAkbG9jYXRpb24ucGF0aCgpYCBhbmQgYCRsb2NhdGlvbi5zZWFyY2goKWAuXG4gICAqXG4gICAqICAgIC0gYFtyZWxvYWRPblNlYXJjaD10cnVlXWAgLSB7Ym9vbGVhbj19IC0gcmVsb2FkIHJvdXRlIHdoZW4gb25seSBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKiAgICAgIG9yIGAkbG9jYXRpb24uaGFzaCgpYCBjaGFuZ2VzLlxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHVybCBpbiB0aGUgYnJvd3NlciBjaGFuZ2VzLCB0aGVuXG4gICAqICAgICAgYCRyb3V0ZVVwZGF0ZWAgZXZlbnQgaXMgYnJvYWRjYXN0ZWQgb24gdGhlIHJvb3Qgc2NvcGUuXG4gICAqXG4gICAqICAgIC0gYFtjYXNlSW5zZW5zaXRpdmVNYXRjaD1mYWxzZV1gIC0ge2Jvb2xlYW49fSAtIG1hdGNoIHJvdXRlcyB3aXRob3V0IGJlaW5nIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYHRydWVgLCB0aGVuIHRoZSBwYXJ0aWN1bGFyIHJvdXRlIGNhbiBiZSBtYXRjaGVkIHdpdGhvdXQgYmVpbmdcbiAgICogICAgICBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGRzIGEgbmV3IHJvdXRlIGRlZmluaXRpb24gdG8gdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gICAqL1xuICB0aGlzLndoZW4gPSBmdW5jdGlvbihwYXRoLCByb3V0ZSkge1xuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAge3JlbG9hZE9uU2VhcmNoOiB0cnVlfSxcbiAgICAgIHJvdXRlLFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlKVxuICAgICk7XG5cbiAgICAvLyBjcmVhdGUgcmVkaXJlY3Rpb24gZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICBpZiAocGF0aCkge1xuICAgICAgdmFyIHJlZGlyZWN0UGF0aCA9IChwYXRoW3BhdGgubGVuZ3RoLTFdID09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGgtMSlcbiAgICAgICAgICAgIDogcGF0aCArJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgIC8qKlxuICAgICogQHBhcmFtIHBhdGgge3N0cmluZ30gcGF0aFxuICAgICogQHBhcmFtIG9wdHMge09iamVjdH0gb3B0aW9uc1xuICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAqXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqIE5vcm1hbGl6ZXMgdGhlIGdpdmVuIHBhdGgsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICogYW5kIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgICpcbiAgICAqIEluc3BpcmVkIGJ5IHBhdGhSZXhwIGluIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3V0aWxzLmpzLlxuICAgICovXG4gIGZ1bmN0aW9uIHBhdGhSZWdFeHAocGF0aCwgb3B0cykge1xuICAgIHZhciBpbnNlbnNpdGl2ZSA9IG9wdHMuY2FzZUluc2Vuc2l0aXZlTWF0Y2gsXG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICBvcmlnaW5hbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVnZXhwOiBwYXRoXG4gICAgICAgIH0sXG4gICAgICAgIGtleXMgPSByZXQua2V5cyA9IFtdO1xuXG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoW1xcP1xcKl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pe1xuICAgICAgICB2YXIgb3B0aW9uYWwgPSBvcHRpb24gPT09ICc/JyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIHZhciBzdGFyID0gb3B0aW9uID09PSAnKicgPyBvcHRpb24gOiBudWxsO1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhIW9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChzdGFyICYmICcoLis/KScgfHwgJyhbXi9dKyknKVxuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKVxuICAgICAgICAgICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLyRcXCpdKS9nLCAnXFxcXCQxJyk7XG5cbiAgICByZXQucmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBpbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHJvdXRlIGRlZmluaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgb24gcm91dGUgY2hhbmdlIHdoZW4gbm8gb3RoZXIgcm91dGUgZGVmaW5pdGlvblxuICAgKiBpcyBtYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YC5cbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB0aGlzLndoZW4obnVsbCwgcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsXG4gICAgICAgICAgICAgICAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICckcm91dGVQYXJhbXMnLFxuICAgICAgICAgICAgICAgJyRxJyxcbiAgICAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgICAgJyRodHRwJyxcbiAgICAgICAgICAgICAgICckdGVtcGxhdGVDYWNoZScsXG4gICAgICAgICAgICAgICAnJHNjZScsXG4gICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHEsICRpbmplY3RvciwgJGh0dHAsICR0ZW1wbGF0ZUNhY2hlLCAkc2NlKSB7XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgc2VydmljZVxuICAgICAqIEBuYW1lICRyb3V0ZVxuICAgICAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAgICAgKiBAcmVxdWlyZXMgJHJvdXRlUGFyYW1zXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudCBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiBUaGUgcm91dGUgZGVmaW5pdGlvbiBjb250YWluczpcbiAgICAgKlxuICAgICAqICAgLSBgY29udHJvbGxlcmA6IFRoZSBjb250cm9sbGVyIGNvbnN0cnVjdG9yIGFzIGRlZmluZSBpbiByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCB0aGlzIGV4YW1wbGUgaXMgdXNpbmcge0BsaW5rIG5nLmRpcmVjdGl2ZTpzY3JpcHQgaW5saW5lZCB0ZW1wbGF0ZXN9XG4gICAgICogdG8gZ2V0IGl0IHdvcmtpbmcgb24ganNmaWRkbGUgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJCb29rQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJDaGFwdGVyQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICogICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgKiAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRyb2xsZXInLFxuICAgICAqICAgICAgICAgcmVzb2x2ZToge1xuICAgICAqICAgICAgICAgICAvLyBJIHdpbGwgY2F1c2UgYSAxIHNlY29uZCBkZWxheVxuICAgICAqICAgICAgICAgICBkZWxheTogZnVuY3Rpb24oJHEsICR0aW1lb3V0KSB7XG4gICAgICogICAgICAgICAgICAgdmFyIGRlbGF5ID0gJHEuZGVmZXIoKTtcbiAgICAgKiAgICAgICAgICAgICAkdGltZW91dChkZWxheS5yZXNvbHZlLCAxMDAwKTtcbiAgICAgKiAgICAgICAgICAgICByZXR1cm4gZGVsYXkucHJvbWlzZTtcbiAgICAgKiAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgfVxuICAgICAqICAgICAgIH0pXG4gICAgICogICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ29udHJvbGxlcidcbiAgICAgKiAgICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAqICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAqICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAqICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuICAgICAqXG4gICAgICogICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcbiAgICAgKlxuICAgICAqICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBuZXh0IEZ1dHVyZSByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2Vzc1xuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBhZnRlciBhIHJvdXRlIGRlcGVuZGVuY2llcyBhcmUgcmVzb2x2ZWQuXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IGxpc3RlbnMgZm9yIHRoZSBkaXJlY3RpdmVcbiAgICAgKiB0byBpbnN0YW50aWF0ZSB0aGUgY29udHJvbGxlciBhbmQgcmVuZGVyIHRoZSB2aWV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfFVuZGVmaW5lZH0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24sIG9yIHVuZGVmaW5lZCBpZiBjdXJyZW50IGlzXG4gICAgICogZmlyc3Qgcm91dGUgZW50ZXJlZC5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvclxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBpZiBhbnkgb2YgdGhlIHJlc29sdmUgcHJvbWlzZXMgYXJlIHJlamVjdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHJlamVjdGlvbiBSZWplY3Rpb24gb2YgdGhlIHByb21pc2UuIFVzdWFsbHkgdGhlIGVycm9yIG9mIHRoZSBmYWlsZWQgcHJvbWlzZS5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVVcGRhdGVcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBUaGUgYHJlbG9hZE9uU2VhcmNoYCBwcm9wZXJ0eSBoYXMgYmVlbiBzZXQgdG8gZmFsc2UsIGFuZCB3ZSBhcmUgcmV1c2luZyB0aGUgc2FtZVxuICAgICAqIGluc3RhbmNlIG9mIHRoZSBDb250cm9sbGVyLlxuICAgICAqL1xuXG4gICAgdmFyIGZvcmNlUmVsb2FkID0gZmFsc2UsXG4gICAgICAgICRyb3V0ZSA9IHtcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgKiBAbmFtZSAkcm91dGUjcmVsb2FkXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgKiBDYXVzZXMgYCRyb3V0ZWAgc2VydmljZSB0byByZWxvYWQgdGhlIGN1cnJlbnQgcm91dGUgZXZlbiBpZlxuICAgICAgICAgICAqIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBoYXNuJ3QgY2hhbmdlZC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEFzIGEgcmVzdWx0IG9mIHRoYXQsIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fVxuICAgICAgICAgICAqIGNyZWF0ZXMgbmV3IHNjb3BlLCByZWluc3RhbnRpYXRlcyB0aGUgY29udHJvbGxlci5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yY2VSZWxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZXZhbEFzeW5jKHVwZGF0ZVJvdXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZVJvdXRlKTtcblxuICAgIHJldHVybiAkcm91dGU7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uIHtzdHJpbmd9IGN1cnJlbnQgdXJsXG4gICAgICogQHBhcmFtIHJvdXRlIHtPYmplY3R9IHJvdXRlIHJlZ2V4cCB0byBtYXRjaCB0aGUgdXJsIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2hlY2sgaWYgdGhlIHJvdXRlIG1hdGNoZXMgdGhlIGN1cnJlbnQgdXJsLlxuICAgICAqXG4gICAgICogSW5zcGlyZWQgYnkgbWF0Y2ggaW5cbiAgICAgKiB2aXNpb25tZWRpYS9leHByZXNzL2xpYi9yb3V0ZXIvcm91dGVyLmpzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN3aXRjaFJvdXRlTWF0Y2hlcihvbiwgcm91dGUpIHtcbiAgICAgIHZhciBrZXlzID0gcm91dGUua2V5cyxcbiAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgaWYgKCFyb3V0ZS5yZWdleHApIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgbSA9IHJvdXRlLnJlZ2V4cC5leGVjKG9uKTtcbiAgICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgICB2YXIgdmFsID0gJ3N0cmluZycgPT0gdHlwZW9mIG1baV1cbiAgICAgICAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQobVtpXSlcbiAgICAgICAgICAgICAgOiBtW2ldO1xuXG4gICAgICAgIGlmIChrZXkgJiYgdmFsKSB7XG4gICAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVSb3V0ZSgpIHtcbiAgICAgIHZhciBuZXh0ID0gcGFyc2VSb3V0ZSgpLFxuICAgICAgICAgIGxhc3QgPSAkcm91dGUuY3VycmVudDtcblxuICAgICAgaWYgKG5leHQgJiYgbGFzdCAmJiBuZXh0LiQkcm91dGUgPT09IGxhc3QuJCRyb3V0ZVxuICAgICAgICAgICYmIGFuZ3VsYXIuZXF1YWxzKG5leHQucGF0aFBhcmFtcywgbGFzdC5wYXRoUGFyYW1zKVxuICAgICAgICAgICYmICFuZXh0LnJlbG9hZE9uU2VhcmNoICYmICFmb3JjZVJlbG9hZCkge1xuICAgICAgICBsYXN0LnBhcmFtcyA9IG5leHQucGFyYW1zO1xuICAgICAgICBhbmd1bGFyLmNvcHkobGFzdC5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlVXBkYXRlJywgbGFzdCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHQgfHwgbGFzdCkge1xuICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN0YXJ0JywgbmV4dCwgbGFzdCk7XG4gICAgICAgICRyb3V0ZS5jdXJyZW50ID0gbmV4dDtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBpZiAobmV4dC5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhuZXh0LnJlZGlyZWN0VG8pKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGludGVycG9sYXRlKG5leHQucmVkaXJlY3RUbywgbmV4dC5wYXJhbXMpKS5zZWFyY2gobmV4dC5wYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKG5leHQucmVkaXJlY3RUbyhuZXh0LnBhdGhQYXJhbXMsICRsb2NhdGlvbi5wYXRoKCksICRsb2NhdGlvbi5zZWFyY2goKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHEud2hlbihuZXh0KS5cbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBuZXh0LnJlc29sdmUpLFxuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUsIHRlbXBsYXRlVXJsO1xuXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsb2NhbHMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNba2V5XSA9IGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID9cbiAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCh2YWx1ZSkgOiAkaW5qZWN0b3IuaW52b2tlKHZhbHVlKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlID0gbmV4dC50ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZShuZXh0LnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsID0gbmV4dC50ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybChuZXh0LnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gJHNjZS5nZXRUcnVzdGVkUmVzb3VyY2VVcmwodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgIG5leHQubG9hZGVkVGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybDtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gJGh0dHAuZ2V0KHRlbXBsYXRlVXJsLCB7Y2FjaGU6ICR0ZW1wbGF0ZUNhY2hlfSkuXG4gICAgICAgICAgICAgICAgICAgICAgdGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2UuZGF0YTsgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNbJyR0ZW1wbGF0ZSddID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChsb2NhbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLlxuICAgICAgICAgIC8vIGFmdGVyIHJvdXRlIGNoYW5nZVxuICAgICAgICAgIHRoZW4oZnVuY3Rpb24obG9jYWxzKSB7XG4gICAgICAgICAgICBpZiAobmV4dCA9PSAkcm91dGUuY3VycmVudCkge1xuICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgIG5leHQubG9jYWxzID0gbG9jYWxzO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShuZXh0LnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBuZXh0LCBsYXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKG5leHQgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIG5leHQsIGxhc3QsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBjdXJyZW50IGFjdGl2ZSByb3V0ZSwgYnkgbWF0Y2hpbmcgaXQgYWdhaW5zdCB0aGUgVVJMXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VSb3V0ZSgpIHtcbiAgICAgIC8vIE1hdGNoIGEgcm91dGVcbiAgICAgIHZhciBwYXJhbXMsIG1hdGNoO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHJvdXRlcywgZnVuY3Rpb24ocm91dGUsIHBhdGgpIHtcbiAgICAgICAgaWYgKCFtYXRjaCAmJiAocGFyYW1zID0gc3dpdGNoUm91dGVNYXRjaGVyKCRsb2NhdGlvbi5wYXRoKCksIHJvdXRlKSkpIHtcbiAgICAgICAgICBtYXRjaCA9IGluaGVyaXQocm91dGUsIHtcbiAgICAgICAgICAgIHBhcmFtczogYW5ndWxhci5leHRlbmQoe30sICRsb2NhdGlvbi5zZWFyY2goKSwgcGFyYW1zKSxcbiAgICAgICAgICAgIHBhdGhQYXJhbXM6IHBhcmFtc30pO1xuICAgICAgICAgIG1hdGNoLiQkcm91dGUgPSByb3V0ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBObyByb3V0ZSBtYXRjaGVkOyBmYWxsYmFjayB0byBcIm90aGVyd2lzZVwiIHJvdXRlXG4gICAgICByZXR1cm4gbWF0Y2ggfHwgcm91dGVzW251bGxdICYmIGluaGVyaXQocm91dGVzW251bGxdLCB7cGFyYW1zOiB7fSwgcGF0aFBhcmFtczp7fX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGludGVycG9sYXRpb24gb2YgdGhlIHJlZGlyZWN0IHBhdGggd2l0aCB0aGUgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludGVycG9sYXRlKHN0cmluZywgcGFyYW1zKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goKHN0cmluZ3x8JycpLnNwbGl0KCc6JyksIGZ1bmN0aW9uKHNlZ21lbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnbWVudE1hdGNoID0gc2VnbWVudC5tYXRjaCgvKFxcdyspKC4qKS8pO1xuICAgICAgICAgIHZhciBrZXkgPSBzZWdtZW50TWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2tleV0pO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnRNYXRjaFsyXSB8fCAnJyk7XG4gICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICB9XTtcbn1cblxubmdSb3V0ZU1vZHVsZS5wcm92aWRlcignJHJvdXRlUGFyYW1zJywgJFJvdXRlUGFyYW1zUHJvdmlkZXIpO1xuXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRyb3V0ZVBhcmFtc1xuICogQHJlcXVpcmVzICRyb3V0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXQgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIFRoZSByb3V0ZSBwYXJhbWV0ZXJzIGFyZSBhIGNvbWJpbmF0aW9uIG9mIHtAbGluayBuZy4kbG9jYXRpb24gYCRsb2NhdGlvbmB9J3NcbiAqIHtAbGluayBuZy4kbG9jYXRpb24jc2VhcmNoIGBzZWFyY2goKWB9IGFuZCB7QGxpbmsgbmcuJGxvY2F0aW9uI3BhdGggYHBhdGgoKWB9LlxuICogVGhlIGBwYXRoYCBwYXJhbWV0ZXJzIGFyZSBleHRyYWN0ZWQgd2hlbiB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIGAkcm91dGVgfSBwYXRoIGlzIG1hdGNoZWQuXG4gKlxuICogSW4gY2FzZSBvZiBwYXJhbWV0ZXIgbmFtZSBjb2xsaXNpb24sIGBwYXRoYCBwYXJhbXMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYHNlYXJjaGAgcGFyYW1zLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGd1YXJhbnRlZXMgdGhhdCB0aGUgaWRlbnRpdHkgb2YgdGhlIGAkcm91dGVQYXJhbXNgIG9iamVjdCB3aWxsIHJlbWFpbiB1bmNoYW5nZWRcbiAqIChidXQgaXRzIHByb3BlcnRpZXMgd2lsbCBsaWtlbHkgY2hhbmdlKSBldmVuIHdoZW4gYSByb3V0ZSBjaGFuZ2Ugb2NjdXJzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYCRyb3V0ZVBhcmFtc2AgYXJlIG9ubHkgdXBkYXRlZCAqYWZ0ZXIqIGEgcm91dGUgY2hhbmdlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbm5vdCByZWx5IG9uIGAkcm91dGVQYXJhbXNgIGJlaW5nIGNvcnJlY3QgaW4gcm91dGUgcmVzb2x2ZSBmdW5jdGlvbnMuXG4gKiBJbnN0ZWFkIHlvdSBjYW4gdXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlJ3MgcGFyYW1ldGVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqICAvLyBHaXZlbjpcbiAqICAvLyBVUkw6IGh0dHA6Ly9zZXJ2ZXIuY29tL2luZGV4Lmh0bWwjL0NoYXB0ZXIvMS9TZWN0aW9uLzI/c2VhcmNoPW1vYnlcbiAqICAvLyBSb3V0ZTogL0NoYXB0ZXIvOmNoYXB0ZXJJZC9TZWN0aW9uLzpzZWN0aW9uSWRcbiAqICAvL1xuICogIC8vIFRoZW5cbiAqICAkcm91dGVQYXJhbXMgPT0+IHtjaGFwdGVySWQ6MSwgc2VjdGlvbklkOjIsIHNlYXJjaDonbW9ieSd9XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gJFJvdXRlUGFyYW1zUHJvdmlkZXIoKSB7XG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge307IH07XG59XG5cbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGYWN0b3J5KTtcbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkpO1xuXG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgbmdWaWV3XG4gKiBAcmVzdHJpY3QgRUNBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIE92ZXJ2aWV3XG4gKiBgbmdWaWV3YCBpcyBhIGRpcmVjdGl2ZSB0aGF0IGNvbXBsZW1lbnRzIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgJHJvdXRlfSBzZXJ2aWNlIGJ5XG4gKiBpbmNsdWRpbmcgdGhlIHJlbmRlcmVkIHRlbXBsYXRlIG9mIHRoZSBjdXJyZW50IHJvdXRlIGludG8gdGhlIG1haW4gbGF5b3V0IChgaW5kZXguaHRtbGApIGZpbGUuXG4gKiBFdmVyeSB0aW1lIHRoZSBjdXJyZW50IHJvdXRlIGNoYW5nZXMsIHRoZSBpbmNsdWRlZCB2aWV3IGNoYW5nZXMgd2l0aCBpdCBhY2NvcmRpbmcgdG8gdGhlXG4gKiBjb25maWd1cmF0aW9uIG9mIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogQGFuaW1hdGlvbnNcbiAqIGVudGVyIC0gYW5pbWF0aW9uIGlzIHVzZWQgdG8gYnJpbmcgbmV3IGNvbnRlbnQgaW50byB0aGUgYnJvd3Nlci5cbiAqIGxlYXZlIC0gYW5pbWF0aW9uIGlzIHVzZWQgdG8gYW5pbWF0ZSBleGlzdGluZyBjb250ZW50IGF3YXkuXG4gKlxuICogVGhlIGVudGVyIGFuZCBsZWF2ZSBhbmltYXRpb24gb2NjdXIgY29uY3VycmVudGx5LlxuICpcbiAqIEBzY29wZVxuICogQHByaW9yaXR5IDQwMFxuICogQHBhcmFtIHtzdHJpbmc9fSBvbmxvYWQgRXhwcmVzc2lvbiB0byBldmFsdWF0ZSB3aGVuZXZlciB0aGUgdmlldyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBXaGV0aGVyIGBuZ1ZpZXdgIHNob3VsZCBjYWxsIHtAbGluayBuZy4kYW5jaG9yU2Nyb2xsXG4gKiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGx9IHRvIHNjcm9sbCB0aGUgdmlld3BvcnQgYWZ0ZXIgdGhlIHZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LCBkaXNhYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIHNldCB3aXRob3V0IHZhbHVlLCBlbmFibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIE90aGVyd2lzZSBlbmFibGUgc2Nyb2xsaW5nIG9ubHkgaWYgdGhlIGBhdXRvc2Nyb2xsYCBhdHRyaWJ1dGUgdmFsdWUgZXZhbHVhdGVkXG4gKiAgICAgICAgICAgICAgICAgICAgYXMgYW4gZXhwcmVzc2lvbiB5aWVsZHMgYSB0cnV0aHkgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICAgIDxleGFtcGxlIG5hbWU9XCJuZ1ZpZXctZGlyZWN0aXZlXCIgbW9kdWxlPVwibmdWaWV3RXhhbXBsZVwiXG4gICAgICAgICAgICAgZGVwcz1cImFuZ3VsYXItcm91dGUuanM7YW5ndWxhci1hbmltYXRlLmpzXCJcbiAgICAgICAgICAgICBhbmltYXRpb25zPVwidHJ1ZVwiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ3RybCBhcyBtYWluXCI+XG4gICAgICAgICAgQ2hvb3NlOlxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3LWFuaW1hdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IG5nLXZpZXcgY2xhc3M9XCJ2aWV3LWFuaW1hdGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aHIgLz5cblxuICAgICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7bWFpbi4kbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnBhcmFtcyA9IHt7bWFpbi4kcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7bWFpbi4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7bWFpbi4kcm91dGVQYXJhbXN9fTwvcHJlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImJvb2suaHRtbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIGNvbnRyb2xsZXI6IHt7Ym9vay5uYW1lfX08YnIgLz5cbiAgICAgICAgICBCb29rIElkOiB7e2Jvb2sucGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiY2hhcHRlci5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tjaGFwdGVyLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgICBDaGFwdGVyIElkOiB7e2NoYXB0ZXIucGFyYW1zLmNoYXB0ZXJJZH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYW5pbWF0aW9ucy5jc3NcIj5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS1jb250YWluZXIge1xuICAgICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgICAgICAgIGhlaWdodDoxMDBweCFpbXBvcnRhbnQ7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgYmFja2dyb3VuZDp3aGl0ZTtcbiAgICAgICAgICBib3JkZXI6MXB4IHNvbGlkIGJsYWNrO1xuICAgICAgICAgIGhlaWdodDo0MHB4O1xuICAgICAgICAgIG92ZXJmbG93OmhpZGRlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUge1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIsIC52aWV3LWFuaW1hdGUubmctbGVhdmUge1xuICAgICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuICAgICAgICAgIHRyYW5zaXRpb246YWxsIGN1YmljLWJlemllcigwLjI1MCwgMC40NjAsIDAuNDUwLCAwLjk0MCkgMS41cztcblxuICAgICAgICAgIGRpc3BsYXk6YmxvY2s7XG4gICAgICAgICAgd2lkdGg6MTAwJTtcbiAgICAgICAgICBib3JkZXItbGVmdDoxcHggc29saWQgYmxhY2s7XG5cbiAgICAgICAgICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgICAgICAgICB0b3A6MDtcbiAgICAgICAgICBsZWZ0OjA7XG4gICAgICAgICAgcmlnaHQ6MDtcbiAgICAgICAgICBib3R0b206MDtcbiAgICAgICAgICBwYWRkaW5nOjEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyIHtcbiAgICAgICAgICBsZWZ0OjEwMCU7XG4gICAgICAgIH1cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlci5uZy1lbnRlci1hY3RpdmUge1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWxlYXZlLm5nLWxlYXZlLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDotMTAwJTtcbiAgICAgICAgfVxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICAgIGFuZ3VsYXIubW9kdWxlKCduZ1ZpZXdFeGFtcGxlJywgWyduZ1JvdXRlJywgJ25nQW5pbWF0ZSddKVxuICAgICAgICAgIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjaGFwdGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgWyckcm91dGUnLCAnJHJvdXRlUGFyYW1zJywgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICBmdW5jdGlvbigkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlID0gJHJvdXRlO1xuICAgICAgICAgICAgICB0aGlzLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0Jvb2tDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiQm9va0N0cmxcIjtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBcIkNoYXB0ZXJDdHJsXCI7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSk7XG5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckN0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuXG4gICAgICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcblxuICAgICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgICAgfSk7XG4gICAgICA8L2ZpbGU+XG4gICAgPC9leGFtcGxlPlxuICovXG5cblxuLyoqXG4gKiBAbmdkb2MgZXZlbnRcbiAqIEBuYW1lIG5nVmlldyMkdmlld0NvbnRlbnRMb2FkZWRcbiAqIEBldmVudFR5cGUgZW1pdCBvbiB0aGUgY3VycmVudCBuZ1ZpZXcgc2NvcGVcbiAqIEBkZXNjcmlwdGlvblxuICogRW1pdHRlZCBldmVyeSB0aW1lIHRoZSBuZ1ZpZXcgY29udGVudCBpcyByZWxvYWRlZC5cbiAqL1xubmdWaWV3RmFjdG9yeS4kaW5qZWN0ID0gWyckcm91dGUnLCAnJGFuY2hvclNjcm9sbCcsICckYW5pbWF0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmFjdG9yeSggICAkcm91dGUsICAgJGFuY2hvclNjcm9sbCwgICAkYW5pbWF0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwLFxuICAgIHRyYW5zY2x1ZGU6ICdlbGVtZW50JyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQsIGF0dHIsIGN0cmwsICR0cmFuc2NsdWRlKSB7XG4gICAgICAgIHZhciBjdXJyZW50U2NvcGUsXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCxcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCxcbiAgICAgICAgICAgIGF1dG9TY3JvbGxFeHAgPSBhdHRyLmF1dG9zY3JvbGwsXG4gICAgICAgICAgICBvbmxvYWRFeHAgPSBhdHRyLm9ubG9hZCB8fCAnJztcblxuICAgICAgICBzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwTGFzdFZpZXcoKSB7XG4gICAgICAgICAgaWYocHJldmlvdXNFbGVtZW50KSB7XG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihjdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmxlYXZlKGN1cnJlbnRFbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50ID0gY3VycmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgIHZhciBsb2NhbHMgPSAkcm91dGUuY3VycmVudCAmJiAkcm91dGUuY3VycmVudC5sb2NhbHMsXG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gbG9jYWxzICYmIGxvY2Fscy4kdGVtcGxhdGU7XG5cbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBOb3RlOiBUaGlzIHdpbGwgYWxzbyBsaW5rIGFsbCBjaGlsZHJlbiBvZiBuZy12aWV3IHRoYXQgd2VyZSBjb250YWluZWQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBodG1sLiBJZiB0aGF0IGNvbnRlbnQgY29udGFpbnMgY29udHJvbGxlcnMsIC4uLiB0aGV5IGNvdWxkIHBvbGx1dGUvY2hhbmdlIHRoZSBzY29wZS5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIsIHVzaW5nIG5nLXZpZXcgb24gYW4gZWxlbWVudCB3aXRoIGFkZGl0aW9uYWwgY29udGVudCBkb2VzIG5vdCBtYWtlIHNlbnNlLi4uXG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBjYW4ndCByZW1vdmUgdGhlbSBpbiB0aGUgY2xvbmVBdHRjaEZuIG9mICR0cmFuc2NsdWRlIGFzIHRoYXRcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGlzIGNhbGxlZCBiZWZvcmUgbGlua2luZyB0aGUgY29udGVudCwgd2hpY2ggd291bGQgYXBwbHkgY2hpbGRcbiAgICAgICAgICAgIC8vIGRpcmVjdGl2ZXMgdG8gbm9uIGV4aXN0aW5nIGVsZW1lbnRzLlxuICAgICAgICAgICAgdmFyIGNsb25lID0gJHRyYW5zY2x1ZGUobmV3U2NvcGUsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgICAgICRhbmltYXRlLmVudGVyKGNsb25lLCBudWxsLCBjdXJyZW50RWxlbWVudCB8fCAkZWxlbWVudCwgZnVuY3Rpb24gb25OZ1ZpZXdFbnRlciAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGF1dG9TY3JvbGxFeHApXG4gICAgICAgICAgICAgICAgICAmJiAoIWF1dG9TY3JvbGxFeHAgfHwgc2NvcGUuJGV2YWwoYXV0b1Njcm9sbEV4cCkpKSB7XG4gICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBjbG9uZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IGN1cnJlbnQuc2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJHZpZXdDb250ZW50TG9hZGVkJyk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGV2YWwob25sb2FkRXhwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vLyBUaGlzIGRpcmVjdGl2ZSBpcyBjYWxsZWQgZHVyaW5nIHRoZSAkdHJhbnNjbHVkZSBjYWxsIG9mIHRoZSBmaXJzdCBgbmdWaWV3YCBkaXJlY3RpdmUuXG4vLyBJdCB3aWxsIHJlcGxhY2UgYW5kIGNvbXBpbGUgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2l0aCB0aGUgbG9hZGVkIHRlbXBsYXRlLlxuLy8gV2UgbmVlZCB0aGlzIGRpcmVjdGl2ZSBzbyB0aGF0IHRoZSBlbGVtZW50IGNvbnRlbnQgaXMgYWxyZWFkeSBmaWxsZWQgd2hlblxuLy8gdGhlIGxpbmsgZnVuY3Rpb24gb2YgYW5vdGhlciBkaXJlY3RpdmUgb24gdGhlIHNhbWUgZWxlbWVudCBhcyBuZ1ZpZXdcbi8vIGlzIGNhbGxlZC5cbm5nVmlld0ZpbGxDb250ZW50RmFjdG9yeS4kaW5qZWN0ID0gWyckY29tcGlsZScsICckY29udHJvbGxlcicsICckcm91dGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSgkY29tcGlsZSwgJGNvbnRyb2xsZXIsICRyb3V0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICBwcmlvcml0eTogLTQwMCxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQsXG4gICAgICAgICAgbG9jYWxzID0gY3VycmVudC5sb2NhbHM7XG5cbiAgICAgICRlbGVtZW50Lmh0bWwobG9jYWxzLiR0ZW1wbGF0ZSk7XG5cbiAgICAgIHZhciBsaW5rID0gJGNvbXBpbGUoJGVsZW1lbnQuY29udGVudHMoKSk7XG5cbiAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgbG9jYWxzLiRzY29wZSA9IHNjb3BlO1xuICAgICAgICB2YXIgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGN1cnJlbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgc2NvcGVbY3VycmVudC5jb250cm9sbGVyQXNdID0gY29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICAkZWxlbWVudC5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICAkZWxlbWVudC5jaGlsZHJlbigpLmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICB9XG5cbiAgICAgIGxpbmsoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIEFwcFxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdmFyIEFwcCA9IGFuZ3VsYXIubW9kdWxlKCdZb3VyQXBwJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25nUm91dGUnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYXN2YXouYmluZG9uY2UnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDb250cm9sbGVycycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0RpcmVjdGl2ZXMnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGYWN0b3JpZXMnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGaWx0ZXJzJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU2VydmljZXMnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICduZ1Nhbml0aXplJ1xuICAgICAgICBdKTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENPTkZJR1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgQXBwLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRwcm92aWRlJywgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyLCAkcHJvdmlkZSkge1xuICAgICAgICBcblx0XHQvKlxuXHRcdCAqIERhdGFSZXNvbHZlIGlzIGEgZnVuY3Rpb24gdGhhdCBlbmRzIHVwIHJldHVybmluZyBhIHByb21pc2UuXG5cdFx0ICogVGhpcyBmdW5jdGlvbiBpcyB0aGVuIHBhc3NlZCB0byBldmVyeSByb3V0ZSB0aGF0IG5lZWRzIGl0LlxuXHQgICAgICogVmlld3Mgd29uJ3QgYmUgbG9hZGVkIHVudGlsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkLCBhbGxvd2luZyB0byBcbiAgICAgICAgICogaW5pdGlhbGl6ZSBkYXRhIHdpdGggYSByZXF1ZXN0LlxuXHRcdCovXG5cbiAgICAgICAgLypcbiAgICAgICAgICogXCJIZWxwZXJcIiBpcyBhIHNlcnZpY2Ugd2l0aCBhIG1ldGhvZCB0aGF0IHJldHVybnMgXG4gICAgICAgICAqIGEgcHJvbWlzZSB3aGljaCBsb2FkcyBzb21lIGRhdGEgd2hlbiByZXNvbHZlZC5cbiAgICAgICAgICovXG4gICAgICAgIC8vIHZhciBkYXRhUmVzb2x2ZSA9IGZ1bmN0aW9uKEhlbHBlciwgJHJvdXRlKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gSGVscGVyLmhlbHBlck1ldGhvZChwYXJhbTEsIHBhcmFtMik7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvaG9tZScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICAgICAgICAvLyByZXNvbHZlOiB7dGVhbXM6IGRhdGFSZXNvbHZlfVxuICAgICAgICB9KTtcblx0XHRcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL2NyZWF0ZScsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvY3JlYXRlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZUNvbnRyb2xsZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9lZGl0Jywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9lZGl0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRDb250cm9sbGVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvZWRpdCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvZWRpdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Q29udHJvbGxlcidcbiAgICAgICAgfSk7ICAgICAgICBcblxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7XG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnLyNsb2dpbidcbiAgICAgICAgICAgIC8vIHJlc29sdmU6IHt0ZWFtczogZGF0YVJlc29sdmV9XG4gICAgICAgIH0pO1xuXG4gICAgfV0pO1xufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdDb250cm9sbGVycycsIFtdKTtcblxuLy8gQUREIEVWRVJZIENPTlRST0xMRVIgWU9VIENSRUFURSBUTyBUSElTIEZJTEUuIEVYOlxucmVxdWlyZSgnLi9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcycpO1xucmVxdWlyZSgnLi9jb250cm9sbGVycy9DcmVhdGVDb250cm9sbGVyLmpzJyk7XG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0VkaXRDb250cm9sbGVyLmpzJyk7XG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0xvZ2luQ29udHJvbGxlci5qcycpOyIsImFuZ3VsYXIubW9kdWxlKCdDb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NyZWF0ZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdIZWxwZXInLGZ1bmN0aW9uICgkc2NvcGUsIEhlbHBlcikge1xuXG4gICAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgQ29udGFjdENSVURDb250cm9sbGVyLmNyZWF0ZUNvbnRhY3QoJHNjb3BlLm5hbWUsICRzY29wZS5sYXN0bmFtZSwgY3VyclVzZXIsIGN1cnJUb2tlbiwgZnVuY3Rpb24gKHJlc3VsdCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzICYmIHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5uYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxhc3RuYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0RvbmUhJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTb21ldGhpbmcgd2VudCB3cm9uZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSBudWxsOyBcbiAgICAgICAgICAgICRzY29wZS5sYXN0bmFtZSA9IG51bGw7IFxuICAgICAgICB9XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0NvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignRWRpdENvbnRyb2xsZXInLCBbJyRzY29wZScsICdIZWxwZXInLGZ1bmN0aW9uICgkc2NvcGUsIEhlbHBlcikge1xuXG5cbiAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ29udGFjdENSVURDb250cm9sbGVyLmNyZWF0ZUNvbnRhY3QoJHNjb3BlLmlkLCAkc2NvcGUubmFtZSwgJHNjb3BlLmxhc3RuYW1lLCBjdXJyVXNlciwgY3VyclRva2VuLCBmdW5jdGlvbiAocmVzdWx0LCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMgJiYgcmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGFzdG5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnRG9uZSEnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUubmFtZSA9IG51bGw7IFxuICAgICAgICAgICAgJHNjb3BlLmxhc3RuYW1lID0gbnVsbDsgXG4gICAgICAgICAgICAkc2NvcGUuaWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0NvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdIZWxwZXInLGZ1bmN0aW9uICgkc2NvcGUsIEhlbHBlcikge1xuXG5cbiAgICAgICAgSGVscGVyLmdldCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB2YXIgY2FsbCA9IGRhdGE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGNhbGwpO1xuXG5cbiAgICAgICAgLy8kc2NvcGUuY29udGFjdHMgPSBbe1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FnNEFBRVwiLFwiRmlyc3ROYW1lXCI6XCJKb2huXCIsXCJMYXN0TmFtZVwiOlwiRG93bmVzXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdBZzVBQUVcIixcIkZpcnN0TmFtZVwiOlwiWGF2aWVyXCIsXCJMYXN0TmFtZVwiOlwiQmlyY2hcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FnNkFBRVwiLFwiRmlyc3ROYW1lXCI6XCJCYXNpbFwiLFwiTGFzdE5hbWVcIjpcIldlbmNlc2xhc1wifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3QWc3QUFFXCIsXCJGaXJzdE5hbWVcIjpcIkFsaWNlXCIsXCJMYXN0TmFtZVwiOlwiQmxhY2tcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0Fmb0FBRVwiLFwiRmlyc3ROYW1lXCI6XCJKb2huXCIsXCJMYXN0TmFtZVwiOlwiRG9kZ2VcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FmcUFBRVwiLFwiRmlyc3ROYW1lXCI6XCJHZW9yZ2VcIixcIkxhc3ROYW1lXCI6XCJEYXBwZXJcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FmckFBRVwiLFwiRmlyc3ROYW1lXCI6XCJKYWNrXCIsXCJMYXN0TmFtZVwiOlwiRG9kZ2VcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0Fmc0FBRVwiLFwiRmlyc3ROYW1lXCI6XCJKZXNzaWNhXCIsXCJMYXN0TmFtZVwiOlwiSm9uZXNcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FmdEFBRVwiLFwiRmlyc3ROYW1lXCI6XCJEcmFnb25cIixcIkxhc3ROYW1lXCI6XCJEYXZpY2hcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FmdUFBRVwiLFwiRmlyc3ROYW1lXCI6XCJTdGV2ZVwiLFwiTGFzdE5hbWVcIjpcIkN1cmlvXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdBZnZBQUVcIixcIkZpcnN0TmFtZVwiOlwiTGF1cmFcIixcIkxhc3ROYW1lXCI6XCJCbGFja1wifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3QWZ3QUFFXCIsXCJGaXJzdE5hbWVcIjpcIldpbGhlbG1cIixcIkxhc3ROYW1lXCI6XCJCbGFrZVwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3QWZ4QUFFXCIsXCJGaXJzdE5hbWVcIjpcIldpbnRlclwiLFwiTGFzdE5hbWVcIjpcIkRyYWtlXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdBZnlBQUVcIixcIkZpcnN0TmFtZVwiOlwiU2FsXCIsXCJMYXN0TmFtZVwiOlwiU2FuZHNcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FmekFBRVwiLFwiRmlyc3ROYW1lXCI6XCJKdWxpYVwiLFwiTGFzdE5hbWVcIjpcIldpbGRzXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdBZzBBQUVcIixcIkZpcnN0TmFtZVwiOlwiSnVuaXBlclwiLFwiTGFzdE5hbWVcIjpcIkJpcnNjaFwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3QWcxQUFFXCIsXCJGaXJzdE5hbWVcIjpcIlZhbGVyaWVcIixcIkxhc3ROYW1lXCI6XCJEdW5jYW5cIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N0FnMkFBRVwiLFwiRmlyc3ROYW1lXCI6XCJQYXR0aVwiLFwiTGFzdE5hbWVcIjpcIlBhdGVsXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdBZzNBQUVcIixcIkZpcnN0TmFtZVwiOlwiSnVzdGluXCIsXCJMYXN0TmFtZVwiOlwiU2hvcnRcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDBOQlFrUUFBWFwiLFwiRmlyc3ROYW1lXCI6XCJYYW5kZXJcIixcIkxhc3ROYW1lXCI6XCJFeGFtcGxlXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN1RBQVNcIixcIkZpcnN0TmFtZVwiOlwiUm9zZVwiLFwiTGFzdE5hbWVcIjpcIkdvbnphbGV6XCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN2dBQUNcIixcIkZpcnN0TmFtZVwiOlwiQXNobGV5XCIsXCJMYXN0TmFtZVwiOlwiSmFtZXNcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3aEFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJUb21cIixcIkxhc3ROYW1lXCI6XCJSaXBsZXlcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3aUFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJMaXpcIixcIkxhc3ROYW1lXCI6XCJEJiMzOTtDcnV6XCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN2pBQUNcIixcIkZpcnN0TmFtZVwiOlwiRWRuYVwiLFwiTGFzdE5hbWVcIjpcIkZyYW5rXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN2tBQUNcIixcIkZpcnN0TmFtZVwiOlwiQXZpXCIsXCJMYXN0TmFtZVwiOlwiR3JlZW5cIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3bEFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJTaWRkYXJ0aGFcIixcIkxhc3ROYW1lXCI6XCJOZWRhZXJrXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN21BQUNcIixcIkZpcnN0TmFtZVwiOlwiSmFrZVwiLFwiTGFzdE5hbWVcIjpcIkxsb3JyYWNcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3VUFBU1wiLFwiRmlyc3ROYW1lXCI6XCJTZWFuXCIsXCJMYXN0TmFtZVwiOlwiRm9yYmVzXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNkxyN1ZBQVNcIixcIkZpcnN0TmFtZVwiOlwiSmFja1wiLFwiTGFzdE5hbWVcIjpcIlJvZ2Vyc1wifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdXQUFTXCIsXCJGaXJzdE5hbWVcIjpcIlBhdFwiLFwiTGFzdE5hbWVcIjpcIlN0dW11bGxlclwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdYQUFTXCIsXCJGaXJzdE5hbWVcIjpcIkFuZHlcIixcIkxhc3ROYW1lXCI6XCJZb3VuZ1wifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdZQUFTXCIsXCJGaXJzdE5hbWVcIjpcIlRpbVwiLFwiTGFzdE5hbWVcIjpcIkJhcnJcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3WkFBU1wiLFwiRmlyc3ROYW1lXCI6XCJKb2huXCIsXCJMYXN0TmFtZVwiOlwiQm9uZFwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdhQUFDXCIsXCJGaXJzdE5hbWVcIjpcIlN0ZWxsYVwiLFwiTGFzdE5hbWVcIjpcIlBhdmxvdmFcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3YkFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJMYXVyZW5cIixcIkxhc3ROYW1lXCI6XCJCb3lsZVwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdjQUFDXCIsXCJGaXJzdE5hbWVcIjpcIkJhYmFyYVwiLFwiTGFzdE5hbWVcIjpcIkxldnlcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3ZEFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJKb3NoXCIsXCJMYXN0TmFtZVwiOlwiRGF2aXNcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2THI3ZUFBQ1wiLFwiRmlyc3ROYW1lXCI6XCJKYW5lXCIsXCJMYXN0TmFtZVwiOlwiR3JleVwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDZMcjdmQUFDXCIsXCJGaXJzdE5hbWVcIjpcIkFydGh1clwiLFwiTGFzdE5hbWVcIjpcIlNvbmdcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1prekFBRVwiLFwiRmlyc3ROYW1lXCI6XCJKb2VcIixcIkxhc3ROYW1lXCI6XCJTbWl0aFwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3WmwwQUFFXCIsXCJGaXJzdE5hbWVcIjpcIkthdGh5XCIsXCJMYXN0TmFtZVwiOlwiU21pdGhcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1psMUFBRVwiLFwiRmlyc3ROYW1lXCI6XCJDYXJvbGluZVwiLFwiTGFzdE5hbWVcIjpcIlJvdGhcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1prY0FBRVwiLFwiRmlyc3ROYW1lXCI6XCJKb3NoXCIsXCJMYXN0TmFtZVwiOlwiS2FwbGFuXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdaa2RBQUVcIixcIkZpcnN0TmFtZVwiOlwiS2F0aHlcIixcIkxhc3ROYW1lXCI6XCJCcm93blwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3WlVaQUEyXCIsXCJGaXJzdE5hbWVcIjpcIkpvc2hcIixcIkxhc3ROYW1lXCI6XCJLYXBsYW5cIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1pVYUFBTVwiLFwiRmlyc3ROYW1lXCI6XCJLYXRoeVwiLFwiTGFzdE5hbWVcIjpcIkJyb3duXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdaa1BBQVVcIixcIkZpcnN0TmFtZVwiOlwiQ2Fyb2xpbmVcIixcIkxhc3ROYW1lXCI6XCJSb3RoXCJ9LHtcIklkXCI6XCIwMDM2MTAwMDAwNjdaa1FBQVVcIixcIkZpcnN0TmFtZVwiOlwiS2ltXCIsXCJMYXN0TmFtZVwiOlwiU2hhaW5cIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1pRNUFBTVwiLFwiRmlyc3ROYW1lXCI6XCJDYXJvbGluZVwiLFwiTGFzdE5hbWVcIjpcIlJvdGhcIn0se1wiSWRcIjpcIjAwMzYxMDAwMDA2N1pRNkFBTVwiLFwiRmlyc3ROYW1lXCI6XCJLaW1cIixcIkxhc3ROYW1lXCI6XCJTaGFpblwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3YTFpQUFBXCIsXCJGaXJzdE5hbWVcIjpcIkNhcm9sXCIsXCJMYXN0TmFtZVwiOlwiUnVpelwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMDY3YU9TQUFZXCIsXCJGaXJzdE5hbWVcIjpcIkNhcm9sXCIsXCJMYXN0TmFtZVwiOlwiUnVpelwifSx7XCJJZFwiOlwiMDAzNjEwMDAwMEpza0VlQUFKXCIsXCJGaXJzdE5hbWVcIjpcIk1hdXJpY2lvXCIsXCJMYXN0TmFtZVwiOlwiTWFjaGFkb1wifSx7XCJJZFwiOlwiMDAzNjEwMDAwME9OaEhBQUExXCIsXCJGaXJzdE5hbWVcIjpcIlRlc3RcIixcIkxhc3ROYW1lXCI6XCIyMDE2MDIwMlwifV07XG5cbiAgICAgICAgLy8gQ29udGFjdENSVURDb250cm9sbGVyLmxpc3RVc2VycyhjdXJyVXNlciwgY3VyclRva2VuLCBmdW5jdGlvbihyZXN1bHQsIGV2ZW50KSB7XG4gICAgICAgIC8vICAgICBpZiAoZXZlbnQuc3RhdHVzICYmIHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmNvbnRhY3RzID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnSGVsbG8gV29ybGQnKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSk7XG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0NvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnSGVscGVyJywgJyRsb2NhdGlvbicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIEhlbHBlciwgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBhdXRoQ29udHJvbGxlci51c2VyTG9naW4oJHNjb3BlLnVzZXJuYW1lLCAkc2NvcGUucGFzc3dvcmQsIGZ1bmN0aW9uKHJlc3VsdCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzICYmIHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJuYXZcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgY3VyclVzZXIgPSAkc2NvcGUudXNlcm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJUb2tlbiA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLW1lbnVcIikuaW5uZXJIVE1MID0gY3VyclVzZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJuYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1lvdSBzdXJlIHRob3NlIGFyZSB5b3VyIGNyZWRlbnRpYWxzPycpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnRGlyZWN0aXZlcycsIFtdKTtcblxuLy8gQUREIEVWRVJZIERJUkVDVElWRSBZT1UgQ1JFQVRFIFRPIFRISVMgRklMRS4gRVg6XG5cbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9zb21lRGlyZWN0aXZlLmpzJyk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnRGlyZWN0aXZlcycpXG5cblx0Ly8gVXRpbGl0aWVzIGlzIGJlaW5nIGluamVjdGVkIChkZXBlbmRlbmN5IGluamVjdGlvbiksIGZvciBiZWluZyB1c2VkIGluIHRoaXMgZGlyZWN0aXZlLiBJdCBjb3VsZCBiZSBhIHNlcnZpY2UsIGZhY3RvcnksIGV0Yy5cbiAgICAuZGlyZWN0aXZlKCdzb21lRGlyZWN0aXZlJywgWydVdGlsaXRpZXMnLCBmdW5jdGlvbihNYW5hZ2VyLCBVdGlsaXRpZXMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb21lLWRpcmVjdGl2ZS5odG1sJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnRmFjdG9yaWVzJywgW10pO1xuXG4vLyBBZGQgZXZlcnkgZmFjdG9yeSB5b3UgY3JlYXRlIHRvIHRoaXMgZmlsZS5cblxucmVxdWlyZSgnLi9mYWN0b3JpZXMvc29tZUZhY3RvcnkuanMnKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdGYWN0b3JpZXMnKS5mYWN0b3J5KCdTb21lRmFjdG9yeScsIFsnJHEnLCBmdW5jdGlvbigkcSkge1xuXG4gICAgdmFyIGdldFNvbWVEYXRhID0gZnVuY3Rpb24oc29tZVBhcmFtKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0XG5cdFx0Ly8gSW50ZXJhY3Qgd2l0aCBzb21lIGRhdGEgZnJvbSB0aGUgc2VydmVyLiBcblx0XHQvLyBUaGlzIGV4YW1wbGUgY2FsbHMgYSByZW1vdGUgYWN0aW9uIGRlZmluZWQgaW4gYW4gQVBFWCBjbGFzcyBjYWxsZWQgU29tZUNvbnRyb2xsZXIuXG5cdFx0XG5cdFx0U29tZUNvbnRyb2xsZXIuU29tZU1ldGhvZChzb21lUGFyYW0sIGZ1bmN0aW9uKHJlc3VsdCxldmVudCl7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpOyBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGV2ZW50KTtcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICB7IGJ1ZmZlcjogZmFsc2UsIGVzY2FwZTogdHJ1ZSwgdGltZW91dDogMzAwMDAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTsgICBcbiAgICB9XG5cdFxuICAgIC8vIEFkZCBldmVyeSBtZXRob2QgZGVmaW5lZCBpbiB0aGlzIGZhY3RvcnkgdG8gdGhlIHJldHVybiBvYmplY3RcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTb21lRGF0YTogZ2V0U29tZURhdGFcbiAgICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdGaWx0ZXJzJywgW10pO1xuXG4vLyBBZGQgZXZlcnkgZmlsdGVyIHlvdSBjcmVhdGUgdG8gdGhpcyBmaWxlXG5cbnJlcXVpcmUoJy4vZmlsdGVycy9maWx0ZXJzLmpzJyk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnRmlsdGVycycpXG4gICAgXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gWW91ciBmaWx0ZXJzXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAuZmlsdGVyKCdzb21lRmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzb21lUGFyYW0sIG90aGVyUGFyYW0pIHtcblx0XHRcdC8vIFJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBmaWx0ZXJpbmcuXG4gICAgICAgIH07XG4gICAgfSlcbiIsInJlcXVpcmUoJy4vdmVuZG9yL2JpbmRvbmNlLmpzJyk7XG5yZXF1aXJlKCcuLi9saWIvYW5ndWxhci1yb3V0ZS5qcycpO1xuXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzLmpzJyk7XG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMuanMnKTtcbnJlcXVpcmUoJy4vZmFjdG9yaWVzLmpzJyk7XG5yZXF1aXJlKCcuL2ZpbHRlcnMuanMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMuanMnKTtcblxucmVxdWlyZSgnLi9hcHAuanMnKTtcbnJlcXVpcmUoJy4uLy4uL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMnKTtcbnJlcXVpcmUoJy4uLy4uL3N0eWxlcy9ib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAubWluLmpzJyk7XG5cbiQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgY3VyclVzZXI7XG4gICAgdmFyIGN1cnJUb2tlbjtcbiAgICAkKFwibmF2XCIpLmhpZGUoKTtcblxuICAgIC8qXG4gICAgICogTmF2aWdhdGlvblxuICAgICAqL1xuICAgICQoXCJuYXYgLm1lbnUtaXRlbVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKFwibmF2IC5tZW51LWl0ZW1cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICAqIExvZ291dFxuICAgICAqL1xuICAgICQoXCIjbG9nb3V0XCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGN1cnJUb2tlbiA9IG51bGw7XG4gICAgICAgIGN1cnJVc2VyID0gbnVsbDtcbiAgICAgICAgJChcIm5hdlwiKS5oaWRlKCk7XG4gICAgfSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnU2VydmljZXMnLCBbXSk7XG5cbi8vIEFkZCBldmVyeSBzZXJ2aWNlIHlvdSBjcmVhdGUgdG8gdGhpcyBmaWxlLlxuXG5yZXF1aXJlKCcuL3NlcnZpY2VzL2hlbHBlci5qcycpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJykuc2VydmljZSgnSGVscGVyJywgWyckcScsIGZ1bmN0aW9uICgkcSwgVXRpbGl0aWVzKSB7XG5cbiAgICB0aGlzLmhlbHBlck1ldGhvZCA9IGZ1bmN0aW9uIChwYXJhbTEsIHBhcmFtMikge1xuXHRcdC8vIFJldHVybiB3aGF0ZXZlci4gRWFjaCBzZXJ2aWNlIGlzIGEgc2luZ2xldG9uLCBzbyB0aGlzIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIG1ldGhvZHMgdG8gcGVyZm9ybSBcblx0XHQvLyBBSkFYIHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhbmQgcmV0dXJuIGEgcHJvbWlzZS5cbiAgICAgXG4gICAgICAgIC8vIENvbnRhY3RDUlVEQ29udHJvbGxlci5saXN0VXNlcnMoY3VyclVzZXIsIGN1cnJUb2tlbiwgZnVuY3Rpb24ocmVzdWx0LCBldmVudCkge1xuICAgICAgICAvLyAgICAgaWYgKGV2ZW50LnN0YXR1cyAmJiByZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgICAgICRzY29wZS5jb250YWN0cyA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ0hlbGxvIFdvcmxkJyk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pO1xuXHRcbiAgICAgICAgdmFyIHNvbWV0aGluZyA9IFwidGVzdFwiO1xuICAgICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cblxufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBCaW5kb25jZSAtIFplcm8gd2F0Y2hlcyBiaW5kaW5nIGZvciBBbmd1bGFySnNcbiAqIEB2ZXJzaW9uIHYwLjEuMSAtIDIwMTMtMDUtMDdcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9QYXN2YXovYmluZG9uY2VcbiAqIEBhdXRob3IgUGFzcXVhbGUgVmF6emFuYSA8cGFzcXVhbGV2YXp6YW5hQGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlLCBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG5cbiBhbmd1bGFyLm1vZHVsZSgncGFzdmF6LmJpbmRvbmNlJywgW10pXG5cbiAuZGlyZWN0aXZlKCdiaW5kb25jZScsIGZ1bmN0aW9uKCkge1xuIFx0dmFyIHRvQm9vbGVhbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggIT09IDApIHtcbiBcdFx0XHR2YXIgdiA9IGFuZ3VsYXIubG93ZXJjYXNlKFwiXCIgKyB2YWx1ZSk7XG4gXHRcdFx0dmFsdWUgPSAhKHYgPT0gJ2YnIHx8IHYgPT0gJzAnIHx8IHYgPT0gJ2ZhbHNlJyB8fCB2ID09ICdubycgfHwgdiA9PSAnbicgfHwgdiA9PSAnW10nKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YWx1ZSA9IGZhbHNlO1xuIFx0XHR9XG4gXHRcdHJldHVybiB2YWx1ZTtcbiBcdH1cblxuIFx0cmV0dXJuIHtcbiBcdFx0cmVzdHJpY3Q6IFwiQU1cIixcbiBcdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG4gXHRcdFx0dmFyIHNob3dIaWRlQmluZGVyID0gZnVuY3Rpb24oZWxtLCBhdHRyLCB2YWx1ZSkgXG4gXHRcdFx0e1xuIFx0XHRcdFx0dmFyIHNob3cgPSAoYXR0ciA9PSAnc2hvdycpID8gJycgOiAnbm9uZSc7XG4gXHRcdFx0XHR2YXIgaGlkZSA9IChhdHRyID09ICdoaWRlJykgPyAnJyA6ICdub25lJztcbiBcdFx0XHRcdGVsbS5jc3MoJ2Rpc3BsYXknLCB0b0Jvb2xlYW4odmFsdWUpID8gc2hvdyA6IGhpZGUpO1xuIFx0XHRcdH1cbiBcdFx0XHR2YXIgY2xhc3NCaW5kZXIgPSBmdW5jdGlvbihlbG0sIHZhbHVlKVxuIFx0XHRcdHtcbiBcdFx0XHRcdGlmIChhbmd1bGFyLmlzT2JqZWN0KHZhbHVlKSAmJiAhYW5ndWxhci5pc0FycmF5KHZhbHVlKSkge1xuIFx0XHRcdFx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuIFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2godmFsdWUsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkgcmVzdWx0cy5wdXNoKGluZGV4KTtcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0cztcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmICh2YWx1ZSkge1xuIFx0XHRcdFx0XHRlbG0uYWRkQ2xhc3MoYW5ndWxhci5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLmpvaW4oJyAnKSA6IHZhbHVlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHR2YXIgY3RybCA9XG4gXHRcdFx0e1xuIFx0XHRcdFx0d2F0Y2hlclJlbW92ZXIgOiB1bmRlZmluZWQsXG4gXHRcdFx0XHRiaW5kZXJzIDogW10sXG4gXHRcdFx0XHRncm91cCA6ICRhdHRycy5ib05hbWUsXG4gXHRcdFx0XHRlbGVtZW50IDogJGVsZW1lbnQsXG4gXHRcdFx0XHRyYW4gOiBmYWxzZSxcblxuIFx0XHRcdFx0YWRkQmluZGVyIDogZnVuY3Rpb24oYmluZGVyKSBcbiBcdFx0XHRcdHtcbiBcdFx0XHRcdFx0dGhpcy5iaW5kZXJzLnB1c2goYmluZGVyKTtcblxuIFx0XHRcdFx0XHQvLyBJbiBjYXNlIG9mIGxhdGUgYmluZGluZyAod2hlbiB1c2luZyB0aGUgZGlyZWN0aXZlIGJvLW5hbWUvYm8tcGFyZW50KVxuIFx0XHRcdFx0XHQvLyBpdCBoYXBwZW5zIG9ubHkgd2hlbiB5b3UgdXNlIG5lc3RlZCBiaW5kb25jZSwgaWYgdGhlIGJvLWNoaWxkcmVuXG4gXHRcdFx0XHRcdC8vIGFyZSBub3QgZG9tIGNoaWxkcmVuIHRoZSBsaW5raW5nIGNhbiBmb2xsb3cgYW5vdGhlciBvcmRlclxuIFx0XHRcdFx0XHRpZiAodGhpcy5yYW4pXG4gXHRcdFx0XHRcdHtcbiBcdFx0XHRcdFx0XHR0aGlzLnJ1bkJpbmRlcnMoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSxcblxuIFx0XHRcdFx0c2V0dXBXYXRjaGVyIDogZnVuY3Rpb24oYmluZG9uY2VWYWx1ZSkgXG4gXHRcdFx0XHR7XG4gXHRcdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcbiBcdFx0XHRcdFx0dGhpcy53YXRjaGVyUmVtb3ZlciA9ICRzY29wZS4kd2F0Y2goYmluZG9uY2VWYWx1ZSwgZnVuY3Rpb24obmV3VmFsdWUpIFxuIFx0XHRcdFx0XHR7XG4gXHRcdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuIFx0XHRcdFx0XHRcdHRoYXQucmVtb3ZlV2F0Y2hlcigpO1xuIFx0XHRcdFx0XHRcdHRoYXQucnVuQmluZGVycygpO1xuIFx0XHRcdFx0XHR9LCB0cnVlKTtcbiBcdFx0XHRcdH0sXG5cbiBcdFx0XHRcdHJlbW92ZVdhdGNoZXIgOiBmdW5jdGlvbigpIFxuIFx0XHRcdFx0e1xuIFx0XHRcdFx0XHRpZiAodGhpcy53YXRjaGVyUmVtb3ZlciAhPSB1bmRlZmluZWQpXG4gXHRcdFx0XHRcdHtcbiBcdFx0XHRcdFx0XHR0aGlzLndhdGNoZXJSZW1vdmVyKCk7XG4gXHRcdFx0XHRcdFx0dGhpcy53YXRjaGVyUmVtb3ZlciA9IHVuZGVmaW5lZDtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSxcblxuIFx0XHRcdFx0cnVuQmluZGVycyA6IGZ1bmN0aW9uKClcbiBcdFx0XHRcdHtcbiBcdFx0XHRcdFx0Zm9yICh2YXIgZGF0YSBpbiB0aGlzLmJpbmRlcnMpXG4gXHRcdFx0XHRcdHtcbiBcdFx0XHRcdFx0XHR2YXIgYmluZGVyID0gdGhpcy5iaW5kZXJzW2RhdGFdO1xuIFx0XHRcdFx0XHRcdHZhciB2YWx1ZTtcblxuIFx0XHRcdFx0XHRcdGlmICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAgIT0gYmluZGVyLmdyb3VwICkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRcbiBcdFx0XHRcdFx0XHRpZiAoYmluZGVyLmF0dHIgPT09ICdkYXRhJykge1xuXG4gXHRcdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goT2JqZWN0LmtleXMoYmluZGVyLmF0dHJzKSwgZnVuY3Rpb24oYXR0cikge1xuIFx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3QXR0ciwgbmV3VmFsdWU7XG4gXHRcdFx0XHRcdFx0XHRcdGlmIChhdHRyLm1hdGNoKC9eYm9EYXRhLykgJiYgYmluZGVyLmF0dHJzW2F0dHJdKSB7XG4gXHRcdFx0XHRcdFx0XHRcdFx0bmV3QXR0ciA9IGF0dHIucmVwbGFjZSgvXmJvLywgJycpLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG4gXHRcdFx0XHRcdFx0XHRcdFx0bmV3VmFsdWUgPSAkc2NvcGUuJGV2YWwoYmluZGVyLmF0dHJzW2F0dHJdKTtcbiBcdFx0XHRcdFx0XHRcdFx0XHRiaW5kZXIuZWxlbWVudC5hdHRyKG5ld0F0dHIsIG5ld1ZhbHVlKTtcbiBcdFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XG4gXHRcdFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0XHRcbiBcdFx0XHRcdFx0XHRcdHZhbHVlID0gJHNjb3BlLiRldmFsKGJpbmRlci52YWx1ZSk7XG4gXHRcdFx0XHRcdFx0XG5cdCBcdFx0XHRcdFx0XHRzd2l0Y2goYmluZGVyLmF0dHIpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdoaWRlJzpcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdzaG93Jzpcblx0XHRcdFx0XHRcdFx0XHRzaG93SGlkZUJpbmRlcihiaW5kZXIuZWxlbWVudCwgYmluZGVyLmF0dHIsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdjbGFzcyc6XG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3NCaW5kZXIoYmluZGVyLmVsZW1lbnQsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRcdFx0XHRiaW5kZXIuZWxlbWVudC50ZXh0KHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdodG1sJzpcblx0XHRcdFx0XHRcdFx0XHRiaW5kZXIuZWxlbWVudC5odG1sKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2hyZWYnOlxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2FsdCc6XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAndGl0bGUnOlxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdzdHlsZSc6XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAndmFsdWUnOlxuXHRcdFx0XHRcdFx0XHRcdGJpbmRlci5lbGVtZW50LmF0dHIoYmluZGVyLmF0dHIsIHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXG4gXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0dGhpcy5yYW4gPSB0cnVlO1xuIFx0XHRcdFx0XHR0aGlzLmJpbmRlcnMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY3RybDtcblx0XHR9XSxcblxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBiaW5kb25jZUNvbnRyb2xsZXIpIHtcblx0XHRcdHZhciB2YWx1ZSA9IChhdHRycy5iaW5kb25jZSkgPyBzY29wZS4kZXZhbChhdHRycy5iaW5kb25jZSkgOiB0cnVlO1xuXHRcdFx0aWYgKHZhbHVlICE9IHVuZGVmaW5lZClcblx0XHRcdHtcblx0XHRcdFx0YmluZG9uY2VDb250cm9sbGVyLnJ1bkJpbmRlcnMoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0YmluZG9uY2VDb250cm9sbGVyLnNldHVwV2F0Y2hlcihhdHRycy5iaW5kb25jZSk7XG5cdFx0XHRcdGVsbS5iaW5kKFwiJGRlc3Ryb3lcIiwgYmluZG9uY2VDb250cm9sbGVyLnJlbW92ZVdhdGNoZXIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn0pO1xuXG5hbmd1bGFyLmZvckVhY2goe1xuXHQnYm9TaG93JyA6ICdzaG93Jyxcblx0J2JvSGlkZScgOiAnaGlkZScsXG5cdCdib0NsYXNzJyA6ICdjbGFzcycsXG5cdCdib1RleHQnIDogJ3RleHQnLFxuXHQnYm9IdG1sJyA6ICdodG1sJyxcblx0J2JvU3JjJyA6ICdzcmMnLFxuXHQnYm9IcmVmJyA6ICdocmVmJyxcblx0J2JvQWx0JyA6ICdhbHQnLFxuXHQnYm9UaXRsZScgOiAndGl0bGUnLFxuXHQnYm9JZCcgOiAnaWQnLFxuXHQnYm9TdHlsZScgOiAnc3R5bGUnLFxuXHQnYm9WYWx1ZScgOiAndmFsdWUnLFxuXHQnYm9EYXRhJyA6ICdkYXRhJ1xufSxcbmZ1bmN0aW9uKHRhZywgYXR0cmlidXRlKVxue1xuXHR2YXIgY2hpbGRQcmlvcml0eSA9IDIwMDtcblx0cmV0dXJuIGFuZ3VsYXIubW9kdWxlKCdwYXN2YXouYmluZG9uY2UnKS5kaXJlY3RpdmUoYXR0cmlidXRlLCBmdW5jdGlvbigpIFxuXHR7XG5cdFx0cmV0dXJuIHsgXG5cdFx0XHRwcmlvcml0eTogY2hpbGRQcmlvcml0eSxcblx0XHRcdHJlcXVpcmU6ICdeYmluZG9uY2UnLCBcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBiaW5kb25jZUNvbnRyb2xsZXIpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBuYW1lID0gYXR0cnMuYm9QYXJlbnQ7XG5cdFx0XHRcdGlmIChuYW1lICYmIGJpbmRvbmNlQ29udHJvbGxlci5ncm91cCAhPSBuYW1lKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSBiaW5kb25jZUNvbnRyb2xsZXIuZWxlbWVudC5wYXJlbnQoKTtcblx0XHRcdFx0XHRiaW5kb25jZUNvbnRyb2xsZXIgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dmFyIHBhcmVudFZhbHVlO1xuXG5cdFx0XHRcdFx0d2hpbGUgKGVsZW1lbnRbMF0ubm9kZVR5cGUgIT0gOSAmJiBlbGVtZW50Lmxlbmd0aClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAoKHBhcmVudFZhbHVlID0gZWxlbWVudC5kYXRhKCckYmluZG9uY2VDb250cm9sbGVyJykpIFxuXHRcdFx0XHRcdFx0XHQmJiBwYXJlbnRWYWx1ZS5ncm91cCA9PSBuYW1lKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRiaW5kb25jZUNvbnRyb2xsZXIgPSBwYXJlbnRWYWx1ZVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIWJpbmRvbmNlQ29udHJvbGxlcilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aHJvdyBFcnJvcihcIk5vIGJpbmRvbmNlIGNvbnRyb2xsZXI6IFwiICsgbmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJpbmRvbmNlQ29udHJvbGxlci5hZGRCaW5kZXIoe2VsZW1lbnQ6IGVsbSwgYXR0cjp0YWcsIHZhbHVlOiBhdHRyc1thdHRyaWJ1dGVdLCBncm91cDogbmFtZSwgYXR0cnM6YXR0cnN9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG4iLCIvKiFcbiAqIEJvb3RzdHJhcCB2My4zLjYgKGh0dHA6Ly9nZXRib290c3RyYXAuY29tKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeVwiKTsrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGI9YS5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihiWzBdPDImJmJbMV08OXx8MT09YlswXSYmOT09YlsxXSYmYlsyXTwxfHxiWzBdPjIpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gM1wiKX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIiksYj17V2Via2l0VHJhbnNpdGlvbjpcIndlYmtpdFRyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmRcIix0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwifTtmb3IodmFyIGMgaW4gYilpZih2b2lkIDAhPT1hLnN0eWxlW2NdKXJldHVybntlbmQ6YltjXX07cmV0dXJuITF9YS5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZD1mdW5jdGlvbihiKXt2YXIgYz0hMSxkPXRoaXM7YSh0aGlzKS5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe2M9ITB9KTt2YXIgZT1mdW5jdGlvbigpe2N8fGEoZCkudHJpZ2dlcihhLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpfTtyZXR1cm4gc2V0VGltZW91dChlLGIpLHRoaXN9LGEoZnVuY3Rpb24oKXthLnN1cHBvcnQudHJhbnNpdGlvbj1iKCksYS5zdXBwb3J0LnRyYW5zaXRpb24mJihhLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kPXtiaW5kVHlwZTphLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsZGVsZWdhdGVUeXBlOmEuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxoYW5kbGU6ZnVuY3Rpb24oYil7cmV0dXJuIGEoYi50YXJnZXQpLmlzKHRoaXMpP2IuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpOnZvaWQgMH19KX0pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1hKHRoaXMpLGU9Yy5kYXRhKFwiYnMuYWxlcnRcIik7ZXx8Yy5kYXRhKFwiYnMuYWxlcnRcIixlPW5ldyBkKHRoaXMpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZVtiXS5jYWxsKGMpfSl9dmFyIGM9J1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsZD1mdW5jdGlvbihiKXthKGIpLm9uKFwiY2xpY2tcIixjLHRoaXMuY2xvc2UpfTtkLlZFUlNJT049XCIzLjMuNlwiLGQuVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsZC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2cuZGV0YWNoKCkudHJpZ2dlcihcImNsb3NlZC5icy5hbGVydFwiKS5yZW1vdmUoKX12YXIgZT1hKHRoaXMpLGY9ZS5hdHRyKFwiZGF0YS10YXJnZXRcIik7Znx8KGY9ZS5hdHRyKFwiaHJlZlwiKSxmPWYmJmYucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLyxcIlwiKSk7dmFyIGc9YShmKTtiJiZiLnByZXZlbnREZWZhdWx0KCksZy5sZW5ndGh8fChnPWUuY2xvc2VzdChcIi5hbGVydFwiKSksZy50cmlnZ2VyKGI9YS5FdmVudChcImNsb3NlLmJzLmFsZXJ0XCIpKSxiLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwoZy5yZW1vdmVDbGFzcyhcImluXCIpLGEuc3VwcG9ydC50cmFuc2l0aW9uJiZnLmhhc0NsYXNzKFwiZmFkZVwiKT9nLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGQuVFJBTlNJVElPTl9EVVJBVElPTik6YygpKX07dmFyIGU9YS5mbi5hbGVydDthLmZuLmFsZXJ0PWIsYS5mbi5hbGVydC5Db25zdHJ1Y3Rvcj1kLGEuZm4uYWxlcnQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmFsZXJ0PWUsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5hbGVydC5kYXRhLWFwaVwiLGMsZC5wcm90b3R5cGUuY2xvc2UpfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKFwiYnMuYnV0dG9uXCIpLGY9XCJvYmplY3RcIj09dHlwZW9mIGImJmI7ZXx8ZC5kYXRhKFwiYnMuYnV0dG9uXCIsZT1uZXcgYyh0aGlzLGYpKSxcInRvZ2dsZVwiPT1iP2UudG9nZ2xlKCk6YiYmZS5zZXRTdGF0ZShiKX0pfXZhciBjPWZ1bmN0aW9uKGIsZCl7dGhpcy4kZWxlbWVudD1hKGIpLHRoaXMub3B0aW9ucz1hLmV4dGVuZCh7fSxjLkRFRkFVTFRTLGQpLHRoaXMuaXNMb2FkaW5nPSExfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuREVGQVVMVFM9e2xvYWRpbmdUZXh0OlwibG9hZGluZy4uLlwifSxjLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihiKXt2YXIgYz1cImRpc2FibGVkXCIsZD10aGlzLiRlbGVtZW50LGU9ZC5pcyhcImlucHV0XCIpP1widmFsXCI6XCJodG1sXCIsZj1kLmRhdGEoKTtiKz1cIlRleHRcIixudWxsPT1mLnJlc2V0VGV4dCYmZC5kYXRhKFwicmVzZXRUZXh0XCIsZFtlXSgpKSxzZXRUaW1lb3V0KGEucHJveHkoZnVuY3Rpb24oKXtkW2VdKG51bGw9PWZbYl0/dGhpcy5vcHRpb25zW2JdOmZbYl0pLFwibG9hZGluZ1RleHRcIj09Yj8odGhpcy5pc0xvYWRpbmc9ITAsZC5hZGRDbGFzcyhjKS5hdHRyKGMsYykpOnRoaXMuaXNMb2FkaW5nJiYodGhpcy5pc0xvYWRpbmc9ITEsZC5yZW1vdmVDbGFzcyhjKS5yZW1vdmVBdHRyKGMpKX0sdGhpcyksMCl9LGMucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBhPSEwLGI9dGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyk7aWYoYi5sZW5ndGgpe3ZhciBjPXRoaXMuJGVsZW1lbnQuZmluZChcImlucHV0XCIpO1wicmFkaW9cIj09Yy5wcm9wKFwidHlwZVwiKT8oYy5wcm9wKFwiY2hlY2tlZFwiKSYmKGE9ITEpLGIuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhcImFjdGl2ZVwiKSk6XCJjaGVja2JveFwiPT1jLnByb3AoXCJ0eXBlXCIpJiYoYy5wcm9wKFwiY2hlY2tlZFwiKSE9PXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikmJihhPSExKSx0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpKSxjLnByb3AoXCJjaGVja2VkXCIsdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSksYSYmYy50cmlnZ2VyKFwiY2hhbmdlXCIpfWVsc2UgdGhpcy4kZWxlbWVudC5hdHRyKFwiYXJpYS1wcmVzc2VkXCIsIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikpLHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIil9O3ZhciBkPWEuZm4uYnV0dG9uO2EuZm4uYnV0dG9uPWIsYS5mbi5idXR0b24uQ29uc3RydWN0b3I9YyxhLmZuLmJ1dHRvbi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uYnV0dG9uPWQsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5idXR0b24uZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsZnVuY3Rpb24oYyl7dmFyIGQ9YShjLnRhcmdldCk7ZC5oYXNDbGFzcyhcImJ0blwiKXx8KGQ9ZC5jbG9zZXN0KFwiLmJ0blwiKSksYi5jYWxsKGQsXCJ0b2dnbGVcIiksYShjLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpfHxhKGMudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyl8fGMucHJldmVudERlZmF1bHQoKX0pLm9uKFwiZm9jdXMuYnMuYnV0dG9uLmRhdGEtYXBpIGJsdXIuYnMuYnV0dG9uLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLGZ1bmN0aW9uKGIpe2EoYi50YXJnZXQpLmNsb3Nlc3QoXCIuYnRuXCIpLnRvZ2dsZUNsYXNzKFwiZm9jdXNcIiwvXmZvY3VzKGluKT8kLy50ZXN0KGIudHlwZSkpfSl9KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy5jYXJvdXNlbFwiKSxmPWEuZXh0ZW5kKHt9LGMuREVGQVVMVFMsZC5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpLGc9XCJzdHJpbmdcIj09dHlwZW9mIGI/YjpmLnNsaWRlO2V8fGQuZGF0YShcImJzLmNhcm91c2VsXCIsZT1uZXcgYyh0aGlzLGYpKSxcIm51bWJlclwiPT10eXBlb2YgYj9lLnRvKGIpOmc/ZVtnXSgpOmYuaW50ZXJ2YWwmJmUucGF1c2UoKS5jeWNsZSgpfSl9dmFyIGM9ZnVuY3Rpb24oYixjKXt0aGlzLiRlbGVtZW50PWEoYiksdGhpcy4kaW5kaWNhdG9ycz10aGlzLiRlbGVtZW50LmZpbmQoXCIuY2Fyb3VzZWwtaW5kaWNhdG9yc1wiKSx0aGlzLm9wdGlvbnM9Yyx0aGlzLnBhdXNlZD1udWxsLHRoaXMuc2xpZGluZz1udWxsLHRoaXMuaW50ZXJ2YWw9bnVsbCx0aGlzLiRhY3RpdmU9bnVsbCx0aGlzLiRpdGVtcz1udWxsLHRoaXMub3B0aW9ucy5rZXlib2FyZCYmdGhpcy4kZWxlbWVudC5vbihcImtleWRvd24uYnMuY2Fyb3VzZWxcIixhLnByb3h5KHRoaXMua2V5ZG93bix0aGlzKSksXCJob3ZlclwiPT10aGlzLm9wdGlvbnMucGF1c2UmJiEoXCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkmJnRoaXMuJGVsZW1lbnQub24oXCJtb3VzZWVudGVyLmJzLmNhcm91c2VsXCIsYS5wcm94eSh0aGlzLnBhdXNlLHRoaXMpKS5vbihcIm1vdXNlbGVhdmUuYnMuY2Fyb3VzZWxcIixhLnByb3h5KHRoaXMuY3ljbGUsdGhpcykpfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuVFJBTlNJVElPTl9EVVJBVElPTj02MDAsYy5ERUZBVUxUUz17aW50ZXJ2YWw6NWUzLHBhdXNlOlwiaG92ZXJcIix3cmFwOiEwLGtleWJvYXJkOiEwfSxjLnByb3RvdHlwZS5rZXlkb3duPWZ1bmN0aW9uKGEpe2lmKCEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGEudGFyZ2V0LnRhZ05hbWUpKXtzd2l0Y2goYS53aGljaCl7Y2FzZSAzNzp0aGlzLnByZXYoKTticmVhaztjYXNlIDM5OnRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufWEucHJldmVudERlZmF1bHQoKX19LGMucHJvdG90eXBlLmN5Y2xlPWZ1bmN0aW9uKGIpe3JldHVybiBifHwodGhpcy5wYXVzZWQ9ITEpLHRoaXMuaW50ZXJ2YWwmJmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCksdGhpcy5vcHRpb25zLmludGVydmFsJiYhdGhpcy5wYXVzZWQmJih0aGlzLmludGVydmFsPXNldEludGVydmFsKGEucHJveHkodGhpcy5uZXh0LHRoaXMpLHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpLHRoaXN9LGMucHJvdG90eXBlLmdldEl0ZW1JbmRleD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy4kaXRlbXM9YS5wYXJlbnQoKS5jaGlsZHJlbihcIi5pdGVtXCIpLHRoaXMuJGl0ZW1zLmluZGV4KGF8fHRoaXMuJGFjdGl2ZSl9LGMucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb249ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmdldEl0ZW1JbmRleChiKSxkPVwicHJldlwiPT1hJiYwPT09Y3x8XCJuZXh0XCI9PWEmJmM9PXRoaXMuJGl0ZW1zLmxlbmd0aC0xO2lmKGQmJiF0aGlzLm9wdGlvbnMud3JhcClyZXR1cm4gYjt2YXIgZT1cInByZXZcIj09YT8tMToxLGY9KGMrZSkldGhpcy4kaXRlbXMubGVuZ3RoO3JldHVybiB0aGlzLiRpdGVtcy5lcShmKX0sYy5wcm90b3R5cGUudG89ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcyxjPXRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZT10aGlzLiRlbGVtZW50LmZpbmQoXCIuaXRlbS5hY3RpdmVcIikpO3JldHVybiBhPnRoaXMuJGl0ZW1zLmxlbmd0aC0xfHwwPmE/dm9pZCAwOnRoaXMuc2xpZGluZz90aGlzLiRlbGVtZW50Lm9uZShcInNsaWQuYnMuY2Fyb3VzZWxcIixmdW5jdGlvbigpe2IudG8oYSl9KTpjPT1hP3RoaXMucGF1c2UoKS5jeWNsZSgpOnRoaXMuc2xpZGUoYT5jP1wibmV4dFwiOlwicHJldlwiLHRoaXMuJGl0ZW1zLmVxKGEpKX0sYy5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oYil7cmV0dXJuIGJ8fCh0aGlzLnBhdXNlZD0hMCksdGhpcy4kZWxlbWVudC5maW5kKFwiLm5leHQsIC5wcmV2XCIpLmxlbmd0aCYmYS5zdXBwb3J0LnRyYW5zaXRpb24mJih0aGlzLiRlbGVtZW50LnRyaWdnZXIoYS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSx0aGlzLmN5Y2xlKCEwKSksdGhpcy5pbnRlcnZhbD1jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpLHRoaXN9LGMucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zbGlkaW5nP3ZvaWQgMDp0aGlzLnNsaWRlKFwibmV4dFwiKX0sYy5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNsaWRpbmc/dm9pZCAwOnRoaXMuc2xpZGUoXCJwcmV2XCIpfSxjLnByb3RvdHlwZS5zbGlkZT1mdW5jdGlvbihiLGQpe3ZhciBlPXRoaXMuJGVsZW1lbnQuZmluZChcIi5pdGVtLmFjdGl2ZVwiKSxmPWR8fHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbihiLGUpLGc9dGhpcy5pbnRlcnZhbCxoPVwibmV4dFwiPT1iP1wibGVmdFwiOlwicmlnaHRcIixpPXRoaXM7aWYoZi5oYXNDbGFzcyhcImFjdGl2ZVwiKSlyZXR1cm4gdGhpcy5zbGlkaW5nPSExO3ZhciBqPWZbMF0saz1hLkV2ZW50KFwic2xpZGUuYnMuY2Fyb3VzZWxcIix7cmVsYXRlZFRhcmdldDpqLGRpcmVjdGlvbjpofSk7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGspLCFrLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtpZih0aGlzLnNsaWRpbmc9ITAsZyYmdGhpcy5wYXVzZSgpLHRoaXMuJGluZGljYXRvcnMubGVuZ3RoKXt0aGlzLiRpbmRpY2F0b3JzLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO3ZhciBsPWEodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KGYpXSk7bCYmbC5hZGRDbGFzcyhcImFjdGl2ZVwiKX12YXIgbT1hLkV2ZW50KFwic2xpZC5icy5jYXJvdXNlbFwiLHtyZWxhdGVkVGFyZ2V0OmosZGlyZWN0aW9uOmh9KTtyZXR1cm4gYS5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJzbGlkZVwiKT8oZi5hZGRDbGFzcyhiKSxmWzBdLm9mZnNldFdpZHRoLGUuYWRkQ2xhc3MoaCksZi5hZGRDbGFzcyhoKSxlLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7Zi5yZW1vdmVDbGFzcyhbYixoXS5qb2luKFwiIFwiKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIiksZS5yZW1vdmVDbGFzcyhbXCJhY3RpdmVcIixoXS5qb2luKFwiIFwiKSksaS5zbGlkaW5nPSExLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpLiRlbGVtZW50LnRyaWdnZXIobSl9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5UUkFOU0lUSU9OX0RVUkFUSU9OKSk6KGUucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksZi5hZGRDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLnNsaWRpbmc9ITEsdGhpcy4kZWxlbWVudC50cmlnZ2VyKG0pKSxnJiZ0aGlzLmN5Y2xlKCksdGhpc319O3ZhciBkPWEuZm4uY2Fyb3VzZWw7YS5mbi5jYXJvdXNlbD1iLGEuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3I9YyxhLmZuLmNhcm91c2VsLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5jYXJvdXNlbD1kLHRoaXN9O3ZhciBlPWZ1bmN0aW9uKGMpe3ZhciBkLGU9YSh0aGlzKSxmPWEoZS5hdHRyKFwiZGF0YS10YXJnZXRcIil8fChkPWUuYXR0cihcImhyZWZcIikpJiZkLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIikpO2lmKGYuaGFzQ2xhc3MoXCJjYXJvdXNlbFwiKSl7dmFyIGc9YS5leHRlbmQoe30sZi5kYXRhKCksZS5kYXRhKCkpLGg9ZS5hdHRyKFwiZGF0YS1zbGlkZS10b1wiKTtoJiYoZy5pbnRlcnZhbD0hMSksYi5jYWxsKGYsZyksaCYmZi5kYXRhKFwiYnMuY2Fyb3VzZWxcIikudG8oaCksYy5wcmV2ZW50RGVmYXVsdCgpfX07YShkb2N1bWVudCkub24oXCJjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaVwiLFwiW2RhdGEtc2xpZGVdXCIsZSkub24oXCJjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaVwiLFwiW2RhdGEtc2xpZGUtdG9dXCIsZSksYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7YSgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcyk7Yi5jYWxsKGMsYy5kYXRhKCkpfSl9KX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXt2YXIgYyxkPWIuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHwoYz1iLmF0dHIoXCJocmVmXCIpKSYmYy5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLFwiXCIpO3JldHVybiBhKGQpfWZ1bmN0aW9uIGMoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcyksZT1jLmRhdGEoXCJicy5jb2xsYXBzZVwiKSxmPWEuZXh0ZW5kKHt9LGQuREVGQVVMVFMsYy5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpOyFlJiZmLnRvZ2dsZSYmL3Nob3d8aGlkZS8udGVzdChiKSYmKGYudG9nZ2xlPSExKSxlfHxjLmRhdGEoXCJicy5jb2xsYXBzZVwiLGU9bmV3IGQodGhpcyxmKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmVbYl0oKX0pfXZhciBkPWZ1bmN0aW9uKGIsYyl7dGhpcy4kZWxlbWVudD1hKGIpLHRoaXMub3B0aW9ucz1hLmV4dGVuZCh7fSxkLkRFRkFVTFRTLGMpLHRoaXMuJHRyaWdnZXI9YSgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnK2IuaWQrJ1wiXSxbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK2IuaWQrJ1wiXScpLHRoaXMudHJhbnNpdGlvbmluZz1udWxsLHRoaXMub3B0aW9ucy5wYXJlbnQ/dGhpcy4kcGFyZW50PXRoaXMuZ2V0UGFyZW50KCk6dGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCx0aGlzLiR0cmlnZ2VyKSx0aGlzLm9wdGlvbnMudG9nZ2xlJiZ0aGlzLnRvZ2dsZSgpfTtkLlZFUlNJT049XCIzLjMuNlwiLGQuVFJBTlNJVElPTl9EVVJBVElPTj0zNTAsZC5ERUZBVUxUUz17dG9nZ2xlOiEwfSxkLnByb3RvdHlwZS5kaW1lbnNpb249ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwid2lkdGhcIik7cmV0dXJuIGE/XCJ3aWR0aFwiOlwiaGVpZ2h0XCJ9LGQucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXtpZighdGhpcy50cmFuc2l0aW9uaW5nJiYhdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImluXCIpKXt2YXIgYixlPXRoaXMuJHBhcmVudCYmdGhpcy4kcGFyZW50LmNoaWxkcmVuKFwiLnBhbmVsXCIpLmNoaWxkcmVuKFwiLmluLCAuY29sbGFwc2luZ1wiKTtpZighKGUmJmUubGVuZ3RoJiYoYj1lLmRhdGEoXCJicy5jb2xsYXBzZVwiKSxiJiZiLnRyYW5zaXRpb25pbmcpKSl7dmFyIGY9YS5FdmVudChcInNob3cuYnMuY29sbGFwc2VcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGYpLCFmLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtlJiZlLmxlbmd0aCYmKGMuY2FsbChlLFwiaGlkZVwiKSxifHxlLmRhdGEoXCJicy5jb2xsYXBzZVwiLG51bGwpKTt2YXIgZz10aGlzLmRpbWVuc2lvbigpO3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZVwiKS5hZGRDbGFzcyhcImNvbGxhcHNpbmdcIilbZ10oMCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy4kdHJpZ2dlci5yZW1vdmVDbGFzcyhcImNvbGxhcHNlZFwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLnRyYW5zaXRpb25pbmc9MTt2YXIgaD1mdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzaW5nXCIpLmFkZENsYXNzKFwiY29sbGFwc2UgaW5cIilbZ10oXCJcIiksdGhpcy50cmFuc2l0aW9uaW5nPTAsdGhpcy4kZWxlbWVudC50cmlnZ2VyKFwic2hvd24uYnMuY29sbGFwc2VcIil9O2lmKCFhLnN1cHBvcnQudHJhbnNpdGlvbilyZXR1cm4gaC5jYWxsKHRoaXMpO3ZhciBpPWEuY2FtZWxDYXNlKFtcInNjcm9sbFwiLGddLmpvaW4oXCItXCIpKTt0aGlzLiRlbGVtZW50Lm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkoaCx0aGlzKSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoZC5UUkFOU0lUSU9OX0RVUkFUSU9OKVtnXSh0aGlzLiRlbGVtZW50WzBdW2ldKX19fX0sZC5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbigpe2lmKCF0aGlzLnRyYW5zaXRpb25pbmcmJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJpblwiKSl7dmFyIGI9YS5FdmVudChcImhpZGUuYnMuY29sbGFwc2VcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGIpLCFiLmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgYz10aGlzLmRpbWVuc2lvbigpO3RoaXMuJGVsZW1lbnRbY10odGhpcy4kZWxlbWVudFtjXSgpKVswXS5vZmZzZXRIZWlnaHQsdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhcImNvbGxhcHNpbmdcIikucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZSBpblwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLiR0cmlnZ2VyLmFkZENsYXNzKFwiY29sbGFwc2VkXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMudHJhbnNpdGlvbmluZz0xO3ZhciBlPWZ1bmN0aW9uKCl7dGhpcy50cmFuc2l0aW9uaW5nPTAsdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNpbmdcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZVwiKS50cmlnZ2VyKFwiaGlkZGVuLmJzLmNvbGxhcHNlXCIpfTtyZXR1cm4gYS5zdXBwb3J0LnRyYW5zaXRpb24/dm9pZCB0aGlzLiRlbGVtZW50W2NdKDApLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkoZSx0aGlzKSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoZC5UUkFOU0lUSU9OX0RVUkFUSU9OKTplLmNhbGwodGhpcyl9fX0sZC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiaW5cIik/XCJoaWRlXCI6XCJzaG93XCJdKCl9LGQucHJvdG90eXBlLmdldFBhcmVudD1mdW5jdGlvbigpe3JldHVybiBhKHRoaXMub3B0aW9ucy5wYXJlbnQpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyt0aGlzLm9wdGlvbnMucGFyZW50KydcIl0nKS5lYWNoKGEucHJveHkoZnVuY3Rpb24oYyxkKXt2YXIgZT1hKGQpO3RoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGIoZSksZSl9LHRoaXMpKS5lbmQoKX0sZC5wcm90b3R5cGUuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5oYXNDbGFzcyhcImluXCIpO2EuYXR0cihcImFyaWEtZXhwYW5kZWRcIixjKSxiLnRvZ2dsZUNsYXNzKFwiY29sbGFwc2VkXCIsIWMpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsYyl9O3ZhciBlPWEuZm4uY29sbGFwc2U7YS5mbi5jb2xsYXBzZT1jLGEuZm4uY29sbGFwc2UuQ29uc3RydWN0b3I9ZCxhLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5jb2xsYXBzZT1lLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLGZ1bmN0aW9uKGQpe3ZhciBlPWEodGhpcyk7ZS5hdHRyKFwiZGF0YS10YXJnZXRcIil8fGQucHJldmVudERlZmF1bHQoKTt2YXIgZj1iKGUpLGc9Zi5kYXRhKFwiYnMuY29sbGFwc2VcIiksaD1nP1widG9nZ2xlXCI6ZS5kYXRhKCk7Yy5jYWxsKGYsaCl9KX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXt2YXIgYz1iLmF0dHIoXCJkYXRhLXRhcmdldFwiKTtjfHwoYz1iLmF0dHIoXCJocmVmXCIpLGM9YyYmLyNbQS1aYS16XS8udGVzdChjKSYmYy5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLFwiXCIpKTt2YXIgZD1jJiZhKGMpO3JldHVybiBkJiZkLmxlbmd0aD9kOmIucGFyZW50KCl9ZnVuY3Rpb24gYyhjKXtjJiYzPT09Yy53aGljaHx8KGEoZSkucmVtb3ZlKCksYShmKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGQ9YSh0aGlzKSxlPWIoZCksZj17cmVsYXRlZFRhcmdldDp0aGlzfTtlLmhhc0NsYXNzKFwib3BlblwiKSYmKGMmJlwiY2xpY2tcIj09Yy50eXBlJiYvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGMudGFyZ2V0LnRhZ05hbWUpJiZhLmNvbnRhaW5zKGVbMF0sYy50YXJnZXQpfHwoZS50cmlnZ2VyKGM9YS5FdmVudChcImhpZGUuYnMuZHJvcGRvd25cIixmKSksYy5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KGQuYXR0cihcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLGUucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpLnRyaWdnZXIoYS5FdmVudChcImhpZGRlbi5icy5kcm9wZG93blwiLGYpKSkpKX0pKX1mdW5jdGlvbiBkKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1hKHRoaXMpLGQ9Yy5kYXRhKFwiYnMuZHJvcGRvd25cIik7ZHx8Yy5kYXRhKFwiYnMuZHJvcGRvd25cIixkPW5ldyBnKHRoaXMpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZFtiXS5jYWxsKGMpfSl9dmFyIGU9XCIuZHJvcGRvd24tYmFja2Ryb3BcIixmPSdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsZz1mdW5jdGlvbihiKXthKGIpLm9uKFwiY2xpY2suYnMuZHJvcGRvd25cIix0aGlzLnRvZ2dsZSl9O2cuVkVSU0lPTj1cIjMuMy42XCIsZy5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGQpe3ZhciBlPWEodGhpcyk7aWYoIWUuaXMoXCIuZGlzYWJsZWQsIDpkaXNhYmxlZFwiKSl7dmFyIGY9YihlKSxnPWYuaGFzQ2xhc3MoXCJvcGVuXCIpO2lmKGMoKSwhZyl7XCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCYmIWYuY2xvc2VzdChcIi5uYXZiYXItbmF2XCIpLmxlbmd0aCYmYShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKS5hZGRDbGFzcyhcImRyb3Bkb3duLWJhY2tkcm9wXCIpLmluc2VydEFmdGVyKGEodGhpcykpLm9uKFwiY2xpY2tcIixjKTt2YXIgaD17cmVsYXRlZFRhcmdldDp0aGlzfTtpZihmLnRyaWdnZXIoZD1hLkV2ZW50KFwic2hvdy5icy5kcm9wZG93blwiLGgpKSxkLmlzRGVmYXVsdFByZXZlbnRlZCgpKXJldHVybjtlLnRyaWdnZXIoXCJmb2N1c1wiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLFwidHJ1ZVwiKSxmLnRvZ2dsZUNsYXNzKFwib3BlblwiKS50cmlnZ2VyKGEuRXZlbnQoXCJzaG93bi5icy5kcm9wZG93blwiLGgpKX1yZXR1cm4hMX19LGcucHJvdG90eXBlLmtleWRvd249ZnVuY3Rpb24oYyl7aWYoLygzOHw0MHwyN3wzMikvLnRlc3QoYy53aGljaCkmJiEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGMudGFyZ2V0LnRhZ05hbWUpKXt2YXIgZD1hKHRoaXMpO2lmKGMucHJldmVudERlZmF1bHQoKSxjLnN0b3BQcm9wYWdhdGlvbigpLCFkLmlzKFwiLmRpc2FibGVkLCA6ZGlzYWJsZWRcIikpe3ZhciBlPWIoZCksZz1lLmhhc0NsYXNzKFwib3BlblwiKTtpZighZyYmMjchPWMud2hpY2h8fGcmJjI3PT1jLndoaWNoKXJldHVybiAyNz09Yy53aGljaCYmZS5maW5kKGYpLnRyaWdnZXIoXCJmb2N1c1wiKSxkLnRyaWdnZXIoXCJjbGlja1wiKTt2YXIgaD1cIiBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGFcIixpPWUuZmluZChcIi5kcm9wZG93bi1tZW51XCIraCk7aWYoaS5sZW5ndGgpe3ZhciBqPWkuaW5kZXgoYy50YXJnZXQpOzM4PT1jLndoaWNoJiZqPjAmJmotLSw0MD09Yy53aGljaCYmajxpLmxlbmd0aC0xJiZqKyssfmp8fChqPTApLGkuZXEoaikudHJpZ2dlcihcImZvY3VzXCIpfX19fTt2YXIgaD1hLmZuLmRyb3Bkb3duO2EuZm4uZHJvcGRvd249ZCxhLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yPWcsYS5mbi5kcm9wZG93bi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uZHJvcGRvd249aCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsYykub24oXCJjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaVwiLFwiLmRyb3Bkb3duIGZvcm1cIixmdW5jdGlvbihhKXthLnN0b3BQcm9wYWdhdGlvbigpfSkub24oXCJjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaVwiLGYsZy5wcm90b3R5cGUudG9nZ2xlKS5vbihcImtleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGlcIixmLGcucHJvdG90eXBlLmtleWRvd24pLm9uKFwia2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaVwiLFwiLmRyb3Bkb3duLW1lbnVcIixnLnByb3RvdHlwZS5rZXlkb3duKX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiLGQpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKFwiYnMubW9kYWxcIiksZz1hLmV4dGVuZCh7fSxjLkRFRkFVTFRTLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtmfHxlLmRhdGEoXCJicy5tb2RhbFwiLGY9bmV3IGModGhpcyxnKSksXCJzdHJpbmdcIj09dHlwZW9mIGI/ZltiXShkKTpnLnNob3cmJmYuc2hvdyhkKX0pfXZhciBjPWZ1bmN0aW9uKGIsYyl7dGhpcy5vcHRpb25zPWMsdGhpcy4kYm9keT1hKGRvY3VtZW50LmJvZHkpLHRoaXMuJGVsZW1lbnQ9YShiKSx0aGlzLiRkaWFsb2c9dGhpcy4kZWxlbWVudC5maW5kKFwiLm1vZGFsLWRpYWxvZ1wiKSx0aGlzLiRiYWNrZHJvcD1udWxsLHRoaXMuaXNTaG93bj1udWxsLHRoaXMub3JpZ2luYWxCb2R5UGFkPW51bGwsdGhpcy5zY3JvbGxiYXJXaWR0aD0wLHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaz0hMSx0aGlzLm9wdGlvbnMucmVtb3RlJiZ0aGlzLiRlbGVtZW50LmZpbmQoXCIubW9kYWwtY29udGVudFwiKS5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsYS5wcm94eShmdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQudHJpZ2dlcihcImxvYWRlZC5icy5tb2RhbFwiKX0sdGhpcykpfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuVFJBTlNJVElPTl9EVVJBVElPTj0zMDAsYy5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxjLkRFRkFVTFRTPXtiYWNrZHJvcDohMCxrZXlib2FyZDohMCxzaG93OiEwfSxjLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuaXNTaG93bj90aGlzLmhpZGUoKTp0aGlzLnNob3coYSl9LGMucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oYil7dmFyIGQ9dGhpcyxlPWEuRXZlbnQoXCJzaG93LmJzLm1vZGFsXCIse3JlbGF0ZWRUYXJnZXQ6Yn0pO3RoaXMuJGVsZW1lbnQudHJpZ2dlcihlKSx0aGlzLmlzU2hvd258fGUuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLmlzU2hvd249ITAsdGhpcy5jaGVja1Njcm9sbGJhcigpLHRoaXMuc2V0U2Nyb2xsYmFyKCksdGhpcy4kYm9keS5hZGRDbGFzcyhcIm1vZGFsLW9wZW5cIiksdGhpcy5lc2NhcGUoKSx0aGlzLnJlc2l6ZSgpLHRoaXMuJGVsZW1lbnQub24oXCJjbGljay5kaXNtaXNzLmJzLm1vZGFsXCIsJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsYS5wcm94eSh0aGlzLmhpZGUsdGhpcykpLHRoaXMuJGRpYWxvZy5vbihcIm1vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtkLiRlbGVtZW50Lm9uZShcIm1vdXNldXAuZGlzbWlzcy5icy5tb2RhbFwiLGZ1bmN0aW9uKGIpe2EoYi50YXJnZXQpLmlzKGQuJGVsZW1lbnQpJiYoZC5pZ25vcmVCYWNrZHJvcENsaWNrPSEwKX0pfSksdGhpcy5iYWNrZHJvcChmdW5jdGlvbigpe3ZhciBlPWEuc3VwcG9ydC50cmFuc2l0aW9uJiZkLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKTtkLiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aHx8ZC4kZWxlbWVudC5hcHBlbmRUbyhkLiRib2R5KSxkLiRlbGVtZW50LnNob3coKS5zY3JvbGxUb3AoMCksZC5hZGp1c3REaWFsb2coKSxlJiZkLiRlbGVtZW50WzBdLm9mZnNldFdpZHRoLGQuJGVsZW1lbnQuYWRkQ2xhc3MoXCJpblwiKSxkLmVuZm9yY2VGb2N1cygpO3ZhciBmPWEuRXZlbnQoXCJzaG93bi5icy5tb2RhbFwiLHtyZWxhdGVkVGFyZ2V0OmJ9KTtlP2QuJGRpYWxvZy5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe2QuJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpLnRyaWdnZXIoZil9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLlRSQU5TSVRJT05fRFVSQVRJT04pOmQuJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpLnRyaWdnZXIoZil9KSl9LGMucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oYil7YiYmYi5wcmV2ZW50RGVmYXVsdCgpLGI9YS5FdmVudChcImhpZGUuYnMubW9kYWxcIiksdGhpcy4kZWxlbWVudC50cmlnZ2VyKGIpLHRoaXMuaXNTaG93biYmIWIuaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLmlzU2hvd249ITEsdGhpcy5lc2NhcGUoKSx0aGlzLnJlc2l6ZSgpLGEoZG9jdW1lbnQpLm9mZihcImZvY3VzaW4uYnMubW9kYWxcIiksdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImluXCIpLm9mZihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIikub2ZmKFwibW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsXCIpLHRoaXMuJGRpYWxvZy5vZmYoXCJtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbFwiKSxhLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/dGhpcy4kZWxlbWVudC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixhLnByb3h5KHRoaXMuaGlkZU1vZGFsLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLlRSQU5TSVRJT05fRFVSQVRJT04pOnRoaXMuaGlkZU1vZGFsKCkpfSxjLnByb3RvdHlwZS5lbmZvcmNlRm9jdXM9ZnVuY3Rpb24oKXthKGRvY3VtZW50KS5vZmYoXCJmb2N1c2luLmJzLm1vZGFsXCIpLm9uKFwiZm9jdXNpbi5icy5tb2RhbFwiLGEucHJveHkoZnVuY3Rpb24oYSl7dGhpcy4kZWxlbWVudFswXT09PWEudGFyZ2V0fHx0aGlzLiRlbGVtZW50LmhhcyhhLnRhcmdldCkubGVuZ3RofHx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJmb2N1c1wiKX0sdGhpcykpfSxjLnByb3RvdHlwZS5lc2NhcGU9ZnVuY3Rpb24oKXt0aGlzLmlzU2hvd24mJnRoaXMub3B0aW9ucy5rZXlib2FyZD90aGlzLiRlbGVtZW50Lm9uKFwia2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbihhKXsyNz09YS53aGljaCYmdGhpcy5oaWRlKCl9LHRoaXMpKTp0aGlzLmlzU2hvd258fHRoaXMuJGVsZW1lbnQub2ZmKFwia2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIpfSxjLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oKXt0aGlzLmlzU2hvd24/YSh3aW5kb3cpLm9uKFwicmVzaXplLmJzLm1vZGFsXCIsYS5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSx0aGlzKSk6YSh3aW5kb3cpLm9mZihcInJlc2l6ZS5icy5tb2RhbFwiKX0sYy5wcm90b3R5cGUuaGlkZU1vZGFsPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczt0aGlzLiRlbGVtZW50LmhpZGUoKSx0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uKCl7YS4kYm9keS5yZW1vdmVDbGFzcyhcIm1vZGFsLW9wZW5cIiksYS5yZXNldEFkanVzdG1lbnRzKCksYS5yZXNldFNjcm9sbGJhcigpLGEuJGVsZW1lbnQudHJpZ2dlcihcImhpZGRlbi5icy5tb2RhbFwiKX0pfSxjLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuJGJhY2tkcm9wJiZ0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKSx0aGlzLiRiYWNrZHJvcD1udWxsfSxjLnByb3RvdHlwZS5iYWNrZHJvcD1mdW5jdGlvbihiKXt2YXIgZD10aGlzLGU9dGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/XCJmYWRlXCI6XCJcIjtpZih0aGlzLmlzU2hvd24mJnRoaXMub3B0aW9ucy5iYWNrZHJvcCl7dmFyIGY9YS5zdXBwb3J0LnRyYW5zaXRpb24mJmU7aWYodGhpcy4kYmFja2Ryb3A9YShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKS5hZGRDbGFzcyhcIm1vZGFsLWJhY2tkcm9wIFwiK2UpLmFwcGVuZFRvKHRoaXMuJGJvZHkpLHRoaXMuJGVsZW1lbnQub24oXCJjbGljay5kaXNtaXNzLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrP3ZvaWQodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrPSExKTp2b2lkKGEudGFyZ2V0PT09YS5jdXJyZW50VGFyZ2V0JiYoXCJzdGF0aWNcIj09dGhpcy5vcHRpb25zLmJhY2tkcm9wP3RoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKTp0aGlzLmhpZGUoKSkpfSx0aGlzKSksZiYmdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGgsdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoXCJpblwiKSwhYilyZXR1cm47Zj90aGlzLiRiYWNrZHJvcC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixiKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pOmIoKX1lbHNlIGlmKCF0aGlzLmlzU2hvd24mJnRoaXMuJGJhY2tkcm9wKXt0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcyhcImluXCIpO3ZhciBnPWZ1bmN0aW9uKCl7ZC5yZW1vdmVCYWNrZHJvcCgpLGImJmIoKX07YS5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpP3RoaXMuJGJhY2tkcm9wLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGcpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTik6ZygpfWVsc2UgYiYmYigpfSxjLnByb3RvdHlwZS5oYW5kbGVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLmFkanVzdERpYWxvZygpfSxjLnByb3RvdHlwZS5hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O3RoaXMuJGVsZW1lbnQuY3NzKHtwYWRkaW5nTGVmdDohdGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmYT90aGlzLnNjcm9sbGJhcldpZHRoOlwiXCIscGFkZGluZ1JpZ2h0OnRoaXMuYm9keUlzT3ZlcmZsb3dpbmcmJiFhP3RoaXMuc2Nyb2xsYmFyV2lkdGg6XCJcIn0pfSxjLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzPWZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC5jc3Moe3BhZGRpbmdMZWZ0OlwiXCIscGFkZGluZ1JpZ2h0OlwiXCJ9KX0sYy5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgYT13aW5kb3cuaW5uZXJXaWR0aDtpZighYSl7dmFyIGI9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2E9Yi5yaWdodC1NYXRoLmFicyhiLmxlZnQpfXRoaXMuYm9keUlzT3ZlcmZsb3dpbmc9ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDxhLHRoaXMuc2Nyb2xsYmFyV2lkdGg9dGhpcy5tZWFzdXJlU2Nyb2xsYmFyKCl9LGMucHJvdG90eXBlLnNldFNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciBhPXBhcnNlSW50KHRoaXMuJGJvZHkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5vcmlnaW5hbEJvZHlQYWQ9ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHR8fFwiXCIsdGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmdGhpcy4kYm9keS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsYSt0aGlzLnNjcm9sbGJhcldpZHRoKX0sYy5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLiRib2R5LmNzcyhcInBhZGRpbmctcmlnaHRcIix0aGlzLm9yaWdpbmFsQm9keVBhZCl9LGMucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2EuY2xhc3NOYW1lPVwibW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmVcIix0aGlzLiRib2R5LmFwcGVuZChhKTt2YXIgYj1hLm9mZnNldFdpZHRoLWEuY2xpZW50V2lkdGg7cmV0dXJuIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQoYSksYn07dmFyIGQ9YS5mbi5tb2RhbDthLmZuLm1vZGFsPWIsYS5mbi5tb2RhbC5Db25zdHJ1Y3Rvcj1jLGEuZm4ubW9kYWwubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLm1vZGFsPWQsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5tb2RhbC5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsZnVuY3Rpb24oYyl7dmFyIGQ9YSh0aGlzKSxlPWQuYXR0cihcImhyZWZcIiksZj1hKGQuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHxlJiZlLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIikpLGc9Zi5kYXRhKFwiYnMubW9kYWxcIik/XCJ0b2dnbGVcIjphLmV4dGVuZCh7cmVtb3RlOiEvIy8udGVzdChlKSYmZX0sZi5kYXRhKCksZC5kYXRhKCkpO2QuaXMoXCJhXCIpJiZjLnByZXZlbnREZWZhdWx0KCksZi5vbmUoXCJzaG93LmJzLm1vZGFsXCIsZnVuY3Rpb24oYSl7YS5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8Zi5vbmUoXCJoaWRkZW4uYnMubW9kYWxcIixmdW5jdGlvbigpe2QuaXMoXCI6dmlzaWJsZVwiKSYmZC50cmlnZ2VyKFwiZm9jdXNcIil9KX0pLGIuY2FsbChmLGcsdGhpcyl9KX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGQ9YSh0aGlzKSxlPWQuZGF0YShcImJzLnRvb2x0aXBcIiksZj1cIm9iamVjdFwiPT10eXBlb2YgYiYmYjsoZXx8IS9kZXN0cm95fGhpZGUvLnRlc3QoYikpJiYoZXx8ZC5kYXRhKFwiYnMudG9vbHRpcFwiLGU9bmV3IGModGhpcyxmKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmVbYl0oKSl9KX12YXIgYz1mdW5jdGlvbihhLGIpe3RoaXMudHlwZT1udWxsLHRoaXMub3B0aW9ucz1udWxsLHRoaXMuZW5hYmxlZD1udWxsLHRoaXMudGltZW91dD1udWxsLHRoaXMuaG92ZXJTdGF0ZT1udWxsLHRoaXMuJGVsZW1lbnQ9bnVsbCx0aGlzLmluU3RhdGU9bnVsbCx0aGlzLmluaXQoXCJ0b29sdGlwXCIsYSxiKX07Yy5WRVJTSU9OPVwiMy4zLjZcIixjLlRSQU5TSVRJT05fRFVSQVRJT049MTUwLGMuREVGQVVMVFM9e2FuaW1hdGlvbjohMCxwbGFjZW1lbnQ6XCJ0b3BcIixzZWxlY3RvcjohMSx0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLHRyaWdnZXI6XCJob3ZlciBmb2N1c1wiLHRpdGxlOlwiXCIsZGVsYXk6MCxodG1sOiExLGNvbnRhaW5lcjohMSx2aWV3cG9ydDp7c2VsZWN0b3I6XCJib2R5XCIscGFkZGluZzowfX0sYy5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihiLGMsZCl7aWYodGhpcy5lbmFibGVkPSEwLHRoaXMudHlwZT1iLHRoaXMuJGVsZW1lbnQ9YShjKSx0aGlzLm9wdGlvbnM9dGhpcy5nZXRPcHRpb25zKGQpLHRoaXMuJHZpZXdwb3J0PXRoaXMub3B0aW9ucy52aWV3cG9ydCYmYShhLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KT90aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLHRoaXMuJGVsZW1lbnQpOnRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3Rvcnx8dGhpcy5vcHRpb25zLnZpZXdwb3J0KSx0aGlzLmluU3RhdGU9e2NsaWNrOiExLGhvdmVyOiExLGZvY3VzOiExfSx0aGlzLiRlbGVtZW50WzBdaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciYmIXRoaXMub3B0aW9ucy5zZWxlY3Rvcil0aHJvdyBuZXcgRXJyb3IoXCJgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyBcIit0aGlzLnR5cGUrXCIgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhXCIpO2Zvcih2YXIgZT10aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdChcIiBcIiksZj1lLmxlbmd0aDtmLS07KXt2YXIgZz1lW2ZdO2lmKFwiY2xpY2tcIj09Zyl0aGlzLiRlbGVtZW50Lm9uKFwiY2xpY2suXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixhLnByb3h5KHRoaXMudG9nZ2xlLHRoaXMpKTtlbHNlIGlmKFwibWFudWFsXCIhPWcpe3ZhciBoPVwiaG92ZXJcIj09Zz9cIm1vdXNlZW50ZXJcIjpcImZvY3VzaW5cIixpPVwiaG92ZXJcIj09Zz9cIm1vdXNlbGVhdmVcIjpcImZvY3Vzb3V0XCI7dGhpcy4kZWxlbWVudC5vbihoK1wiLlwiK3RoaXMudHlwZSx0aGlzLm9wdGlvbnMuc2VsZWN0b3IsYS5wcm94eSh0aGlzLmVudGVyLHRoaXMpKSx0aGlzLiRlbGVtZW50Lm9uKGkrXCIuXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixhLnByb3h5KHRoaXMubGVhdmUsdGhpcykpfX10aGlzLm9wdGlvbnMuc2VsZWN0b3I/dGhpcy5fb3B0aW9ucz1hLmV4dGVuZCh7fSx0aGlzLm9wdGlvbnMse3RyaWdnZXI6XCJtYW51YWxcIixzZWxlY3RvcjpcIlwifSk6dGhpcy5maXhUaXRsZSgpfSxjLnByb3RvdHlwZS5nZXREZWZhdWx0cz1mdW5jdGlvbigpe3JldHVybiBjLkRFRkFVTFRTfSxjLnByb3RvdHlwZS5nZXRPcHRpb25zPWZ1bmN0aW9uKGIpe3JldHVybiBiPWEuZXh0ZW5kKHt9LHRoaXMuZ2V0RGVmYXVsdHMoKSx0aGlzLiRlbGVtZW50LmRhdGEoKSxiKSxiLmRlbGF5JiZcIm51bWJlclwiPT10eXBlb2YgYi5kZWxheSYmKGIuZGVsYXk9e3Nob3c6Yi5kZWxheSxoaWRlOmIuZGVsYXl9KSxifSxjLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnM9ZnVuY3Rpb24oKXt2YXIgYj17fSxjPXRoaXMuZ2V0RGVmYXVsdHMoKTtyZXR1cm4gdGhpcy5fb3B0aW9ucyYmYS5lYWNoKHRoaXMuX29wdGlvbnMsZnVuY3Rpb24oYSxkKXtjW2FdIT1kJiYoYlthXT1kKX0pLGJ9LGMucHJvdG90eXBlLmVudGVyPWZ1bmN0aW9uKGIpe3ZhciBjPWIgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yP2I6YShiLmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUpO3JldHVybiBjfHwoYz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihiLmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksYShiLmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsYykpLGIgaW5zdGFuY2VvZiBhLkV2ZW50JiYoYy5pblN0YXRlW1wiZm9jdXNpblwiPT1iLnR5cGU/XCJmb2N1c1wiOlwiaG92ZXJcIl09ITApLGMudGlwKCkuaGFzQ2xhc3MoXCJpblwiKXx8XCJpblwiPT1jLmhvdmVyU3RhdGU/dm9pZChjLmhvdmVyU3RhdGU9XCJpblwiKTooY2xlYXJUaW1lb3V0KGMudGltZW91dCksYy5ob3ZlclN0YXRlPVwiaW5cIixjLm9wdGlvbnMuZGVsYXkmJmMub3B0aW9ucy5kZWxheS5zaG93P3ZvaWQoYy50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcImluXCI9PWMuaG92ZXJTdGF0ZSYmYy5zaG93KCl9LGMub3B0aW9ucy5kZWxheS5zaG93KSk6Yy5zaG93KCkpfSxjLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMuaW5TdGF0ZSlpZih0aGlzLmluU3RhdGVbYV0pcmV0dXJuITA7cmV0dXJuITF9LGMucHJvdG90eXBlLmxlYXZlPWZ1bmN0aW9uKGIpe3ZhciBjPWIgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yP2I6YShiLmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUpO3JldHVybiBjfHwoYz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihiLmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksYShiLmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsYykpLGIgaW5zdGFuY2VvZiBhLkV2ZW50JiYoYy5pblN0YXRlW1wiZm9jdXNvdXRcIj09Yi50eXBlP1wiZm9jdXNcIjpcImhvdmVyXCJdPSExKSxjLmlzSW5TdGF0ZVRydWUoKT92b2lkIDA6KGNsZWFyVGltZW91dChjLnRpbWVvdXQpLGMuaG92ZXJTdGF0ZT1cIm91dFwiLGMub3B0aW9ucy5kZWxheSYmYy5vcHRpb25zLmRlbGF5LmhpZGU/dm9pZChjLnRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1wib3V0XCI9PWMuaG92ZXJTdGF0ZSYmYy5oaWRlKCl9LGMub3B0aW9ucy5kZWxheS5oaWRlKSk6Yy5oaWRlKCkpfSxjLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIGI9YS5FdmVudChcInNob3cuYnMuXCIrdGhpcy50eXBlKTtpZih0aGlzLmhhc0NvbnRlbnQoKSYmdGhpcy5lbmFibGVkKXt0aGlzLiRlbGVtZW50LnRyaWdnZXIoYik7dmFyIGQ9YS5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LHRoaXMuJGVsZW1lbnRbMF0pO2lmKGIuaXNEZWZhdWx0UHJldmVudGVkKCl8fCFkKXJldHVybjt2YXIgZT10aGlzLGY9dGhpcy50aXAoKSxnPXRoaXMuZ2V0VUlEKHRoaXMudHlwZSk7dGhpcy5zZXRDb250ZW50KCksZi5hdHRyKFwiaWRcIixnKSx0aGlzLiRlbGVtZW50LmF0dHIoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsZyksdGhpcy5vcHRpb25zLmFuaW1hdGlvbiYmZi5hZGRDbGFzcyhcImZhZGVcIik7dmFyIGg9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudD90aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcyxmWzBdLHRoaXMuJGVsZW1lbnRbMF0pOnRoaXMub3B0aW9ucy5wbGFjZW1lbnQsaT0vXFxzP2F1dG8/XFxzPy9pLGo9aS50ZXN0KGgpO2omJihoPWgucmVwbGFjZShpLFwiXCIpfHxcInRvcFwiKSxmLmRldGFjaCgpLmNzcyh7dG9wOjAsbGVmdDowLGRpc3BsYXk6XCJibG9ja1wifSkuYWRkQ2xhc3MoaCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSx0aGlzKSx0aGlzLm9wdGlvbnMuY29udGFpbmVyP2YuYXBwZW5kVG8odGhpcy5vcHRpb25zLmNvbnRhaW5lcik6Zi5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJpbnNlcnRlZC5icy5cIit0aGlzLnR5cGUpO3ZhciBrPXRoaXMuZ2V0UG9zaXRpb24oKSxsPWZbMF0ub2Zmc2V0V2lkdGgsbT1mWzBdLm9mZnNldEhlaWdodDtpZihqKXt2YXIgbj1oLG89dGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydCk7aD1cImJvdHRvbVwiPT1oJiZrLmJvdHRvbSttPm8uYm90dG9tP1widG9wXCI6XCJ0b3BcIj09aCYmay50b3AtbTxvLnRvcD9cImJvdHRvbVwiOlwicmlnaHRcIj09aCYmay5yaWdodCtsPm8ud2lkdGg/XCJsZWZ0XCI6XCJsZWZ0XCI9PWgmJmsubGVmdC1sPG8ubGVmdD9cInJpZ2h0XCI6aCxmLnJlbW92ZUNsYXNzKG4pLmFkZENsYXNzKGgpfXZhciBwPXRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChoLGssbCxtKTt0aGlzLmFwcGx5UGxhY2VtZW50KHAsaCk7dmFyIHE9ZnVuY3Rpb24oKXt2YXIgYT1lLmhvdmVyU3RhdGU7ZS4kZWxlbWVudC50cmlnZ2VyKFwic2hvd24uYnMuXCIrZS50eXBlKSxlLmhvdmVyU3RhdGU9bnVsbCxcIm91dFwiPT1hJiZlLmxlYXZlKGUpfTthLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kdGlwLmhhc0NsYXNzKFwiZmFkZVwiKT9mLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLHEpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuVFJBTlNJVElPTl9EVVJBVElPTik6cSgpfX0sYy5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQ9ZnVuY3Rpb24oYixjKXt2YXIgZD10aGlzLnRpcCgpLGU9ZFswXS5vZmZzZXRXaWR0aCxmPWRbMF0ub2Zmc2V0SGVpZ2h0LGc9cGFyc2VJbnQoZC5jc3MoXCJtYXJnaW4tdG9wXCIpLDEwKSxoPXBhcnNlSW50KGQuY3NzKFwibWFyZ2luLWxlZnRcIiksMTApO2lzTmFOKGcpJiYoZz0wKSxpc05hTihoKSYmKGg9MCksYi50b3ArPWcsYi5sZWZ0Kz1oLGEub2Zmc2V0LnNldE9mZnNldChkWzBdLGEuZXh0ZW5kKHt1c2luZzpmdW5jdGlvbihhKXtkLmNzcyh7dG9wOk1hdGgucm91bmQoYS50b3ApLGxlZnQ6TWF0aC5yb3VuZChhLmxlZnQpfSl9fSxiKSwwKSxkLmFkZENsYXNzKFwiaW5cIik7dmFyIGk9ZFswXS5vZmZzZXRXaWR0aCxqPWRbMF0ub2Zmc2V0SGVpZ2h0O1widG9wXCI9PWMmJmohPWYmJihiLnRvcD1iLnRvcCtmLWopO3ZhciBrPXRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKGMsYixpLGopO2subGVmdD9iLmxlZnQrPWsubGVmdDpiLnRvcCs9ay50b3A7dmFyIGw9L3RvcHxib3R0b20vLnRlc3QoYyksbT1sPzIqay5sZWZ0LWUraToyKmsudG9wLWYraixuPWw/XCJvZmZzZXRXaWR0aFwiOlwib2Zmc2V0SGVpZ2h0XCI7ZC5vZmZzZXQoYiksdGhpcy5yZXBsYWNlQXJyb3cobSxkWzBdW25dLGwpfSxjLnByb3RvdHlwZS5yZXBsYWNlQXJyb3c9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuYXJyb3coKS5jc3MoYz9cImxlZnRcIjpcInRvcFwiLDUwKigxLWEvYikrXCIlXCIpLmNzcyhjP1widG9wXCI6XCJsZWZ0XCIsXCJcIil9LGMucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnRpcCgpLGI9dGhpcy5nZXRUaXRsZSgpO2EuZmluZChcIi50b29sdGlwLWlubmVyXCIpW3RoaXMub3B0aW9ucy5odG1sP1wiaHRtbFwiOlwidGV4dFwiXShiKSxhLnJlbW92ZUNsYXNzKFwiZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHRcIil9LGMucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe1wiaW5cIiE9ZS5ob3ZlclN0YXRlJiZmLmRldGFjaCgpLGUuJGVsZW1lbnQucmVtb3ZlQXR0cihcImFyaWEtZGVzY3JpYmVkYnlcIikudHJpZ2dlcihcImhpZGRlbi5icy5cIitlLnR5cGUpLGImJmIoKX12YXIgZT10aGlzLGY9YSh0aGlzLiR0aXApLGc9YS5FdmVudChcImhpZGUuYnMuXCIrdGhpcy50eXBlKTtyZXR1cm4gdGhpcy4kZWxlbWVudC50cmlnZ2VyKGcpLGcuaXNEZWZhdWx0UHJldmVudGVkKCk/dm9pZCAwOihmLnJlbW92ZUNsYXNzKFwiaW5cIiksYS5zdXBwb3J0LnRyYW5zaXRpb24mJmYuaGFzQ2xhc3MoXCJmYWRlXCIpP2Yub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZCkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5UUkFOU0lUSU9OX0RVUkFUSU9OKTpkKCksdGhpcy5ob3ZlclN0YXRlPW51bGwsdGhpcyl9LGMucHJvdG90eXBlLmZpeFRpdGxlPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudDsoYS5hdHRyKFwidGl0bGVcIil8fFwic3RyaW5nXCIhPXR5cGVvZiBhLmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKSYmYS5hdHRyKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLGEuYXR0cihcInRpdGxlXCIpfHxcIlwiKS5hdHRyKFwidGl0bGVcIixcIlwiKX0sYy5wcm90b3R5cGUuaGFzQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl9LGMucHJvdG90eXBlLmdldFBvc2l0aW9uPWZ1bmN0aW9uKGIpe2I9Ynx8dGhpcy4kZWxlbWVudDt2YXIgYz1iWzBdLGQ9XCJCT0RZXCI9PWMudGFnTmFtZSxlPWMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7bnVsbD09ZS53aWR0aCYmKGU9YS5leHRlbmQoe30sZSx7d2lkdGg6ZS5yaWdodC1lLmxlZnQsaGVpZ2h0OmUuYm90dG9tLWUudG9wfSkpO3ZhciBmPWQ/e3RvcDowLGxlZnQ6MH06Yi5vZmZzZXQoKSxnPXtzY3JvbGw6ZD9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wfHxkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDpiLnNjcm9sbFRvcCgpfSxoPWQ/e3dpZHRoOmEod2luZG93KS53aWR0aCgpLGhlaWdodDphKHdpbmRvdykuaGVpZ2h0KCl9Om51bGw7cmV0dXJuIGEuZXh0ZW5kKHt9LGUsZyxoLGYpfSxjLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0PWZ1bmN0aW9uKGEsYixjLGQpe3JldHVyblwiYm90dG9tXCI9PWE/e3RvcDpiLnRvcCtiLmhlaWdodCxsZWZ0OmIubGVmdCtiLndpZHRoLzItYy8yfTpcInRvcFwiPT1hP3t0b3A6Yi50b3AtZCxsZWZ0OmIubGVmdCtiLndpZHRoLzItYy8yfTpcImxlZnRcIj09YT97dG9wOmIudG9wK2IuaGVpZ2h0LzItZC8yLGxlZnQ6Yi5sZWZ0LWN9Ont0b3A6Yi50b3ArYi5oZWlnaHQvMi1kLzIsbGVmdDpiLmxlZnQrYi53aWR0aH19LGMucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT17dG9wOjAsbGVmdDowfTtpZighdGhpcy4kdmlld3BvcnQpcmV0dXJuIGU7dmFyIGY9dGhpcy5vcHRpb25zLnZpZXdwb3J0JiZ0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZ3x8MCxnPXRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpO2lmKC9yaWdodHxsZWZ0Ly50ZXN0KGEpKXt2YXIgaD1iLnRvcC1mLWcuc2Nyb2xsLGk9Yi50b3ArZi1nLnNjcm9sbCtkO2g8Zy50b3A/ZS50b3A9Zy50b3AtaDppPmcudG9wK2cuaGVpZ2h0JiYoZS50b3A9Zy50b3ArZy5oZWlnaHQtaSl9ZWxzZXt2YXIgaj1iLmxlZnQtZixrPWIubGVmdCtmK2M7ajxnLmxlZnQ/ZS5sZWZ0PWcubGVmdC1qOms+Zy5yaWdodCYmKGUubGVmdD1nLmxlZnQrZy53aWR0aC1rKX1yZXR1cm4gZX0sYy5wcm90b3R5cGUuZ2V0VGl0bGU9ZnVuY3Rpb24oKXt2YXIgYSxiPXRoaXMuJGVsZW1lbnQsYz10aGlzLm9wdGlvbnM7cmV0dXJuIGE9Yi5hdHRyKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIGMudGl0bGU/Yy50aXRsZS5jYWxsKGJbMF0pOmMudGl0bGUpfSxjLnByb3RvdHlwZS5nZXRVSUQ9ZnVuY3Rpb24oYSl7ZG8gYSs9fn4oMWU2Kk1hdGgucmFuZG9tKCkpO3doaWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGEpKTtyZXR1cm4gYX0sYy5wcm90b3R5cGUudGlwPWZ1bmN0aW9uKCl7aWYoIXRoaXMuJHRpcCYmKHRoaXMuJHRpcD1hKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSksMSE9dGhpcy4kdGlwLmxlbmd0aCkpdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZStcIiBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IVwiKTtyZXR1cm4gdGhpcy4kdGlwfSxjLnByb3RvdHlwZS5hcnJvdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRhcnJvdz10aGlzLiRhcnJvd3x8dGhpcy50aXAoKS5maW5kKFwiLnRvb2x0aXAtYXJyb3dcIil9LGMucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hMH0sYy5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hMX0sYy5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hdGhpcy5lbmFibGVkfSxjLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztiJiYoYz1hKGIuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSksY3x8KGM9bmV3IHRoaXMuY29uc3RydWN0b3IoYi5jdXJyZW50VGFyZ2V0LHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpLGEoYi5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLGMpKSksYj8oYy5pblN0YXRlLmNsaWNrPSFjLmluU3RhdGUuY2xpY2ssYy5pc0luU3RhdGVUcnVlKCk/Yy5lbnRlcihjKTpjLmxlYXZlKGMpKTpjLnRpcCgpLmhhc0NsYXNzKFwiaW5cIik/Yy5sZWF2ZShjKTpjLmVudGVyKGMpfSxjLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSx0aGlzLmhpZGUoZnVuY3Rpb24oKXthLiRlbGVtZW50Lm9mZihcIi5cIithLnR5cGUpLnJlbW92ZURhdGEoXCJicy5cIithLnR5cGUpLGEuJHRpcCYmYS4kdGlwLmRldGFjaCgpLGEuJHRpcD1udWxsLGEuJGFycm93PW51bGwsYS4kdmlld3BvcnQ9bnVsbH0pfTt2YXIgZD1hLmZuLnRvb2x0aXA7YS5mbi50b29sdGlwPWIsYS5mbi50b29sdGlwLkNvbnN0cnVjdG9yPWMsYS5mbi50b29sdGlwLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi50b29sdGlwPWQsdGhpc319KGpRdWVyeSksK2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoXCJicy5wb3BvdmVyXCIpLGY9XCJvYmplY3RcIj09dHlwZW9mIGImJmI7KGV8fCEvZGVzdHJveXxoaWRlLy50ZXN0KGIpKSYmKGV8fGQuZGF0YShcImJzLnBvcG92ZXJcIixlPW5ldyBjKHRoaXMsZikpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZlW2JdKCkpfSl9dmFyIGM9ZnVuY3Rpb24oYSxiKXt0aGlzLmluaXQoXCJwb3BvdmVyXCIsYSxiKX07aWYoIWEuZm4udG9vbHRpcCl0aHJvdyBuZXcgRXJyb3IoXCJQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanNcIik7Yy5WRVJTSU9OPVwiMy4zLjZcIixjLkRFRkFVTFRTPWEuZXh0ZW5kKHt9LGEuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUyx7cGxhY2VtZW50OlwicmlnaHRcIix0cmlnZ2VyOlwiY2xpY2tcIixjb250ZW50OlwiXCIsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J30pLGMucHJvdG90eXBlPWEuZXh0ZW5kKHt9LGEuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpLGMucHJvdG90eXBlLmNvbnN0cnVjdG9yPWMsYy5wcm90b3R5cGUuZ2V0RGVmYXVsdHM9ZnVuY3Rpb24oKXtyZXR1cm4gYy5ERUZBVUxUU30sYy5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciBhPXRoaXMudGlwKCksYj10aGlzLmdldFRpdGxlKCksYz10aGlzLmdldENvbnRlbnQoKTthLmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKVt0aGlzLm9wdGlvbnMuaHRtbD9cImh0bWxcIjpcInRleHRcIl0oYiksYS5maW5kKFwiLnBvcG92ZXItY29udGVudFwiKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpW3RoaXMub3B0aW9ucy5odG1sP1wic3RyaW5nXCI9PXR5cGVvZiBjP1wiaHRtbFwiOlwiYXBwZW5kXCI6XCJ0ZXh0XCJdKGMpLGEucmVtb3ZlQ2xhc3MoXCJmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpblwiKSxhLmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKS5odG1sKCl8fGEuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLmhpZGUoKX0sYy5wcm90b3R5cGUuaGFzQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl8fHRoaXMuZ2V0Q29udGVudCgpfSxjLnByb3RvdHlwZS5nZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudCxiPXRoaXMub3B0aW9ucztyZXR1cm4gYS5hdHRyKFwiZGF0YS1jb250ZW50XCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgYi5jb250ZW50P2IuY29udGVudC5jYWxsKGFbMF0pOmIuY29udGVudCl9LGMucHJvdG90eXBlLmFycm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGFycm93PXRoaXMuJGFycm93fHx0aGlzLnRpcCgpLmZpbmQoXCIuYXJyb3dcIil9O3ZhciBkPWEuZm4ucG9wb3ZlcjthLmZuLnBvcG92ZXI9YixhLmZuLnBvcG92ZXIuQ29uc3RydWN0b3I9YyxhLmZuLnBvcG92ZXIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnBvcG92ZXI9ZCx0aGlzfX0oalF1ZXJ5KSwrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihjLGQpe3RoaXMuJGJvZHk9YShkb2N1bWVudC5ib2R5KSx0aGlzLiRzY3JvbGxFbGVtZW50PWEoYShjKS5pcyhkb2N1bWVudC5ib2R5KT93aW5kb3c6YyksdGhpcy5vcHRpb25zPWEuZXh0ZW5kKHt9LGIuREVGQVVMVFMsZCksdGhpcy5zZWxlY3Rvcj0odGhpcy5vcHRpb25zLnRhcmdldHx8XCJcIikrXCIgLm5hdiBsaSA+IGFcIix0aGlzLm9mZnNldHM9W10sdGhpcy50YXJnZXRzPVtdLHRoaXMuYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5zY3JvbGxIZWlnaHQ9MCx0aGlzLiRzY3JvbGxFbGVtZW50Lm9uKFwic2Nyb2xsLmJzLnNjcm9sbHNweVwiLGEucHJveHkodGhpcy5wcm9jZXNzLHRoaXMpKSx0aGlzLnJlZnJlc2goKSx0aGlzLnByb2Nlc3MoKX1mdW5jdGlvbiBjKGMpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKFwiYnMuc2Nyb2xsc3B5XCIpLGY9XCJvYmplY3RcIj09dHlwZW9mIGMmJmM7ZXx8ZC5kYXRhKFwiYnMuc2Nyb2xsc3B5XCIsZT1uZXcgYih0aGlzLGYpKSxcInN0cmluZ1wiPT10eXBlb2YgYyYmZVtjXSgpfSl9Yi5WRVJTSU9OPVwiMy4zLjZcIixiLkRFRkFVTFRTPXtvZmZzZXQ6MTB9LGIucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodHx8TWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCl9LGIucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLGM9XCJvZmZzZXRcIixkPTA7dGhpcy5vZmZzZXRzPVtdLHRoaXMudGFyZ2V0cz1bXSx0aGlzLnNjcm9sbEhlaWdodD10aGlzLmdldFNjcm9sbEhlaWdodCgpLGEuaXNXaW5kb3codGhpcy4kc2Nyb2xsRWxlbWVudFswXSl8fChjPVwicG9zaXRpb25cIixkPXRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkpLHRoaXMuJGJvZHkuZmluZCh0aGlzLnNlbGVjdG9yKS5tYXAoZnVuY3Rpb24oKXt2YXIgYj1hKHRoaXMpLGU9Yi5kYXRhKFwidGFyZ2V0XCIpfHxiLmF0dHIoXCJocmVmXCIpLGY9L14jLi8udGVzdChlKSYmYShlKTtyZXR1cm4gZiYmZi5sZW5ndGgmJmYuaXMoXCI6dmlzaWJsZVwiKSYmW1tmW2NdKCkudG9wK2QsZV1dfHxudWxsfSkuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdLWJbMF19KS5lYWNoKGZ1bmN0aW9uKCl7Yi5vZmZzZXRzLnB1c2godGhpc1swXSksYi50YXJnZXRzLnB1c2godGhpc1sxXSl9KX0sYi5wcm90b3R5cGUucHJvY2Vzcz1mdW5jdGlvbigpe3ZhciBhLGI9dGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSt0aGlzLm9wdGlvbnMub2Zmc2V0LGM9dGhpcy5nZXRTY3JvbGxIZWlnaHQoKSxkPXRoaXMub3B0aW9ucy5vZmZzZXQrYy10aGlzLiRzY3JvbGxFbGVtZW50LmhlaWdodCgpLGU9dGhpcy5vZmZzZXRzLGY9dGhpcy50YXJnZXRzLGc9dGhpcy5hY3RpdmVUYXJnZXQ7aWYodGhpcy5zY3JvbGxIZWlnaHQhPWMmJnRoaXMucmVmcmVzaCgpLGI+PWQpcmV0dXJuIGchPShhPWZbZi5sZW5ndGgtMV0pJiZ0aGlzLmFjdGl2YXRlKGEpO2lmKGcmJmI8ZVswXSlyZXR1cm4gdGhpcy5hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLmNsZWFyKCk7Zm9yKGE9ZS5sZW5ndGg7YS0tOylnIT1mW2FdJiZiPj1lW2FdJiYodm9pZCAwPT09ZVthKzFdfHxiPGVbYSsxXSkmJnRoaXMuYWN0aXZhdGUoZlthXSl9LGIucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKGIpe3RoaXMuYWN0aXZlVGFyZ2V0PWIsdGhpcy5jbGVhcigpO3ZhciBjPXRoaXMuc2VsZWN0b3IrJ1tkYXRhLXRhcmdldD1cIicrYisnXCJdLCcrdGhpcy5zZWxlY3RvcisnW2hyZWY9XCInK2IrJ1wiXScsZD1hKGMpLnBhcmVudHMoXCJsaVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbmQucGFyZW50KFwiLmRyb3Bkb3duLW1lbnVcIikubGVuZ3RoJiYoZD1kLmNsb3Nlc3QoXCJsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSksZC50cmlnZ2VyKFwiYWN0aXZhdGUuYnMuc2Nyb2xsc3B5XCIpfSxiLnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe2EodGhpcy5zZWxlY3RvcikucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpfTt2YXIgZD1hLmZuLnNjcm9sbHNweTthLmZuLnNjcm9sbHNweT1jLGEuZm4uc2Nyb2xsc3B5LkNvbnN0cnVjdG9yPWIsYS5mbi5zY3JvbGxzcHkubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnNjcm9sbHNweT1kLHRoaXN9LGEod2luZG93KS5vbihcImxvYWQuYnMuc2Nyb2xsc3B5LmRhdGEtYXBpXCIsZnVuY3Rpb24oKXthKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGI9YSh0aGlzKTtjLmNhbGwoYixiLmRhdGEoKSl9KX0pfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKFwiYnMudGFiXCIpO2V8fGQuZGF0YShcImJzLnRhYlwiLGU9bmV3IGModGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZlW2JdKCl9KX12YXIgYz1mdW5jdGlvbihiKXt0aGlzLmVsZW1lbnQ9YShiKX07Yy5WRVJTSU9OPVwiMy4zLjZcIixjLlRSQU5TSVRJT05fRFVSQVRJT049MTUwLGMucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLmVsZW1lbnQsYz1iLmNsb3Nlc3QoXCJ1bDpub3QoLmRyb3Bkb3duLW1lbnUpXCIpLGQ9Yi5kYXRhKFwidGFyZ2V0XCIpO2lmKGR8fChkPWIuYXR0cihcImhyZWZcIiksZD1kJiZkLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sXCJcIikpLCFiLnBhcmVudChcImxpXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXt2YXIgZT1jLmZpbmQoXCIuYWN0aXZlOmxhc3QgYVwiKSxmPWEuRXZlbnQoXCJoaWRlLmJzLnRhYlwiLHtyZWxhdGVkVGFyZ2V0OmJbMF19KSxnPWEuRXZlbnQoXCJzaG93LmJzLnRhYlwiLHtyZWxhdGVkVGFyZ2V0OmVbMF19KTtpZihlLnRyaWdnZXIoZiksYi50cmlnZ2VyKGcpLCFnLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhZi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGg9YShkKTt0aGlzLmFjdGl2YXRlKGIuY2xvc2VzdChcImxpXCIpLGMpLHRoaXMuYWN0aXZhdGUoaCxoLnBhcmVudCgpLGZ1bmN0aW9uKCl7ZS50cmlnZ2VyKHt0eXBlOlwiaGlkZGVuLmJzLnRhYlwiLHJlbGF0ZWRUYXJnZXQ6YlswXX0pLGIudHJpZ2dlcih7dHlwZTpcInNob3duLmJzLnRhYlwiLHJlbGF0ZWRUYXJnZXQ6ZVswXX0pfSl9fX0sYy5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oYixkLGUpe2Z1bmN0aW9uIGYoKXtnLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmZpbmQoXCI+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5lbmQoKS5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSxiLmFkZENsYXNzKFwiYWN0aXZlXCIpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLGg/KGJbMF0ub2Zmc2V0V2lkdGgsYi5hZGRDbGFzcyhcImluXCIpKTpiLnJlbW92ZUNsYXNzKFwiZmFkZVwiKSxiLnBhcmVudChcIi5kcm9wZG93bi1tZW51XCIpLmxlbmd0aCYmYi5jbG9zZXN0KFwibGkuZHJvcGRvd25cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIikuZW5kKCkuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksZSYmZSgpfXZhciBnPWQuZmluZChcIj4gLmFjdGl2ZVwiKSxoPWUmJmEuc3VwcG9ydC50cmFuc2l0aW9uJiYoZy5sZW5ndGgmJmcuaGFzQ2xhc3MoXCJmYWRlXCIpfHwhIWQuZmluZChcIj4gLmZhZGVcIikubGVuZ3RoKTtnLmxlbmd0aCYmaD9nLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGYpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuVFJBTlNJVElPTl9EVVJBVElPTik6ZigpLGcucmVtb3ZlQ2xhc3MoXCJpblwiKX07dmFyIGQ9YS5mbi50YWI7YS5mbi50YWI9YixhLmZuLnRhYi5Db25zdHJ1Y3Rvcj1jLGEuZm4udGFiLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi50YWI9ZCx0aGlzfTt2YXIgZT1mdW5jdGlvbihjKXtjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJzaG93XCIpfTthKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLnRhYi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLGUpLm9uKFwiY2xpY2suYnMudGFiLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLGUpfShqUXVlcnkpLCtmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKFwiYnMuYWZmaXhcIiksZj1cIm9iamVjdFwiPT10eXBlb2YgYiYmYjtlfHxkLmRhdGEoXCJicy5hZmZpeFwiLGU9bmV3IGModGhpcyxmKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmVbYl0oKX0pfXZhciBjPWZ1bmN0aW9uKGIsZCl7dGhpcy5vcHRpb25zPWEuZXh0ZW5kKHt9LGMuREVGQVVMVFMsZCksdGhpcy4kdGFyZ2V0PWEodGhpcy5vcHRpb25zLnRhcmdldCkub24oXCJzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGlcIixhLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbix0aGlzKSkub24oXCJjbGljay5icy5hZmZpeC5kYXRhLWFwaVwiLGEucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCx0aGlzKSksdGhpcy4kZWxlbWVudD1hKGIpLHRoaXMuYWZmaXhlZD1udWxsLHRoaXMudW5waW49bnVsbCx0aGlzLnBpbm5lZE9mZnNldD1udWxsLHRoaXMuY2hlY2tQb3NpdGlvbigpfTtjLlZFUlNJT049XCIzLjMuNlwiLGMuUkVTRVQ9XCJhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tXCIsYy5ERUZBVUxUUz17b2Zmc2V0OjAsdGFyZ2V0OndpbmRvd30sYy5wcm90b3R5cGUuZ2V0U3RhdGU9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9dGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpLGY9dGhpcy4kZWxlbWVudC5vZmZzZXQoKSxnPXRoaXMuJHRhcmdldC5oZWlnaHQoKTtpZihudWxsIT1jJiZcInRvcFwiPT10aGlzLmFmZml4ZWQpcmV0dXJuIGM+ZT9cInRvcFwiOiExO2lmKFwiYm90dG9tXCI9PXRoaXMuYWZmaXhlZClyZXR1cm4gbnVsbCE9Yz9lK3RoaXMudW5waW48PWYudG9wPyExOlwiYm90dG9tXCI6YS1kPj1lK2c/ITE6XCJib3R0b21cIjt2YXIgaD1udWxsPT10aGlzLmFmZml4ZWQsaT1oP2U6Zi50b3Asaj1oP2c6YjtyZXR1cm4gbnVsbCE9YyYmYz49ZT9cInRvcFwiOm51bGwhPWQmJmkraj49YS1kP1wiYm90dG9tXCI6ITF9LGMucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldD1mdW5jdGlvbigpe2lmKHRoaXMucGlubmVkT2Zmc2V0KXJldHVybiB0aGlzLnBpbm5lZE9mZnNldDt0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKGMuUkVTRVQpLmFkZENsYXNzKFwiYWZmaXhcIik7dmFyIGE9dGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpLGI9dGhpcy4kZWxlbWVudC5vZmZzZXQoKTtyZXR1cm4gdGhpcy5waW5uZWRPZmZzZXQ9Yi50b3AtYX0sYy5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3A9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KGEucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLHRoaXMpLDEpfSxjLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uPWZ1bmN0aW9uKCl7aWYodGhpcy4kZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKXt2YXIgYj10aGlzLiRlbGVtZW50LmhlaWdodCgpLGQ9dGhpcy5vcHRpb25zLm9mZnNldCxlPWQudG9wLGY9ZC5ib3R0b20sZz1NYXRoLm1heChhKGRvY3VtZW50KS5oZWlnaHQoKSxhKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKTtcIm9iamVjdFwiIT10eXBlb2YgZCYmKGY9ZT1kKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiYoZT1kLnRvcCh0aGlzLiRlbGVtZW50KSksXCJmdW5jdGlvblwiPT10eXBlb2YgZiYmKGY9ZC5ib3R0b20odGhpcy4kZWxlbWVudCkpO3ZhciBoPXRoaXMuZ2V0U3RhdGUoZyxiLGUsZik7aWYodGhpcy5hZmZpeGVkIT1oKXtudWxsIT10aGlzLnVucGluJiZ0aGlzLiRlbGVtZW50LmNzcyhcInRvcFwiLFwiXCIpO3ZhciBpPVwiYWZmaXhcIisoaD9cIi1cIitoOlwiXCIpLGo9YS5FdmVudChpK1wiLmJzLmFmZml4XCIpO2lmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihqKSxqLmlzRGVmYXVsdFByZXZlbnRlZCgpKXJldHVybjt0aGlzLmFmZml4ZWQ9aCx0aGlzLnVucGluPVwiYm90dG9tXCI9PWg/dGhpcy5nZXRQaW5uZWRPZmZzZXQoKTpudWxsLHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoYy5SRVNFVCkuYWRkQ2xhc3MoaSkudHJpZ2dlcihpLnJlcGxhY2UoXCJhZmZpeFwiLFwiYWZmaXhlZFwiKStcIi5icy5hZmZpeFwiKX1cImJvdHRvbVwiPT1oJiZ0aGlzLiRlbGVtZW50Lm9mZnNldCh7dG9wOmctYi1mfSl9fTt2YXIgZD1hLmZuLmFmZml4O2EuZm4uYWZmaXg9YixhLmZuLmFmZml4LkNvbnN0cnVjdG9yPWMsYS5mbi5hZmZpeC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uYWZmaXg9ZCx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1hKHRoaXMpLGQ9Yy5kYXRhKCk7ZC5vZmZzZXQ9ZC5vZmZzZXR8fHt9LG51bGwhPWQub2Zmc2V0Qm90dG9tJiYoZC5vZmZzZXQuYm90dG9tPWQub2Zmc2V0Qm90dG9tKSxudWxsIT1kLm9mZnNldFRvcCYmKGQub2Zmc2V0LnRvcD1kLm9mZnNldFRvcCksYi5jYWxsKGMsZCl9KX0pfShqUXVlcnkpOyIsImFuZ3VsYXIubW9kdWxlKFwiWW91ckFwcFwiKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcclxuXHJcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwicGFnZXMvY3JlYXRlLmh0bWxcIixcclxuICAgIFwiPHNlY3Rpb24gaWQ9XFxcImNyZWF0ZVxcXCIgYmluZG9uY2U9XFxcInNvbWUubW9kZWwub2JqZWN0XFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDxoND4nU3VwPyBIRVkhIFRoaXMgaXMgdGhlIHRlbXBsYXRlIGZvciBDb250YWN0IENyZWF0aW9uPC9oND5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tNiB0ZXh0LWNlbnRlclxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aDE+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgUHNzdCEgSGV5IGtpZCwgd2FubmEgY3JlYXRlIHNvbWUgQ29udGFjdHM/XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8L2gxPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGZvcm0gbm92YWxpZGF0ZSBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICBuYW1lPVxcXCJjcmVhdGVGb3JtXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1pbmxpbmUgY29sLXNtLTYgY3JlYXRpbmctZm9ybVxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgbmctc3VibWl0PXN1Ym1pdCgpPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJOYW1lXFxcIj5OYW1lPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwibmFtZVxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwiTmFtZVxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkhlcmUgZ29lcyB0aGUgTmFtZS4uLlxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIkxhc3ROYW1lXFxcIj5MYXN0IE5hbWU8L2xhYmVsPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJsYXN0bmFtZVxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwiTGFzdE5hbWVcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJBbmQgdGhlIExhc3QgTmFtZSBoZXJlXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIiBpZD1cXFwiY3JlYXRlQnRuXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj5DcmVhdGUgaXQhPC9idXR0b24+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPC9mb3JtPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCI8L3NlY3Rpb24+XCJcclxuICApO1xyXG5cclxuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJwYWdlcy9lZGl0Lmh0bWxcIixcclxuICAgIFwiPHNlY3Rpb24gaWQ9XFxcImVkaXRcXFwiIGJpbmRvbmNlPVxcXCJzb21lLm1vZGVsLm9iamVjdFxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8aDQ+J1N1cD8gVGhpcyBpcyB0aGUgdGVtcGxhdGUgZm9yIHRoZSBDb250YWN0IEVkaXRpb248L2g0PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS02IHRleHQtY2VudGVyXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxoMT5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICBEdWRlISBUaGF0IGVudHJ5IGxvb2tzIHdlaXJkLCB3YW5uYSBjaGFuZ2UgaXQ/XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8L2gxPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGZvcm0gbm92YWxpZGF0ZSBjbGFzcz1cXFwiZm9ybS1pbmxpbmUgY29sLXNtLTYgZWRpdGluZy1mb3JtXFxcIiBuZy1zdWJtaXQ9c3VibWl0KCk+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvdyB0ZXh0LWNlbnRlclxcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiSWRcXFwiPklkPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwiaWRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJpZFxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiVGhlIElkIGdvZXMgaGVyZSwgcGxlYXNlXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIk5hbWVcXFwiPk5hbWU8L2xhYmVsPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJuYW1lXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwibmFtZVxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiSGVyZSBnb2VzIHRoZSBOYW1lLi4uXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiTGFzdE5hbWVcXFwiPkxhc3QgTmFtZTwvbGFiZWw+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcImxhc3ROYW1lXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwibGFzdG5hbWVcXFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkFuZCB0aGUgTGFzdCBOYW1lIGhlcmVcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiPkNoYW5nZSBpdCE8L2J1dHRvbj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Zvcm0+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPCEtLSBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICpcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICogSGVyZSBnb2VzIHRoZSBFZGl0XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAqIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgIC0tPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIjwvc2VjdGlvbj5cIlxyXG4gICk7XHJcblxyXG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhZ2VzL2hvbWUuaHRtbFwiLFxyXG4gICAgXCI8c2VjdGlvbiBpZD1cXFwiaG9tZVxcXCIgYmluZG9uY2U9XFxcInNvbWUubW9kZWwub2JqZWN0XFxcIj5cXG5cIiArXHJcbiAgICBcIlxcdDxoND4nU3VwPyBIRVkhIFRoaXMgaXMgdGhlIHRlbXBsYXRlIGZvciB0aGUgSG9tZTwvaDQ+XFxuXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDxkaXYgY2xhc3M9XFxcImNvbnRhaW5lci1mbHVpZFxcXCI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtc20tNiB0ZXh0LWNlbnRlclxcXCI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGgxPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICBTbywgaGVyZSdzIHRoZSBDb250YWN0IGxpc3Q6XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPC9oMT5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcblwiICtcclxuICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93IGNvbC1zbS04XFxcIj5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJ0YWJsZSB0YWJsZS1ob3ZlclxcXCI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8dGhlYWQ+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICA8dGg+SWQ8L3RoPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIDx0aD5MYXN0IE5hbWU8L3RoPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L3RoZWFkPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPHRib2R5PlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XFxcImNvbnRhY3QgaW4gY29udGFjdHNcXFwiPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICA8dGQ+e3tjb250YWN0LklkfX08L3RkPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICA8dGQ+e3tjb250YWN0LkZpcnN0TmFtZX19PC90ZD5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgPHRkPnt7Y29udGFjdC5MYXN0TmFtZX19PC90ZD5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC90Ym9keT5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgPC90YWJsZT5cXG5cIiArXHJcbiAgICBcIiAgICAgICAgPC9kaXY+XFxuXCIgK1xyXG4gICAgXCIgICAgPC9kaXY+XFxuXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIjwvc2VjdGlvbj5cXG5cIlxyXG4gICk7XHJcblxyXG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhZ2VzL2xvZ2luLmh0bWxcIixcclxuICAgIFwiPHNlY3Rpb24gaWQ9XFxcImxvZ2luXFxcIiBiaW5kb25jZT1cXFwic29tZS5tb2RlbC5vYmplY3RcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyIHJvd1xcXCI+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTYgcHVzaC1zbS0zIHRleHQtY2VudGVyXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGgxPkFtbW1tLi4uIFdobyBhcmUgeW91PzwvaDE+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgIDxkaXYgY2xhc3M9XFxcImNvbnRhaW5lciByb3dcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgIDxmb3JtIG5vdmFsaWRhdGUgbmFtZT1cXFwibG9naW5Gb3JtXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJmb3JtLWlubGluZSBjb2wtc20tNiBsb2dpbi1mb3JtXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXN1Ym1pdD1cXFwibG9naW5Gb3JtLiR2YWxpZCAmJiBzdWJtaXQoKVxcXCI+ICAgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwiVXNlcm5hbWVcXFwiPlVzZXJuYW1lPC9sYWJlbD5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VybmFtZVxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwidXNlcm5hbWVcXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJZb3VyIHVzZXJuYW1lLCBwbGVhc2VcXFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XFxcIlBhc3N3b3JkXFxcIj5QYXNzd29yZDwvbGFiZWw+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCJcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwicGFzc3dvcmRcXFwiXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcInBhc3N3b3JkXFxcIiBcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCiXFxcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8L2Rpdj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPGRpdj4gbG9naW5Gb3JtIGlzIHt7bG9naW5Gb3JtLiR2YWxpZH19IDwvZGl2PlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICA8YnV0dG9uIGlkPVxcXCJsb2dpbi1idG5cXFwiIFxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgICAgICAgICAgICAgICAgIHR5cGU9XFxcInN1Ym1pdFxcXCIgXFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBwdWxsLXJpZ2h0XFxcIj5cXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgIExvZyBpbiFcXHJcIiArXHJcbiAgICBcIlxcblwiICtcclxuICAgIFwiICAgICAgICAgICAgPC9idXR0b24+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIiAgICAgICAgPC9mb3JtPlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCIgICAgPC9kaXY+XFxyXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIlxcclwiICtcclxuICAgIFwiXFxuXCIgK1xyXG4gICAgXCI8L3NlY3Rpb24+XCJcclxuICApO1xyXG5cclxuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJzb21lLWRpcmVjdGl2ZS5odG1sXCIsXHJcbiAgICBcIjxzZWN0aW9uIGJpbmRvbmNlPVxcXCJzb21lLm1vZGVsLm9iamVjdFxcXCI+XFxuXCIgK1xyXG4gICAgXCJcXG5cIiArXHJcbiAgICBcIjwvc2VjdGlvbj5cXG5cIlxyXG4gICk7XHJcblxyXG59XSk7XHJcbiJdfQ==
;