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
var Categories, getPostCategories, getCategoryUrl, __, translations;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/lib/categories.js                                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Categories = new Mongo.Collection("categories");                                                                 // 1
                                                                                                                 // 2
// category schema                                                                                               // 3
Categories.schema = new SimpleSchema({                                                                           // 4
  name: {                                                                                                        // 5
    type: String,                                                                                                // 6
    editableBy: ["admin"]                                                                                        // 7
  },                                                                                                             // 8
  description: {                                                                                                 // 9
    type: String,                                                                                                // 10
    optional: true,                                                                                              // 11
    editableBy: ["admin"],                                                                                       // 12
    autoform: {                                                                                                  // 13
      rows: 3                                                                                                    // 14
    }                                                                                                            // 15
  },                                                                                                             // 16
  order: {                                                                                                       // 17
    type: Number,                                                                                                // 18
    optional: true,                                                                                              // 19
    editableBy: ["admin"]                                                                                        // 20
  },                                                                                                             // 21
  slug: {                                                                                                        // 22
    type: String,                                                                                                // 23
    optional: true,                                                                                              // 24
    editableBy: ["admin"]                                                                                        // 25
  },                                                                                                             // 26
  image: {                                                                                                       // 27
    type: String,                                                                                                // 28
    optional: true,                                                                                              // 29
    editableBy: ["admin"]                                                                                        // 30
  }                                                                                                              // 31
});                                                                                                              // 32
                                                                                                                 // 33
Categories.schema.internationalize();                                                                            // 34
                                                                                                                 // 35
Categories.attachSchema(Categories.schema);                                                                      // 36
                                                                                                                 // 37
Categories.before.insert(function (userId, doc) {                                                                // 38
  // if no slug has been provided, generate one                                                                  // 39
  if (!doc.slug)                                                                                                 // 40
    doc.slug = Telescope.utils.slugify(doc.name);                                                                // 41
});                                                                                                              // 42
                                                                                                                 // 43
// category post list parameters                                                                                 // 44
Posts.views.add("category", function (terms) {                                                                   // 45
  var categoryId = Categories.findOne({slug: terms.category})._id;                                               // 46
  return {                                                                                                       // 47
    find: {'categories': {$in: [categoryId]}} ,                                                                  // 48
    options: {sort: {sticky: -1, score: -1}} // for now categories views default to the "top" view               // 49
  };                                                                                                             // 50
});                                                                                                              // 51
                                                                                                                 // 52
Meteor.startup(function () {                                                                                     // 53
  Categories.allow({                                                                                             // 54
    insert: Users.is.adminById,                                                                                  // 55
    update: Users.is.adminById,                                                                                  // 56
    remove: Users.is.adminById                                                                                   // 57
  });                                                                                                            // 58
});                                                                                                              // 59
                                                                                                                 // 60
getPostCategories = function (post) {                                                                            // 61
  return !!post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];                        // 62
};                                                                                                               // 63
                                                                                                                 // 64
getCategoryUrl = function(slug){                                                                                 // 65
  return Telescope.utils.getSiteUrl()+'category/'+slug;                                                          // 66
};                                                                                                               // 67
                                                                                                                 // 68
// add callback that adds categories CSS classes                                                                 // 69
function addCategoryClass (post, postClass){                                                                     // 70
  var classArray = _.map(getPostCategories(post), function (category){return "category-"+category.slug;});       // 71
  return postClass + " " + classArray.join(' ');                                                                 // 72
}                                                                                                                // 73
Telescope.callbacks.add("postClass", addCategoryClass);                                                          // 74
                                                                                                                 // 75
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/lib/custom_fields.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Posts.addField(                                                                                                  // 1
  {                                                                                                              // 2
    fieldName: 'categories',                                                                                     // 3
    fieldSchema: {                                                                                               // 4
      type: [String],                                                                                            // 5
      optional: true,                                                                                            // 6
      editableBy: ["member", "admin"],                                                                           // 7
      autoform: {                                                                                                // 8
        noselect: true,                                                                                          // 9
        options: function () {                                                                                   // 10
          var categories = Categories.find().map(function (category) {                                           // 11
            return {                                                                                             // 12
              value: category._id,                                                                               // 13
              label: category.name                                                                               // 14
            };                                                                                                   // 15
          });                                                                                                    // 16
          return categories;                                                                                     // 17
        }                                                                                                        // 18
      }                                                                                                          // 19
    }                                                                                                            // 20
  }                                                                                                              // 21
);                                                                                                               // 22
                                                                                                                 // 23
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/lib/hooks.js                                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Telescope.menuItems.add("adminMenu", {                                                                           // 1
  route: 'categories',                                                                                           // 2
  label: 'Categories',                                                                                           // 3
  description: 'add_and_remove_categories'                                                                       // 4
});                                                                                                              // 5
                                                                                                                 // 6
// push "categories" modules to postHeading                                                                      // 7
Telescope.modules.add("postHeading", {                                                                           // 8
  template: 'post_categories',                                                                                   // 9
  order: 30                                                                                                      // 10
});                                                                                                              // 11
                                                                                                                 // 12
