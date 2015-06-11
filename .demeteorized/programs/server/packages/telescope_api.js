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
var serveAPI;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:api/lib/server/api.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
serveAPI = function(limitSegment){                                                                                  // 1
  var posts = [];                                                                                                   // 2
  var limit = isNaN(limitSegment) ? 20 : limitSegment; // default limit: 20 posts                                   // 3
                                                                                                                    // 4
  Posts.find({status: Posts.config.STATUS_APPROVED}, {sort: {postedAt: -1}, limit: limit}).forEach(function(post) { // 5
    var url = Posts.getLink(post);                                                                                  // 6
    var properties = {                                                                                              // 7
      title: post.title,                                                                                            // 8
      headline: post.title, // for backwards compatibility                                                          // 9
      author: post.author,                                                                                          // 10
      date: post.postedAt,                                                                                          // 11
      url: url,                                                                                                     // 12
      guid: post._id                                                                                                // 13
    };                                                                                                              // 14
                                                                                                                    // 15
    if(post.body)                                                                                                   // 16
      properties.body = post.body;                                                                                  // 17
                                                                                                                    // 18
    if(post.url)                                                                                                    // 19
      properties.domain = Telescope.utils.getDomain(url);                                                           // 20
                                                                                                                    // 21
    var twitterName = Users.getTwitterNameById(post.userId);                                                        // 22
    if(twitterName)                                                                                                 // 23
      properties.twitterName = twitterName;                                                                         // 24
                                                                                                                    // 25
    var comments = [];                                                                                              // 26
                                                                                                                    // 27
    Comments.find({postId: post._id}, {sort: {postedAt: -1}, limit: 50}).forEach(function(comment) {                // 28
      var commentProperties = {                                                                                     // 29
       body: comment.body,                                                                                          // 30
       author: comment.author,                                                                                      // 31
       date: comment.postedAt,                                                                                      // 32
       guid: comment._id,                                                                                           // 33
       parentCommentId: comment.parentCommentId                                                                     // 34
      };                                                                                                            // 35
      comments.push(commentProperties);                                                                             // 36
    });                                                                                                             // 37
                                                                                                                    // 38
    var commentsToDelete = [];                                                                                      // 39
                                                                                                                    // 40
    comments.forEach(function(comment, index) {                                                                     // 41
      if (comment.parentCommentId) {                                                                                // 42
        var parent = comments.filter(function(obj) {                                                                // 43
          return obj.guid === comment.parentCommentId;                                                              // 44
        })[0];                                                                                                      // 45
        if (parent) {                                                                                               // 46
          parent.replies = parent.replies || [];                                                                    // 47
          parent.replies.push(JSON.parse(JSON.stringify(comment)));                                                 // 48
          commentsToDelete.push(index);                                                                             // 49
        }                                                                                                           // 50
      }                                                                                                             // 51
    });                                                                                                             // 52
                                                                                                                    // 53
    commentsToDelete.reverse().forEach(function(index) {                                                            // 54
      comments.splice(index,1);                                                                                     // 55
    });                                                                                                             // 56
                                                                                                                    // 57
    properties.comments = comments;                                                                                 // 58
                                                                                                                    // 59
    posts.push(properties);                                                                                         // 60
  });                                                                                                               // 61
                                                                                                                    // 62
  return JSON.stringify(posts);                                                                                     // 63
};                                                                                                                  // 64
                                                                                                                    // 65
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:api/lib/server/routes.js                                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.startup(function () {                                                                                        // 1
                                                                                                                    // 2
  Router.route('api', {                                                                                             // 3
    where: 'server',                                                                                                // 4
    path: '/api/:limit?',                                                                                           // 5
    action: function() {                                                                                            // 6
      var limit = parseInt(this.params.limit);                                                                      // 7
      this.response.write(serveAPI(limit));                                                                         // 8
      this.response.end();                                                                                          // 9
    }                                                                                                               // 10
  });                                                                                                               // 11
                                                                                                                    // 12
});                                                                                                                 // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:api'] = {};

})();

//# sourceMappingURL=telescope_api.js.map
