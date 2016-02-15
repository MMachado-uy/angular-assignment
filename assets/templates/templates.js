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
