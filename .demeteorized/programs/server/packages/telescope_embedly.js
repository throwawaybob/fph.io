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
var __, getEmbedlyData, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:embedly/package-i18n.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
TAPi18n.packages["telescope:embedly"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                    // 2
// define package's translation function (proxy to the i18next)                                                     // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                    // 4
                                                                                                                    // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:embedly/lib/embedly.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var thumbnailProperty = {                                                                                           // 1
  fieldName: 'thumbnailUrl',                                                                                        // 2
  fieldSchema: {                                                                                                    // 3
    type: String,                                                                                                   // 4
    optional: true,                                                                                                 // 5
    editableBy: ["member", "admin"],                                                                                // 6
    autoform: {                                                                                                     // 7
      type: 'bootstrap-postthumbnail'                                                                               // 8
    }                                                                                                               // 9
  }                                                                                                                 // 10
};                                                                                                                  // 11
Posts.addField(thumbnailProperty);                                                                                  // 12
                                                                                                                    // 13
var mediaProperty = {                                                                                               // 14
  fieldName: 'media',                                                                                               // 15
  fieldSchema: {                                                                                                    // 16
    type: Object,                                                                                                   // 17
    optional: true,                                                                                                 // 18
    blackbox: true                                                                                                  // 19
  }                                                                                                                 // 20
};                                                                                                                  // 21
Posts.addField(mediaProperty);                                                                                      // 22
                                                                                                                    // 23
Telescope.modules.add("postThumbnail", {                                                                            // 24
  template: 'post_thumbnail',                                                                                       // 25
  order: 15                                                                                                         // 26
});                                                                                                                 // 27
                                                                                                                    // 28
var embedlyKeyProperty = {                                                                                          // 29
  fieldName: 'embedlyKey',                                                                                          // 30
  fieldSchema: {                                                                                                    // 31
    type: String,                                                                                                   // 32
    optional: true,                                                                                                 // 33
    private: true,                                                                                                  // 34
    autoform: {                                                                                                     // 35
      group: 'embedly',                                                                                             // 36
      class: 'private-field'                                                                                        // 37
    }                                                                                                               // 38
  }                                                                                                                 // 39
};                                                                                                                  // 40
Settings.addField(embedlyKeyProperty);                                                                              // 41
                                                                                                                    // 42
var thumbnailWidthProperty = {                                                                                      // 43
  fieldName: 'thumbnailWidth',                                                                                      // 44
  fieldSchema: {                                                                                                    // 45
    type: Number,                                                                                                   // 46
    optional: true,                                                                                                 // 47
    autoform: {                                                                                                     // 48
      group: 'embedly'                                                                                              // 49
    }                                                                                                               // 50
  }                                                                                                                 // 51
};                                                                                                                  // 52
Settings.addField(thumbnailWidthProperty);                                                                          // 53
                                                                                                                    // 54
var thumbnailHeightProperty = {                                                                                     // 55
  fieldName: 'thumbnailHeight',                                                                                     // 56
  fieldSchema: {                                                                                                    // 57
    type: Number,                                                                                                   // 58
    optional: true,                                                                                                 // 59
    autoform: {                                                                                                     // 60
      group: 'embedly'                                                                                              // 61
    }                                                                                                               // 62
  }                                                                                                                 // 63
};                                                                                                                  // 64
Settings.addField(thumbnailHeightProperty);                                                                         // 65
                                                                                                                    // 66
function addThumbnailClass (post, postClass) {                                                                      // 67
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";                                      // 68
  return postClass + " " + thumbnailClass;                                                                          // 69
}                                                                                                                   // 70
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes                                             // 71
Telescope.callbacks.add("postClass", addThumbnailClass);                                                            // 72
                                                                                                                    // 73
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:embedly/lib/server/get_embedly_data.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
getEmbedlyData = function (url) {                                                                                   // 1
  var data = {};                                                                                                    // 2
  var extractBase = 'http://api.embed.ly/1/extract';                                                                // 3
  var embedlyKey = Settings.get('embedlyKey');                                                                      // 4
  var thumbnailWidth = Settings.get('thumbnailWidth', 200);                                                         // 5
  var thumbnailHeight = Settings.get('thumbnailHeight', 125);                                                       // 6
                                                                                                                    // 7
  if(!embedlyKey) {                                                                                                 // 8
    // fail silently to still let the post be submitted as usual                                                    // 9
    console.log("Couldn't find an Embedly API key! Please add it to your Telescope settings or remove the Embedly module.");
    return null;                                                                                                    // 11
  }                                                                                                                 // 12
                                                                                                                    // 13
  try {                                                                                                             // 14
                                                                                                                    // 15
    var result = Meteor.http.get(extractBase, {                                                                     // 16
      params: {                                                                                                     // 17
        key: embedlyKey,                                                                                            // 18
        url: url,                                                                                                   // 19
        image_width: thumbnailWidth,                                                                                // 20
        image_height: thumbnailHeight,                                                                              // 21
        image_method: 'crop'                                                                                        // 22
      }                                                                                                             // 23
    });                                                                                                             // 24
                                                                                                                    // 25
    // console.log(result)                                                                                          // 26
                                                                                                                    // 27
    if (!!result.data.images && !!result.data.images.length) // there may not always be an image                    // 28
      result.data.thumbnailUrl = result.data.images[0].url.replace("http:", ""); // add thumbnailUrl as its own property and remove "http"
                                                                                                                    // 30
    return _.pick(result.data, 'title', 'media', 'description', 'thumbnailUrl');                                    // 31
                                                                                                                    // 32
  } catch (error) {                                                                                                 // 33
    console.log(error)                                                                                              // 34
    // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest         // 35
    var errorObject = JSON.parse(error.message.substring(13));                                                      // 36
    throw new Meteor.Error(errorObject.error_code, errorObject.error_message);                                      // 37
    return null;                                                                                                    // 38
  }                                                                                                                 // 39
}                                                                                                                   // 40
                                                                                                                    // 41
