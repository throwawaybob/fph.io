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
var Pages, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/lib/pages.js                                                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Pages = new Mongo.Collection('pages');                                                                          // 1
                                                                                                                // 2
Pages.schema = new SimpleSchema({                                                                               // 3
  title: {                                                                                                      // 4
    type: String                                                                                                // 5
  },                                                                                                            // 6
  slug: {                                                                                                       // 7
    type: String,                                                                                               // 8
    optional: true                                                                                              // 9
  },                                                                                                            // 10
  content: {                                                                                                    // 11
    type: String,                                                                                               // 12
    autoform: {                                                                                                 // 13
      rows: 10                                                                                                  // 14
    }                                                                                                           // 15
  },                                                                                                            // 16
  order: {                                                                                                      // 17
    type: Number,                                                                                               // 18
    optional: true                                                                                              // 19
  }                                                                                                             // 20
});                                                                                                             // 21
                                                                                                                // 22
                                                                                                                // 23
Pages.schema.internationalize();                                                                                // 24
                                                                                                                // 25
Pages.attachSchema(Pages.schema);                                                                               // 26
                                                                                                                // 27
Pages.before.insert(function (userId, doc) {                                                                    // 28
  // if no slug has been provided, generate one                                                                 // 29
  if (!doc.slug)                                                                                                // 30
    doc.slug = Telescope.utils.slugify(doc.title);                                                              // 31
});                                                                                                             // 32
                                                                                                                // 33
Telescope.modules.add("primaryNav", {                                                                           // 34
  template: "pages_menu",                                                                                       // 35
  order: 5                                                                                                      // 36
});                                                                                                             // 37
                                                                                                                // 38
Telescope.modules.add("mobileNav", {                                                                            // 39
  template: 'pages_menu',                                                                                       // 40
  order: 5                                                                                                      // 41
});                                                                                                             // 42
                                                                                                                // 43
Meteor.startup(function () {                                                                                    // 44
  Pages.allow({                                                                                                 // 45
    insert: Users.is.adminById,                                                                                 // 46
    update: Users.is.adminById,                                                                                 // 47
    remove: Users.is.adminById                                                                                  // 48
  });                                                                                                           // 49
                                                                                                                // 50
  Meteor.methods({                                                                                              // 51
    insertPage: function(pageTitle, pageContent){                                                               // 52
      return Feeds.insert({title: pageTitle, content: pageContent});                                            // 53
    }                                                                                                           // 54
  });                                                                                                           // 55
});                                                                                                             // 56
                                                                                                                // 57
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/lib/server/publications.js                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Meteor.publish('pages', function() {                                                                            // 1
  return Pages.find({});                                                                                        // 2
});                                                                                                             // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/Users/sacha/Dev/Telescope/packages/telescope-pages/i18n/en.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null}); // 8
TAPi18n.languages_names["en"] = ["English","English"];                                                          // 9
// integrate the fallback language translations                                                                 // 10
translations = {};                                                                                              // 11
translations[namespace] = {"manage_static_pages":"Manage static pages"};                                        // 12
TAPi18n._loadLangFileObject("en", translations);                                                                // 13
                                                                                                                // 14
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:pages'] = {
  Pages: Pages
};

})();

//# sourceMappingURL=telescope_pages.js.map
