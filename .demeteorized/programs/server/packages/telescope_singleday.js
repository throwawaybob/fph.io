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
var __, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/package-i18n.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TAPi18n.packages["telescope:singleday"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                      // 2
// define package's translation function (proxy to the i18next)                                                       // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                      // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/lib/routes.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Controller for single day view                                                                                     // 2
 */                                                                                                                   // 3
Posts.controllers.singleday = Posts.controllers.list.extend({                                                         // 4
                                                                                                                      // 5
  view: 'singleday',                                                                                                  // 6
                                                                                                                      // 7
  template: 'single_day', // use single_day template to get prev/next day navigation                                  // 8
                                                                                                                      // 9
  data: function() {                                                                                                  // 10
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today');
    var terms = {                                                                                                     // 12
      view: 'singleday',                                                                                              // 13
      date: currentDate,                                                                                              // 14
      after: moment(currentDate).startOf('day').toDate(),                                                             // 15
      before: moment(currentDate).endOf('day').toDate()                                                               // 16
    };                                                                                                                // 17
    return {terms: terms};                                                                                            // 18
  },                                                                                                                  // 19
                                                                                                                      // 20
});                                                                                                                   // 21
                                                                                                                      // 22
Meteor.startup(function () {                                                                                          // 23
                                                                                                                      // 24
  // Digest                                                                                                           // 25
                                                                                                                      // 26
  Router.route('/day/:year/:month/:day', {                                                                            // 27
    name: 'postsSingleDay',                                                                                           // 28
    controller: Posts.controllers.singleday                                                                           // 29
  });                                                                                                                 // 30
                                                                                                                      // 31
  Router.route('/day', {                                                                                              // 32
    name: 'postsSingleDayDefault',                                                                                    // 33
    controller: Posts.controllers.singleday                                                                           // 34
  });                                                                                                                 // 35
                                                                                                                      // 36
});                                                                                                                   // 37
                                                                                                                      // 38
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/lib/singleday.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Telescope.menuItems.add("viewsMenu", {                                                                                // 1
  route: 'postsSingleDayDefault',                                                                                     // 2
  label: 'singleday',                                                                                                 // 3
  description: 'posts_of_a_single_day'                                                                                // 4
});                                                                                                                   // 5
                                                                                                                      // 6
Posts.views.add("singleday", function (terms) {                                                                       // 7
  return {                                                                                                            // 8
    find: {                                                                                                           // 9
      postedAt: {                                                                                                     // 10
        $gte: terms.after,                                                                                            // 11
        $lt: terms.before                                                                                             // 12
      }                                                                                                               // 13
    },                                                                                                                // 14
    options: {                                                                                                        // 15
      sort: {sticky: -1, score: -1}                                                                                   // 16
    }                                                                                                                 // 17
  };                                                                                                                  // 18
});                                                                                                                   // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/bg.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                       // 8
  TAPi18n.translations["bg"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                            // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["bg"][namespace], {"the_top_5_posts_of_each_day":"Топ 5 публикации от всеки ден","previous_day":"Предишен ден","next_day":"Следващ ден","sorry_no_posts_for_today":"Няма публикации за днес","sorry_no_posts_for":"Няма публикации за","today":"Днес","yesterday":"Вчера","single_day":"определен ден.","posts_of_a_single_day":"Публикации за определен ден.","singleday":"Определен ден"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/de.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                       // 8
  TAPi18n.translations["de"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                            // 12
  TAPi18n.translations["de"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["de"][namespace], {"the_top_5_posts_of_each_day":"Die Top-5-Links eines jeden Tages.","previous_day":"Einen Tag zurück","next_day":"Einen Tag vor","sorry_no_posts_for_today":"Heute gibt es keine Links.","sorry_no_posts_for":"Keine Links für","today":"Heute","yesterday":"Gestern"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/nl.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                       // 8
  TAPi18n.translations["nl"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                            // 12
  TAPi18n.translations["nl"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["nl"][namespace], {"the_top_5_posts_of_each_day":"Top 5 berichten van elke dag.","previous_day":"Gisteren","next_day":"Morgen","sorry_no_posts_for_today":"Sorry, vandaag geen berichten","sorry_no_posts_for":"Sorry, geen berichten voor","today":"Vandaag","yesterday":"Gisteren","single_day":"Per dag","singleday":"Per dag","posts_of_a_single_day":"Berichten per dag."});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/en.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
// integrate the fallback language translations                                                                       // 8
translations = {};                                                                                                    // 9
translations[namespace] = {"singleday":"Single Day","the_top_5_posts_of_each_day":"The top 5 posts of each day.","previous_day":"Previous Day","next_day":"Next Day","sorry_no_posts_for_today":"Sorry, no posts for today","sorry_no_posts_for":"Sorry, no posts for","today":"Today","yesterday":"Yesterday","single_day":"Single Day","posts_of_a_single_day":"The posts of a single day."};
TAPi18n._loadLangFileObject("en", translations);                                                                      // 11
                                                                                                                      // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/es.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                       // 8
  TAPi18n.translations["es"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                            // 12
  TAPi18n.translations["es"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["es"][namespace], {"the_top_5_posts_of_each_day":"Los 5 mejores posts de cada día","previous_day":"Dia anterior","next_day":"Dia siguiente","sorry_no_posts_for_today":"Lo sentimos, no hay post para hoy","today":"Hoy","yesterday":"Ayer"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/fr.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                       // 8
  TAPi18n.translations["fr"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                            // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["fr"][namespace], {"singleday":"A la journée","the_top_5_posts_of_each_day":"5 meilleurs post par jours","previous_day":"Jour précédent","next_day":"Jour suivant","sorry_no_posts_for_today":"Désolé, aucun post aujourd'hui","sorry_no_posts_for":"Désolé, aucun post pour","today":"Aujourd'hui","yesterday":"Hier"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/it.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                       // 8
  TAPi18n.translations["it"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                            // 12
  TAPi18n.translations["it"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["it"][namespace], {"the_top_5_posts_of_each_day":"I 5 migliori post di ogni giorno.","previous_day":"Giorno Precedente","next_day":"Giorno Successivo","sorry_no_posts_for_today":"Ci spiace, non ci sono post per oggi","sorry_no_posts_for":"Ci spiace, non ci sono post per","today":"Oggi","yesterday":"Ieri"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/tr.i18n.js                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                       // 8
  TAPi18n.translations["tr"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                            // 12
  TAPi18n.translations["tr"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["tr"][namespace], {"the_top_5_posts_of_each_day":"Her günün en üst 5 paylaşımı","previous_day":"Önceki gün","next_day":"Sonraki gün","Sorry, no posts for today":"Özür dileriz, bugün bir paylaşım yok","sorry_no_posts_for_today":"Özür dileriz, paylaşım yok","today":"Bugün","yesterday":"Dün"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:singleday/Users/sacha/Dev/Telescope/packages/telescope-singleday/i18n/zh-CN.i18n.js             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:singleday",                                                                             // 2
    namespace = "telescope:singleday";                                                                                // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                    // 8
  TAPi18n.translations["zh-CN"] = {};                                                                                 // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                         // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                      // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"the_top_5_posts_of_each_day":"每天前5名的帖子","previous_day":"前一天","next_day":"后一天","sorry_no_posts_for_today":"抱歉今天没有新的帖子","today":"今天","yesterday":"昨天"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:singleday'] = {};

})();

//# sourceMappingURL=telescope_singleday.js.map