// For security reason, we use a separate server-side API call to set the media object,                             // 42
// and the thumbnail object if it hasn't already been set                                                           // 43
                                                                                                                    // 44
// Async variant that directly modifies the post object with update()                                               // 45
function addMediaAfterSubmit (post) {                                                                               // 46
  var set = {};                                                                                                     // 47
  if(post.url){                                                                                                     // 48
    var data = getEmbedlyData(post.url);                                                                            // 49
    if (!!data) {                                                                                                   // 50
      // only add a thumbnailUrl if there isn't one already                                                         // 51
      if (!post.thumbnailUrl && !!data.thumbnailUrl) {                                                              // 52
        post.thumbnailUrl = data.thumbnailUrl;                                                                      // 53
        set.thumbnailUrl = data.thumbnailUrl;                                                                       // 54
      }                                                                                                             // 55
      // add media if necessary                                                                                     // 56
      if (!!data.media.html) {                                                                                      // 57
        post.media = data.media;                                                                                    // 58
        set.media = data.media;                                                                                     // 59
      }                                                                                                             // 60
    }                                                                                                               // 61
    // make sure set object is not empty (Embedly call could have failed)                                           // 62
    if(!_.isEmpty(set)) {                                                                                           // 63
      Posts.update(post._id, {$set: set});                                                                          // 64
    }                                                                                                               // 65
  }                                                                                                                 // 66
  return post;                                                                                                      // 67
};                                                                                                                  // 68
Telescope.callbacks.add("postSubmitAsync", addMediaAfterSubmit);                                                    // 69
                                                                                                                    // 70
function updateMediaOnEdit (modifier, post) {                                                                       // 71
  var newUrl = modifier.$set.url;                                                                                   // 72
  if(newUrl && newUrl !== post.url){                                                                                // 73
    var data = getEmbedlyData(newUrl);                                                                              // 74
    if(!!data && !!data.media.html) {                                                                               // 75
      modifier.$set.media = data.media;                                                                             // 76
    }                                                                                                               // 77
  }                                                                                                                 // 78
  return modifier;                                                                                                  // 79
}                                                                                                                   // 80
Telescope.callbacks.add("postEdit", updateMediaOnEdit);                                                             // 81
                                                                                                                    // 82
                                                                                                                    // 83
Meteor.methods({                                                                                                    // 84
  testGetEmbedlyData: function (url) {                                                                              // 85
    console.log(getEmbedlyData(url));                                                                               // 86
  },                                                                                                                // 87
  getEmbedlyData: function (url) {                                                                                  // 88
    return getEmbedlyData(url);                                                                                     // 89
  },                                                                                                                // 90
  embedlyKeyExists: function () {                                                                                   // 91
    return !!Settings.get('embedlyKey');                                                                            // 92
  },                                                                                                                // 93
  regenerateEmbedlyData: function (post) {                                                                          // 94
    if (Users.can.edit(Meteor.user(), post)) {                                                                      // 95
      addMediaAfterSubmit(post);                                                                                    // 96
    }                                                                                                               // 97
  }                                                                                                                 // 98
});                                                                                                                 // 99
                                                                                                                    // 100
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:embedly/Users/sacha/Dev/Telescope/packages/telescope-embedly/i18n/en.i18n.js                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:embedly",                                                                             // 2
    namespace = "telescope:embedly";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
// integrate the fallback language translations                                                                     // 8
translations = {};                                                                                                  // 9
translations[namespace] = {"thumbnail":"Thumbnail","thumbnailUrl":"Thumbnail","regenerate_thumbnail":"Regenerate Thumbnail","clear_thumbnail":"Clear Thumbnail","please_fill_in_embedly_key":"Please fill in your Embedly API key to enable thumbnails.","please_ask_your_admin_to_fill_in_embedly_key":"Please ask your site admin to fill in an Embedly API key to enable thumbnails.","embedlyKey":"Embedly API Key","thumbnailWidth":"Thumbnail Width","thumbnailHeight":"Thumbnail Height"};
TAPi18n._loadLangFileObject("en", translations);                                                                    // 11
                                                                                                                    // 12
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:embedly/Users/sacha/Dev/Telescope/packages/telescope-embedly/i18n/fr.i18n.js                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:embedly",                                                                             // 2
    namespace = "telescope:embedly";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                     // 8
  TAPi18n.translations["fr"] = {};                                                                                  // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                          // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                       // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["fr"][namespace], {"thumbnail":"Aperçu","thumbnailUrl":"Aperçu","regenerate_thumbnail":"Regenerer l'aperçu","clear_thumbnail":"Effacer l'aperçu","please_fill_in_embedly_key":"Veuillez fournir une clé API Embedly pour activer les aperçus."});
                                                                                                                    // 17
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:embedly'] = {};

})();

//# sourceMappingURL=telescope_embedly.js.map