// push "categories_menu" template to primaryNav                                                                 // 13
Telescope.modules.add("primaryNav", {                                                                            // 14
  template: 'categories_menu',                                                                                   // 15
  order: 50                                                                                                      // 16
});                                                                                                              // 17
                                                                                                                 // 18
Telescope.modules.add("mobileNav", {                                                                             // 19
  template: 'categories_menu',                                                                                   // 20
  order: 10                                                                                                      // 21
});                                                                                                              // 22
                                                                                                                 // 23
// we want to wait until categories are all loaded to load the rest of the app                                   // 24
Telescope.subscriptions.preload('categories');                                                                   // 25
                                                                                                                 // 26
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/package-i18n.js                                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
TAPi18n.packages["telescope:tags"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                 // 2
// define package's translation function (proxy to the i18next)                                                  // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                 // 4
                                                                                                                 // 5
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/lib/server/publications.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish('categories', function() {                                                                        // 1
  if(Users.can.viewById(this.userId)){                                                                           // 2
    return Categories.find();                                                                                    // 3
  }                                                                                                              // 4
  return [];                                                                                                     // 5
});                                                                                                              // 6
                                                                                                                 // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/lib/server/hooks.js                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// make sure all categories in the post.categories array exist in the db                                         // 1
var checkCategories = function (post) {                                                                          // 2
                                                                                                                 // 3
  // if there are not categories, stop here                                                                      // 4
  if (!post.categories || post.categories.length === 0) {                                                        // 5
    return;                                                                                                      // 6
  }                                                                                                              // 7
                                                                                                                 // 8
  // check how many of the categories given also exist in the db                                                 // 9
  var categoryCount = Categories.find({_id: {$in: post.categories}}).count();                                    // 10
                                                                                                                 // 11
  if (post.categories.length !== categoryCount) {                                                                // 12
    throw new Meteor.Error('invalid_category', i18n.t('invalid_category'));                                      // 13
  }                                                                                                              // 14
};                                                                                                               // 15
                                                                                                                 // 16
function postSubmitCheckCategories (post) {                                                                      // 17
  checkCategories(post);                                                                                         // 18
  return post;                                                                                                   // 19
}                                                                                                                // 20
Telescope.callbacks.add("submitPost", postSubmitCheckCategories);                                                // 21
                                                                                                                 // 22
function postEditCheckCategories (options) {                                                                     // 23
  var post = options.modifier.$set;                                                                              // 24
  checkCategories(post);                                                                                         // 25
  return options;                                                                                                // 26
}                                                                                                                // 27
Telescope.callbacks.add("editPost", postEditCheckCategories);                                                    // 28
                                                                                                                 // 29
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/bg.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                  // 8
  TAPi18n.translations["bg"] = {};                                                                               // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                       // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                    // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["bg"][namespace], {"categories":"Категории","add_and_remove_categories":"Добавяне и изтриване на категории."});
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/de.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                  // 8
  TAPi18n.translations["de"] = {};                                                                               // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                       // 12
  TAPi18n.translations["de"][namespace] = {};                                                                    // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["de"][namespace], {"categories":"Kategorien"});                                    // 16
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/en.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
// integrate the fallback language translations                                                                  // 8
translations = {};                                                                                               // 9
translations[namespace] = {"categories":"Categories","add_and_remove_categories":"Add and remove categories.","all_categories":"All","invalid_category":"Sorry, this is not a valid category"};
TAPi18n._loadLangFileObject("en", translations);                                                                 // 11
                                                                                                                 // 12
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/es.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                  // 8
  TAPi18n.translations["es"] = {};                                                                               // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                       // 12
  TAPi18n.translations["es"][namespace] = {};                                                                    // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["es"][namespace], {"categories":"Categorías"});                                    // 16
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/fr.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                  // 8
  TAPi18n.translations["fr"] = {};                                                                               // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                       // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                    // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["fr"][namespace], {"categories":"Catégories","add_and_remove_categories":"Ajoutez et supprimez des catégories.","all_categories":"Tous","invalid_category":"Cette catégorie n'est pas valide"});
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/it.i18n.js                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                  // 8
  TAPi18n.translations["it"] = {};                                                                               // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                       // 12
  TAPi18n.translations["it"][namespace] = {};                                                                    // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["it"][namespace], {"categories":"Categorie"});                                     // 16
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:tags/Users/sacha/Dev/Telescope/packages/telescope-tags/i18n/zh-CN.i18n.js                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "telescope:tags",                                                                             // 2
    namespace = "telescope:tags";                                                                                // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                               // 8
  TAPi18n.translations["zh-CN"] = {};                                                                            // 9
}                                                                                                                // 10
                                                                                                                 // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                    // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                 // 13
}                                                                                                                // 14
                                                                                                                 // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"categories":"分类"});                                         // 16
                                                                                                                 // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:tags'] = {
  Categories: Categories
};

})();

//# sourceMappingURL=telescope_tags.js.map
