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
    $("nav").hide();

    /*
     * Navigation
     */
    $("nav li").click(function (e) {
        // alert("click!");
        $("nav li").removeClass("active");
        $(this).addClass("active");
    });
});