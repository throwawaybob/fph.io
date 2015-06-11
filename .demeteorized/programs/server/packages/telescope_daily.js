(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var coreSubscriptions = Package['telescope:core'].coreSubscriptions;
var Telescope = Package['telescope:lib'].Telescope;
var _ = Package.underscore._;
var getTemplate = Package['telescope:lib'].getTemplate;
var templates = Package['telescope:lib'].templates;
var themeSettings = Package['telescope:lib'].themeSettings;
var getVotePower = Package['telescope:lib'].getVotePower;
var i18n = Package['telescope:i18n'].i18n;
var Events = Package['telescope:events'].Events;
var Settings = Package['telescope:settings'].Settings;
var Users = Package['telescope:users'].Users;
var Comments = Package['telescope:comments'].Comments;
var Posts = Package['telescope:posts'].Posts;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Accounts = Package['accounts-base'].Accounts;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Email = Package.email.Email;
var Spiderable = Package.spiderable.Spiderable;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var FastRender = Package['meteorhacks:fast-render'].FastRender;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var SyncedCron = Package['percolatestudio:synced-cron'].SyncedCron;
var tinycolor = Package['aramk:tinycolor'].tinycolor;
var moment = Package['momentjs:moment'].moment;
var ReactiveTable = Package['aslagle:reactive-table'].ReactiveTable;
var Avatar = Package['utilities:avatar'].Avatar;
var sanitizeHtml = Package['djedi:sanitize-html'].sanitizeHtml;
var Gravatar = Package['jparker:gravatar'].Gravatar;
var MeteorFilesHelpers = Package['sanjo:meteor-files-helpers'].MeteorFilesHelpers;
var Handlebars = Package.ui.Handlebars;
var OriginalHandlebars = Package['cmather:handlebars-server'].OriginalHandlebars;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Iron = Package['iron:core'].Iron;
var AccountsTemplates = Package['useraccounts:core'].AccountsTemplates;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Spacebars = Package.spacebars.Spacebars;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __, daysPerPage, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/package-i18n.js                                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
TAPi18n.packages["telescope:daily"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                  // 2
// define package's translation function (proxy to the i18next)                                                   // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                  // 4
                                                                                                                  // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/lib/daily.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
daysPerPage = 5;                                                                                                  // 1
                                                                                                                  // 2
Telescope.menuItems.add("viewsMenu", {                                                                            // 3
  route: 'postsDaily',                                                                                            // 4
  label: 'daily',                                                                                                 // 5
  description: 'day_by_day_view'                                                                                  // 6
});                                                                                                               // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/lib/routes.js                                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/**                                                                                                               // 1
 * Controller for daily view                                                                                      // 2
 */                                                                                                               // 3
Posts.controllers.daily = Posts.controllers.list.extend({                                                         // 4
                                                                                                                  // 5
  view: "daily",                                                                                                  // 6
                                                                                                                  // 7
  template: function() {                                                                                          // 8
    // use a function to make sure the template is evaluated *after* any template overrides                       // 9
    // TODO: still needed?                                                                                        // 10
    return 'posts_daily';                                                                                         // 11
  },                                                                                                              // 12
                                                                                                                  // 13
  data: function () {                                                                                             // 14
    this.days = this.params.days ? this.params.days : daysPerPage;                                                // 15
    Session.set('postsDays', this.days);                                                                          // 16
    return {                                                                                                      // 17
      days: this.days                                                                                             // 18
    };                                                                                                            // 19
  }                                                                                                               // 20
                                                                                                                  // 21
});                                                                                                               // 22
                                                                                                                  // 23
Meteor.startup(function () {                                                                                      // 24
                                                                                                                  // 25
  Router.route('/daily/:days?', {                                                                                 // 26
    name: 'postsDaily',                                                                                           // 27
    template: 'posts_daily',                                                                                      // 28
    controller: Posts.controllers.daily                                                                           // 29
  });                                                                                                             // 30
                                                                                                                  // 31
});                                                                                                               // 32
                                                                                                                  // 33
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/de.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                   // 8
  TAPi18n.translations["de"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                        // 12
  TAPi18n.translations["de"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["de"][namespace], {"daily":"Daily"});                                               // 16
                                                                                                                  // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/en.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
// integrate the fallback language translations                                                                   // 8
translations = {};                                                                                                // 9
translations[namespace] = {"daily":"Daily","day_by_day_view":"The most popular posts of each day.","load_next_days":"Load Next Days"};
TAPi18n._loadLangFileObject("en", translations);                                                                  // 11
                                                                                                                  // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/es.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                   // 8
  TAPi18n.translations["es"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                        // 12
  TAPi18n.translations["es"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["es"][namespace], {"daily":"Diario","day_by_day_view":"Los post mas populares de cada día.","load_next_days":"Cargar días siguientes"});
                                                                                                                  // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/fr.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                   // 8
  TAPi18n.translations["fr"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                        // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["fr"][namespace], {"daily":"Jour par jour"});                                       // 16
                                                                                                                  // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/it.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                   // 8
  TAPi18n.translations["it"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                        // 12
  TAPi18n.translations["it"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["it"][namespace], {"daily":"Daily"});                                               // 16
                                                                                                                  // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Users/sacha/Dev/Telescope/packages/telescope-daily/i18n/zh-CN.i18n.js                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                // 8
  TAPi18n.translations["zh-CN"] = {};                                                                             // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                     // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                  // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"daily":"Daily"});                                            // 16
                                                                                                                  // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:daily'] = {};

})();

//# sourceMappingURL=telescope_daily.js.map
