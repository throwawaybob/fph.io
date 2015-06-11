(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
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
var coreSubscriptions, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/router/config.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Router.setTemplateNameConverter(function (str) { return str; });                                                   // 1
                                                                                                                   // 2
Telescope.subscriptions.preload('settings');                                                                       // 3
Telescope.subscriptions.preload('currentUser');                                                                    // 4
                                                                                                                   // 5
Router.configure({                                                                                                 // 6
  layoutTemplate: 'layout',                                                                                        // 7
  loadingTemplate: 'loading',                                                                                      // 8
  not_foundTemplate: 'not_found',                                                                                  // 9
  waitOn: function () {                                                                                            // 10
    return _.map(Telescope.subscriptions, function(sub){                                                           // 11
      // can either pass strings or objects with subName and subArguments properties                               // 12
      if (typeof sub === 'object'){                                                                                // 13
        Meteor.subscribe(sub.subName, sub.subArguments);                                                           // 14
      }else{                                                                                                       // 15
        Meteor.subscribe(sub);                                                                                     // 16
      }                                                                                                            // 17
    });                                                                                                            // 18
  }                                                                                                                // 19
});                                                                                                                // 20
                                                                                                                   // 21
// adding common subscriptions that's need to be loaded on all the routes                                          // 22
// notification does not included here since it is not much critical and                                           // 23
// it might have considerable amount of docs                                                                       // 24
if(Meteor.isServer) {                                                                                              // 25
  FastRender.onAllRoutes(function() {                                                                              // 26
    var router = this;                                                                                             // 27
    _.each(Telescope.subscriptions, function(sub){                                                                 // 28
      router.subscribe(sub);                                                                                       // 29
    });                                                                                                            // 30
  });                                                                                                              // 31
}                                                                                                                  // 32
                                                                                                                   // 33
Telescope.controllers = {};                                                                                        // 34
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/router/filters.js                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
//--------------------------------------------------------------------------------------------------//             // 1
//--------------------------------------------- Filters --------------------------------------------//             // 2
//--------------------------------------------------------------------------------------------------//             // 3
                                                                                                                   // 4
Router._filters = {                                                                                                // 5
                                                                                                                   // 6
  isReady: function () {                                                                                           // 7
    if (!this.ready()) {                                                                                           // 8
      // console.log('not ready')                                                                                  // 9
      this.render('loading');                                                                                      // 10
    }else{                                                                                                         // 11
      this.next();                                                                                                 // 12
      // console.log('ready')                                                                                      // 13
    }                                                                                                              // 14
  },                                                                                                               // 15
                                                                                                                   // 16
  clearSeenMessages: function () {                                                                                 // 17
    Messages.clearSeen();                                                                                          // 18
    this.next();                                                                                                   // 19
  },                                                                                                               // 20
                                                                                                                   // 21
  resetScroll: function () {                                                                                       // 22
    var scrollTo = window.currentScroll || 0;                                                                      // 23
    var $body = $('body');                                                                                         // 24
    $body.scrollTop(scrollTo);                                                                                     // 25
    $body.css("min-height", 0);                                                                                    // 26
  },                                                                                                               // 27
                                                                                                                   // 28
  /*                                                                                                               // 29
  isLoggedIn: function () {                                                                                        // 30
    if (!(Meteor.loggingIn() || Meteor.user())) {                                                                  // 31
      throwError(i18n.t('please_sign_in_first'));                                                                  // 32
      var current = getCurrentRoute();                                                                             // 33
      if (current){                                                                                                // 34
        Session.set('fromWhere', current);                                                                         // 35
      }                                                                                                            // 36
      this.render('entrySignIn');                                                                                  // 37
    } else {                                                                                                       // 38
      this.next();                                                                                                 // 39
    }                                                                                                              // 40
  },                                                                                                               // 41
  */                                                                                                               // 42
                                                                                                                   // 43
  isLoggedOut: function () {                                                                                       // 44
    if(Meteor.user()){                                                                                             // 45
      this.render('already_logged_in');                                                                            // 46
    } else {                                                                                                       // 47
      this.next();                                                                                                 // 48
    }                                                                                                              // 49
  },                                                                                                               // 50
                                                                                                                   // 51
  isAdmin: function () {                                                                                           // 52
    if(!this.ready()) return;                                                                                      // 53
    if(!Users.is.admin()){                                                                                         // 54
      this.render('no_rights');                                                                                    // 55
    } else {                                                                                                       // 56
      this.next();                                                                                                 // 57
    }                                                                                                              // 58
  },                                                                                                               // 59
                                                                                                                   // 60
  canView: function () {                                                                                           // 61
    if(!this.ready() || Meteor.loggingIn()){                                                                       // 62
      this.render('loading');                                                                                      // 63
    } else if (!Users.can.view()) {                                                                                // 64
      this.render('no_invite');                                                                                    // 65
    } else {                                                                                                       // 66
      this.next();                                                                                                 // 67
    }                                                                                                              // 68
  },                                                                                                               // 69
                                                                                                                   // 70
  canViewPendingPosts: function () {                                                                               // 71
    var post = this.data();                                                                                        // 72
    var user = Meteor.user();                                                                                      // 73
    if (!!post && post.status === Posts.config.STATUS_PENDING && !Users.can.viewPendingPost(user, post)) {         // 74
      this.render('no_rights');                                                                                    // 75
    } else {                                                                                                       // 76
      this.next();                                                                                                 // 77
    }                                                                                                              // 78
  },                                                                                                               // 79
                                                                                                                   // 80
  canViewRejectedPosts: function () {                                                                              // 81
    var post = this.data();                                                                                        // 82
    var user = Meteor.user();                                                                                      // 83
    if (!!post && post.status === Posts.config.STATUS_REJECTED && !Users.can.viewRejectedPost(user, post)) {       // 84
      this.render('no_rights');                                                                                    // 85
    } else {                                                                                                       // 86
      this.next();                                                                                                 // 87
    }                                                                                                              // 88
  },                                                                                                               // 89
                                                                                                                   // 90
  canPost: function () {                                                                                           // 91
    if(!this.ready() || Meteor.loggingIn()){                                                                       // 92
      this.render('loading');                                                                                      // 93
    } else if(!Users.can.post()) {                                                                                 // 94
      Messages.flash(i18n.t("sorry_you_dont_have_permissions_to_add_new_items"), "error");                         // 95
      this.render('no_rights');                                                                                    // 96
    } else {                                                                                                       // 97
      this.next();                                                                                                 // 98
    }                                                                                                              // 99
  },                                                                                                               // 100
                                                                                                                   // 101
  canEditPost: function () {                                                                                       // 102
    if(!this.ready()) return;                                                                                      // 103
    // Already subscribed to this post by route({waitOn: ...})                                                     // 104
    var post = Posts.findOne(this.params._id);                                                                     // 105
    if(!Users.can.currentUserEdit(post)){                                                                          // 106
      Messages.flash(i18n.t("sorry_you_cannot_edit_this_post"), "error");                                          // 107
      this.render('no_rights');                                                                                    // 108
    } else {                                                                                                       // 109
      this.next();                                                                                                 // 110
    }                                                                                                              // 111
  },                                                                                                               // 112
                                                                                                                   // 113
  canEditComment: function () {                                                                                    // 114
    if(!this.ready()) return;                                                                                      // 115
    // Already subscribed to this comment by CommentPageController                                                 // 116
    var comment = Comments.findOne(this.params._id);                                                               // 117
    if(!Users.can.currentUserEdit(comment)){                                                                       // 118
      Messages.flash(i18n.t("sorry_you_cannot_edit_this_comment"), "error");                                       // 119
      this.render('no_rights');                                                                                    // 120
    } else {                                                                                                       // 121
      this.next();                                                                                                 // 122
    }                                                                                                              // 123
  },                                                                                                               // 124
                                                                                                                   // 125
  hasCompletedProfile: function () {                                                                               // 126
    if(!this.ready()) return;                                                                                      // 127
    var user = Meteor.user();                                                                                      // 128
    if (user && ! Users.userProfileComplete(user)){                                                                // 129
      this.render('user_complete');                                                                                // 130
    } else {                                                                                                       // 131
      this.next();                                                                                                 // 132
    }                                                                                                              // 133
  },                                                                                                               // 134
                                                                                                                   // 135
  setSEOProperties: function () {                                                                                  // 136
                                                                                                                   // 137
    var props = {meta: {}, og: {}};                                                                                // 138
    var title = this.getTitle && this.getTitle();                                                                  // 139
    var description = this.getDescription && this.getDescription();                                                // 140
    var image = Settings.get("siteImage");                                                                         // 141
                                                                                                                   // 142
    if (!!title) {                                                                                                 // 143
      props.title = title + " | " + Settings.get("title");                                                         // 144
    }                                                                                                              // 145
    if (!!description) {                                                                                           // 146
      props.meta.description = description;                                                                        // 147
      props.og.description = description;                                                                          // 148
    }                                                                                                              // 149
    if (!!image) {                                                                                                 // 150
      props.og.image = image;                                                                                      // 151
    }                                                                                                              // 152
                                                                                                                   // 153
    SEO.set(props);                                                                                                // 154
                                                                                                                   // 155
  },                                                                                                               // 156
                                                                                                                   // 157
  setCanonical: function () {                                                                                      // 158
    var post = Posts.findOne(this.params._id);                                                                     // 159
    if (post) {                                                                                                    // 160
      SEO.set({link: {canonical: Posts.getPageUrl(post)}}, false);                                                 // 161
    }                                                                                                              // 162
  }                                                                                                                // 163
                                                                                                                   // 164
};                                                                                                                 // 165
                                                                                                                   // 166
var filters = Router._filters;                                                                                     // 167
coreSubscriptions = new SubsManager({                                                                              // 168
  // cache recent 50 subscriptions                                                                                 // 169
  cacheLimit: 50,                                                                                                  // 170
  // expire any subscription after 30 minutes                                                                      // 171
  expireIn: 30                                                                                                     // 172
});                                                                                                                // 173
                                                                                                                   // 174
Meteor.startup( function (){                                                                                       // 175
                                                                                                                   // 176
  if(Meteor.isClient){                                                                                             // 177
                                                                                                                   // 178
    // Load Hooks                                                                                                  // 179
                                                                                                                   // 180
    Router.onBeforeAction( function () {                                                                           // 181
      Session.set('categorySlug', null);                                                                           // 182
                                                                                                                   // 183
      // if we're not on the search page itself, clear search query and field                                      // 184
      if(Router.current().route.getName() !== 'search'){                                                           // 185
        Session.set('searchQuery', '');                                                                            // 186
        $('.search-field').val('').blur();                                                                         // 187
      }                                                                                                            // 188
                                                                                                                   // 189
      this.next();                                                                                                 // 190
                                                                                                                   // 191
    });                                                                                                            // 192
                                                                                                                   // 193
    // onRun Hooks                                                                                                 // 194
                                                                                                                   // 195
    // note: this has to run in an onRun hook, because onBeforeAction hooks can get called multiple times          // 196
    // per route, which would erase the message before the user has actually seen it                               // 197
    // TODO: find a way to make this work even with HCRs.                                                          // 198
    Router.onRun(filters.clearSeenMessages);                                                                       // 199
                                                                                                                   // 200
    // Before Hooks                                                                                                // 201
                                                                                                                   // 202
    Router.onBeforeAction(filters.isReady);                                                                        // 203
    Router.onBeforeAction(filters.hasCompletedProfile);                                                            // 204
    Router.onBeforeAction(filters.canView, {except: ['atSignIn', 'atSignUp', 'atForgotPwd', 'atResetPwd', 'signOut']});
    Router.onBeforeAction(filters.canViewPendingPosts, {only: ['post_page']});                                     // 206
    Router.onBeforeAction(filters.canViewRejectedPosts, {only: ['post_page']});                                    // 207
    Router.onBeforeAction(filters.isLoggedOut, {only: []});                                                        // 208
    Router.onBeforeAction(filters.canEditPost, {only: ['post_edit']});                                             // 209
    Router.onBeforeAction(filters.canEditComment, {only: ['comment_edit']});                                       // 210
    Router.onBeforeAction(filters.isAdmin, {only: ['posts_pending', 'all-users', 'settings', 'toolbox', 'logs']}); // 211
                                                                                                                   // 212
    Router.plugin('ensureSignedIn', {only: ['post_submit', 'post_edit', 'comment_edit']});                         // 213
                                                                                                                   // 214
    Router.onBeforeAction(filters.canPost, {only: ['posts_pending', 'post_submit']});                              // 215
                                                                                                                   // 216
    // After Hooks                                                                                                 // 217
                                                                                                                   // 218
    // Router.onAfterAction(filters.resetScroll, {except:['posts_top', 'posts_new', 'posts_best', 'posts_pending', 'posts_category', 'all-users']});
    Router.onAfterAction(Events.analyticsInit); // will only run once thanks to _.once()                           // 220
    Router.onAfterAction(Events.analyticsRequest); // log this request with mixpanel, etc                          // 221
    Router.onAfterAction(filters.setSEOProperties);                                                                // 222
    Router.onAfterAction(filters.setCanonical, {only: ["post_page", "post_page_with_slug"]});                      // 223
                                                                                                                   // 224
    // Unload Hooks                                                                                                // 225
                                                                                                                   // 226
    //                                                                                                             // 227
                                                                                                                   // 228
  }                                                                                                                // 229
                                                                                                                   // 230
});                                                                                                                // 231
                                                                                                                   // 232
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/router/admin.js                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Telescope.controllers.admin = RouteController.extend({                                                             // 1
                                                                                                                   // 2
  template: "admin_wrapper"                                                                                        // 3
                                                                                                                   // 4
});                                                                                                                // 5
                                                                                                                   // 6
Meteor.startup(function (){                                                                                        // 7
                                                                                                                   // 8
 // Loading (for testing purposes)                                                                                 // 9
                                                                                                                   // 10
  Router.route('/loading', {                                                                                       // 11
    name: 'loading',                                                                                               // 12
    template: 'loading'                                                                                            // 13
  });                                                                                                              // 14
                                                                                                                   // 15
  // Toolbox                                                                                                       // 16
                                                                                                                   // 17
  Router.route('/toolbox', {                                                                                       // 18
    name: 'toolbox',                                                                                               // 19
    template: 'toolbox'                                                                                            // 20
  });                                                                                                              // 21
                                                                                                                   // 22
});                                                                                                                // 23
                                                                                                                   // 24
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/router/server.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
                                                                                                                   // 1
var increasePostClicks = function(postId, ip){                                                                     // 2
                                                                                                                   // 3
  var clickEvent = {                                                                                               // 4
    name: 'click',                                                                                                 // 5
    properties: {                                                                                                  // 6
      postId: postId,                                                                                              // 7
      ip: ip                                                                                                       // 8
    }                                                                                                              // 9
  };                                                                                                               // 10
                                                                                                                   // 11
  // make sure this IP hasn't previously clicked on this post                                                      // 12
  var existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});      // 13
                                                                                                                   // 14
  if(!existingClickEvent){                                                                                         // 15
    Events.log(clickEvent);                                                                                        // 16
    Posts.update(postId, { $inc: { clickCount: 1 }});                                                              // 17
  }                                                                                                                // 18
};                                                                                                                 // 19
                                                                                                                   // 20
                                                                                                                   // 21
Meteor.startup(function (){                                                                                        // 22
                                                                                                                   // 23
  // Link Out                                                                                                      // 24
                                                                                                                   // 25
  Router.route('/out', {                                                                                           // 26
    name: 'out',                                                                                                   // 27
    where: 'server',                                                                                               // 28
    action: function(){                                                                                            // 29
      var query = this.request.query;                                                                              // 30
      if(query.url){ // for some reason, query.url doesn't need to be decoded                                      // 31
        var post = Posts.findOne({url: query.url});                                                                // 32
        if (post) {                                                                                                // 33
          var ip = this.request.connection.remoteAddress;                                                          // 34
          increasePostClicks(post._id, ip);                                                                        // 35
          this.response.writeHead(302, {'Location': query.url});                                                   // 36
        } else {                                                                                                   // 37
          // don't redirect if we can't find a post for that link                                                  // 38
          this.response.write('Invalid URL');                                                                      // 39
        }                                                                                                          // 40
        this.response.end();                                                                                       // 41
      }                                                                                                            // 42
    }                                                                                                              // 43
  });                                                                                                              // 44
                                                                                                                   // 45
  // Account approved email                                                                                        // 46
                                                                                                                   // 47
  Router.route('/email/account-approved/:id?', {                                                                   // 48
    name: 'accountApproved',                                                                                       // 49
    where: 'server',                                                                                               // 50
    action: function() {                                                                                           // 51
      var user = Meteor.users.findOne(this.params.id);                                                             // 52
      var emailProperties = {                                                                                      // 53
        profileUrl: Users.getProfileUrl(user),                                                                     // 54
        username: Users.getUserName(user),                                                                         // 55
        siteTitle: Settings.get('title'),                                                                          // 56
        siteUrl: Telescope.utils.getSiteUrl()                                                                      // 57
      };                                                                                                           // 58
      var html = Handlebars.templates.emailAccountApproved(emailProperties);                                       // 59
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 60
      this.response.end();                                                                                         // 61
    }                                                                                                              // 62
  });                                                                                                              // 63
                                                                                                                   // 64
});                                                                                                                // 65
                                                                                                                   // 66
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/config.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* global                                                                                                          // 1
    AccountsTemplates: false,                                                                                      // 2
    Settings: false                                                                                                // 3
*/                                                                                                                 // 4
                                                                                                                   // 5
//////////////////////////////////                                                                                 // 6
// AccountsTemplates configuration                                                                                 // 7
//////////////////////////////////                                                                                 // 8
                                                                                                                   // 9
if (Meteor.isServer) {                                                                                             // 10
  Meteor.startup(function () {                                                                                     // 11
    Accounts.emailTemplates.siteName = Settings.get('title');                                                      // 12
    Accounts.emailTemplates.from = Settings.get('defaultEmail');                                                   // 13
  });                                                                                                              // 14
}                                                                                                                  // 15
                                                                                                                   // 16
//Fields                                                                                                           // 17
AccountsTemplates.addField({                                                                                       // 18
    _id: 'username',                                                                                               // 19
    type: 'text',                                                                                                  // 20
    displayName: 'username',                                                                                       // 21
    required: true,                                                                                                // 22
    minLength: 3,                                                                                                  // 23
    errStr: 'error.minChar'                                                                                        // 24
});                                                                                                                // 25
                                                                                                                   // 26
AccountsTemplates.removeField('email');                                                                            // 27
AccountsTemplates.addField({                                                                                       // 28
    _id: 'email',                                                                                                  // 29
    type: 'email',                                                                                                 // 30
    required: true,                                                                                                // 31
    re: /.+@(.+){2,}\.(.+){2,}/,                                                                                   // 32
    errStr: 'error.accounts.Invalid email',                                                                        // 33
});                                                                                                                // 34
                                                                                                                   // 35
AccountsTemplates.removeField('password');                                                                         // 36
AccountsTemplates.addField({                                                                                       // 37
    _id: 'password',                                                                                               // 38
    type: 'password',                                                                                              // 39
    required: true,                                                                                                // 40
    minLength: 8,                                                                                                  // 41
    errStr: 'error.minChar'                                                                                        // 42
});                                                                                                                // 43
                                                                                                                   // 44
AccountsTemplates.addField({                                                                                       // 45
    _id: 'username_and_email',                                                                                     // 46
    type: 'text',                                                                                                  // 47
    required: true,                                                                                                // 48
    displayName: 'usernameOrEmail',                                                                                // 49
    placeholder: 'usernameOrEmail',                                                                                // 50
});                                                                                                                // 51
                                                                                                                   // 52
                                                                                                                   // 53
//Routes                                                                                                           // 54
AccountsTemplates.configureRoute('signIn');                                                                        // 55
AccountsTemplates.configureRoute('signUp', {                                                                       // 56
  path: '/register'                                                                                                // 57
});                                                                                                                // 58
AccountsTemplates.configureRoute('forgotPwd');                                                                     // 59
AccountsTemplates.configureRoute('resetPwd');                                                                      // 60
AccountsTemplates.configureRoute('changePwd');                                                                     // 61
//AccountsTemplates.configureRoute('enrollAccount');                                                               // 62
//AccountsTemplates.configureRoute('verifyEmail');                                                                 // 63
                                                                                                                   // 64
                                                                                                                   // 65
// Options                                                                                                         // 66
AccountsTemplates.configure({                                                                                      // 67
    enablePasswordChange: true,                                                                                    // 68
    showForgotPasswordLink: true,                                                                                  // 69
    confirmPassword: false,                                                                                        // 70
    overrideLoginErrors: true,                                                                                     // 71
    lowercaseUsername: true,                                                                                       // 72
                                                                                                                   // 73
    negativeFeedback: false,                                                                                       // 74
    positiveFeedback: false,                                                                                       // 75
    negativeValidation: true,                                                                                      // 76
    positiveValidation: true                                                                                       // 77
});                                                                                                                // 78
                                                                                                                   // 79
// hack to get signOut route not considered among previous paths                                                   // 80
if (Meteor.isClient) {                                                                                             // 81
    Meteor.startup(function(){                                                                                     // 82
        AccountsTemplates.knownRoutes.push('/sign-out');                                                           // 83
    });                                                                                                            // 84
}                                                                                                                  // 85
                                                                                                                   // 86
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/modules.js                                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// array containing nav items;                                                                                     // 1
                                                                                                                   // 2
Telescope.modules.add("secondaryNav", [                                                                            // 3
  {                                                                                                                // 4
    template: 'user_menu',                                                                                         // 5
    order: 10                                                                                                      // 6
  },                                                                                                               // 7
  {                                                                                                                // 8
    template: 'submit_button',                                                                                     // 9
    order: 30                                                                                                      // 10
  }                                                                                                                // 11
]);                                                                                                                // 12
                                                                                                                   // 13
Telescope.modules.add("mobileNav", [                                                                               // 14
  {                                                                                                                // 15
    template: 'user_menu',                                                                                         // 16
    order: 10                                                                                                      // 17
  },                                                                                                               // 18
  {                                                                                                                // 19
    template: 'submit_button',                                                                                     // 20
    order: 30                                                                                                      // 21
  }                                                                                                                // 22
]);                                                                                                                // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/vote.js                                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
                                                                                                                   // 1
// getVotePower returns how much "power" a user's votes have                                                       // 2
// It is can be set in a package, by setting getVotePower to a Number or Function then re-exporting                // 3
// The default is found in base.js in the base package, and returns 1.                                             // 4
                                                                                                                   // 5
var modifyKarma = function (userId, karma) {                                                                       // 6
  Meteor.users.update({_id: userId}, {$inc: {"telescope.karma": karma}});                                          // 7
};                                                                                                                 // 8
                                                                                                                   // 9
var hasUpvotedItem = function (item, user) {                                                                       // 10
  return item.upvoters && item.upvoters.indexOf(user._id) !== -1;                                                  // 11
};                                                                                                                 // 12
                                                                                                                   // 13
var hasDownvotedItem = function (item, user) {                                                                     // 14
  return item.downvoters && item.downvoters.indexOf(user._id) !== -1;                                              // 15
};                                                                                                                 // 16
                                                                                                                   // 17
var addVote = function (userId, vote, collection, upOrDown) {                                                      // 18
  var field = 'telescope.' + upOrDown + 'voted' + collection;                                                      // 19
  var add = {};                                                                                                    // 20
  add[field] = vote;                                                                                               // 21
  Meteor.users.update({_id: userId}, {                                                                             // 22
    $addToSet: add                                                                                                 // 23
  });                                                                                                              // 24
};                                                                                                                 // 25
                                                                                                                   // 26
var removeVote = function (userId, itemId, collection, upOrDown) {                                                 // 27
  var field = 'telescope.' + upOrDown + 'voted' + collection;                                                      // 28
  var remove = {};                                                                                                 // 29
  remove[field] = {itemId: itemId};                                                                                // 30
  Meteor.users.update({_id: userId}, {                                                                             // 31
    $pull: remove                                                                                                  // 32
  });                                                                                                              // 33
};                                                                                                                 // 34
                                                                                                                   // 35
Telescope.upvoteItem = function (collection, item, user) {                                                         // 36
  user = typeof user === "undefined" ? Meteor.user() : user;                                                       // 37
  var collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);                        // 38
                                                                                                                   // 39
  // make sure user has rights to upvote first                                                                     // 40
  if (!user || !Users.can.vote(user, true) || hasUpvotedItem(item, user))                                          // 41
    return false;                                                                                                  // 42
                                                                                                                   // 43
  // ------------------------------ Callbacks ------------------------------ //                                    // 44
                                                                                                                   // 45
  // run all upvote callbacks on item successively                                                                 // 46
                                                                                                                   // 47
  item = Telescope.callbacks.run("upvote", item);                                                                  // 48
                                                                                                                   // 49
  // ----------------------------------------------------------------------- //                                    // 50
                                                                                                                   // 51
  var votePower = getVotePower(user);                                                                              // 52
                                                                                                                   // 53
  // in case user is upvoting a previously downvoted item, cancel downvote first                                   // 54
  Telescope.cancelDownvote(collection, item, user);                                                                // 55
                                                                                                                   // 56
  // Votes & Score                                                                                                 // 57
  var result = collection.update({_id: item && item._id, upvoters: { $ne: user._id }},{                            // 58
    $addToSet: {upvoters: user._id},                                                                               // 59
    $inc: {upvotes: 1, baseScore: votePower},                                                                      // 60
    $set: {inactive: false}                                                                                        // 61
  });                                                                                                              // 62
                                                                                                                   // 63
  if (result > 0) {                                                                                                // 64
                                                                                                                   // 65
    // Add item to list of upvoted items                                                                           // 66
    var vote = {                                                                                                   // 67
      itemId: item._id,                                                                                            // 68
      votedAt: new Date(),                                                                                         // 69
      power: votePower                                                                                             // 70
    };                                                                                                             // 71
    addVote(user._id, vote, collectionName, 'up');                                                                 // 72
                                                                                                                   // 73
    // extend item with baseScore to help calculate newScore                                                       // 74
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});                                              // 75
    Telescope.updateScore({collection: collection, item: item, forceUpdate: true});                                // 76
                                                                                                                   // 77
    // if the item is being upvoted by its own author, don't give karma                                            // 78
    if (item.userId !== user._id) {                                                                                // 79
      modifyKarma(item.userId, votePower);                                                                         // 80
                                                                                                                   // 81
      // if karma redistribution is enabled, give karma to all previous upvoters of the post                       // 82
      // (but not to the person doing the upvoting)                                                                // 83
      if (Settings.get('redistributeKarma', false)) {                                                              // 84
        _.each(item.upvoters, function (upvoterId) {                                                               // 85
          // share the karma equally among all upvoters, but cap the value at 0.1                                  // 86
          var karmaIncrease = Math.min(0.1, votePower/item.upvoters.length);                                       // 87
          modifyKarma(upvoterId, karmaIncrease);                                                                   // 88
        });                                                                                                        // 89
      }                                                                                                            // 90
    }                                                                                                              // 91
                                                                                                                   // 92
                                                                                                                   // 93
    // --------------------- Server-Side Async Callbacks --------------------- //                                  // 94
                                                                                                                   // 95
    Telescope.callbacks.runAsync("upvoteAsync", item);                                                             // 96
                                                                                                                   // 97
    // ----------------------------------------------------------------------- //                                  // 98
  }                                                                                                                // 99
  // console.log(collection.findOne(item._id));                                                                    // 100
  return true;                                                                                                     // 101
};                                                                                                                 // 102
                                                                                                                   // 103
Telescope.downvoteItem = function (collection, item, user) {                                                       // 104
  user = typeof user === "undefined" ? Meteor.user() : user;                                                       // 105
  var collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);                        // 106
                                                                                                                   // 107
  // make sure user has rights to downvote first                                                                   // 108
  if (!user || !Users.can.vote(user, true)  || hasDownvotedItem(item, user))                                       // 109
    return false;                                                                                                  // 110
                                                                                                                   // 111
  // ------------------------------ Callbacks ------------------------------ //                                    // 112
                                                                                                                   // 113
  // run all downvote callbacks on item successively                                                               // 114
  item = Telescope.callbacks.run("downvote", item);                                                                // 115
                                                                                                                   // 116
  // ----------------------------------------------------------------------- //                                    // 117
                                                                                                                   // 118
  var votePower = getVotePower(user);                                                                              // 119
                                                                                                                   // 120
  // in case user is downvoting a previously upvoted item, cancel upvote first                                     // 121
  Telescope.cancelUpvote(collection, item, user);                                                                  // 122
                                                                                                                   // 123
  // Votes & Score                                                                                                 // 124
  var result = collection.update({_id: item && item._id, downvoters: { $ne: user._id }},{                          // 125
    $addToSet: {downvoters: user._id},                                                                             // 126
    $inc: {downvotes: 1, baseScore: -votePower},                                                                   // 127
    $set: {inactive: false}                                                                                        // 128
  });                                                                                                              // 129
                                                                                                                   // 130
  if (result > 0) {                                                                                                // 131
    // Add item to list of downvoted items                                                                         // 132
    var vote = {                                                                                                   // 133
      itemId: item._id,                                                                                            // 134
      votedAt: new Date(),                                                                                         // 135
      power: votePower                                                                                             // 136
    };                                                                                                             // 137
    addVote(user._id, vote, collectionName, 'down');                                                               // 138
                                                                                                                   // 139
    // extend item with baseScore to help calculate newScore                                                       // 140
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});                                              // 141
    Telescope.updateScore({collection: collection, item: item, forceUpdate: true});                                // 142
                                                                                                                   // 143
    // if the item is being upvoted by its own author, don't give karma                                            // 144
    if (item.userId !== user._id)                                                                                  // 145
      modifyKarma(item.userId, votePower);                                                                         // 146
                                                                                                                   // 147
    // --------------------- Server-Side Async Callbacks --------------------- //                                  // 148
                                                                                                                   // 149
    Telescope.callbacks.runAsync("downvoteAsync", item);                                                           // 150
                                                                                                                   // 151
    // ----------------------------------------------------------------------- //                                  // 152
  }                                                                                                                // 153
  // console.log(collection.findOne(item._id));                                                                    // 154
  return true;                                                                                                     // 155
};                                                                                                                 // 156
                                                                                                                   // 157
Telescope.cancelUpvote = function (collection, item, user) {                                                       // 158
  user = typeof user === "undefined" ? Meteor.user() : user;                                                       // 159
  var collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);                        // 160
                                                                                                                   // 161
  // if user isn't among the upvoters, abort                                                                       // 162
  if (!hasUpvotedItem(item, user))                                                                                 // 163
    return false;                                                                                                  // 164
                                                                                                                   // 165
  // ------------------------------ Callbacks ------------------------------ //                                    // 166
                                                                                                                   // 167
  // run all cancel upvote callbacks on item successively                                                          // 168
  item = Telescope.callbacks.run("cancelUpvote", item);                                                            // 169
                                                                                                                   // 170
  // ----------------------------------------------------------------------- //                                    // 171
                                                                                                                   // 172
  var votePower = getVotePower(user);                                                                              // 173
                                                                                                                   // 174
  // Votes & Score                                                                                                 // 175
  var result = collection.update({_id: item && item._id, upvoters: user._id},{                                     // 176
    $pull: {upvoters: user._id},                                                                                   // 177
    $inc: {upvotes: -1, baseScore: -votePower},                                                                    // 178
    $set: {inactive: false}                                                                                        // 179
  });                                                                                                              // 180
                                                                                                                   // 181
  if (result > 0) {                                                                                                // 182
    // Remove item from list of upvoted items                                                                      // 183
    removeVote(user._id, item._id, collectionName, 'up');                                                          // 184
                                                                                                                   // 185
    // extend item with baseScore to help calculate newScore                                                       // 186
    item = _.extend(item, {baseScore: (item.baseScore - votePower)});                                              // 187
    Telescope.updateScore({collection: collection, item: item, forceUpdate: true});                                // 188
                                                                                                                   // 189
    // if the item is being upvoted by its own author, don't give karma                                            // 190
    if (item.userId !== user._id)                                                                                  // 191
      modifyKarma(item.userId, votePower);                                                                         // 192
                                                                                                                   // 193
                                                                                                                   // 194
    // --------------------- Server-Side Async Callbacks --------------------- //                                  // 195
                                                                                                                   // 196
    Telescope.callbacks.runAsync("cancelUpvoteAsync", item);                                                       // 197
                                                                                                                   // 198
    // ----------------------------------------------------------------------- //                                  // 199
  }                                                                                                                // 200
  // console.log(collection.findOne(item._id));                                                                    // 201
  return true;                                                                                                     // 202
};                                                                                                                 // 203
                                                                                                                   // 204
Telescope.cancelDownvote = function (collection, item, user) {                                                     // 205
  user = typeof user === "undefined" ? Meteor.user() : user;                                                       // 206
  var collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);                        // 207
                                                                                                                   // 208
  // if user isn't among the downvoters, abort                                                                     // 209
  if (!hasDownvotedItem(item, user))                                                                               // 210
    return false;                                                                                                  // 211
                                                                                                                   // 212
  // ------------------------------ Callbacks ------------------------------ //                                    // 213
                                                                                                                   // 214
  // run all cancel downvote callbacks on item successively                                                        // 215
                                                                                                                   // 216
  item = Telescope.callbacks.run("cancelDownvote", item);                                                          // 217
                                                                                                                   // 218
  // ----------------------------------------------------------------------- //                                    // 219
                                                                                                                   // 220
  var votePower = getVotePower(user);                                                                              // 221
                                                                                                                   // 222
  // Votes & Score                                                                                                 // 223
  var result = collection.update({_id: item && item._id, downvoters: user._id},{                                   // 224
    $pull: {downvoters: user._id},                                                                                 // 225
    $inc: {downvotes: -1, baseScore: votePower},                                                                   // 226
    $set: {inactive: false}                                                                                        // 227
  });                                                                                                              // 228
                                                                                                                   // 229
  if (result > 0) {                                                                                                // 230
    // Remove item from list of downvoted items                                                                    // 231
    removeVote(user._id, item._id, collectionName, 'down');                                                        // 232
                                                                                                                   // 233
    // extend item with baseScore to help calculate newScore                                                       // 234
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});                                              // 235
    Telescope.updateScore({collection: collection, item: item, forceUpdate: true});                                // 236
                                                                                                                   // 237
    // if the item is being upvoted by its own author, don't give karma                                            // 238
    if (item.userId !== user._id)                                                                                  // 239
      modifyKarma(item.userId, votePower);                                                                         // 240
                                                                                                                   // 241
                                                                                                                   // 242
    // --------------------- Server-Side Async Callbacks --------------------- //                                  // 243
                                                                                                                   // 244
    Telescope.callbacks.runAsync("cancelDownvoteAsync", item);                                                     // 245
                                                                                                                   // 246
    // ----------------------------------------------------------------------- //                                  // 247
  }                                                                                                                // 248
  // console.log(collection.findOne(item._id));                                                                    // 249
  return true;                                                                                                     // 250
};                                                                                                                 // 251
                                                                                                                   // 252
Meteor.methods({                                                                                                   // 253
  upvotePost: function (post) {                                                                                    // 254
    return Telescope.upvoteItem.call(this, Posts, post);                                                           // 255
  },                                                                                                               // 256
  downvotePost: function (post) {                                                                                  // 257
    return Telescope.downvoteItem.call(this, Posts, post);                                                         // 258
  },                                                                                                               // 259
  cancelUpvotePost: function (post) {                                                                              // 260
    return Telescope.cancelUpvote.call(this, Posts, post);                                                         // 261
  },                                                                                                               // 262
  cancelDownvotePost: function (post) {                                                                            // 263
    return Telescope.cancelDownvote.call(this, Posts, post);                                                       // 264
  },                                                                                                               // 265
  upvoteComment: function (comment) {                                                                              // 266
    return Telescope.upvoteItem.call(this, Comments, comment);                                                     // 267
  },                                                                                                               // 268
  downvoteComment: function (comment) {                                                                            // 269
    return Telescope.downvoteItem.call(this, Comments, comment);                                                   // 270
  },                                                                                                               // 271
  cancelUpvoteComment: function (comment) {                                                                        // 272
    return Telescope.cancelUpvote.call(this, Comments, comment);                                                   // 273
  },                                                                                                               // 274
  cancelDownvoteComment: function (comment) {                                                                      // 275
    return Telescope.cancelDownvote.call(this, Comments, comment);                                                 // 276
  }                                                                                                                // 277
});                                                                                                                // 278
                                                                                                                   // 279
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/lib/server/start.js                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1
  Events.log({                                                                                                     // 2
    name: "firstRun",                                                                                              // 3
    unique: true, // will only get logged a single time                                                            // 4
    important: true                                                                                                // 5
  });                                                                                                              // 6
});                                                                                                                // 7
                                                                                                                   // 8
if (Settings.get('mailUrl'))                                                                                       // 9
  process.env.MAIL_URL = Settings.get('mailUrl');                                                                  // 10
                                                                                                                   // 11
Meteor.startup(function() {                                                                                        // 12
  SyncedCron.start();                                                                                              // 13
});                                                                                                                // 14
                                                                                                                   // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/ar.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["ar"] = ["Arabic","العربية"];                                                              // 8
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null});    // 9
TAPi18n.languages_names["en"] = ["English","English"];                                                             // 10
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                    // 11
  TAPi18n.translations["ar"] = {};                                                                                 // 12
}                                                                                                                  // 13
                                                                                                                   // 14
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                         // 15
  TAPi18n.translations["ar"][namespace] = {};                                                                      // 16
}                                                                                                                  // 17
                                                                                                                   // 18
_.extend(TAPi18n.translations["ar"][namespace], {"view":"معاينة","menu":"قائمة","top":"اﻻكثر شعبية","new":"جديد","best":"اﻻفضل","digest":"ملخص","users":"مستخدمين","settings":"الإعدادات","admin":"مشرف","post":"ارسل","toolbox":"الأدوات","sign_up_sign_in":"دخول/تسجيل","my_account":"حسابي","view_profile":"مشاهدة الملف الشخصي","edit_account":"تعديل الحساب","pending":"في الانتظار","new_posts":"مشاركة جديدة","title":"عنوان","siteUrl":"رابط الموقع","tagline":"شعار","requireViewInvite":"مشاهدة مقيدة","requirePostInvite":"مشاركة مقيدة","requirePostsApproval":"موافقة مطلوبة","defaultEmail":"البريد اﻻلكتروني","scoreUpdateInterval":"تحديث النتيجة","defaultView":"مشهد افتراضي","postInterval":"فاصل المشاركات","commentInterval":"فاصل التعليقات","maxPostsPerDay":"العدد اﻻقصى للمشاركات في اليوم","startInvitesCount":"الدعوات منذ البريداية","postsPerPage":"المشاركات في الصفحة","logoUrl":"رابط الشارة","logoHeight":"طول الشارة","logoWidth":"عرض الشارة","language":"اللغة","backgroundCSS":"CSS للخلفية","buttonColor":"لون اﻻزرار","buttonTextColor":"لون نص اﻻزرار","headerColor":"لون الجزء الرأسي","headerTextColor":"لون نص الجزء الراسي","twitterAccount":"حساب تويتر","googleAnalyticsId":"معرف قوقل تحليﻻت","mixpanelId":"ID Mixpanel","clickyId":"ID Clicky","footerCode":"شفرة الجزء السفلي","extraCode":"شفرات زائدة","emailFooter":"الجزء السفلي لﻻيميل","notes":"مﻻحظات","debug":"وضع المعالجة","fontUrl":"رابط الخط","fontFamily":"اسم الخط","authMethods":"أساليب المصادقة","faviconUrl":"رابط فافيكون","mailURL":"رابط اﻻيميل","postsLayout":"مشاركات ﻻيوت","general":"عام","invites":"دعوات","email":"البريد اﻻلكتروني","scoring":"النتيجة","posts":"المشاركات","comments":"تعليقات","logo":"شارة","extras":"إضافات","colors":"اﻻلوان","integrations":"دمج","createdAt":"كتب على ","postedAt":"ارسل على","url":"رابط","body":"وصف","htmlBody":"Texte HTML","viewCount":"عدد المشاهدات","commentCount":"تعليقات","commenters":"معلقون","lastCommentedAt":"اخر تعليق على","clickCount":"عدد النقرات","baseScore":"النقاط الأساسية","upvotes":"تصويت مع","upvoters":"الموصوتون مع","downvotes":"تصويت ضد","downvoters":"الموصوتون ضد","score":"النتيجة","status":"status","sticky":"Mis en avant","inactive":"غير نشط","author":"كاتب","userId":"مستخدم","sorry_we_couldnt_find_any_posts":"ﻻ توجد اي مشاركة","your_comment_has_been_deleted":"قد تم حذف تعليقك","comment_":"تعليق","delete_comment":"احذف التعليق","add_comment":"اضف تعليق","upvote":"صوت مع","downvote":"صوت ضد","link":"رابط","edit":"تعديل","reply":"رد","no_comments":"ﻻ يوجد تعليق","please_sign_in_to_reply":"يتوجب الدخول ﻻضافة رد","you_are_already_logged_in":"انت اﻻن متصل","sorry_this_is_a_private_site_please_sign_up_first":"يتوجب عليك الدخول","thanks_for_signing_up":"شكرا لقيامك بالتسجيل","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"الدخول الى الموقع  يكون عن طريق الدعوة فقط. سوف نبلغك في أقرب وقت عندما يكو ن فيه  مكانا متاحا.","sorry_you_dont_have_the_rights_to_view_this_page":"ﻻ يمكنك رؤية هذه الصفحة","not_found":"Oups","were_sorry_whatever_you_were_looking_for_isnt_here":"ما تبحث عنه غير موجود هنا","no_notifications":"0 تعليقات","1_notification":"1 تعليق","notifications":"تعليقات","mark_all_as_read":"اجعلها مقرؤة","your_post_has_been_deleted":"مشاركتك قد تم حذفها.","created":"استحدث","suggest_title":"اقترح عنوان","short_url":"رابط قصير","category":"مجموعة,","inactive_":"غير نشط؟","sticky_":"Mis en avant ?","submission_date":"تاريخ اﻻرسال","submission_time":"توقيت اﻻرسال","date":"تاريخ","submission":"ارسال","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"مﻻحظة:مشاركتك قيد المعاينة","user":"مستخدم","status_":"حاﻻت","approved":"مقبول","rejected":"مرفوض","delete_post":"احذف المشاركة","thanks_your_post_is_awaiting_approval":"شكرا, مشاركتك قيد العاينة","sorry_couldnt_find_a_title":"ﻻ يمكننا ايجاد عنوان واحد","please_fill_in_an_url_first":"يجب عليك كتابة الرابط","share":"شارك","discuss":"ناقش","upvote_":"صوت","votes":"اعدد الصوات","basescore":"النتيجة المبدئية","clicks":"نقرات","views":"مشاهدات","comment":"تعليق","point":"نقطة","points":"نقاط","please_complete_your_profile_below_before_continuing":"شكرا  لاستكمال ملفك الشخصي قبل المتابعة.","account":"حساب","username":"اسم المستخدم","display_name":"اﻻسم الحقيقي","bio":"السيرة:","password":"كلمة المرور","change_password":"تبديل كلمة المرور","old_password":"كلمة المرور القديمة","new_password":"كلمة المرور الجديدة","email_notifications":"إشعارات بالبريد الإلكتروني","comments_on_my_posts":"تعليقات على مشاركاتي","replies_to_my_comments":"اجابة تعليقاتي","forgot_password":"نسيت كلمة المرور؟","profile_updated":"تحديث الملف الشخصي","please_fill_in_your_email_below_to_finish_signing_up":"تفضل بأدخل بريدك الالكتروني لإنهاء إنشاء الحساب","invite":"قم بدعوة","uninvite":"الغاء الدعوة","make_admin":"عين مشرف","unadmin":"الغي مشرف","delete_user":"احذف مستخدم","are_you_sure_you_want_to_delete":"هل انت متاكد من الحذف؟ ","reset_password":"اعادة كلمة المرور","password_reset_link_sent":"قد تم ارسال رابط ﻻسترجاع كلمة المرور","name":"اﻻسم:","comments_":"التعليقات","karma":"Karma","is_invited":"هل هو مدعو؟","is_admin":"هل هو مشرف؟","delete":"حذف","member_since":"عضو منذ","edit_profile":"تغيير الملف الشخصي","sign_in":"دخول","sign_in_":"دخول","sign_up_":"استحدث حساب","dont_have_an_account":"ﻻ تمتلك حساب؟","already_have_an_account":"تمتلك حساب؟","sign_up":"استحدث حساب","please_fill_in_all_fields":"يتوجب مل كل الخانات","invite_":"دعوة ","left":" باقي","invite_none_left":"دعوات (0 متبقي)","all":"الكل","invited":"مدعو؟","uninvited":"غير مدعو","filter_by":"فرز ب","sort_by":"ترتيب حسب","sorry_you_do_not_have_access_to_this_page":"عذرا, ﻻ يمكنك الدخول لهذه الصفحة","please_sign_in_first":"يتوجب عليك الدخول","sorry_you_have_to_be_an_admin_to_view_this_page":"عذرا, يتوجب عليك ان تكون مشرف لرؤية هذه الصفحة","sorry_you_dont_have_permissions_to_add_new_items":"ليس ليدك الصلحيات ﻻضافة مشاركات","sorry_you_cannot_edit_this_post":"ﻻ سنكنك التعديل على هذه المشاركة","sorry_you_cannot_edit_this_comment":"ﻻ يمكنك تعديل هذا التعليق","you_need_to_login_and_be_an_admin_to_add_a_new_category":"يجب أن تكون مشرف ومسجلا لإضافة مجموعة","you_need_to_login_or_be_invited_to_post_new_comments":"يجب أن تكون مسجلا و مدعو لإضافة التعليقات","please_wait":"Merci de patienter ","seconds_before_commenting_again":" ثواني قبل نشر تعليق جديد","your_comment_is_empty":"تعليقك فارغ","you_dont_have_permission_to_delete_this_comment":"ليس  لديك إذن لحذف هذا التعليق","you_need_to_login_or_be_invited_to_post_new_stories":"يجب أن تكون مسجلا أو مدعو ﻻنشاء مشاركة جديدة","please_fill_in_a_headline":"اضف عنوان من فضلك","this_link_has_already_been_posted":"هذا الرابط موجود","sorry_you_cannot_submit_more_than":"ﻻ يمكنك اضافة اكثر من ","posts_per_day":" posts par jour","someone_replied_to_your_comment_on":"احدهم قام باضافة اجابة لتعليقك حول","has_replied_to_your_comment_on":" قام باضافة تعليق حول","read_more":"اقر اﻻتي","a_new_comment_on_your_post":"تعليق جديد حول مشاركتك","you_have_a_new_comment_by":"لديك تعليق جديد من","on_your_post":" حول مشاركتك","has_created_a_new_post":" اضاف مشاركة جديدة","your_account_has_been_approved":"قد تم قبول حسابك","welcome_to":"مرحبا بك في  ","start_posting":"قم باضافة جديدة","please_fill_in_a_title":"قم باضافة عنوان","seconds_before_posting_again":" ثواني قبل نشر مشاركة جديدة.","upvoted":"مصوت لهذه","posted_date":"تاريخ التقديم","posted_time":"توقيت التقديم","profile":"الملف الشخصي","sign_out":"خروج","invitedcount":"اعضاء المدعون","actions":"اعمال","invites_left":"الدعوات الباقية","id":"ID","github":"GitHub","site":"الموقع","upvoted_posts":"المشاركات المصوت لها","downvoted_posts":"المشاركات المصوت ضدها","mark_as_read":"إجعلها مقروءة","loading":"تحميل ...","submit":"ابعث","you_must_be_logged_in":"يتوجب عليك الدخول","are_you_sure":"هل انت متاكد؟","please_log_in_first":"يتوجب عليك الدخول","sign_in_sign_up_with_twitter":"تسجيل الدخول / تسجيل عبر تويتر","load_more":"تحميل أكثر","most_popular_posts":"اﻻكثر شعبية اﻻن","newest_posts":"أحدث المشاركات.","highest_ranked_posts_ever":"اﻻفضل في كل اﻻوقات","the_profile_of":"الملف الشخصى ل","posts_awaiting_moderation":"مشاركات تنتظر المصادقة","future_scheduled_posts":"المشاركات المقرر مستقبﻻ.","users_dashboard":"لوحة قيادة الخاصة بالمستخدمين","telescope_settings_panel":"لوحة اﻻعدادات","various_utilities":"المرافق المختلفة."});
                                                                                                                   // 20
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/bg.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["bg"] = ["Bulgarian","Български"];                                                         // 8
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                    // 9
  TAPi18n.translations["bg"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                         // 13
  TAPi18n.translations["bg"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["bg"][namespace], {"menu":"Меню","view":"Преглед","top":"Топ","new":"Нови ","best":"Най-добри","digest":"Справочник","users":"Потребители","settings":"Настройки","admin":"Администратор","post":"Публикация","toolbox":"Toolbox","sign_up_sign_in":"Регистрирай се/Влезте","my_account":"Моят профил","view_profile":"Преглед на профил","edit_account":"Редактиране на профила","new_posts":"Нови Публикации","your_comment_has_been_deleted":"Вашият коментар беше изтрит.","comment_":"Коментар","delete_comment":"Изтриване на коментар","add_comment":"Добави коментар","upvote":"Харесвам","downvote":"Не харесвам","link":"връзка","edit":"редактирай","reply":"отговор","no_comments":"Няма коментари.","you_are_already_logged_in":"Вече сте влезли в системата","sorry_this_is_a_private_site_please_sign_up_first":"За съжаление, това е частен сайт. Моля, регистрирайте се първо.","thanks_for_signing_up":"Благодаря, че се регистрирахте!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Сайтът в момента е само с покани, но ние ще ви уведомим веднага щом  отвари.","sorry_you_dont_have_the_rights_to_view_this_page":"Съжаляваме, но нямате нужните правата, за да видите тази страница.","not_found":"Not Found!","were_sorry_whatever_you_were_looking_for_isnt_here":"За съжаление; Каквото и да търсите не е тук..","no_notifications":"Няма известия","1_notification":"1 известие","notifications":"известия","mark_all_as_read":"Отбележи всичко като прочетено","your_post_has_been_deleted":"Публикацията ви е изтритa.","the_top_5_posts_of_each_day":"В топ 5 публикации на всеки ден.","previous_day":"Предишен ден","next_day":"Следващ ден","sorry_no_posts_for_today":"За съжаление, няма публикации за днес","sorry_no_posts_for":"За съжаление, няма публикации за ","today":"Днес","yesterday":"Вчера","created":"Създаден","title":"Заглавие","suggest_title":"Предложи заглавие","url":"URL","short_url":"кратко URL","body":"тяло","category":"Категория","inactive_":"Неактивен?","sticky_":"Закачи?","submission_date":"Дата на подаване","submission_time":"Време на подаване","date":"Дата","submission":"Подаване","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Забележка: тази публикация все още е висяща, така че няма дата на подаване.","user":"Потребител","status_":"Статус","approved":"Одобрен","rejected":"Отхвърлен","delete_post":"Изтрий публикацията","thanks_your_post_is_awaiting_approval":"Благодаря,  публикацията ви чака одобрение.","sorry_couldnt_find_a_title":"За съжаление, не можах да намеря заглавие...","please_fill_in_an_url_first":"Моля попълни URL първо!","share":"Сподели","discuss":"Обсъждане","upvote_":"Upvote","sticky":"Закачи","status":"статус","votes":"гласували","basescore":"Основен резултат","score":"резултат","clicks":"Кликания","views":"Видяна","inactive":"неактивена","comment":"коментар","comments":"коментари","point":"точка","points":"точки","please_complete_your_profile_below_before_continuing":"Моля попълнете вашия профил по-долу, преди да продължите.","account":"Акаунт","username":"Потребителско име","display_name":"Прякор","email":"Емайл","bio":"Биография:","password":"Парола","change_password":"Променете парола?","old_password":"Стара парола","new_password":"Нова парола","email_notifications":"Емайл известия","comments_on_my_posts":"Коментари на мои публикации","replies_to_my_comments":"Отговори на мои коментари","forgot_password":"Забравена Парола?","profile_updated":"Профила е обновен","please_fill_in_your_email_below_to_finish_signing_up":"Моля попълнете емайл адреса си за да завършите регистрацията.","invite":"Покана","uninvite":"Отмяна на покана","make_admin":"Направи администратор","unadmin":"Премахване на администраторски права","delete_user":"Изтриване на потребител","are_you_sure_you_want_to_delete":"Сигурни ли сте, че искате да изтриете ","reset_password":"Нулиране на парола","password_reset_link_sent":"Линка за нулиране на паролата ви е изпратен!","name":"Име:","posts":"Публикации","comments_":"Коментари","karma":"Карма","is_invited":"Е поканен?","is_admin":"Е Администратор?","delete":"Изтриване","member_since":"Потребител от","edit_profile":"Промяна на профила","sign_in":"Влезте","sign_in_":"Влезте!","sign_up_":"Регистрирайте се!","dont_have_an_account":"Нямате Акаунт?","already_have_an_account":"Вече имате акаунт?","sign_up":"Регистрирай се","please_fill_in_all_fields":"Моля попълнете всички полета","invite_":"Покани ","left":" остава","invite_none_left":"Покана (none left)","all":"Всичко","invited":"Поканен?","uninvited":"Поканата е отхвърлена","filter_by":"Филтрирай по ","sort_by":"Сортирай по ","sorry_you_do_not_have_access_to_this_page":"Съжаляваме, нямате достъп до тази страница.","please_sign_in_first":"Моля, първо влезте в системата.","sorry_you_have_to_be_an_admin_to_view_this_page":"Съжаляваме, трябва да сте администратор за да видите тази страница.","sorry_you_dont_have_permissions_to_add_new_items":"Съжаляваме, нямате права за да добавяте нови елементи.","sorry_you_cannot_edit_this_post":"Съжаляваме, неможете да променяте тази публикация.","sorry_you_cannot_edit_this_comment":"Съжаляваме, неможете да променяте този коментар.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Трябва да сте влезнали в системата и да сте администратор за да добавяте нова категория.","you_need_to_login_or_be_invited_to_post_new_comments":"Трябва да сте влезнали в системата или да сте поканен за да публикувате нови коментари.","please_wait":"Моля изчакайте ","seconds_before_commenting_again":" секунди преди да коментирате отново","your_comment_is_empty":"Коментара ви е празен.","you_dont_have_permission_to_delete_this_comment":"Нямате права за да изтриете този коментар.","you_need_to_login_or_be_invited_to_post_new_stories":"Трябва да влезете в системата или да бъде поканен да публикувате нови истории.","please_fill_in_a_headline":"Моля въведете заглавие","this_link_has_already_been_posted":"Тази връзка вече е публикувана","sorry_you_cannot_submit_more_than":"Съжаляваме, неможете да предадете повече от ","posts_per_day":" публикации на ден","someone_replied_to_your_comment_on":"Някой отговори на коментара ви относно","has_replied_to_your_comment_on":" е отговорил на коментара ви за","read_more":"Прочетете повече","a_new_comment_on_your_post":"Нов коментар на ваша публикация","you_have_a_new_comment_by":"Имате нов коментар от ","on_your_post":" на ваша публикация","has_created_a_new_post":" е създадена нова публикация","your_account_has_been_approved":"Профилът ви е одобрен.","welcome_to":"Добре дошли в ","start_posting":"Започнете да публикувате.","please_fill_in_a_title":"Моля въведете заглавие","seconds_before_posting_again":" секунди преди да публикувате отново","upvoted":"Харесан","posted_date":"Дата на публикуване","posted_time":"Време на публикуване","profile":"Профил","sign_out":"Излизане","invitedcount":"Брой пъти поканен","invites":"Покани","actions":"Действия","invites_left":"Оставащи покани","id":"ID","github":"GitHub","site":"Сайт","upvoted_posts":"Харесвани публикации","downvoted_posts":"Нехаресвани публикации","mark_as_read":"Маркирай като прочетено","pending":"в очакване","loading":"Зареждане...","submit":"Предай","you_must_be_logged_in":"Трябва да сте влезнали в системата.","are_you_sure":"Сигурни ли сте?","please_log_in_first":"Моля първо влезте в системата","sign_in_sign_up_with_twitter":"Влезте/Регистрирайте се с Twitter","load_more":"Зареди повече","most_popular_posts":"Най-популярни публикации в момента.","newest_posts":"Най-нови публикации.","highest_ranked_posts_ever":"Топ публикации за всички времена.","the_profile_of":"Профилът на","posts_awaiting_moderation":"Публикации очакващи модерация.","future_scheduled_posts":"Планирани публикации.","users_dashboard":"Потребителски панел.","telescope_settings_panel":"Telescope настройки.","various_utilities":"Други услуги."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/de.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["de"] = ["German","Deutsch"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                    // 9
  TAPi18n.translations["de"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                         // 13
  TAPi18n.translations["de"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["de"][namespace], {"menu":"Menü","top":"Top","new":"Neu","digest":"Zusammenfassung","users":"Benutzer","settings":"Einstellungen","admin":"Admin?","post":"Link eintragen","toolbox":"Werkzeuge","sign_up_sign_in":"Registrieren/Anmelden","my_account":"Mein Konto","view_profile":"Profil anzeigen","edit_account":"Konto bearbeiten","new_posts":"Neue Links","your_comment_has_been_deleted":"Dein Kommentar wurde gelöscht.","comment_":"Kommentieren","delete_comment":"Kommentar löschen","add_comment":"Kommentar hinzufügen","upvote":"+1","downvote":"-1","link":"link","edit":"bearbeiten","reply":"antworten","no_comments":"Keine Kommentare.","you_are_already_logged_in":"Du bist bereits eingeloggt","sorry_this_is_a_private_site_please_sign_up_first":"Dies ist ein privates Angebot. Du musst dich erst registrieren.","thanks_for_signing_up":"Vielen Dank für Deine Registrierung!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Derzeit sind Neuregistrierungen nur mit einer Einladung möglich, aber wir werden dich wissen lassen, wenn wir unsere Registrierung wieder öffnen.","sorry_you_dont_have_the_rights_to_view_this_page":"Entschuldigung, Du hast leider keine Rechte diese Seite anzuzeigen.","not_found":"Nichts gefunden!","were_sorry_whatever_you_were_looking_for_isnt_here":"Es tut uns leid, wonach auch immer Du gesucht hast, hier ist es nicht.","no_notifications":"Keine Benachrichtigungen","1_notification":"1 Benachrichtigung","notifications":"Benachrichtigungen","mark_all_as_read":"Alle als gelesen markieren","your_post_has_been_deleted":"Dein Link wurde gelöscht.","created":"Erstellt","title":"Titel","suggest_title":"Titelvorschlag","url":"URL","short_url":"Kurz-URL","body":"Beschreibung","category":"Kategorie","inactive_":"Inaktiv?","sticky_":"Anheften?","submission_date":"Eintragsdatum","submission_time":"Eintragszeit","date":"Datum","submission":"Eintragung","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Hinweis: Dieser Beitrag wartet noch auf Freischaltung, daher gibt es noch kein Datum und keine Uhrzeit.","user":"Benutzer","status_":"Status","approved":"Genehmigt","rejected":"Abgelehnt","delete_post":"Link löschen","thanks_your_post_is_awaiting_approval":"Vielen Dank, Dein Beitrag wartet auf Freischaltung.","sorry_couldnt_find_a_title":"Du hast vergessen einen Titel anzugeben...","please_fill_in_an_url_first":"Du musst eine URL/einen Link angeben!","share":"Teilen","discuss":"Kommentare","upvote_":"Abstimmen","sticky":"Angeheftet","status":"status","votes":"Stimmen","basescore":"Punktebasis","score":"Punkte","clicks":"klicks","views":"views","inactive":"inaktiv","comment":"Kommentar","comments":"Kommentare","point":"Punkt","points":"Punkte","please_complete_your_profile_below_before_continuing":"Bitte füllen Dein Profil vollständig aus bevor du fortfährst.","account":"Konto","username":"Benutzername","display_name":"Angezeigter Name","email":"Email","bio":"Bio:","password":"Passwort","change_password":"Passwort ändern?","old_password":"Altes Passwort","new_password":"Neues Passwort","email_notifications":"Email-Benachrichtigung","comments_on_my_posts":"Kommentare zu meinen Links","replies_to_my_comments":"Antworten auf meine Kommentare","forgot_password":"Passwort vergessen?","profile_updated":"Profil aktualisiert","please_fill_in_your_email_below_to_finish_signing_up":"Bitte trage Deine Email-Adresse ein um die Registrierung abzuschließen.","invite":"Einladen","uninvite":"Ausladen","make_admin":"Zum Admin ernennen","unadmin":"Als Admin entfernen","delete_user":"Benutzer löschen","are_you_sure_you_want_to_delete":"Bist du Dir sicher, dass du folgendes löschen willst: ","reset_password":"Passwort zurücksetzen","password_reset_link_sent":"Ein Link zum zurücksetzen des Passworts wurde versendet!","name":"Name:","posts":"Links","comments_":"Kommentare","karma":"Karma","is_invited":"Wurde eingeladen?","is_admin":"Ist Admin?","delete":"Löschen","member_since":"Mitglied seit","edit_profile":"Profil bearbeiten","sign_in":"Einloggen","sign_in_":"Einloggen!","sign_up_":"Registrieren!","dont_have_an_account":"Du hast noch kein Konto?","already_have_an_account":"Du hast bereits ein Konto?","sign_up":"Registrieren","please_fill_in_all_fields":"Bitte fülle alle Felder aus","invite_":"Einladung(en) ","left":" übrig","invite_none_left":"Einladungen (keine übrig)","all":"Alle","invited":"Invited?","uninvited":"Nicht eingeladen","filter_by":"Filtern nach","sort_by":"Sortieren nach","sorry_you_do_not_have_access_to_this_page":"Sorry, Du hast keinen Zugang zu dieser Seite","please_sign_in_first":"Bitte melde Dich zuerst an.","sorry_you_have_to_be_an_admin_to_view_this_page":"Sorry, Du musst Admin sein um diese Seite anzeigen zu können.","sorry_you_dont_have_permissions_to_add_new_items":"Sorry, Du hast keine Berechtigung neue Einträge zu erstellen.","sorry_you_cannot_edit_this_post":"Sorry, Du kannst diesen Beitrag nicht bearbeiten.","sorry_you_cannot_edit_this_comment":"Sorry, Du kannst diesen Kommentar nicht bearbeiten.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Du musst Dich anmelden und ein Admin sein um eine neue Kategorien hinzuzufügen.","you_need_to_login_or_be_invited_to_post_new_comments":"Du musst dich einloggen oder eingeladen sein um neue Kommentare schreiben zu können.","please_wait":"Bitte warte ","seconds_before_commenting_again":" Sekunden, bevor du wieder kommentierst.","your_comment_is_empty":"Dein Kommentar ist leer.","you_dont_have_permission_to_delete_this_comment":"Du hast keine Berechtigung diesen Kommentar zu löschen.","you_need_to_login_or_be_invited_to_post_new_stories":"Du musst eingeloggt oder eingeladen sein um einen neuen Link zu posten.","please_fill_in_a_headline":"Bitte fülle den Titel aus","this_link_has_already_been_posted":"Dieser Link wurde bereits gepostet","sorry_you_cannot_submit_more_than":"Es tut uns leid, Du kannst nicht mehr als ","posts_per_day":" Links pro Tag eintragen","someone_replied_to_your_comment_on":"Jemand hat auf Deinen Kommentar geantwortet bei","has_replied_to_your_comment_on":" hat auf Deinen Kommentar geantwortet bei","read_more":"weiterlesen","a_new_comment_on_your_post":"Ein neuer Kommentar zu Deinem Link","you_have_a_new_comment_by":"Du hast einen neuen Kommentar von ","on_your_post":" bei Deinem Link","has_created_a_new_post":" hat einen neuen Link erstellt","your_account_has_been_approved":"Dein Konto wurde freigeschaltet.","welcome_to":"Willkommen bei ","start_posting":"Fang an Links einzutragen.","please_fill_in_a_title":"Please fill in a title","seconds_before_posting_again":" seconds before posting again","upvoted":"Upvoted","posted_date":"Posted Date","posted_time":"Posted Time","profile":"Profile","sign_out":"Sign Out","invitedcount":"InvitedCount","invites":"Invites","actions":"Actions","invites_left":"invites left","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Upvoted Posts","downvoted_posts":"Downvoted Posts","mark_as_read":"Mark as read","pending":"Wartet","loading":"lädt...","submit":"Abschicken","you_must_be_logged_in":"Du musst angemeldet sein.","are_you_sure":"Bist Du sicher?","please_log_in_first":"Bitte melde Dich zuerst an","sign_in_sign_up_with_twitter":"Anmelden/Registrieren mit Twitter","load_more":"Mehr Laden"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/el.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["el"] = ["Greek","Ελληνικά"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                    // 9
  TAPi18n.translations["el"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                         // 13
  TAPi18n.translations["el"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["el"][namespace], {"menu":"Μενού","view":"Προβολή","top":"Κορυφαία","new":"Νέα","best":"Καλύτερα","digest":"Περίληψη","users":"Χρήστες","settings":"Ρυθμίσεις","admin":"Διαχειριστής","post":"Δημοσίευση","toolbox":"Εργαλειοθήκη","sign_up_sign_in":"Εγγραφή/Σύνδεση","my_account":"Ο λογαριασμός μου","view_profile":"Προβολή προφίλ","edit_account":"Επεξεργασία λογαριασμού","new_posts":"Νέες δημοσιεύσεις","title":"Τίτλος","description":"Περιγραφή","siteUrl":"URL Ιστοσελίδας","tagline":"Ετικέτα","requireViewInvite":"Να απαιτείται πρόσκληση για προβολή","requirePostInvite":"Να απαιτείται πρόσκληση για δημοσίευση","requirePostsApproval":"Να απαιτείται έγκριση των δημοσιεύσεων","defaultEmail":"Προεπιλεγμένο Email","scoreUpdateInterval":"Χρόνος ανανέωσης Σκορ","defaultView":"Προεπιλεγμένη Προβολή","postInterval":"Χρόνος ανανέωσης δημοσίευσης","commentInterval":"Χρόνος ανανέωσης σχολίου","maxPostsPerDay":"Μέγιστες δημοσιεύσεις ανα ημέρα","startInvitesCount":"Invites Start Count","postsPerPage":"Δημοσιεύσεις ανα ημέρα","logoUrl":"URL Λογότυπου","logoHeight":"Υψος Λογότυπου","logoWidth":"Πλάτος Λογότυπου","language":"Γλώσσα","backgroundCSS":"Background CSS","buttonColor":"Χρώμα κουμπιού","buttonTextColor":"Χρώμα κειμένου κουμπιού","headerColor":"Χρώμα Επικεφαλίδας","headerTextColor":"Χρώμα κειμένου Επικεφαλίδας","twitterAccount":"Λογαριασμός Twitter","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer Code","extraCode":"Extra Code","emailFooter":"Email Footer","notes":"Σημειώσεις","debug":"Debug Mode","fontUrl":"Font URL","fontFamily":"Font Family","authMethods":"Authentication Methods","faviconUrl":"Favicon URL","mailURL":"MailURL","postsLayout":"Στύλ Δημοσιεύσεων","general":"Γενικά","invites":"Προσκλήσεις","email":"Email","scoring":"Σκορ","posts":"Δημοσιεύσεις","comments":"σχόλια","logo":"Λογότυπο","extras":"Extras","colors":"Χρώματα","integrations":"Προσθήκες","createdAt":"Δημιουργήθηκε στις","postedAt":"Δημοσιεύθηκε στις","url":"URL","body":"Κείμενο","htmlBody":"HTML κείμενο","viewCount":"Πλήθος προβολών","commentCount":"Πλήθος σχολίων","commenters":"Σχολιαστές","lastCommentedAt":"Τελευταίο σχόλιο στις","clickCount":"Πλήθος κλικ","baseScore":"Βασικό σκορ","upvotes":"Υπερψηφισμοί","upvoters":"Υπερψηφιστές","downvotes":"Καταψηφισμοί","downvoters":"Καταψηφιστές","score":"σκορ","status":"κατάσταση","sticky":"Προτεινόμενο","inactive":"ανενεργό","author":"Δημιουργός","userId":"Χρήστης","sorry_we_couldnt_find_any_posts":"Μας συγχωρείτε, δεν βρήκαμε καμιά δημοσίευση.","your_comment_has_been_deleted":"Το σχόλιο σας έχει διαγραφεί.","comment_":"Σχόλιο","delete_comment":"Διαγραφή σχολίου","add_comment":"Νέο σχόλιο","upvote":"Υπερ","downvote":"Κατά","link":"Σύνδεσμος","edit":"Επεξεργασία","reply":"Απάντηση","no_comments":"Κανένα σχόλιο.","you_are_already_logged_in":"Είστε ήδη συνδεδεμένος","sorry_this_is_a_private_site_please_sign_up_first":"Μας συγχωρείτε αλλα πρέπει να εγγραφείτε για να συνεχίσετε.","thanks_for_signing_up":"Ευχαριστούμε για την εγγραφή σας!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Δυστυχώς χρειάζεστε πρόσκληση για να εγγραφείτε. Θα σας ειδοποιήσουμε μόλις ανοίξουν πάλι οι εγγραφές.","sorry_you_dont_have_the_rights_to_view_this_page":"Δεν έχετε δικαίωμα να δείτε αυτήν την σελίδα.","sorry_you_do_not_have_the_rights_to_comments":"Δεν έχετε δικαίωμα να κάνετε σχόλιο.","not_found":"Δεν βρέθηκε!","were_sorry_whatever_you_were_looking_for_isnt_here":"Αυτό που ψάχνετε δεν είναι εδώ!","disallowed_property_detected":"Παράνομη παράμετρος!","no_notifications":"Καμία ειδοποίηση","1_notification":"1 ειδοποίηση","notifications":"ειδοποίησεις","mark_all_as_read":"Μάρκαρε τα όλα ότι τα διάβασες","your_post_has_been_deleted":"Η δημοσίευση σου έχει διαγραφεί.","created":"Δημιουργήθηκε","suggest_title":"Πρότεινε ενα τίτλο","short_url":"Short URL","category":"Κατηγορία","inactive_":"Ανενεργό?","sticky_":"Προτεινόμενο?","submission_date":"Ημερομηνία Υποβολής","submission_time":"Ώρα Υποβολής","date":"Ημερομηνία","submission":"Υποβολή","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note: this post is still pending so it has no submission timestamp yet.","user":"Χρήστης","status_":"Κατάσταση","approved":"Εγκρίθηκε","rejected":"Απορρίφθηκε","delete_post":"Διαγραφή δημοσίευσης","thanks_your_post_is_awaiting_approval":"Ευχαριστούμε, η δημοσίευση αναμένει εγκριση.","sorry_couldnt_find_a_title":"Συγγνώμη, ο τίτλος δεν βρέθηκε ","please_fill_in_an_url_first":"Παρακαλώ συμπληρώστε το URL πρώτα!","share":"Μοιράσου","discuss":"Συζύτησε","upvote_":"Μου αρέσει","votes":"Ψήφοι","basescore":"Βασικό Σκορ","clicks":"κλικ","views":"προβολές","comment":"σχόλιο","point":"πόντος","points":"πόντους","please_complete_your_profile_below_before_continuing":"Παρακαλώ συμπληρώστε το προφίλ σας πριν συνεχισετε.","account":"Λογαριασμός","username":"Ονομα χρήστη","display_name":"Παρατσούκλι","bio":"Βιογραφία:","twitter_username":"Ονομα χρήστη Twitter","github_username":"Ονομα χρήστη GitHub","site_url":"URL Ιστοσελίδας","password":"κωδικός","change_password":"Αλλαγή κωδικού?","old_password":"Παλιός κωδικός","new_password":"Νέος κωδικός","email_notifications":"Ειδοποιήσεις μέσω Email","new_users":"Νέοι Χρήστες","comments_on_my_posts":"Σχόλια στις δημοσιέυσεις μου","replies_to_my_comments":"Απαντήσεις στα σχόλια μου","forgot_password":"Ξέχασες τον κωδικό σου;","profile_updated":"Το προφίλ ενημερώθηκε","please_fill_in_your_email_below_to_finish_signing_up":"Παρακαλώ συμπλήρωσε το email για να ολοκληρώσεις την εγγραφή σου.","invite":"Προσκληση","uninvite":"Διαγραφή πρόσκλησης","make_admin":"Δικαίωμα διαχειριστή","unadmin":"Διαγραφή δικαίωματος διαχειριστή","delete_user":"Διαγραφή χρήστη","are_you_sure_you_want_to_delete":"Είσαι σίγουρος για την διαγραφή","reset_password":"Επαναφορά κωδικού","password_reset_link_sent":"Στείλαμε σύνδεσμο επαναφοράς κωδικου στο email!","name":"Όνομα:","comments_":"Σχόλια","karma":"Karma","is_invited":"Έχει προσκληση?","is_admin":"Είναι διαχειριστής?","delete":"Διαγραφή","member_since":"Μέλος από","edit_profile":"Επεξεργασία Προφίλ","sign_in":"Σύνδεση","sign_in_":"Σύνδεση!","sign_up_":"Εγγραφή!","dont_have_an_account":"Δεν έχεις λογαριασμό;","already_have_an_account":"Έχεις ήδη λογαριασμό;","sign_up":"Εγγραφλη","please_fill_in_all_fields":"Παρακαλώ συμπληρώστε τα πεδία","invite_":"Πρόσκληση ","left":" αριστερά","invite_none_left":"Πρόσκληση (κανένας αριστερά)","all":"Όλους","invited":"Προσκεκλημενος?","uninvited":"Αυτούς που ΔΕΝ έχουν πρόσκληση","filter_by":"Δείξε ","sort_by":"Ταξινόμηση","sorry_you_do_not_have_access_to_this_page":"Συγγνώμη, δεν έχετε πρόσβαση σε αυτήν τη σελίδα","please_sign_in_first":"Πρέπει να συνδεθείς πρώτα.","sorry_you_have_to_be_an_admin_to_view_this_page":"Συγγνώμη, πρέπει να είσαι διαχειριστής για να δείς αυτήν τη σελίδα.","sorry_you_dont_have_permissions_to_add_new_items":"Συγγνώμη, Συγγνώμη, δεν έχετε δικαίωμα να προσθέσετε νέα στοιχεία.","sorry_you_cannot_edit_this_post":"Συγγνώμη, δεν μπορείς να επεξεργαστείς αυτήν την δημοσίευση.","sorry_you_cannot_edit_this_comment":"Συγγνώμη, δεν μπορείς να επεξεργαστείς συτό το σχόλιο.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Πρέπει να συνδεθείς για να προσθέσεις νέα κατηγορία.","you_need_to_login_or_be_invited_to_post_new_comments":"Πρέπει να συνδεθείς ή να έχεις πρόσκληση για να κάνεις σχόλια.","please_wait":"Παρακαλώ περιμένετε ","seconds_before_commenting_again":" δευτερόλεπτα πριν μπορείτε να ξανα σχολιάσετε.","your_comment_is_empty":"Το σχόλιό σας είναι άδειο.","you_dont_have_permission_to_delete_this_comment":"Συγγνώμη, Συγγνώμη, δεν έχετε δικαίωμα να διαγράψετε αυτό το σχόλιο.","you_need_to_login_or_be_invited_to_post_new_stories":"Πρέπει να συνδεθείς ή να έχεις πρόσκληση για να δημοσιέυσεις.","please_fill_in_a_headline":"Παρακαλώ συμπληρώστε την επικεφαλίδα","this_link_has_already_been_posted":"Αυτός ο σύνδεσμος υπάρχει ήδη","sorry_you_cannot_submit_more_than":"Δεν μπορείς να υποβάλεις περισσότερα από ","posts_per_day":" σχόλια την ημέρα","someone_replied_to_your_comment_on":"Κάποιος απάντησε στο σχόλιό σου","has_replied_to_your_comment_on":" απάντησε στο σχόλιό σου","read_more":"Διάβασε περισσότερα","a_new_comment_on_your_post":"Νέο σχόλιο στη δημοσίευση σου","you_have_a_new_comment_by":"Νέο σχόλιο από","on_your_post":" στη δημοσίευση σου","has_created_a_new_post":" έκανε μια νέα δημοσίευση","your_account_has_been_approved":"Ο λογαριασμό σου έχει εγκριθεί.","welcome_to":"Καλωσορίσατε στο ","start_posting":"Ξεκινήστε να δημοσιεύετε.","please_fill_in_a_title":"Παρακαλώ συμπληρώστε τον τίτλο","seconds_before_posting_again":" δευτερόλεπτα πριν ξανα δημοσιεύσετε","upvoted":"Υπερψηφισμένο","posted_date":"Ημερομηνία δημοσίευσης","posted_time":"Ωρα δημοσίευσης","profile":"Προφίλ","sign_out":"Αποσύνδεση","you_ve_been_signed_out":"Εχετε αποσυνδεθεί!","invitedcount":"Πλήθος προσκλήσεων","actions":"Ενέργειες","invites_left":"Προσκλήσεις που απομενουν","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Δημοσιεύσεις που μου αρέσουν","downvoted_posts":"Δημοσιεύσεις που ΔΕΝ μου αρέσουν","mark_as_read":"To διάβασα","pending":"Εκκρεμούν","loading":"Περιμένετε...","submit":"Υποβολή","you_must_be_logged_in":"Πρέπει να συνδεθείτε.","are_you_sure":"Είστε σίγουρος?","please_log_in_first":"Πρέπει να συνδεθείτε πρώτα.","please_log_in_to_comment":"Πρέπει να συνδεθείτε για να κάνετε σχόλιο.","sign_in_sign_up_with_twitter":"Εγγραφείτε με το Twitter σας","load_more":"Περισσότερα","most_popular_posts":"Οι πιο δημοφιλής δημοσιεύσεις.","newest_posts":"Οι πιο καινούριες δημοσιεύσεις.","highest_ranked_posts_ever":"Οι πιο υπερψηφισμένες δημοσιεύσεις.","the_profile_of":"Το προφίλ του","posts_awaiting_moderation":"Δημοσιεύσεις που αναμένουν έγγριση.","future_scheduled_posts":"Μελλοντικές δημοσιεύσεις.","users_dashboard":"Πίνακας Χρηστών.","telescope_settings_panel":"Γενικές Ρυθμίσεις.","various_utilities":"Διάφορα εργαλεία."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/en.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
// integrate the fallback language translations                                                                    // 8
translations = {};                                                                                                 // 9
translations[namespace] = {"menu":"Menu","view":"View","top":"Top","new":"New","best":"Best","digest":"Digest","scheduled":"Scheduled","users":"Users","settings":"Settings","admin":"Admin","post":"Post","toolbox":"Toolbox","sign_up_sign_in":"Register/Sign In","my_account":"My Account","view_profile":"View Profile","edit_account":"Edit Account","view_your_profile":"View your profile","edit_your_profile":"Edit your profile","new_posts":"New Posts","title":"Title","description":"Description","siteUrl":"Site URL","tagline":"Tagline","requireViewInvite":"Require Invite to View","requirePostInvite":"Require Invite to Post","requirePostsApproval":"Require Posts to be Approved","defaultEmail":"Default Email","scoreUpdateInterval":"Score Update Interval","defaultView":"Default View","postInterval":"Post Interval","commentInterval":"Comment Interval","maxPostsPerDay":"Max Posts Per Day","startInvitesCount":"Invites Start Count","postsPerPage":"Posts Per Page","logoUrl":"Logo URL","logoHeight":"Logo Height","logoWidth":"Logo Width","language":"Language","backgroundCSS":"Background CSS","buttonColor":"Button Color","buttonTextColor":"Button Text Color","headerColor":"Header Color","headerTextColor":"Header Text Color","twitterAccount":"Twitter Account","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer Code","extraCode":"Extra Code","emailFooter":"Email Footer","notes":"Notes","debug":"Debug Mode","fontUrl":"Font URL","fontFamily":"Font Family","authMethods":"Authentication Methods","faviconUrl":"Favicon URL","mailURL":"MailURL","postsLayout":"Posts Layout","siteImage":"Site Image","general":"General","invites":"Invites","email":"Email","scoring":"Scoring","posts":"Posts","comments":"comments","logo":"Logo","extras":"Extras","colors":"Colors","integrations":"Integrations","accentColor":"Accent Color","accentContrastColor":"Accent Contrast Color","secondaryColor":"Secondary Color","secondaryContrastColor":"Secondary Contrast Color","postViews":"Post Views","navLayout":"Navigation Layout","mailUrl":"Mail URL","createdAt":"Created At","postedAt":"Posted At","url":"URL","body":"Body","htmlBody":"HTML Body","viewCount":"View Count","commentCount":"Comment Count","commenters":"Commenters","lastCommentedAt":"Last Commented At","clickCount":"Click Count","baseScore":"Base Score","upvotes":"Upvotes","upvoters":"Upvoters","downvotes":"Downvotes","downvoters":"Downvoters","score":"score","status":"status","sticky":"Sticky","inactive":"inactive","author":"Author","userId":"User","sorry_we_couldnt_find_any_posts":"Sorry, we couldn't find any posts.","your_comment_has_been_deleted":"Your comment has been deleted.","comment_":"Comment","delete_comment":"Delete Comment","add_comment":"Add Comment","upvote":"upvote","downvote":"downvote","link":"link","edit":"Edit","reply":"Reply","no_comments":"No comments.","please_sign_in_to_reply":"Please sign in to reply","you_are_already_logged_in":"You are already logged in","sorry_this_is_a_private_site_please_sign_up_first":"Sorry, this is a private site. Please register first.","thanks_for_signing_up":"Thanks for registering!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"The site is currently invite-only, but we will let you know as soon as a spot opens up.","sorry_you_dont_have_the_rights_to_view_this_page":"Sorry, you don't have the rights to view this page.","sorry_you_do_not_have_the_rights_to_comments":"Sorry, you do not have the rights to leave comments at this time.","not_found":"Not Found!","were_sorry_whatever_you_were_looking_for_isnt_here":"We're sorry; whatever you were looking for isn't here..","disallowed_property_detected":"Disallowed property detected","no_notifications":"No notifications","1_notification":"1 notification","notifications":"notifications","mark_all_as_read":"Mark all as read","your_post_has_been_deleted":"Your post has been deleted.","created":"Created","suggest_title":"Suggest title","short_url":"Short URL","category":"Category","inactive_":"Inactive?","sticky_":"Sticky?","submission_date":"Submission Date","submission_time":"Submission Time","date":"Date","submission":"Submission","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note: this post is still pending so it has no submission timestamp yet.","user":"User","status_":"Status","approved":"Approved","rejected":"Rejected","delete_post":"Delete Post","thanks_your_post_is_awaiting_approval":"Thanks, your post is awaiting approval.","sorry_couldnt_find_a_title":"Sorry, couldn't find a title...","please_fill_in_an_url_first":"Please fill in an URL first!","share":"Share","discuss":"Discuss","upvote_":"Upvote","votes":"votes","basescore":"baseScore","clicks":"clicks","views":"views","comment":"comment","point":"point","points":"points","please_complete_your_profile_below_before_continuing":"Please complete your profile below before continuing.","account":"Account","username":"Username","display_name":"Display Name","bio":"Bio","city":"City","twitter_username":"Twitter Username","github_username":"GitHub Username","site_url":"Site URL","password":"Password","change_password":"Change Password?","old_password":"Old Password","new_password":"New Password","email_notifications":"Email Notifications","new_users":"New users","comments_on_my_posts":"Comments on my posts","replies_to_my_comments":"Replies to my comments","forgot_password":"Forgot password?","profile_updated":"Profile updated","please_fill_in_your_email_below_to_finish_signing_up":"Please fill in your email below to finish the registration.","invite":"Invite","uninvite":"Uninvite","make_admin":"Make admin","unadmin":"Unadmin","delete_user":"Delete User","are_you_sure_you_want_to_delete":"Are you sure you want to delete ","reset_password":"Reset Password","password_reset_link_sent":"Password reset link sent!","name":"Name:","comments_":"Comments","karma":"Karma","is_invited":"Is Invited?","is_admin":"Is Admin?","delete":"Delete","member_since":"Member since","edit_profile":"Edit profile","sign_in":"Sign In","sign_in_":"Sign in!","sign_up_":"Register!","dont_have_an_account":"Don't have an account?","already_have_an_account":"Already have an account?","sign_up":"Register","please_fill_in_all_fields":"Please fill in all fields","invite_":"Invite ","left":" left","invite_none_left":"Invite (none left)","all":"All","invited":"Invited?","uninvited":"Uninvited","filter_by":"Filter by","sort_by":"Sort by","sorry_you_do_not_have_access_to_this_page":"Sorry, you do not have access to this page","please_sign_in_first":"Please Sign In First.","sorry_you_have_to_be_an_admin_to_view_this_page":"Sorry, you  have to be an admin to view this page.","sorry_you_dont_have_permissions_to_add_new_items":"Sorry, you don't have permissions to add new items.","sorry_you_cannot_edit_this_post":"Sorry, you cannot edit this post.","sorry_you_cannot_edit_this_comment":"Sorry, you cannot edit this comment.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"You need to login and be an admin to add a new category.","you_need_to_login_or_be_invited_to_post_new_comments":"You need to login or be invited to post new comments.","please_wait":"Please wait ","seconds_before_commenting_again":" seconds before commenting again","your_comment_is_empty":"Your comment is empty.","you_dont_have_permission_to_delete_this_comment":"You don't have permission to delete this comment.","you_need_to_login_or_be_invited_to_post_new_stories":"You need to login or be invited to post new stories.","please_fill_in_a_headline":"Please fill in a headline","this_link_has_already_been_posted":"This link has already been posted","sorry_you_cannot_submit_more_than":"Sorry, you cannot submit more than ","posts_per_day":" posts per day","someone_replied_to_your_comment_on":"Someone replied to your comment on","has_replied_to_your_comment_on":" has replied to your comment on","read_more":"Read more","a_new_comment_on_your_post":"A new comment on your post","you_have_a_new_comment_by":"You have a new comment by ","on_your_post":" on your post","has_created_a_new_post":" has created a new post","your_account_has_been_approved":"Your account has been approved.","welcome_to":"Welcome to ","start_posting":"Start posting.","please_fill_in_a_title":"Please fill in a title","seconds_before_posting_again":" seconds before posting again","upvoted":"Upvoted","posted_date":"Posted Date","posted_time":"Posted Time","profile":"Profile","sign_out":"Sign Out","you_ve_been_signed_out":"You've been signed out. Come back soon!","invitedcount":"InvitedCount","actions":"Actions","invites_left":"invites left","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Upvoted Posts","downvoted_posts":"Downvoted Posts","mark_as_read":"Mark as read","pending":"Pending","loading":"Loading...","submit":"Submit","you_must_be_logged_in":"You must be logged in.","are_you_sure":"Are you sure?","please_log_in_first":"Please log in first.","please_log_in_to_comment":"Please log in to comment.","sign_in_sign_up_with_twitter":"Register/Sign Up with Twitter","load_more":"Load More","most_popular_posts":"The most popular posts right now.","newest_posts":"The newest posts.","highest_ranked_posts_ever":"The all-time highest-ranked posts.","the_profile_of":"The profile of","posts_awaiting_moderation":"Posts awaiting moderation.","future_scheduled_posts":"Future scheduled posts.","users_dashboard":"Users dashboard.","telescope_settings_panel":"Telescope settings panel.","various_utilities":"Various utilities."};
TAPi18n._loadLangFileObject("en", translations);                                                                   // 11
                                                                                                                   // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/es.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["es"] = ["Spanish (Spain)","Español"];                                                     // 8
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                    // 9
  TAPi18n.translations["es"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                         // 13
  TAPi18n.translations["es"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["es"][namespace], {"view":"Explorar","menu":"Menú","top":"Top","new":"Nuevos","digest":"Resumen","users":"Usuarios","settings":"Configuración","admin":"¿Administrador?","post":"Post","toolbox":"Herramientas","sign_up_sign_in":"Registrarse/Iniciar sesión","my_account":"Mi Cuenta","view_profile":"Ver perfil","edit_account":"Editar cuenta","new_posts":"Nuevo Post","your_comment_has_been_deleted":"Tu comentario ha sido borrado","comment_":"Comentario","delete_comment":"Borrar comentario","add_comment":"Añadir comentario","upvote":"Voto Positivo","downvote":"Voto Negativo","link":"link","edit":"Editar","reply":"Contestar","no_comments":"No hay comentarios.","you_are_already_logged_in":"Ya estás conectado","sorry_this_is_a_private_site_please_sign_up_first":"Lo sentimos pero esta pagina es privada. Por favor, conéctese para verla","thanks_for_signing_up":"Gracias por registrarte","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"El sitio solo es accesible mediante invitación, pero te haremos saber pronto cuando este disponible para el público.","sorry_you_dont_have_the_rights_to_view_this_page":"Lo sentimos pero no tienes los permisos suficientes para ver esta pagina","not_found":"¡No encontramos nada!","were_sorry_whatever_you_were_looking_for_isnt_here":"Lo sentimos pero aqui no hay nada... ","no_notifications":"Ninguna notificación","1_notification":"1 notificación","notifications":"notificaciones","mark_all_as_read":"Marcar todas como leídas","your_post_has_been_deleted":"Tu post ha sido borrado.","created":"Creado","title":"Título","suggest_title":"Proponer un titulo","url":"URL","short_url":"URL Corta","body":"Descripción","category":"Categoría","inactive_":"Inactivo","sticky_":"Destacar","submission_date":"Fecha de entrega","submission_time":"Hora de entrega","date":"Fecha","submission":"Entrega","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota : Este post esta en proceso de validación entonces no tiene fecha de entrega todavía.","user":"Usuario","status_":"Estado","approved":"Aprobado","rejected":"Rechazado","delete_post":"Borrar este post","thanks_your_post_is_awaiting_approval":"Gracias, su post esta esperando aprobación.","sorry_couldnt_find_a_title":"Lo sentimos, imposible de encontrar este título.","please_fill_in_an_url_first":"Tienes que introducir una URL.","share":"Compartir","discuss":"Comentar","upvote_":"Votar","sticky":"Destacado","status":"Estado","votes":"votos","basescore":"baseScore","score":"puntuación","clicks":"clicks","views":"views","inactive":"inactivo","comment":"comentario","comments":"comentarios","point":"punto","points":"puntos","please_complete_your_profile_below_before_continuing":"Por favor complete su perfil antes de seguir.","account":"Cuenta","username":"Nombre de usuario","display_name":"Nombre","email":"Email","bio":"Biografía:","password":"Contraseña","change_password":"Cambiar de contraseña","old_password":"Antigua Contraseña","new_password":"Nueva Contraseña","email_notifications":"Notificaciónes por Email","comments_on_my_posts":"Comentarios de mi post","replies_to_my_comments":"Respuestas a mis comentarios","forgot_password":"Olvidaste tu contraseña?","profile_updated":"Perfil actualizado","please_fill_in_your_email_below_to_finish_signing_up":"Por favor, introduzca su email para terminar de registrarse.","invite":"Invitar","uninvite":"Cancelar la invitación","make_admin":"Hacer admin","unadmin":"Borrar de admin","delete_user":"Borrar usuario","are_you_sure_you_want_to_delete":"¿Está seguro de que desea eliminar?","reset_password":"Restablecer contraseña","password_reset_link_sent":"Enlace de restablecimiento de contraseña enviado a su email.","name":"Nombre:","posts":"Posts","comments_":"Comentarios","karma":"Karma","is_invited":"¿Esta invitado?","is_admin":"¿Es admin?","delete":"Borrar","member_since":"Miembro desde","edit_profile":"Modificar el perfil","sign_in":"Registrarse","sign_in_":"Registrarse","sign_up_":"Inscribirse","dont_have_an_account":"¿No tiene cuenta de usuario?","already_have_an_account":"¿Ya tiene cuenta?","sign_up":"Inscribirse","please_fill_in_all_fields":"Tiene que rellenar todos los campos","invite_":"Invitación ","left":" restante","invite_none_left":"Invitación (no queda)","all":"Todos","invited":"¿Invitado?","uninvited":"No invitado","filter_by":"Filtrar por","sort_by":"Ordenar por","sorry_you_do_not_have_access_to_this_page":"Lo sentimos, no tienes acceso a esta página","please_sign_in_first":"Tienes que registrarte primero.","sorry_you_have_to_be_an_admin_to_view_this_page":"Lo sentimos, tienes que ser un administrador para ver esta página.","sorry_you_dont_have_permissions_to_add_new_items":"Lo sentimos, no tiene permisos para agregar nuevos elementos.","sorry_you_cannot_edit_this_post":"Lo sentimos, no puede editar este post.","sorry_you_cannot_edit_this_comment":"Lo sentimos, no puede editar este comentario.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Usted tiene que entrar y ser un administrador para añadir una nueva categoría","you_need_to_login_or_be_invited_to_post_new_comments":"¡Tienes que iniciar sesión o ser invitado a publicar nuevos comentarios.","please_wait":"Espera por favor","seconds_before_commenting_again":" segundos antes de comentar de nuevo","your_comment_is_empty":"Tu comentario está vacío","you_dont_have_permission_to_delete_this_comment":"Usted no tiene permiso para eliminar este comentario.","you_need_to_login_or_be_invited_to_post_new_stories":"¡Tienes que iniciar sesión o ser invitado para publicar nuevas historias.","please_fill_in_a_headline":"Por favor rellene el titulo","this_link_has_already_been_posted":"Este enlace ya ha sido publicado","sorry_you_cannot_submit_more_than":"Lo sentimos, usted no puede presentar más de ","posts_per_day":" posts por dia","someone_replied_to_your_comment_on":"Alguien respondió a tu comentario en","has_replied_to_your_comment_on":" ha respondido a su comentario sobre","read_more":"Leer más","a_new_comment_on_your_post":"Un nuevo comentario en su post","you_have_a_new_comment_by":"Usted tiene un nuevo comentario de ","on_your_post":" en su post","has_created_a_new_post":" ha creado un nuevo post","your_account_has_been_approved":"Su cuenta ha sido aprobada.","start_posting":"Empezar a publicar","please_fill_in_a_title":"Por favor, agrega un título","seconds_before_posting_again":"segundos antes de postear de nuevo","upvoted":"Voto a favor","posted_date":"Fecha de publicación","posted_time":"Tiempo de publicación","profile":"Perfil","sign_out":"Cerrar sesión","invitedcount":"Total de invitados","invites":"Invitaciones","actions":"Acciones","invites_left":"Invitaciones pendientes","id":"ID","github":"GitHub","site":"Sitio","upvoted_posts":"Posts votados a favor","downvoted_posts":"Posts votados en contra","mark_as_read":"Marcar como leído","pending":"Pendiente","loading":"Cargando...","submit":"Enviar","you_must_be_logged_in":"Debes estar conectado","are_you_sure":"¿Estás seguro? ","please_log_in_first":"Por favor, inicia sesión","sign_in_sign_up_with_twitter":"Regístrate/Inicia sesión con Twitter","load_more":"Mostrar más"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/fr.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["fr"] = ["French (France)","Français"];                                                    // 8
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                    // 9
  TAPi18n.translations["fr"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                         // 13
  TAPi18n.translations["fr"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["fr"][namespace], {"menu":"Menu","view":"Classement","top":"Populaire","new":"Nouveau","best":"Meilleur","digest":"Résumé","scheduled":"Planifié","users":"Utilisateurs","settings":"Paramètres","admin":"Admin","post":"Poster","toolbox":"Outils","sign_up_sign_in":"Connexion/Créer un compte","my_account":"Mon compte","view_profile":"Voir le profil","edit_account":"Modifier le compte","view_your_profile":"Voir votre profil","edit_your_profile":"Editer votre profil","new_posts":"Nouveau post","title":"Titre","siteUrl":"URL du site","tagline":"Slogan","requireViewInvite":"Consultation restreinte","requirePostInvite":"Participation restreinte","requirePostsApproval":"Modération obligatoire","defaultEmail":"Email par défaut","scoreUpdateInterval":"Mise à jour du score","defaultView":"Vue par défaut","postInterval":"Interval des posts","commentInterval":"Interval des commentaires","maxPostsPerDay":"Max posts par jour","startInvitesCount":"Invitations de départ","postsPerPage":"Posts par page","logoUrl":"URL du logo","logoHeight":"Hauteur du logo","logoWidth":"Largeur du logo","language":"Langue","backgroundCSS":"CSS de fond","buttonColor":"Couleur des boutons","buttonTextColor":"Couleur du texte des boutons","headerColor":"Couleur de l'entête","headerTextColor":"Couleur du texte de l'entête","twitterAccount":"Compte Twitter","googleAnalyticsId":"ID Google Analytics","mixpanelId":"ID Mixpanel","clickyId":"ID Clicky","footerCode":"Code du pied de page","extraCode":"Code en plus","emailFooter":"Pied de page des mails","notes":"Notes","debug":"Mode Debug","fontUrl":"URL de font","fontFamily":"Famille de font","authMethods":"Méthode d'authentification","faviconUrl":"URL de la favicon","postsLayout":"Layout des posts","siteImage":"Image du site","general":"Général","invites":"Invitations","email":"Adresse mail","scoring":"Score","posts":"Posts","comments":"commentaires","logo":"Logo","extras":"Extras","colors":"Couleurs","integrations":"Intégrations","accentColor":"Couleur des accents","accentContrastColor":"Couleur du contraste des accents","secondaryColor":"Couleur secondaire","secondaryContrastColor":"Couleur de contraste secondaire","postViews":"Nombre de vue","navLayout":"Layout de navigation ","mailUrl":"Mail URL","createdAt":"Créé le","postedAt":"Posté le","url":"URL","body":"Description","htmlBody":"Texte HTML","viewCount":"vues","commentCount":"commentaires","commenters":"commentateurs","lastCommentedAt":"Dernier commentaire le","clickCount":"Clics","baseScore":"Score de base","upvotes":"Upvotes","upvoters":"Upvoteurs","downvotes":"Downvotes","downvoters":"Downvoteurs","score":"score","status":"statut","sticky":"Epinglé","inactive":"inactif","author":"Auteur","userId":"Utilisateur","sorry_we_couldnt_find_any_posts":"Aucun post n'a été trouvé","your_comment_has_been_deleted":"Votre commentaire a été supprimé.","comment_":"Commentaire","delete_comment":"Supprimer le commentaire","add_comment":"Ajouter un commentaire","upvote":"upvote","downvote":"downvote","link":"lien","edit":"Modifier","reply":"Répondre","no_comments":"Aucun commentaire.","please_sign_in_to_reply":"Connectez vous pour répondre","you_are_already_logged_in":"Vous êtes déjà connecté","sorry_this_is_a_private_site_please_sign_up_first":"Désolé mais ce site est privé, vous devez d'abord vous connecter","thanks_for_signing_up":"Merci pour votre inscription !","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"L'accès au site se fait uniquement par invitation. Nous vous informerons dès qu'une place se libère.","sorry_you_dont_have_the_rights_to_view_this_page":"Désolé, vous n'avez pas le droit de voir cette page.","sorry_you_do_not_have_the_rights_to_comments":"Désolé, vous n'avez pas le droit de commenter","not_found":"Oups ! La page est introuvable.","were_sorry_whatever_you_were_looking_for_isnt_here":"Désolé, mais ce que vous cherchiez ne se trouve pas là...","disallowed_property_detected":"Opération interdite","no_notifications":"Aucune notification","1_notification":"1 notification","notifications":"notifications","mark_all_as_read":"Tout marquer comme lu","your_post_has_been_deleted":"Votre post a été supprimé.","created":"Crée","suggest_title":"Suggérer un titre","short_url":"URL Courte","category":"Catégorie","inactive_":"Inactif ? ","sticky_":"Epinglé ? ","submission_date":"Date de soumission","submission_time":"Heure de soumission","date":"Date","submission":"Soumission","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note : ce post est en cours de validation, il n'a pas encore de timestamp.","user":"Utilisateur","status_":"Statut ","approved":"Approuvé","rejected":"Rejeté","delete_post":"Supprimer le post","thanks_your_post_is_awaiting_approval":"Merci, votre post est en cours de validation","sorry_couldnt_find_a_title":"Désolé, impossible de trouver un titre...","please_fill_in_an_url_first":"Vous devez saisir une URL.","share":"Partager","discuss":"Discuter","upvote_":"Voter","votes":"votes","basescore":"Score de base","clicks":"clics","views":"vues","comment":"commentaire","point":"point","points":"points","please_complete_your_profile_below_before_continuing":"Merci de compléter votre profil avant de continuer.","account":"Compte","username":"Nom d'utilisateur","display_name":"Nom réel","bio":"Bio:","twitter_username":"Pseudo sur Twitter","github_username":"Pseudo sur GitHub","site_url":"Url du site","password":"Mot de passe","change_password":"Changer le mot de passe","old_password":"Ancien mot de passe","new_password":"Nouveau mot de passe","email_notifications":"Notifications par mail","new_users":"Nouvel utilisateur","comments_on_my_posts":"Commentaires sur mes posts","replies_to_my_comments":"Reponses à mes commentaires","forgot_password":"Mot de passe oublié ?","profile_updated":"Profil mis à jour","please_fill_in_your_email_below_to_finish_signing_up":"Merci de saisir votre email pour finir la création de votre compte","invite":"Inviter","uninvite":"Annuler l'invitation","make_admin":"Rendre admin","unadmin":"Supprimer les droits d'admin","delete_user":"Supprimer l'utilisateur","are_you_sure_you_want_to_delete":"Etes-vous sur de vouloir supprimer ?","reset_password":"Redéfinir le mot de passe","password_reset_link_sent":"Un lien pour redéfinir votre mot de passe a été envoyé !","name":"Nom:","comments_":"Commentaires","karma":"Karma","is_invited":"Est-il invité ?","is_admin":"Est-il Administrateur ?","delete":"Supprimer","member_since":"Membre depuis","edit_profile":"Modifier le profil","sign_in":"Connexion","sign_in_":"Connexion","sign_up_":"Créer un compte.","dont_have_an_account":"Pas de compte ?","already_have_an_account":"Déjà un compte ?","sign_up":"Créer un compte","please_fill_in_all_fields":"Vous devez remplir tous les champs.","invite_":"Invitation ","left":" restante","invite_none_left":"Invitation (aucune restante)","all":"Tout(e)s","invited":"Invité(e) ?","uninvited":"Pas invité(e)","filter_by":"Filtrer par","sort_by":"Trier par","sorry_you_do_not_have_access_to_this_page":"Désolé, vous n'avez pas accès à cette page","please_sign_in_first":"Vous devez d'abord vous connecter.","sorry_you_have_to_be_an_admin_to_view_this_page":"Désolé, vous devez être administrateur pour voir cette page.","sorry_you_dont_have_permissions_to_add_new_items":"Désolé, vous n'avez pas la permission d'ajouter de nouveaux posts.","sorry_you_cannot_edit_this_post":"Désolé, vous ne pouvez pas modifier ce post.","sorry_you_cannot_edit_this_comment":"Désolé, vous ne pouvez pas modifier ce commentaire.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Vous devez être administrateur et connecté pour ajouter une catégorie","you_need_to_login_or_be_invited_to_post_new_comments":"Vous devez être connecté et invité pour poster des commentaires","please_wait":"Merci de patienter ","seconds_before_commenting_again":" secondes avant de poster un nouveau commentaire","your_comment_is_empty":"Votre commentaire est vide","you_dont_have_permission_to_delete_this_comment":"Vous n'avez pas la permission de supprimer ce commentaire","you_need_to_login_or_be_invited_to_post_new_stories":"Vous devez être connecté ou invité pour créer un nouveau post","please_fill_in_a_headline":"Merci de saisir un titre","this_link_has_already_been_posted":"Ce lien a déjà été posté","sorry_you_cannot_submit_more_than":"Désolé, vous ne pouvez pas créer plus de ","posts_per_day":" posts par jour","someone_replied_to_your_comment_on":"Quelqu'un à répondu à votre commentaire sur","has_replied_to_your_comment_on":" a répondu à votre commentaire sur","read_more":"Lire la suite.","a_new_comment_on_your_post":"Un nouveau commentaire sur votre post","you_have_a_new_comment_by":"Vous avez un nouveau commentaire de ","on_your_post":" sur votre post","has_created_a_new_post":" a créer un nouveau post","your_account_has_been_approved":"Votre compte a été validé.","welcome_to":"Bienvenu sur ","start_posting":"Commencer à poster.","please_fill_in_a_title":"Please fill in a title","seconds_before_posting_again":" seconds before posting again","upvoted":"Upvoted","posted_date":"Posted Date","posted_time":"Posted Time","profile":"Profile","sign_out":"Sign Out","you_ve_been_signed_out":"Vous avez été déconnecté","invitedcount":"InvitedCount","actions":"Actions","invites_left":"Invitations restantes","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Posts upvotés","downvoted_posts":"Posts downvotés","mark_as_read":"Marquer comme lu","pending":"En attente","loading":"Chargement...","submit":"Envoyer","you_must_be_logged_in":"Vous devez être connecté.","are_you_sure":"Etes-vous sur ?","please_log_in_first":"Connectez vous d'abord.","please_log_in_to_comment":"Connectez vous pour commenter.","sign_in_sign_up_with_twitter":"Connexion/Créer un compte avec Twitter","load_more":"En voir plus","most_popular_posts":"Posts les plus populaire.","newest_posts":"Posts les plus récents","highest_ranked_posts_ever":"Posts les plus populaire de tous les temps.","the_profile_of":"Le profil de","posts_awaiting_moderation":"Posts en attente de moderation.","future_scheduled_posts":"Posts planifiés.","users_dashboard":"Tableau de bord utilisateur.","telescope_settings_panel":"Page de configuration de Telescope.","various_utilities":"Outils divers"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/it.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["it"] = ["Italian","Italiano"];                                                            // 8
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                    // 9
  TAPi18n.translations["it"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                         // 13
  TAPi18n.translations["it"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["it"][namespace], {"menu":"Menu","top":"Migliori","new":"Nuovi","digest":"Selezione","users":"Utenti","settings":"Impostazioni","admin":"Admin?","post":"Posta","toolbox":"Toolbox","sign_up_sign_in":"Registrati/Accedi","my_account":"Il Mio Account","view_profile":"Vedi Profilo","edit_account":"Modifica Account","new_posts":"Nuovi Posts","your_comment_has_been_deleted":"Il tuo commento è stato rimosso.","comment_":"Commenta","delete_comment":"Elimina Commento","add_comment":"Aggiungi Commento","upvote":"promuovi","downvote":"sconsiglia","link":"link","edit":"Modifica","reply":"Rispondi","no_comments":"Nessun commento.","you_are_already_logged_in":"Hai già eseguito l'accesso","sorry_this_is_a_private_site_please_sign_up_first":"Ci spiace, questo è un sito privato. Per favore registrati.","thanks_for_signing_up":"Grazie per esserti registrato!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Questo sito al momento è solo per chi è stato invitato, ma ti faremo sapere non appena ci sarà la possibilità di accedere.","sorry_you_dont_have_the_rights_to_view_this_page":"Ci spiace, non hai i permessi per visualizzare questa pagina.","not_found":"Non Trovato!","were_sorry_whatever_you_were_looking_for_isnt_here":"Ci spiace; qualsiasi cosa stessi cercando non è qua..","no_notifications":"Nessuna notifica","1_notification":"1 notifica","notifications":"notifiche","mark_all_as_read":"Segna tutte come lette","your_post_has_been_deleted":"Il tuo post è stato rimosso.","created":"Creato","title":"Titolo","suggest_title":"Titolo suggerito","url":"URL","short_url":"URL breve","body":"Corpo","category":"Categoria","inactive_":"Inattivo?","sticky_":"Persistente?","submission_date":"Data di Invio","submission_time":"Ora di Invio","date":"Data","submission":"Invio","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota: questo post è ancora in attesa quindi non ha ancora una data di invio.","user":"Utente","status_":"Stato","approved":"Approvato","rejected":"Rifiutato","delete_post":"Elimina Post","thanks_your_post_is_awaiting_approval":"Grazie, il tuo post è in attesa di approvazione.","sorry_couldnt_find_a_title":"Ci spiace, non riusciamo a trovare un titolo...","please_fill_in_an_url_first":"Per favore riempi prima l'URL!","share":"Condividi","discuss":"Discuti","upvote_":"Promuovi","sticky":"Persistente","status":"stato","votes":"voti","basescore":"punteggioBase","score":"punteggio","clicks":"clicks","views":"views","inactive":"inattivo","comment":"commento","comments":"commenti","point":"punto","points":"punti","please_complete_your_profile_below_before_continuing":"Per favore completa il tuo profilo qua sotto prima di proseguire.","account":"Account","username":"Nome Utente","display_name":"Nome Visualizzato","email":"Email","bio":"Bio:","password":"Password","change_password":"Cambio Password?","old_password":"Vecchia Password","new_password":"Nuova Password","email_notifications":"Notifiche via Email","comments_on_my_posts":"Commenti ai miei post","replies_to_my_comments":"Risposte ai miei commenti","forgot_password":"Password dimenticata?","profile_updated":"Profilo aggiornato","please_fill_in_your_email_below_to_finish_signing_up":"Per favore inserisci qua sotto la tua email per completare la registrazione.","invite":"Invita","uninvite":"Annulla l'invito","make_admin":"Rendi amministratore","unadmin":"Annulla amministratore","delete_user":"Elimina Utente","are_you_sure_you_want_to_delete":"Sei sicuro di voler eliminare ","reset_password":"Reimposta Password","password_reset_link_sent":"Link per reimpostare la password inviato!","name":"Name:","posts":"Post","comments_":"Commenti","karma":"Karma","is_invited":"È Invitato?","is_admin":"È Amministratore?","delete":"Elimina","member_since":"Membro dal","edit_profile":"Modifica profilo","sign_in":"Accedi","sign_in_":"Accedi!","sign_up_":"Registrati!","dont_have_an_account":"Non hai un account?","already_have_an_account":"Hai già un account?","sign_up":"Registrati","please_fill_in_all_fields":"Per favore compila tutti i campi","invite_":"Invita ","left":" sinistra","invite_none_left":"Invita (nessuno rimasto)","all":"Tutti","invited":"Invited?","uninvited":"Non invitati","filter_by":"Filtra per","sort_by":"Ordina per","sorry_you_do_not_have_access_to_this_page":"Ci spiace, non hai accesso a questa pagina","please_sign_in_first":"Per favore prima accedi.","sorry_you_have_to_be_an_admin_to_view_this_page":"Ci spiace, devi essere un amministratore per vedere questa pagina.","sorry_you_dont_have_permissions_to_add_new_items":"Ci spiace, non hai i permessi per aggiungere nuovi elementi.","sorry_you_cannot_edit_this_post":"Ci spiace, non puoi modificare questo post.","sorry_you_cannot_edit_this_comment":"Ci spiace, non puoi modificare questo commento.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Devi accedere ed essere un amministratore per aggiungere una nuova categoria.","you_need_to_login_or_be_invited_to_post_new_comments":"Devi accedere od essere invitato per postare nuovi commenti.","please_wait":"Per favore attendi ","seconds_before_commenting_again":" secondi prima di fare un altro commento","your_comment_is_empty":"Il tuo commento è vuoto.","you_dont_have_permission_to_delete_this_comment":"Non hai i permessi per eliminare questo commento.","you_need_to_login_or_be_invited_to_post_new_stories":"Devi accedere o essere invitato per postare nuove storie.","please_fill_in_a_headline":"Per favore inserisci un titolo","this_link_has_already_been_posted":"Questo link è già stato postato","sorry_you_cannot_submit_more_than":"Ci spiace, non puoi inviare più di ","posts_per_day":" post al giorno","someone_replied_to_your_comment_on":"Qualcuno ha risposto al tuo commento su","has_replied_to_your_comment_on":" ha risposto al tuo commento su","read_more":"Leggi di più","a_new_comment_on_your_post":"Un nuovo commento sul tuo post","you_have_a_new_comment_by":"Hai un nuovo commento di ","on_your_post":" sul tuo post","has_created_a_new_post":" ha creato un nuovo post","your_account_has_been_approved":"Il tuo account è stato approvato.","welcome_to":"Benvenuto a ","start_posting":"Inizia a postare.","please_fill_in_a_title":"Please fill in a title","seconds_before_posting_again":" seconds before posting again","upvoted":"Upvoted","posted_date":"Posted Date","posted_time":"Posted Time","profile":"Profile","sign_out":"Sign Out","invitedcount":"InvitedCount","invites":"Invites","actions":"Actions","invites_left":"invites left","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Upvoted Posts","downvoted_posts":"Downvoted Posts","mark_as_read":"Mark as read","pending":"In attesa","loading":"Caricamento...","submit":"Invia","you_must_be_logged_in":"Devi effettuare l'accesso.","are_you_sure":"Sei sicuro?","please_log_in_first":"Per favore esegui prima l'accesso","sign_in_sign_up_with_twitter":"Accedi/Registrati con Twitter","load_more":"Carica altro"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/nl.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["nl"] = ["Dutch","Nederlands"];                                                            // 8
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                    // 9
  TAPi18n.translations["nl"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                         // 13
  TAPi18n.translations["nl"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["nl"][namespace], {"menu":"Menu","view":"Weergave","top":"Top","new":"Nieuw","best":"Beste","digest":"Samenvatting","users":"Gebruikers","settings":"Instellingen","admin":"Beheerder","post":"Artikel","toolbox":"Toolbox","sign_up_sign_in":"Registreren/Login","my_account":"Mijn profiel","view_profile":"Profiel bekijken","edit_account":"Profiel bewerken","new_posts":"Nieuwe artikelen","title":"Titel","description":"Beschrijving","siteUrl":"Website adres","tagline":"Onderschrift","requireViewInvite":"Uitnodiging verplicht om te lezen","requirePostInvite":"Uitnodiging verplicht om te plaatsen","requirePostsApproval":"Goedkeuring nieuwe artikel","defaultEmail":"Standaard Email","scoreUpdateInterval":"Score verversen interval","defaultView":"Normale weergave","postInterval":"Artikel interval","commentInterval":"Reacties interval","maxPostsPerDay":"Max. artikelen per dag","startInvitesCount":"Begin aantal uitnodigingen","postsPerPage":"Artikelen per pagina","logoUrl":"Logo URL","logoHeight":"Logo hoogte","logoWidth":"Logo breedte","language":"Taal","backgroundCSS":"Achtergrond CSS","buttonColor":"Knop kleur","buttonTextColor":"Knop tekst kleur","headerColor":"Kop kleur","headerTextColor":"Kop tekst kleur","twitterAccount":"Twitter account","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer code","extraCode":"Extra code","emailFooter":"Email footer","notes":"Notities","debug":"Debug modus","fontUrl":"Lettertype URL","fontFamily":"Lettertype familie","authMethods":"Authenticatie methoden","faviconUrl":"Favicon URL","mailURL":"Mail URL","postsLayout":"Artikelen weergave","general":"Algemeen","invites":"Uitnodigingen","email":"Email","scoring":"Score","posts":"Artikelen","comments":"reacties","logo":"Logo","extras":"Extras","colors":"Kleuren","integrations":"Integraties","createdAt":"Geschreven","postedAt":"Ingestuurd","url":"URL","body":"Beschrijving","htmlBody":"HTML Body","viewCount":"Weergaven","commentCount":"Reacties","commenters":"Reageerders","lastCommentedAt":"Laatste reactie","clickCount":"Aantal klikken","baseScore":"Basis score","upvotes":"Omhoog stemmen","upvoters":"Omhoog stemmers","downvotes":"Stemmen omlaag","downvoters":"Omlaag stemmers","score":"score","status":"status","sticky":"Vastgezet","inactive":"inactief","author":"Auteur","userId":"Gebruiker","sorry_we_couldnt_find_any_posts":"Sorry, geen artikelen gevonden.","your_comment_has_been_deleted":"Jouw reactie is verwijderd.","comment_":"Reactie","delete_comment":"Verwijder reactie","add_comment":"Reactie toevoegen","upvote":"omhoog","downvote":"omlaag","link":"link","edit":"Bewerk","reply":"Reageer","no_comments":"Geen reacties.","please_sign_in_to_reply":"Login om te kunnen reageren.","you_are_already_logged_in":"Je bent al ingelogd","sorry_this_is_a_private_site_please_sign_up_first":"Sorry, dit is een privé website. Eerst registreren alstublieft.","thanks_for_signing_up":"Bedankt voor het registreren!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"De website is op dit moment alleen op basis van uitnodiging, maar zodra er een plek vrij is hoor je het gelijk van ons.","sorry_you_dont_have_the_rights_to_view_this_page":"Sorry, je hebt geen rechten om deze pagina te bekijken.","sorry_you_do_not_have_the_rights_to_comments":"Sorry, op dit moment heb je rechten om te reageren.","not_found":"Niet gevonden!","were_sorry_whatever_you_were_looking_for_isnt_here":"Het spijt ons; we hebben niet kunnen vinden waar je naar op zoek was..","disallowed_property_detected":"Verboden toegang","no_notifications":"Geen berichten","1_notification":"1 bericht","notifications":"notificaties","mark_all_as_read":"Markeer alles als gelezen","your_post_has_been_deleted":"Jouw artikel is verwijderd.","created":"Ingestuurd","suggest_title":"Titel suggestie","short_url":"Korte URL","category":"Categorie","inactive_":"Inactief?","sticky_":"Vastgezet?","submission_date":"Datum van insturen","submission_time":"Tijd van insturen","date":"Datum","submission":"Inzending","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Let op: dit bericht wacht nog op goedkeuring en heeft daardoor nog geen datum van inzending.","user":"Gberuiker","status_":"Status","approved":"Goedgekeurd","rejected":"Afgewezen","delete_post":"Verwijder artikel","thanks_your_post_is_awaiting_approval":"Bedankt, je bericht wacht op goedkeuring.","sorry_couldnt_find_a_title":"Sorry, kon geen titel vinden..","please_fill_in_an_url_first":"Vul eerst een URL in!","share":"Delen","discuss":"Discusieer","upvote_":"Omhoog","votes":"stemmen","basescore":"basisScore","clicks":"klikken","views":"weergaven","comment":"reactie","point":"punt","points":"punten","please_complete_your_profile_below_before_continuing":"Maak eerst je profiel af alvorens verder te gaan.","account":"Account","username":"Gebruikersnaam","display_name":"Weergave naam","bio":"Bio:","twitter_username":"Twitter gebruikersnaam","github_username":"GitHub gebruikersnaam","site_url":"Website URL","password":"Wachtwoord","change_password":"Wachtwoord veranderen?","old_password":"Oud wachtwoord","new_password":"Nieuw wachtwoord","email_notifications":"Email Notificaties","new_users":"Nieuwe gebruikers","comments_on_my_posts":"Reacties op mijn artikelen","replies_to_my_comments":"Antwoorden op mijn reacties","forgot_password":"Wachtwoord vergeten?","profile_updated":"Profiel bijgewerkt","please_fill_in_your_email_below_to_finish_signing_up":"Vul je email in om de registratie af te ronden.","invite":"Uitnodigen","uninvite":"Uitnodiging intrekken","make_admin":"Beheerder maken","unadmin":"Beheer rechten ontnemen","delete_user":"Gberuiker verwijderen","are_you_sure_you_want_to_delete":"Verwijder ","reset_password":"Reset wachtwoord","password_reset_link_sent":"Wacthwoord reset link verstuurd!","name":"Naam:","comments_":"Reacties","karma":"Karma","is_invited":"Is uitgenodigd?","is_admin":"Is beheerder?","delete":"Verwijder","member_since":"Lid sinds","edit_profile":"Bewerk profiel","sign_in":"Inloggen","sign_in_":"Inloggen!","sign_up_":"Registreren!","dont_have_an_account":"Geen account?","already_have_an_account":"Heb je al een account?","sign_up":"Registreren","please_fill_in_all_fields":"Alle velden invullen a.u.b.","invite_":"Uitnodiging sturen aan ","left":" resterend","invite_none_left":"Invite (geen resterend)","all":"Alles","invited":"Uitgenodigd?","uninvited":"Uitnoding ongedaan gemaakt","filter_by":"Filteren","sort_by":"Sorteer","sorry_you_do_not_have_access_to_this_page":"Sorry, je hebt geen toegang tot deze pagina","please_sign_in_first":"Log eerst in.","sorry_you_have_to_be_an_admin_to_view_this_page":"Sorry, alleen beheerders kunnen deze pagina bekijken.","sorry_you_dont_have_permissions_to_add_new_items":"Sorry, je hebt geen rechten om toe te voegen.","sorry_you_cannot_edit_this_post":"Sorry, je kan dit artikel niet bewerken.","sorry_you_cannot_edit_this_comment":"Sorry, je kan deze reactie niet bewerken.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Je moet eerst inloggen en een beheerder zijn om een categorie aan te maken.","you_need_to_login_or_be_invited_to_post_new_comments":"Je moet eerst inloggen of uitgenodigd worden om een reactie te kunnen plaatsen.","please_wait":"Moment geduld ","seconds_before_commenting_again":" seconden voordat je opnieuw kunt reageren","your_comment_is_empty":"Je reactie is leeg.","you_dont_have_permission_to_delete_this_comment":"Je hebt geen rechten om deze reactie te verwijderen.","you_need_to_login_or_be_invited_to_post_new_stories":"Je moet eerst inloggen of uitgenoegd worden om artikelen te kunnen plaatsen.","please_fill_in_a_headline":"Vul een titel in","this_link_has_already_been_posted":"Dit adres is al een keer ingestuurd.","sorry_you_cannot_submit_more_than":"Sorry, je kunt niet meer dan ","posts_per_day":" artikelen per dag plaatsen","someone_replied_to_your_comment_on":"Iemand heeft gereageerd op ","has_replied_to_your_comment_on":" heeft gereageerd op jouw reactie op ","read_more":"Verder lezen","a_new_comment_on_your_post":"Nieuwe reactie op je artikel","you_have_a_new_comment_by":"Nieuwe reactie van ","on_your_post":" op jouw artikel","has_created_a_new_post":" heeft een nieuw artikel geplaatst","your_account_has_been_approved":"Jouw account is goedgekeurd.","welcome_to":"Welkom bij ","start_posting":"Begin met plaatsen.","please_fill_in_a_title":"Vul een titel in","seconds_before_posting_again":" voor het opnieuw kunnen plaatsen.","upvoted":"Omhoog gestemd","posted_date":"Datum plaatsing","posted_time":"Tijd plaatsing","profile":"Profiel","sign_out":"Uitloggen","you_ve_been_signed_out":"Je bent uitgelogd. Tot snel!","invitedcount":"Aantal uitgenodigd","actions":"Acties","invites_left":"uitnodigingen over","id":"ID","github":"GitHub","site":"Website","upvoted_posts":"Omhoog gestemd","downvoted_posts":"Omlaag gestemd","mark_as_read":"Markeer als gelezen","pending":"In behandeling","loading":"Laden...","submit":"Verzenden","you_must_be_logged_in":"Je moet ingelogd zijn.","are_you_sure":"Zeker weten?","please_log_in_first":"Log eerst in.","please_log_in_to_comment":"Log eerst in om een reactie te kunnen plaatsen.","sign_in_sign_up_with_twitter":"Registreer/Registreer met Twitter","load_more":"Meer laden","most_popular_posts":"De meest populaire artikelen.","newest_posts":"De nieuwste artikelen.","highest_ranked_posts_ever":"Artikelen met de meeste stemmen.","the_profile_of":"Profiel van","posts_awaiting_moderation":"Artikelen die op goedkeuring wachten.","future_scheduled_posts":"Ingeplande artikelen.","users_dashboard":"Gebruikers dashboard.","telescope_settings_panel":"Telescope intellingen pagina.","various_utilities":"Verschillende voorzieningen."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/pl.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["pl"] = ["Polish","Polski"];                                                               // 8
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                    // 9
  TAPi18n.translations["pl"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                         // 13
  TAPi18n.translations["pl"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["pl"][namespace], {"menu":"Menu","view":"Widok","top":"Na topie","new":"Najnowsze","best":"Najlepsze","digest":"Dzisiaj","users":"Użytkownicy","settings":"Ustawienia","admin":"Admin","post":"Nowy temat","toolbox":"Narzędzia","sign_up_sign_in":"Zarejestruj/Zaloguj","my_account":"Moje konto","view_profile":"Profil","edit_account":"Edytuj konto","new_posts":"Nowe posty","title":"Tytuł","siteUrl":"URL strony","tagline":"Podtytuł","requireViewInvite":"Wymagaj zaproszenia żeby przeglądać","requirePostInvite":"Wymagaj zaproszenia żeby pisać","requirePostsApproval":"Zatwierdzanie nowych postów","defaultEmail":"Standardowy Email","scoreUpdateInterval":"Częstotliwość przeliczania punktów","defaultView":"Standardowy widok","postInterval":"Interwał czasowy dla nowych postów","commentInterval":"Interwał czasowy dla nowych komentarzy","maxPostsPerDay":"Maksymalna liczba postów w jednym dniu","startInvitesCount":"Licznik zaproszeń","postsPerPage":"Postów na stronę","logoUrl":"URL Logo","logoHeight":"Wysokość Logo","logoWidth":"Szerokość Logo","language":"Język","backgroundCSS":"Tło CSS","buttonColor":"Kolor przycisków","buttonTextColor":"Kolor tekstu na przyciskach","headerColor":"Kolor dla nagłówka","headerTextColor":"Kolor tekstu dla nagłówka","twitterAccount":"Konto Twitter","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Kod w stopce","extraCode":"Dodatkowy kod","emailFooter":"Stopka Email","notes":"Notatki","debug":"Debug Mode","general":"Główne","invites":"Zaproszenia","email":"Email","scoring":"Scoring","posts":"Posty","comments":"komentarze","logo":"Logo","extras":"Extras","colors":"Kolory","integrations":"Integracje","createdAt":"Utworzony","postedAt":"Dodany","url":"URL","body":"Body","htmlBody":"Treść HTML","viewCount":"Liczba odświeżeń","commentCount":"Liczba komentarzy","commenters":"Komentujący","lastCommentedAt":"Ostatnio komentował","clickCount":"Liczba kliknięć","baseScore":"Bazowy wynik","upvotes":"Pozytywne","upvoters":"Głosujący pozytywnie","downvotes":"Negatywne","downvoters":"Głosujący negatywnie","score":"wynik","status":"status","sticky":"Przyklejony","inactive":"nieaktywny","author":"Autor","userId":"Użytkownik","sorry_we_couldnt_find_any_posts":"Przepraszamy, ale w tej chwili nie ma tutaj żadnych postów.","your_comment_has_been_deleted":"Twój komentarz został usunięty.","comment_":"Komentuj","delete_comment":"Usuń komentarz","add_comment":"Dodaj komentarz","upvote":"plus","downvote":"minus","link":"link","edit":"Edytuj","reply":"Odpowiedz","no_comments":"Brak komentarzy.","you_are_already_logged_in":"Jesteś już zalogowany","sorry_this_is_a_private_site_please_sign_up_first":"Musisz się najpierw zarejestrować.","thanks_for_signing_up":"Dzięki za rejestrację!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Tą stronę mogą oglądać jedynie zaproszone osoby","sorry_you_dont_have_the_rights_to_view_this_page":"Niestety nie masz odpowiednich praw dostępu żeby widzieć tą stronę.","sorry_you_do_not_have_the_rights_to_comments":"Niestety nie masz odpowiednich praw dostępu żeby móc dodawać komentarze.","not_found":"Nie znaleziono!","were_sorry_whatever_you_were_looking_for_isnt_here":"Niestety nie ma tutaj tego czego szukałeś...","no_notifications":"Brak powiadomień","1_notification":"1 powiadomienie","notifications":"powiadomień","mark_all_as_read":"Oznacz wszystkie jako przeczytane","your_post_has_been_deleted":"Twój post został usunięty.","created":"Utworzone","suggest_title":"Zasugeruj tytuł","short_url":"Krótki URL","category":"Kategoria","categories":"Kategorie","inactive_":"Nieaktywny?","sticky_":"Przyklejony?","submission_date":"Data utworzenia","submission_time":"Godzina utworzenia","date":"Data","submission":"Wpis","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Ten post ciągle czeka na zatwierdzenie.","user":"Użytkownik","status_":"Status","approved":"Zaakceptowany","rejected":"Odrzucony","delete_post":"Usuń post","thanks_your_post_is_awaiting_approval":"Twój post czeka na zatwierdzenie.","sorry_couldnt_find_a_title":"Podaj tytuł...","please_fill_in_an_url_first":"Podaj URL","share":"Udostępnij","discuss":"Komentuj","upvote_":"Plus","votes":"głosy","basescore":"wynik bazowy","clicks":"kliknięcia","views":"wyświetlenia","comment":"komentarz","point":"punkt","points":"punktów","please_complete_your_profile_below_before_continuing":"Uzupełnij profil.","account":"Konto","username":"Nick","display_name":"Nazwa wyświetlana","bio":"Bio:","twitter_username":"Twitter","github_username":"GitHub","site_url":"Strona WWW","password":"Hasło","change_password":"Zmienić hasło?","old_password":"Stare hasło","new_password":"Nowe hasło","email_notifications":"Notyfikacje email","new_users":"Nowi użytkownicy","comments_on_my_posts":"Komentarze do moich postów","replies_to_my_comments":"Odpowiedzi na moje komentarze","forgot_password":"Zapomniałeś hasło?","profile_updated":"Profil został zaktualizowany","please_fill_in_your_email_below_to_finish_signing_up":"Uzupełnij email.","invite":"Zaproś","uninvite":"Wyproś","make_admin":"Mianuj admina","unadmin":"Zdejmij admina","delete_user":"Usuń użytkownika","are_you_sure_you_want_to_delete":"Jesteś pewny, że chcesz usunąć ","reset_password":"Resetuj hasło","password_reset_link_sent":"Link z nowym hasłem został wysłany!","name":"Imię:","comments_":"Komentarze","karma":"Karma","is_invited":"Czy jest zaproszony?","is_admin":"Czy jest adminem?","delete":"Usuń","member_since":"Zarejestrowany od","edit_profile":"Edytuj profil","sign_in":"Zaloguj","sign_in_":"Zaloguj!","sign_up_":"Zarejestruj!","dont_have_an_account":"Nie masz konta?","already_have_an_account":"Masz już konto?","sign_up":"Zarejestruj","please_fill_in_all_fields":"Uzupełnij pola","invite_":"Zaproś ","left":" left","invite_none_left":"Zaproszenia (brak)","all":"Wszyscy","invited":"Zaproszony?","uninvited":"Niezaproszeni","filter_by":"Filtruj po","sort_by":"Sortuj po","sorry_you_do_not_have_access_to_this_page":"Przepraszamy, nie masz dostępu.","please_sign_in_first":"Zaloguj się.","sorry_you_have_to_be_an_admin_to_view_this_page":"Musisz być adminem żeby to zobaczyć.","sorry_you_dont_have_permissions_to_add_new_items":"Nie masz uprawnień do dodawania.","sorry_you_cannot_edit_this_post":"Nie możesz edytować tego postu.","sorry_you_cannot_edit_this_comment":"Nie możesz edytować tego komentarza.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Musisz się zalogować jako admin aby móc dodawać nowe kategorie.","you_need_to_login_or_be_invited_to_post_new_comments":"Musisz być zalogowany lub zaproszony aby dodawaćc nowe komentarze.","please_wait":"Proszę czekać ","seconds_before_commenting_again":" sekund zanim znowu będziesz móc komentować","your_comment_is_empty":"Twój komentarz jest pusty.","you_dont_have_permission_to_delete_this_comment":"Nie możesz usunąć tego komentarza.","you_need_to_login_or_be_invited_to_post_new_stories":"Musisz być zalogowany lub zaproszony aby dodawać nowe posty.","please_fill_in_a_headline":"Please fill in a headline","this_link_has_already_been_posted":"Ten link już istnieje","sorry_you_cannot_submit_more_than":"Nie możesz dodawać więcej niż ","posts_per_day":" postów na dzień","someone_replied_to_your_comment_on":"Ktoś odpowiedział na twój komentarz w","has_replied_to_your_comment_on":" odpowiedział na twój komentarz w","read_more":"Czytaj dalej","a_new_comment_on_your_post":"Nowy komentarz","you_have_a_new_comment_by":"Pojawił się nowy komentarz ","on_your_post":" dla twojego posta","has_created_a_new_post":" utworzył nowy post","your_account_has_been_approved":"Twoje konto zostało zaakceptowane.","welcome_to":"Witaj na ","start_posting":"Zacznij pisać.","please_fill_in_a_title":"Wypełnij tytuł","seconds_before_posting_again":" sekund zanim znowu będziesz mógł napisać","upvoted":"minus","posted_date":"Data","posted_time":"Godzina","profile":"Profil","sign_out":"Wyloguj się","you_ve_been_signed_out":"Zostałeś prawidłowo wylogowany!","invitedcount":"Liczba zaproszeń","actions":"Akcje","invites_left":"zaproszeń pozostało","id":"ID","github":"GitHub","site":"Strona WWW","upvoted_posts":"Głosy pozytywne","downvoted_posts":"Głosy negatywne","mark_as_read":"Oznacz jako przeczytane","pending":"Oczekuje","loading":"Ładowanie...","submit":"Wyślij","you_must_be_logged_in":"Musisz być zalogowany.","are_you_sure":"Jesteś pewny?","please_log_in_first":"Najpierw się zaloguj.","please_log_in_to_comment":"Aby komentować musisz być zalogowany.","sign_in_sign_up_with_twitter":"Zarejestruj/Zaloguj się przez Twitter","load_more":"Więcej","most_popular_posts":"Aktualnie najpopularniejsze posty.","newest_posts":"Najnowsze posty.","highest_ranked_posts_ever":"Najwyżej oceniane posty wszechczasów.","the_profile_of":"Profil","posts_awaiting_moderation":"Posty czekające na moderację.","future_scheduled_posts":"Posty na przyszłość.","users_dashboard":"Pulpit użytkowników.","telescope_settings_panel":"Ustawienia.","various_utilities":"Narzędzia."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/pt-BR.i18n.js                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["pt-BR"] = ["Portuguese (Brazil)","Português do Brasil"];                                  // 8
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                 // 9
  TAPi18n.translations["pt-BR"] = {};                                                                              // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                      // 13
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                   // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["pt-BR"][namespace], {"menu":"Menu","view":"Visão","top":"Topo","new":"Novo","best":"Melhor","digest":"Resumo","users":"Usuários","settings":"Configurações","admin":"Admin","post":"Postar","toolbox":"Toolbox","sign_up_sign_in":"Registrar/Entrar","my_account":"Minha Conta","view_profile":"Ver Perfil","edit_account":"Editar Conta","new_posts":"Novas Postagens","title":"Título","description":"Descrição","siteUrl":"URL do site","tagline":"Tagline","requireViewInvite":"Exigir Convite para Ver","requirePostInvite":"Exigir Convite para Postar","requirePostsApproval":"Exigir Postagens serem Aprovadas","defaultEmail":"Email Padrão","scoreUpdateInterval":"Definir Intervalo de Atualização","defaultView":"Visão Padrão","postInterval":"Intervalo de Postagens","commentInterval":"Intervalo de Comentários","maxPostsPerDay":"Máx de Postagens Por Dia","startInvitesCount":"Número Inicial de Convites","postsPerPage":"Postagens Por Página","logoUrl":"URL do Logo","logoHeight":"Altura do Logo","logoWidth":"Comprimento do Logo","language":"Linguagem","backgroundCSS":"Background CSS","buttonColor":"Cor do Botão","buttonTextColor":"Cor do Texto do Botão","headerColor":"Cor do Cabeçalho","headerTextColor":"Cor do Texto do Cabeçalho","twitterAccount":"Conta do Twitter","googleAnalyticsId":"ID do Google Analytics","mixpanelId":"ID do Mixpanel","clickyId":"ID do Clicky","footerCode":"Código para o Rodapé","extraCode":"Código Extra","emailFooter":"Rodapé do Email","notes":"Notas","debug":"Modo de Debug","fontUrl":"URL da Fonte","fontFamily":"Família da Fonte","authMethods":"Métodos de Autenticação","faviconUrl":"URL do Favicon","mailURL":"MailURL","postsLayout":"Layout dos Posts","general":"Geral","invites":"Convites","email":"Email","scoring":"Classificação","posts":"Postagens","comments":"comentários","logo":"Logo","extras":"Extras","colors":"Cores","integrations":"Integrações","createdAt":"Criado em","postedAt":"Postado em","url":"URL","body":"Corpo","htmlBody":"Corpo HTML","viewCount":"Ver Contagem","commentCount":"Contagem de Comentários","commenters":"Comentaristas","lastCommentedAt":"Comentado por último em","clickCount":"Contagem de cliques","baseScore":"Classificação Básica","upvotes":"Votos Positivos","upvoters":"Votadores Positivos","downvotes":"Votos Negativos","downvoters":"Votadores Negativos","score":"classificação","status":"estado","sticky":"Fixo","inactive":"inativo","author":"Autor","userId":"Usuário","sorry_we_couldnt_find_any_posts":"Desculpe, não conseguimos encontrar nenhuma postagem.","your_comment_has_been_deleted":"Seu comentário foi deletado.","comment_":"Comentário","delete_comment":"Deletar Comentário","add_comment":"Adicionar Comentário","upvote":"+","downvote":"-","link":"link","edit":"Editar","reply":"Responder","no_comments":"Sem comentários.","please_sign_in_to_reply":"Por favor, registre-se para responder","you_are_already_logged_in":"Você já está logado","sorry_this_is_a_private_site_please_sign_up_first":"Desculpe, mas este é um site privado. Registre-se primeiro.","thanks_for_signing_up":"Obrigado por se registrar!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"O site está atualmente apenas para convidados, mas nós iremos avisá-lo assim que abrirmos ao público geral.","sorry_you_dont_have_the_rights_to_view_this_page":"Desculpe, você não pode ver esta página.","sorry_you_do_not_have_the_rights_to_comments":"Desculpe, você não pode comentar neste momento.","not_found":"Não Encontrado!","were_sorry_whatever_you_were_looking_for_isnt_here":"Nos desculpe; o que estava procurando não se encontra aqui...","disallowed_property_detected":"Propriedade não permitida detectada","no_notifications":"Sem notificações","1_notification":"1 notificação","notifications":"notificações","mark_all_as_read":"Marcar todas como lidas","your_post_has_been_deleted":"Sua postagem foi deletada.","created":"Criado","suggest_title":"Sugerir título","short_url":"URL curta","category":"Categoria","inactive_":"Inativo?","sticky_":"Fixo?","submission_date":"Data de Submissão","submission_time":"Hora de Submissão","date":"Data","submission":"Submissão","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota: esta postagem continua pendente e não possui data de submissão ainda.","user":"Usuário","status_":"Estado","approved":"Aprovada","rejected":"Rejeitada","delete_post":"Deletar Postagem","thanks_your_post_is_awaiting_approval":"Obrigado, sua postagem está aguardando aprovação.","sorry_couldnt_find_a_title":"Desculpe, não encontramos um título...","please_fill_in_an_url_first":"Por favor, inclua a URL antes!","share":"Compartilhar","discuss":"Discutir","upvote_":"Votar","votes":"votos","basescore":"classificaçaoBase","clicks":"cliques","views":"visualizações","comment":"comentário","point":"ponto","points":"pontos","please_complete_your_profile_below_before_continuing":"Por favor, complete seu perfil abaixo antes de continuar.","account":"Conta","username":"Nome de usuário","display_name":"Nome de exibição","bio":"Bio:","twitter_username":"Twitter","github_username":"GitHub","site_url":"URL do Site","password":"Senha","change_password":"Mudar Senha?","old_password":"Senha Antiga","new_password":"Nova Senha","email_notifications":"Notificações por Email","new_users":"Novos usuários","comments_on_my_posts":"Comentários em minhas postagens","replies_to_my_comments":"Respostas aos meus comentários","forgot_password":"Esqueceu sua senha?","profile_updated":"Perfil atualizado","please_fill_in_your_email_below_to_finish_signing_up":"Por favor, preencha seu email abaixo para finalizar o registro.","invite":"Convite","uninvite":"Desconvidar","make_admin":"Tornar admin","unadmin":"Retirar do admin","delete_user":"Deletar Usuário","are_you_sure_you_want_to_delete":"Está certo de que deseja deletar ","reset_password":"Resetar Senhar","password_reset_link_sent":"Link de reset de senha enviado!","name":"Nome:","comments_":"Comentários","karma":"Carma","is_invited":"Foi Convidado?","is_admin":"É Admin?","delete":"Deletar","member_since":"Membro desde","edit_profile":"Editar perfil","sign_in":"Entrar","sign_in_":"Entrar!","sign_up_":"Registrar!","dont_have_an_account":"Não possui uma conta?","already_have_an_account":"Já possui uma conta?","sign_up":"Registrar","please_fill_in_all_fields":"Por favor, preencha todos os campos","invite_":"Convidar ","left":" restantes","invite_none_left":"Convidar (nenhum restante)","all":"Todos","invited":"Convidado?","uninvited":"Desconvidado","filter_by":"Filtrar por","sort_by":"Distribuir por","sorry_you_do_not_have_access_to_this_page":"Desculpe, você não possui acesso a esta página","please_sign_in_first":"Por favor, entre com sua conta primeiro.","sorry_you_have_to_be_an_admin_to_view_this_page":"Desculpe, você precisa ser admin para ver esta página.","sorry_you_dont_have_permissions_to_add_new_items":"Desculpe, você não possui permissão para adicionar novos itens.","sorry_you_cannot_edit_this_post":"Desculpe, você não pode estar esta postagem.","sorry_you_cannot_edit_this_comment":"Desculpe, você não pode editar este comentário.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Você precisa se logar e ser um admin para adicionar uma nova categoria.","you_need_to_login_or_be_invited_to_post_new_comments":"Você precisa se logar ou ser convidado para postar novos comentários.","please_wait":"Por favor aguarde ","seconds_before_commenting_again":" segundos antes de comentar novamente","your_comment_is_empty":"Seu comentário está vazio.","you_dont_have_permission_to_delete_this_comment":"Você não possui permissão para deletar este comentário.","you_need_to_login_or_be_invited_to_post_new_stories":"Você precisa se logar ou ser convidado para novas postagens.","please_fill_in_a_headline":"Por favor, preencha uma chamada","this_link_has_already_been_posted":"Este link já foi publicado","sorry_you_cannot_submit_more_than":"Desculpe, você não pode submeter mais do que ","posts_per_day":" postagens por dia","someone_replied_to_your_comment_on":"Alguém respondeu ao seu comentário em","has_replied_to_your_comment_on":" respondeu ao seu comentário em","read_more":"Ler mais","a_new_comment_on_your_post":"Um novo comentário em sua postagem","you_have_a_new_comment_by":"Você possui um novo comentário por ","on_your_post":" em sua postagem","has_created_a_new_post":" criou uma nova postagem","your_account_has_been_approved":"Sua conta foi aprovada.","welcome_to":"Bem vindo para ","start_posting":"Comece a postar.","please_fill_in_a_title":"Por favor preencha um título","seconds_before_posting_again":" segundos antes de postar novamente","upvoted":"Votado","posted_date":"Data da Postagem","posted_time":"Hora da da Postagem","profile":"Perfil","sign_out":"Sair","you_ve_been_signed_out":"Você saiu com sucesso. Volte logo!","invitedcount":"ContagemConvites","actions":"Ações","invites_left":"invites left","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Postagens votadas","downvoted_posts":"Postagens contra","mark_as_read":"Marcar como lido","pending":"Pendente","loading":"Carregando...","submit":"Submeter","you_must_be_logged_in":"Você deve estar logado.","are_you_sure":"Você está certo?","please_log_in_first":"Por favor, entre primeiro.","please_log_in_to_comment":"Por favor entre para comentário.","sign_in_sign_up_with_twitter":"Registrar/Entrar com Twitter","load_more":"Carregar Mais","most_popular_posts":"As postagens mais populares neste momento.","newest_posts":"As postagens mais novas.","highest_ranked_posts_ever":"As melhores postagens de todos os tempos.","the_profile_of":"O perfil de","posts_awaiting_moderation":"Postagens aguardando moderação.","future_scheduled_posts":"Postagens agendadas para o futuro.","users_dashboard":"Painel dos usuários.","telescope_settings_panel":"Painel de Configurações do Telescope.","various_utilities":"Várias utilidades."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/ro.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["ro"] = ["Romanian","Română"];                                                             // 8
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                    // 9
  TAPi18n.translations["ro"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                         // 13
  TAPi18n.translations["ro"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["ro"][namespace], {"menu":"Meniu","top":"Top Știri","new":"Noutăți","digest":"Rezumat","users":"Utilizatori","settings":"Setari","admin":"Admin","post":"Postează","toolbox":"Trusa de scule","sign_up_sign_in":"Inregistrare/Logare","my_account":"Contul meu","view_profile":"Afiseaza profil","edit_account":"Modifica profil","new_posts":"Postări noi","your_comment_has_been_deleted":"Comentariul tău a fost șters","comment_":"Comentare","delete_comment":"Sterge comentariu","add_comment":"Adaugă comentariu","upvote":"+1","downvote":"-1","link":"link","edit":"editează","reply":"răspunde","no_comments":"Nici un comentariu.","you_are_already_logged_in":"Sunteți deja logat.","sorry_this_is_a_private_site_please_sign_up_first":"Ne cerem scuze, acesta este un site care necesită înscriere.","thanks_for_signing_up":"Mulțumim pentru înregistrare!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Momentan nu acceptăm decât înscrieri pe bază de invitație, dar vă vom anunța de îndată ce avem un loc disponibil!","sorry_you_dont_have_the_rights_to_view_this_page":"Ne cerem scuze, însă nu aveți drepturi de a accesa această pagină.","not_found":"Inexistent!","were_sorry_whatever_you_were_looking_for_isnt_here":"Ne pare rău, dar ceea ce ați căutat nu pare a fi disponibil.","no_notifications":"Nici o notificare","1_notification":"1 Notificare","notifications":"Notificări","mark_all_as_read":"Marchează toate ca citite","your_post_has_been_deleted":"Postarea ta a fost ștersă.","created":"Creat","title":"Titlu","suggest_title":"Propune un titlu","url":"URL","short_url":"Prescurtare-URL","body":"Descriere","category":"Categorie","inactive_":"Inactiv?","sticky_":"Arhivează?","submission_date":"Data înregistrării","submission_time":"Ora înregistrării","date":"Data","submission":"Înregistrare","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Informare: Această contribuție este încă în curs de aprobare, de aceea nu există o dată și o oră de înregistrare.","user":"Utilizator","status_":"Status","approved":"Aprobat","rejected":"Respins","delete_post":"Șterge postarea","thanks_your_post_is_awaiting_approval":"Mulțumim, postarea ta este în curs de verificare.","sorry_couldnt_find_a_title":"Ai uitat oare să specifici un titlu?","please_fill_in_an_url_first":"Trebuie să specifici un URL/Link!","share":"Share","discuss":"Comentarii","upvote_":"Votează","sticky":"Actual","status":"Status","votes":"Voturi","basescore":"Scor de bază","score":"Punctaj","clicks":"Click-uri","views":"Afișări","inactive":"Inactiv","comment":"Comentariu","comments":"Comentarii","point":"Punct","points":"Puncte","please_complete_your_profile_below_before_continuing":"Te rugăm să completezi toate datele înainte de a trece mai departe.","account":"Profil","username":"Nume utilizator","display_name":"Nume afișat public","email":"Email","bio":"Despre:","password":"Parola","change_password":"Schimbă parola?","old_password":"Parola veche","new_password":"Parola nouă","email_notifications":"Notificări prin email","comments_on_my_posts":"Comentarii la postările mele","replies_to_my_comments":"Răspunsuri la postările mele","forgot_password":"Ați uitat parola?","profile_updated":"Profilul a fost actualizat","please_fill_in_your_email_below_to_finish_signing_up":"Vă rugăm treceți adresa de email pentru a finaliza înregistrarea.","invite":"Invație","uninvite":"Retrage invitația","make_admin":"Promovează ca administrator","unadmin":"Retrage dreptul de administrator","delete_user":"Șterge utilizator","are_you_sure_you_want_to_delete":"Ești sigur că vrei să ștergi următoarele: ","reset_password":"Resetează parola","password_reset_link_sent":"Un link pentru resetarea parolei tocmai a fost trimis!","name":"Nume:","posts":"Postări","comments_":"Comentarii","karma":"Karma","is_invited":"Este invitat?","is_admin":"Este administrator?","delete":"Șterge","member_since":"Vechime","edit_profile":"Editează profilul","sign_in":"Logare","sign_in_":"Logare!","sign_up_":"Înregistrare!","dont_have_an_account":"Nu ești înregistrat?","already_have_an_account":"Ești deja înregistrat?","sign_up":"Înregistrează-te","please_fill_in_all_fields":"Te rugăm să completezi toate câmpurile necesare.","invite_":"Invitați(i) ","left":" rămase","invite_none_left":"Număr de invitații epuizat","all":"Toți","invited":"Invitat de","uninvited":"cei neinvitați","filter_by":"Filtreză după","sort_by":"Sorteză după","sorry_you_do_not_have_access_to_this_page":"Ne pare rău, dar nu ai acces la acestă pagină","please_sign_in_first":"Este nevoie să te autentifici.","sorry_you_have_to_be_an_admin_to_view_this_page":"Ne pare rău, trebuie să ai drepturi de administrare pentru a accesa această pagină.","sorry_you_dont_have_permissions_to_add_new_items":"Ne pare rău, nu ai drepturi de a adăuga înregistrări.","sorry_you_cannot_edit_this_post":"Ne pare rău, nu poți edita această postare.","sorry_you_cannot_edit_this_comment":"Ne pare rău, nu poți edita aceast comentariu.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Trebuie să fi autentificat și să ai drepturi de administrare pentru a adăuga noi categorii.","you_need_to_login_or_be_invited_to_post_new_comments":"Trebuie să fi autentificat și să ai drepturi de administrare pentru a adăuga comentarii.","please_wait":"Te rugăm să aștepți ","seconds_before_commenting_again":" Secunde, până vei putea adăuga comentarii.","your_comment_is_empty":"Comentariul nu conține nici un text.","you_dont_have_permission_to_delete_this_comment":"Nu ai drepturi de a șterge acest comentariu.","you_need_to_login_or_be_invited_to_post_new_stories":"Trebuie să fi autentificat sau invitat pentru a putea posta.","please_fill_in_a_headline":"Te rugăm să introduci un titlu","this_link_has_already_been_posted":"Acest link a fost deja publicat","sorry_you_cannot_submit_more_than":"Ne pare rău insă nu poți publica mai mult de ","posts_per_day":" postări pe zi","someone_replied_to_your_comment_on":"Cineva a lăsat un comentariu la","has_replied_to_your_comment_on":" a răspuns la comentariul tău la","read_more":"mai mult","a_new_comment_on_your_post":"Un nou comentariu la postarea ta","you_have_a_new_comment_by":"Ai un nou comentariu de la ","on_your_post":" la postarea ta","has_created_a_new_post":" a publicat o nouă postare","your_account_has_been_approved":"Profilul tău a fost activat.","welcome_to":"Bine ai venit ","start_posting":"Poți începe să publici.","please_fill_in_a_title":"Te rugăm să alegi un titlu","seconds_before_posting_again":" secunde până să poți publica iar","upvoted":"Votat","posted_date":"Data Postării","posted_time":"Ora Postării","profile":"Profil","sign_out":"De-logare","invitedcount":"Număr de invitați","invites":"Invitații trimise","actions":"Actiuni","invites_left":"invitații rămase","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Postări promvate","downvoted_posts":"Postări în trend","mark_as_read":"Postări contra trend-ului","pending":"în așteptare","loading":"se âncarcă...","submit":"Trimite","you_must_be_logged_in":"Trebuie să fi autentificat.","are_you_sure":"Ești sigur?","please_log_in_first":"Te rugăm să te autentifici mai întâi","sign_in_sign_up_with_twitter":"Autentificare/Înregistrare cu Twitter","load_more":"Afișează noutăți"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/ru.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["ru"] = ["Russian","Русский"];                                                             // 8
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                    // 9
  TAPi18n.translations["ru"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                         // 13
  TAPi18n.translations["ru"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["ru"][namespace], {"menu":"Меню","view":"Вид","top":"Топ","new":"Новое","best":"Лучшее","digest":"Дайджест","users":"Пользователи","settings":"Настройки","admin":"Админ","post":"Пост","toolbox":"Инструменты","sign_up_sign_in":"Вход/Регистрация","my_account":"Мой аккаунт","view_profile":"Просмотр профиля","edit_account":"Редактирование аккаунта","new_posts":"Новые посты","title":"Заголовок","siteUrl":"URL сайта","tagline":"Теги","requireViewInvite":"Требуется инвайт для Вида","requirePostInvite":"Требуется инвайт для поста","requirePostsApproval":"Нужно утвердить посты","defaultEmail":"Email по-умолчанию","scoreUpdateInterval":"Интервал обновления очков","defaultView":"Вид по-умолчанию","postInterval":"Интервал между постами","commentInterval":"Интервал между комментариями","maxPostsPerDay":"Максимум постов за день","startInvitesCount":"Приглашает к старту счёта","postsPerPage":"Постов на странице","logoUrl":"URL лого","logoHeight":"Высота лого","logoWidth":"Ширина лого","language":"Язык","backgroundCSS":"CSS фона","buttonColor":"Цвет кнопок","buttonTextColor":"Цвет текста кнопок","headerColor":"Цвет заголовка","headerTextColor":"Цвет текста заголовка","twitterAccount":"Twitter аккаунт","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Код футера","extraCode":"Дополнительный код","emailFooter":"Email футер","notes":"Замечания","debug":"Режим отладки","general":"Главная","invites":"Инвайты","email":"Email","scoring":"Очки","posts":"Посты","comments":"комментариев","logo":"Лого","extras":"Дополнения","colors":"Цвета","integrations":"Интеграции","createdAt":"Создан","postedAt":"Опубликован","url":"URL","body":"Body","htmlBody":"HTML Body","viewCount":"Просмотров","commentCount":"Комментариве","commenters":"Комментаторов","lastCommentedAt":"Последний комментарий","clickCount":"Кликов","baseScore":"Базовый счёт","upvotes":"Голосов За","upvoters":"Поддержали","downvotes":"Голосов Против","downvoters":"Выступили против","score":"очки","status":"статус","sticky":"В закладки","inactive":"неактивно","author":"Автор","userId":"Пользователь","your_comment_has_been_deleted":"Ваш комментарий удалили.","comment_":"Комментарий","delete_comment":"Удалить комментарий","add_comment":"Добавить комментарий","upvote":"за","downvote":"против","link":"ссылка","edit":"Редактировать","reply":"Ответить","no_comments":"Без комментариев.","you_are_already_logged_in":"Вы уже вошли","sorry_this_is_a_private_site_please_sign_up_first":"Извините, это частный сайт. Вначале зарегистрируйтесь.","thanks_for_signing_up":"Thanks for signing up!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Сайт пока что только по инвайтам, но мы вам сообщим, если будет открыта регистрация.","sorry_you_dont_have_the_rights_to_view_this_page":"Извините, но у вас нет прав для просмотра страницы.","not_found":"Not Found!","were_sorry_whatever_you_were_looking_for_isnt_here":"Извините, но что бы вы не искали, этого тут нет..","no_notifications":"Оповещений нет","1_notification":"1 оповещение","notifications":"оповещения","mark_all_as_read":"Отметить всё прочитанным","your_post_has_been_deleted":"Ваш пост удалён.","created":"Создан","suggest_title":"Предложите название","short_url":"Короткий URL","category":"Категория","inactive_":"Сделать неактивным?","sticky_":"С закладкой?","submission_date":"Дата отправки на утверждение","submission_time":"Время отправки на утверждение","date":"Дата","submission":"Утверждение","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Заметка: этот пост находится на рассмотрении, поэтому время утверждения не указано.","user":"Пользователь","status_":"Статус","approved":"Утверждён","rejected":"Отклонён","delete_post":"Удалить пост","thanks_your_post_is_awaiting_approval":"Спасибо, пост ожидает утверждения.","sorry_couldnt_find_a_title":"Извините, не смог найти название...","please_fill_in_an_url_first":"Вначале укажите URL!","share":"Поделится","discuss":"Обсудить","upvote_":"Проголосовать за","votes":"голосов","basescore":"базовые очки","clicks":"кликов","views":"просмотров","comment":"комментарий","point":"бал","points":"баллов","please_complete_your_profile_below_before_continuing":"Заполните ваш профиль перед тем, как продолжить.","account":"Аккаунт","username":"Имя пользователя","display_name":"Показать имя","bio":"Обо мне:","twitter_username":"Имя в Twitter","github_username":"Имя в GitHub","site_url":"URL сайта","password":"Пароль","change_password":"Сменить пароль?","old_password":"Старый пароль","new_password":"Новый пароль","email_notifications":"Email оповещение","new_users":"Новые пользователи","comments_on_my_posts":"Комментариев под моими постами","replies_to_my_comments":"Ответов на мои комментарии","forgot_password":"Забыли пароль?","profile_updated":"Профиль обновлён","please_fill_in_your_email_below_to_finish_signing_up":"Пожалуйста, укажите ваш email ниже для окончания регистрации.","invite":"Инвайт","uninvite":"Отменить инвайт","make_admin":"Сделать админом","unadmin":"Отметить админа","delete_user":"Удалить пользователя","are_you_sure_you_want_to_delete":"Уверены, что хотите удалить ","reset_password":"Сбросить пароль","password_reset_link_sent":"Ссылка для сброса пароля отправлена!","name":"Имя:","comments_":"Комментарии","karma":"Карма","is_invited":"Приглашён?","is_admin":"Админ?","delete":"Удалить","member_since":"Является членом с","edit_profile":"Редактировать профиль","sign_in":"Войти","sign_in_":"Войти!","sign_up_":"Зарегистрироваться!","dont_have_an_account":"Нет аккаунта?","already_have_an_account":"Уже есть аккаунт?","sign_up":"Зарегистрироваться","please_fill_in_all_fields":"Заполните все поля","invite_":"Пригласить ","left":" покинул(а)","invite_none_left":"Пригласить (не осталось)","all":"Все","invited":"Приглашены?","uninvited":"Неприглашённые","filter_by":"Фильтровать по","sort_by":"Сортировать по","sorry_you_do_not_have_access_to_this_page":"Извините, у вас нет доступа к этой странице","please_sign_in_first":"Вначале войдите.","sorry_you_have_to_be_an_admin_to_view_this_page":"Извините, вы должны быть админом для просмотра этой страницы.","sorry_you_dont_have_permissions_to_add_new_items":"Извините, у вас нет прав для добавления новых элементов.","sorry_you_cannot_edit_this_post":"Извините, вы не можете редактировать этот пост.","sorry_you_cannot_edit_this_comment":"Извините, вы не можете редактировать это.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Вам нужно войти и быть админом для создания новой категории.","you_need_to_login_or_be_invited_to_post_new_comments":"Вам нужно войти или быть приглашённым для комментирования.","please_wait":"Пожалуйста подождите ","seconds_before_commenting_again":" секунд перед новым комментарием","your_comment_is_empty":"Ваш комментарий пуст.","you_dont_have_permission_to_delete_this_comment":"У вас нет прав для удаления этого комментария.","you_need_to_login_or_be_invited_to_post_new_stories":"Вам нужно войти или быть приглашённым, чтобы публиковать новые истории.","please_fill_in_a_headline":"Заполните заголовок","this_link_has_already_been_posted":"Эта ссылка уже была опубликована","sorry_you_cannot_submit_more_than":"Извините, вы не можете отправлять больше, чем ","posts_per_day":" постов за день","someone_replied_to_your_comment_on":"Кто-то ответил на ваш комментарий","has_replied_to_your_comment_on":" ответил(а) на ваш комментарий по","read_more":"Подробнее","a_new_comment_on_your_post":"Новый комментарий по вашему посту","you_have_a_new_comment_by":"У вас есть новый комментарий от ","on_your_post":" по вашему посту","has_created_a_new_post":" создал новый пост","your_account_has_been_approved":"Ваш аккаунт утвердили.","welcome_to":"Добро пожаловать ","start_posting":"Начать пост.","please_fill_in_a_title":"Заполните заголовок","seconds_before_posting_again":" секунд перед новым постом","upvoted":"За","posted_date":"Дата поста","posted_time":"Время поста","profile":"Профиль","sign_out":"Выйти","you_ve_been_signed_out":"Вы вышли. Возвращайтесь снова!","invitedcount":"Подсчёт инвайтов","actions":"Действия","invites_left":"осталось инвайтов","id":"ИД","github":"GitHub","site":"Сайт","upvoted_posts":"Постов За","downvoted_posts":"Постов Против","mark_as_read":"Отметить прочитанным","pending":"Ожидает","loading":"Загружается...","submit":"Отправить","you_must_be_logged_in":"Вы должны залогиниться.","are_you_sure":"Уверены?","please_log_in_first":"Войдите вначале","sign_in_sign_up_with_twitter":"Войти/зарегистрироваться с помощью Twitter","load_more":"Загрузить ещё"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/se.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["se"] = ["se","se"];                                                                       // 8
if(_.isUndefined(TAPi18n.translations["se"])) {                                                                    // 9
  TAPi18n.translations["se"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["se"][namespace])) {                                                         // 13
  TAPi18n.translations["se"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["se"][namespace], {"menu":"Meny","view":"Vy","top":"Topp","new":"Ny","best":"Bäst","digest":"Sammanställning","users":"Användare","settings":"Inställningar","admin":"Admin","post":"Nytt inlägg","toolbox":"Verktygslåda","sign_up_sign_in":"Skapa konto/Logga in","my_account":"Mitt Konto","view_profile":"Se Profil","edit_account":"Ändra Konto","new_posts":"Nya inlägg","title":"Titel","siteUrl":"Hemside-URL","tagline":"Tagline","requireViewInvite":"Inbjudning krävs för att se","requirePostInvite":"Inbjudning krävs för att skapa inlägg","requirePostsApproval":"Inlägg måste godkännas","defaultEmail":"Standard-E-post","scoreUpdateInterval":"Poänguppdateringsintervall","defaultView":"Standardvy","postInterval":"Inläggsintervall","commentInterval":"Kommentarsinterval","maxPostsPerDay":"Max-inlägg per dag","startInvitesCount":"Startantal för inbjudningar","postsPerPage":"Inlägg per sida","logoUrl":"Logotyp-URL","logoHeight":"Logotyphöjd","logoWidth":"Logotypvidd","language":"Språk","backgroundCSS":"Bakgrunds-CSS","buttonColor":"Knappfärg","buttonTextColor":"Knapptextfärg","headerColor":"Titelområdesfärg","headerTextColor":"Titeltextfärg","twitterAccount":"Twitter-konto","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Sidfotskod","extraCode":"Extrakod","emailFooter":"Sidfotens E-post","notes":"Anteckningar","debug":"Debug-läge","general":"Allmänt","invites":"Inbjudningar","email":"E-post","scoring":"Poäng","posts":"Inlägg","comments":"kommentarer","logo":"Logga","extras":"Extra","colors":"Färger","integrations":"Integrationer","createdAt":"Skapad","postedAt":"Tillagd","url":"URL","body":"Innehåll","htmlBody":"HTML-kropp","viewCount":"Antal visningar","commentCount":"Antal kommentarer","commenters":"Kommentatorer","lastCommentedAt":"Senast kommenterad","clickCount":"Antal klick","baseScore":"Baspoäng","upvotes":"Uppröstningar","upvoters":"Uppröstare","downvotes":"Nedröstningar","downvoters":"Nedröstare","score":"poäng","status":"status","sticky":"Permanent","inactive":"inaktiv","author":"Skapad av","userId":"Användare","sorry_we_couldnt_find_any_posts":"Tyvärr kunde vi inte hitta några inlägg.","your_comment_has_been_deleted":"Din kommentar har tagits bort.","comment_":"Kommentar","delete_comment":"Ta Bort Kommentar","add_comment":"Lägg Till Kommentar","upvote":"upprösta","downvote":"nedrösta","link":"länk","edit":"Redigera","reply":"Svara","no_comments":"Inga kommentarer.","you_are_already_logged_in":"Du är redan inloggad","sorry_this_is_a_private_site_please_sign_up_first":"Tyvärr, detta är en privat sida. Vänligen bli medlem.","thanks_for_signing_up":"Tack för att du blev medlem!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Denna sida är för tillfället endast tillgänglig för inbjudna, vi talar om så fort vi får plats.","sorry_you_dont_have_the_rights_to_view_this_page":"Du har inte rättigheter att se denna sida.","sorry_you_do_not_have_the_rights_to_comments":"Tyvärr har du inte rättigheter att lämna kommentarer.","not_found":"Ej funnen!","were_sorry_whatever_you_were_looking_for_isnt_here":"Ursäkta, vad du letar efter verkar inte finnas här...","no_notifications":"Inga notifikationer","1_notification":"En notifikation","notifications":"notifikationer","mark_all_as_read":"Markera alla som lästa","your_post_has_been_deleted":"Ditt inlägg har tagits bort.","created":"Skapad","suggest_title":"Föreslå titel","short_url":"Kort URL","category":"Kategori","inactive_":"Inaktiv?","sticky_":"Permanent?","submission_date":"Inläggsdatum","submission_time":"Inläggstid","date":"Datum","submission":"Inlägg","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"OBS: detta inlägg väntar på godkännande, så den har inget inläggsdatum än.","user":"Användare","status_":"Status","approved":"Godkänd","rejected":"Avslaget","delete_post":"Ta Bort Inlägg","thanks_your_post_is_awaiting_approval":"Tack, ditt inlägg väntar på att bli godkänd.","sorry_couldnt_find_a_title":"Tyvärr kunde vi inte någon titel...","please_fill_in_an_url_first":"Vänligen fyll i en adress först!","share":"Dela","discuss":"Diskutera","upvote_":"Upprösta","votes":"röster","basescore":"baspoäng","clicks":"klick","views":"visningar","comment":"kommentera","point":"poäng","points":"poäng","please_complete_your_profile_below_before_continuing":"Vänligen fyll i din profil innan du fortsätter.","account":"Konto","username":"Användarnamn","display_name":"Visningsnamn","bio":"Biografi:","city":"Stad","twitter_username":"Twitter-konto","github_username":"GitHub-konto","site_url":"Hemside-adress","password":"Lösenord","change_password":"Byta lösenord?","old_password":"Gammalt lösenord","new_password":"Nytt lösenord","email_notifications":"E-post-notifikationer","new_users":"Nya användare","comments_on_my_posts":"Kommentarer på mina inlägg","replies_to_my_comments":"Svar på mina kommentarer","forgot_password":"Glömt lösenord?","profile_updated":"Profil uppdaterad","please_fill_in_your_email_below_to_finish_signing_up":"Vänligen fyll i din E-post för att bli medlem.","invite":"Bjud in","uninvite":"Avbryt inbjudning","make_admin":"Gör till admin","unadmin":"Gör inte till admin","delete_user":"Ta bort användare","are_you_sure_you_want_to_delete":"Är du säker att du vill ta bort ","reset_password":"Återställ lösenord","password_reset_link_sent":"Återställningslänk skickad!","name":"Namn:","comments_":"Kommentarer","karma":"Karma","is_invited":"Är inbjuden?","is_admin":"Är admin?","delete":"Ta bort","member_since":"Medlem sen","edit_profile":"Redigera profil","sign_in":"Logga in","sign_in_":"Logga in!","sign_up_":"Bli Medlem!","dont_have_an_account":"Har du inget konto?","already_have_an_account":"Har du redan ett konto?","sign_up":"Bli Medlem","please_fill_in_all_fields":"Vänligen fyll i samtliga fält","invite_":"Bjud in ","left":" kvar","invite_none_left":"Inbjudningar (inga kvar)","all":"Alla","invited":"Inbjuden?","uninvited":"Oinbjuden","filter_by":"Filtrera på","sort_by":"Sortera på","sorry_you_do_not_have_access_to_this_page":"Tyvärr, du har inte tillgång till denna sida","please_sign_in_first":"Vänligen logga in först.","sorry_you_have_to_be_an_admin_to_view_this_page":"Tyvärr måste du vara adminstratör för att se denna sida.","sorry_you_dont_have_permissions_to_add_new_items":"Tyvärr har du inte rättigheter att lägga till saker.","sorry_you_cannot_edit_this_post":"Tyvärr, du kan inte redigera detta inlägg.","sorry_you_cannot_edit_this_comment":"Tyvärr, du kan inte redigera denna kommentar.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Du måste vara inloggad som administratör för att lägga till nya kategorier.","you_need_to_login_or_be_invited_to_post_new_comments":"Du måste logga in eller vara inbjuden för att kommentera.","please_wait":"Vänligen vänta ","seconds_before_commenting_again":" sekunder innan du kommenterar igen.","your_comment_is_empty":"Din kommentar är tom.","you_dont_have_permission_to_delete_this_comment":"Du har inte tillåtelse att ta bort denna kommentar.","you_need_to_login_or_be_invited_to_post_new_stories":"Du måste logga in eller vara inbjuden för att skriva nya inlägg.","please_fill_in_a_headline":"Vänligen fyll i rubrik","this_link_has_already_been_posted":"Denna länk är redan inlagd","sorry_you_cannot_submit_more_than":"Tyvärr får du inte skapa mer än ","posts_per_day":" inlägg per dag","someone_replied_to_your_comment_on":"Någon svarade på din kommentar gällande","has_replied_to_your_comment_on":" har svarat på din kommentar gällande","read_more":"Läs mer","a_new_comment_on_your_post":"En ny kommentar på ditt inlägg","you_have_a_new_comment_by":"Du har en ny kommentar från ","on_your_post":" på ditt inlägg","has_created_a_new_post":" har skapat ett nytt inlägg","your_account_has_been_approved":"Ditt konto har blivit godkänt.","welcome_to":"Välkommen till ","start_posting":"Börja skapa inlägg.","please_fill_in_a_title":"Vänligen fyll i en titel","seconds_before_posting_again":" sekunder innan nästa inlägg","upvoted":"Uppröstad","posted_date":"Inlagt datum","posted_time":"Inlagt tid","profile":"Konto","sign_out":"Logga ut","you_ve_been_signed_out":"Du har loggat ut. Välkommen åter!","invitedcount":"Inbjudningar","actions":"Actions","invites_left":"Inbjudningar kvar","id":"ID","github":"GitHub","site":"Hemsida","upvoted_posts":"Uppröstade inlägg","downvoted_posts":"Nedröstade inlägg","mark_as_read":"Markera som läst","pending":"Väntar","loading":"Laddar...","submit":"Skicka","you_must_be_logged_in":"Du måste vara inloggad.","are_you_sure":"Är du säker?","please_log_in_first":"Vänligen logga in först.","please_log_in_to_comment":"Vänligen logga in för att kommentera.","sign_in_sign_up_with_twitter":"Logga in eller bli medlem med Twitter","load_more":"Ladda mer","most_popular_posts":"De mest populära inläggen just nu.","newest_posts":"De nyaste inläggen just nu.","highest_ranked_posts_ever":"De högst rankade inläggen någonsin.","the_profile_of":"Kontot tillhörande","posts_awaiting_moderation":"Inlägg väntar på administration.","future_scheduled_posts":"Framtida schemalagda inlägg.","users_dashboard":"Användarnas inställningspanel.","telescope_settings_panel":"Telescopes inställningspanel.","various_utilities":"Diverse verktyg."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/tr.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["tr"] = ["Turkish","Türkçe"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                    // 9
  TAPi18n.translations["tr"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                         // 13
  TAPi18n.translations["tr"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["tr"][namespace], {"menu":"Menü","top":"En Yukarı","new":"Yeni","digest":"Toplu","users":"Kullanıcılar","settings":"Ayarlar","admin":"Admin?","post":"Paylaş","toolbox":"Araç Kutusu","sign_up_sign_in":"Kayıt Ol/Giriş Yap","my_account":"Hesabım","view_profile":"Profili gör","edit_account":"Hesabı Ayarla","new_posts":"Yeni paylaşımlar","your_comment_has_been_deleted":"Yorumunuz silindi","comment_":"Yorum","delete_comment":"Yorumu Sil","add_comment":"Yorum Ekle","upvote":"1","downvote":"-1","link":"link","edit":"Düzenle","reply":"Cevap","no_comments":"Yorum yok","you_are_already_logged_in":"Zaten giriş yapmış durumdasınız","sorry_this_is_a_private site_please_sign_up_first":"Özür dileriz, bu özel bir site. Lütfen önce giriş yapınız","thanks_for_signing_up":"Kayıt olduğunuz için teşekkür ederiz","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Bu site sadece davetliler için ama bir yer açılınca size haber vereceğiz","sorry_you_dont_have_the_rights_to_view_this_page":"Özür dileriz, bu sayfaya erişiminiz yok","not_found":"Bulunamadı!","ere_sorry_whatever_you_were_looking_for_isnt_here":"Özür dileriz, aradığınız şey burada değil.","no_notifications":"Bildirim yok","1_notification":"1 bildirim","notifications":"Bildirimler","mark_all_as_read":"Hepsini okunmuş olarak işaretle","your_post_has_been_deleted":"Paylaşımınız silindi","created":"Oluşturuldu","title":"Başlık","suggest_title":"Başlık öner","url":"URL","short_URL":"Kısa URL","body":"Metin","category":"Kategori","inactive_":"Etkin değil?","sticky_":"Yapışkan?","submission_date":"Yayın tarihi","submission_time":"Yayın zamanı","date":"Tarih","submission":"Yayın","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Bu paylaşım hala onay bekliyor, bu nedenle henüz yayın tarihi yok","user":"Kullanıcı","status":"Durum","approved":"Onaylandı","rejected":"Reddedildi","delete_post":"Paylaşımı sil","thanks_your_post_is_awaiting_approval":"Teşekkürler, paylaşımınız onay bekliyor","sorry_couldnt_find_a_title":"Özür dileriz, bir başlık bulamadık","please_fill_in_an_url_first":"Lütfen önce bir URL giriniz","share":"Paylaş","discuss":"Yorum yap","upvote_":"Beğen","sticky":"Yapışkan","votes":"oylar","baseScore":"temel skor","score":"skor","clicks":"tıklamalar","inactive":"etkin değil","comment":"yorum","comments":"Yorumlar","point":"nokta","points":"noktalar","please_complete_your_profile_below_before_continuing":"Lütfen devam etmeden önce aşağıdaki profilinizi tamamlayınız","account":"Hesap","username":"Kullanıcı adı","display_name":"Görülen isim","email":"Eposta","bio":"Bio:","password":"şifre","change_password":"şifreyi değiştir?","old_password":"Eski şifre","new_password":"Yeni şifre","email_notifications":"e-posta bildirimi","comments_on_my_posts":"Paylaşımımdaki yorumlar","replies_to_my_comments":"Yorumlarıma cevaplar","forgot_password":"Şifreyi unuttunuz mu?","profile_updated":"Profil güncellendi","please_fill_in_your_email_below_to_finish_signing_up":"Lütfen kaydınızı tamamlamak için aşağıya e-posta adresinizi giriniz","invite":"Davet et","uninvite":"Daveti geri al","make_admin":"Admin yap","unadmin":"Adminliği kaldır","delete_user":"Kullanıcıyı sil","are_you_sure_you_want_to_delete":"Silmek istediğinize emin misiniz?","reset_password":"Şifreyi sıfırla","password_reset_link_sent":"Şifre sıfırlama bağlantısı gönderildi!","name":"İsim","posts":"Paylaşımlar","karma":"Karma","is_invited":"Davet edildi mi?","is_admin":"Admin mi?","delete":"Sil","member_since":"Üyelik başlangıcı","edit_profile":"Profili değiştir","sign_in":"Giriş yap","sign_in_":"Giriş yap!","sign_up_":"Kayıt ol!","dont_have_an_account":"Hesabınız yok mu?","already_have_an_account":"Hesabınız var mı?","sign_up":"Kayıt ol","please_fill_in_all_fields":"Lütfen bütün alanları doldurunuz","invite ":"Davet et","left":" kalan","invite_none_left":"Davet et (hiç kalmadı)","all":"Hepsi","invited":"Davet edildi mi?","uninvited":"Davet edilmedi","filter_by":"Filtreleme kıstası","sort_by":"Sıralama kıstası","sorry_you_do_not_have_access_to_this_page":"Özür dileriz, bu sayfaya erişim izniniz yok","please_sign_in_first":"Lütfen önce giriş yapın","sorry_you_have_to_be_an_admin_to_view_this_page":"Özür dileriz, sadece adminler bu sayfayı görebilir","sorry_you_dont_have_permissions_to_add_new_items":"Özür dileriz, yeni bir şeyler eklemeye yetkiniz yok","sorry_you_cannot_edit_this_post":"Özür dileriz, bu paylaşımı değiştiremezsiniz","sorry_you_cannot_edit_this_comment":"Özür dileriz, bu yorumu değiştiremezsiniz","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Yeni kategori eklemek için admin olarak giriş yapmanız lazım","you_need_to_login_or_be_invited_to_post_new_comments":"Yorum yapmak için giriş yapmanız veya davet edilmeniz lazım","please_wait":"Lütfen bekleyin ","seconds_before_commenting_again":" saniye daha beklemeniz lazım tekrar yorum yapmadan önce","your_comment_is_empty":"Yorumunuz boş","you_dont_have_permission_to_delete_this_comment":"Bu yorumu silmek için izniniz yok","you_need_to_login_or_be_invited_to_post_new_stories":"Paylaşım yapmak için giriş yapmanız ya da davet edilmiş olmanız lazım","please_fill_in_a_headline":"Lütfen bir başlık girin","this_link_has_already_been_posted":"Bu bağlantı daha önce paylaşılmıştı","sorry_you_cannot_submit_more_than":"Özür dileriz, bu sayıdan daha fazla paylaşamazsınız: ","posts_per_day":" paylaşım / gün","someone_replied_to_your_comment_on":"Birisi yorumunuza cevap verdi şu konu hakkında: ","has_replied_to_your_comment_on":" yorumunuza cevap verdi şu konu hakkında:","read_more":"Daha fazla oku","a_new_comment_on_your_post":"Şu paylaşımınıza yeni bir yorum yapıldı: ","you_have_a_new_comment_by":"Şu kişiden yeni bir yorum aldınız: ","on_your_post":" paylaşımınızda","has_created_a_new_post":" yeni bir paylaşım yaptı","your_account_has_been_approved":"Hesabınız onaylandı","welcome_to":"Hoşgeldiniz ","start_posting":"Paylaşıma başlayın","please_fill_in_a_title":"Lütfen bir başlık girin","seconds_before_posting_again":" saniye daha beklemeniz lazım tekrar paylaşım yapmadan önce","upvoted":"Yukarı oylandı","posted_date":"Paylaşım Tarihi","posted_time":"Paylaşım Zamanı","profile":"Profil","sign_out":"Çıkış Yap","invitedcount":"Davetiye Sayısı","invites":"Davetiyeler","actions":"Yapılanlar","invites_left":"davetiye kaldı","id":"ID","github":"GitHub","site":"Site","upvoted_posts":"Yukarı oy alan paylaşımlar","downvoted_posts":"Aşağı oy alan paylaşımlar","mark_as_read":"Okundu olarak işaretle","pending":"Onay bekliyor","loading":"Yüklüyor","submit":"Gönder","you_must_be_logged_in":"Giriş yapmanız lazım","are_you_sure":"Emin misiniz?","please_log_in_first":"Lütfen önce giriş yapın","sign_in_sign_up_with_twitter":"Twitter ile kayıt ol/giriş yap","load_more":"Daha fazla yükle"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/vn.i18n.js                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["vn"] = ["vn","vn"];                                                                       // 8
if(_.isUndefined(TAPi18n.translations["vn"])) {                                                                    // 9
  TAPi18n.translations["vn"] = {};                                                                                 // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["vn"][namespace])) {                                                         // 13
  TAPi18n.translations["vn"][namespace] = {};                                                                      // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["vn"][namespace], {"menu":"Danh mục","view":"Xem","top":"Top","new":"New","best":"Best","digest":"Digest","users":"Người dùng","settings":"Settings","admin":"Admin","post":"Bài","toolbox":"Toolbox","sign_up_sign_in":"Đăng ký/Đăng nhập","my_account":"Tài khoản","view_profile":"Xem hồ sơ","edit_account":"Chỉnh sửa","new_posts":"Bài mới","title":"Tiêu đề","siteUrl":"Địa chỉ URL","tagline":"Tagline","requireViewInvite":"Require Invite to View","requirePostInvite":"Require Invite to Post","requirePostsApproval":"Require Posts to be Approved","defaultEmail":"Default Email","scoreUpdateInterval":"Score Update Interval","defaultView":"Default View","postInterval":"Post Interval","commentInterval":"Comment Interval","maxPostsPerDay":"Max Posts Per Day","startInvitesCount":"Invites Start Count","postsPerPage":"Posts Per Page","logoUrl":"Logo URL","logoHeight":"Logo Height","logoWidth":"Logo Width","language":"Language","backgroundCSS":"Background CSS","buttonColor":"Button Color","buttonTextColor":"Button Text Color","headerColor":"Header Color","headerTextColor":"Header Text Color","twitterAccount":"Twitter Account","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer Code","extraCode":"Extra Code","emailFooter":"Email Footer","notes":"Notes","debug":"Debug Mode","general":"General","invites":"Mời","email":"Email","scoring":"Scoring","posts":"Bài","comments":"ý kiến","logo":"Logo","extras":"Extras","colors":"Colors","integrations":"Integrations","createdAt":"Tạo lúc","postedAt":"Đăng lúc","url":"URL","body":"Nội dung","htmlBody":"HTML Body","viewCount":"Số lần xem","commentCount":"Số lần bình luận","commenters":"Bình luận","lastCommentedAt":"Bình luận lúc","clickCount":"Click Count","baseScore":"Base Score","upvotes":"Upvotes","upvoters":"Upvoters","downvotes":"Downvotes","downvoters":"Downvoters","score":"điểm","status":"trạng thái","sticky":"Sticky","inactive":"inactive","author":"Author","userId":"User","sorry_we_couldnt_find_any_posts":"Xin lỗi, thông tin không được tìm thấy.","your_comment_has_been_deleted":"Ý kiến của bạn đã được xóa.","comment_":"Ý kiến","delete_comment":"Xóa ý kiến","add_comment":"Thêm ý kiến","upvote":"Thích","downvote":"Không thích","link":"link","edit":"Sửa","reply":"Trả lời","no_comments":"Không ý kiến.","you_are_already_logged_in":"Bạn đã đăng nhập","sorry_this_is_a_private_site_please_sign_up_first":"Xin lỗi, bạn cần đăng ký để xem thông tin.","thanks_for_signing_up":"Cám ơn bạn đã đăng ký!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"Trang này hiện chỉ dùng cho những người được mời, chúng tôi sẽ cho bạn biết khi sẵn sàng.","sorry_you_dont_have_the_rights_to_view_this_page":"Xin lỗi, bạn không có quyền để xem trang này.","sorry_you_do_not_have_the_rights_to_comments":"Xin lỗi, hiện tại bạn không có quyền để đăng ý kiến.","not_found":"Không tìm thấy!","were_sorry_whatever_you_were_looking_for_isnt_here":"Chúng tôi xin lỗi vì không có thông tin bạn đang tìm kiếm...","no_notifications":"Không có thông báo","1_notification":"1 thông báo","notifications":"Thông báo","mark_all_as_read":"Đánh dấu đã đọc","your_post_has_been_deleted":"Bài của bạn đã được xóa.","created":"Tạo","suggest_title":"Gợi ý tiêu đề","short_url":"URL ngắn","category":"Loại","inactive_":"Ngừng kích hoạt?","sticky_":"Sticky?","submission_date":"Ngày đăng","submission_time":"Giờ đăng","date":"Ngày","submission":"Đăng","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Lưu ý: bài này đang đợi xét duyệt nên chưa có thời gian đăng bài.","user":"Người dùng","status_":"Trạng thái","approved":"Đồng ý","rejected":"Từ chối","delete_post":"Xóa bài","thanks_your_post_is_awaiting_approval":"Cảm ơn, bài của bạn đang đợi phê duyệt.","sorry_couldnt_find_a_title":"Xin lỗi, không có tiêu đề...","please_fill_in_an_url_first":"Làm ơn nhập địa chỉ website!","share":"Chia sẻ","discuss":"Bình luận","upvote_":"Thích","votes":"phiếu","basescore":"baseScore","clicks":"clicks","views":"xem","comment":"ý kiến","point":"điểm","points":"điểm","please_complete_your_profile_below_before_continuing":"Xin điền thông tin hồ sơ của bạn để tiếp tục.","account":"Tài khoản","username":"Tên đăng nhập","display_name":"Tên xuất hiện","bio":"Bio:","twitter_username":"Tài khoản Twitter","github_username":"Tài khoản GitHub","site_url":"Địa chỉ website","password":"Mật khẩu","change_password":"Thay đổi mật khẩu?","old_password":"Mật khẩu cũ","new_password":"Mật khẩu mới","email_notifications":"Email thông báo","new_users":"Người dùng mới","comments_on_my_posts":"Bình luận trên bài của tôi","replies_to_my_comments":"Trả lời ý kiến của tôi","forgot_password":"Quyên mật khẩu?","profile_updated":"Cập nhật hồ sơ","please_fill_in_your_email_below_to_finish_signing_up":"Xin nhập email của bạn dưới đây để hoàn thành việc đăng ký.","invite":"Mời","uninvite":"Không mời","make_admin":"Thiết lập Admin","unadmin":"Ngắt Admin","delete_user":"Xóa người dùng","are_you_sure_you_want_to_delete":"Bạn có chắc muốn xóa?","reset_password":"Thiết lập lại mật khẩu","password_reset_link_sent":"Mật khẩu đã được gửi!","name":"Tên:","comments_":"Ý kiến","karma":"Karma","is_invited":"Được mời?","is_admin":"Admin?","delete":"Xóa","member_since":"Thành viên từ","edit_profile":"Sửa hồ sơ","sign_in":"Đăng nhập","sign_in_":"Đăng nhập!","sign_up_":"Đăng ký!","dont_have_an_account":"Bạn không có tài khoản?","already_have_an_account":"Bạn đã có tài khoản?","sign_up":"Đăng ký","please_fill_in_all_fields":"Nhập thông tin","invite_":"Mời ","left":" left","invite_none_left":"Invite (none left)","all":"Tất cả","invited":"Được mời?","uninvited":"Không mời","filter_by":"Lọc theo","sort_by":"Sắp xếp theo","sorry_you_do_not_have_access_to_this_page":"Xin lỗi, bạn không có quyền truy cập vào trang này","please_sign_in_first":"Xin đăng nhập trước.","sorry_you_have_to_be_an_admin_to_view_this_page":"Xin lỗi, bản phải có quyền Admin để xem trang này.","sorry_you_dont_have_permissions_to_add_new_items":"Xin lỗi, bạn không có quyền thêm.","sorry_you_cannot_edit_this_post":"Xin lỗi, bạn không thể sửa bài này.","sorry_you_cannot_edit_this_comment":"Xin lỗi, bạn không thể sửa ý kiến này.","you_need_to_login_and_be_an_admin_to_add_a_new_category":"Bạn phải đăng nhập và là Admin để tạo thẻ.","you_need_to_login_or_be_invited_to_post_new_comments":"Bạn phải đăng nhập và được mời để đăng ý kiến.","please_wait":"Làm ơn đợi ","seconds_before_commenting_again":" một vài giây để đăng ý kiến tiếp","your_comment_is_empty":"Xin nhập ý kiến.","you_dont_have_permission_to_delete_this_comment":"Bạn không có quyền để xóa ý kiến này.","you_need_to_login_or_be_invited_to_post_new_stories":"Bạn phải đăng nhập và được mời để đăng bài mới.","please_fill_in_a_headline":"Xin nhập thông tin","this_link_has_already_been_posted":"Đường dẫn này đã được đăng","sorry_you_cannot_submit_more_than":"Xin lỗi, bạn không thể đăng nhiều hơn ","posts_per_day":" bài mỗi ngày","someone_replied_to_your_comment_on":"Có người trả lời ý kiến của bạn","has_replied_to_your_comment_on":" đã trả lời ý kiến của bạn","read_more":"Xem tiếp","a_new_comment_on_your_post":"Có ý kiến mới trên bài của bạn","you_have_a_new_comment_by":"Bạn có ý kiến mới bởi ","on_your_post":" trên bài của bạn","has_created_a_new_post":" đã bạo bài mới","your_account_has_been_approved":"Tài khoản của bạn đã được đồng ý.","welcome_to":"Xin chào ","start_posting":"Bắt đầu đăng bài.","please_fill_in_a_title":"xin nhập tiêu đề","seconds_before_posting_again":" một vài giây để đăng lại","upvoted":"Thích","posted_date":"Ngày đăng","posted_time":"Giờ đăng","profile":"Hồ sơ","sign_out":"Đăng xuất","you_ve_been_signed_out":"Bạn đã đăng xuất, hẹn sớm gặp lại","invitedcount":"đếmMoi","actions":"Actions","invites_left":"invites left","id":"ID","github":"GitHub","site":"website","upvoted_posts":"Thích bài","downvoted_posts":"Không thích bài","mark_as_read":"Đã đọc","pending":"Pending","loading":"Tải...","submit":"Gửi","you_must_be_logged_in":"Bạn phải đăng nhập.","are_you_sure":"Bạn có chắn?","please_log_in_first":"Xin đăng nhập trước.","please_log_in_to_comment":"Đăng nhập để bình luận","sign_in_sign_up_with_twitter":"Đăng ký/Đăng nhập với Twitter","load_more":"Xem thêm","most_popular_posts":"Những bài được xem nhiều nhất","newest_posts":"Những bài mới nhất.","highest_ranked_posts_ever":"Những bài được thích nhất.","the_profile_of":"Hồ sơ của","posts_awaiting_moderation":"Bài đang đợi để sửa","future_scheduled_posts":"Bài đăng theo lịch","users_dashboard":"Bảng người dùng.","telescope_settings_panel":"Bản thiết lập Telescope.","various_utilities":"Một số tiện ích."});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:core/Users/sacha/Dev/Telescope/packages/telescope-core/i18n/zh-CN.i18n.js                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "project",                                                                                      // 2
    namespace = "project";                                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","中文"];                                                       // 8
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                 // 9
  TAPi18n.translations["zh-CN"] = {};                                                                              // 10
}                                                                                                                  // 11
                                                                                                                   // 12
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                      // 13
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                   // 14
}                                                                                                                  // 15
                                                                                                                   // 16
_.extend(TAPi18n.translations["zh-CN"][namespace], {"view":"视图","menu":"菜单","top":"置顶","new":"最新","digest":"摘要","users":"用户","settings":"设置","admin":"管理","post":"提交","toolbox":"工具箱","sign_up_sign_in":"注册/登录","my_account":"帐号","view_profile":"个人资料","edit_account":"编辑帐号","new_posts":"最新主题","your_comment_has_been_deleted":"你的评论已经被删除","comment_":"评论","delete_comment":"删除评论","add_comment":"评论","upvote":"顶","downvote":"踩","link":"链接","edit":"编辑","reply":"回复","no_comments":"暂时没有评论","you_are_already_logged_in":"你已经登录","sorry_this_is_a_private_site_please_sign_up_first":"对不起, 请先注册再进行后续操作","thanks_for_signing_up":"感谢您的注册!","the_site_is_currently_invite_only_but_we_will_let_you_know_as_soon_as_a_spot_opens_up":"该站点暂时只允许邀请访问, 如果开放了我们会让你知道","sorry_you_dont_have_the_rights_to_view_this_page":"抱歉你没有权利查看此页面","not_found":"页面不存在","were_sorry_whatever_you_were_looking_for_isnt_here":"抱歉没有你要查看的内容!","no_notifications":"无消息","1_notification":"1 个消息","notifications":"消息","mark_all_as_read":"标记所有","your_post_has_been_deleted":"你的帖子已经被删除","created":"创建","title":"标题","suggest_title":"显示标题","url":"链接地址","short_url":"短网址","body":"内容","category":"分类","inactive_":"Inactive?","sticky_":"置顶?","submission_date":"提交日期","submission_time":"提交时间","date":"日期","submission":"提交","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"这篇文章没有进行审核.","user":"用户","status_":"专题","approved":"审核","rejected":"拒接","delete_post":"删除帖子","thanks_your_post_is_awaiting_approval":"感谢, 你的帖子正在等待批准.","sorry_couldnt_find_a_title":"抱歉找不相关话题","please_fill_in_an_url_first":"请在第一栏填写链接","share":"分享","discuss":"讨论","upvote_":"顶","sticky":"置顶","status":"状态","votes":"得票","basescore":"基础得分","score":"得分","clicks":"点击","views":"views","inactive":"不活跃","comment":"评论","comments":"评论数","point":"点击","points":"点击数","please_complete_your_profile_below_before_continuing":"在继续之前请填写相关资料.","account":"帐号","username":"用户名","display_name":"昵称","email":"Email","bio":"Bio:","password":"密码","change_password":"修改密码?","old_password":"旧密码","new_password":"新密码","email_notifications":"邮箱提醒","comments_on_my_posts":"评论我的主题时","replies_to_my_comments":"回复我的回复时","forgot_password":"忘记密码?","profile_updated":"更新资料","please_fill_in_your_email_below_to_finish_signing_up":"请填写你的电子邮件完成注册.","invite":"邀请","uninvite":"未激活","make_admin":"设置为管理员","unadmin":"取消管理资格","delete_user":"删除用户","are_you_sure_you_want_to_delete":"你确定要删除用户吗 ","reset_password":"重置密码","password_reset_link_sent":"密码重置链接已发送","name":"名字:","posts":"帖子数","comments_":"评论数","karma":"Karma","is_invited":"邀请用户?","is_admin":"管理员?","delete":"删除","member_since":"加入至今","edit_profile":"修改个人资料","sign_in":"登录","sign_in_":"登录!","sign_up_":"注册!","dont_have_an_account":"还没有帐号?","already_have_an_account":"已有帐号?","sign_up":"注册","please_fill_in_all_fields":"请填写完整","invite_":"邀请 ","left":" restante","invite_none_left":"Invite (none left)","all":"全部","invited":"邀请?","uninvited":"未被邀请","filter_by":"过滤","sort_by":"排序","sorry_you_do_not_have_access_to_this_page":"抱歉你没有权限访问此页面","please_sign_in_first":"请先登录.","sorry_you_have_to_be_an_admin_to_view_this_page":"抱歉你必须是管理员才能查看此页面","sorry_you_dont_have_permissions_to_add_new_items":"抱歉你没有权限添加新项.","sorry_you_cannot_edit_this_post":"对不起你不能编辑这个帖子","sorry_you_cannot_edit_this_comment":"对不起你不能编辑这个评论","you_need_to_login_and_be_an_admin_to_add_a_new_category":"你必须登录并且是管理员才能添加新类别.","you_need_to_login_or_be_invited_to_post_new_comments":"你需要登录或被邀请才能发表新的评论.","please_wait":"请稍等 ","seconds_before_commenting_again":" 秒后在评论","your_comment_is_empty":"你的评论是空的.","you_dont_have_permission_to_delete_this_comment":"你没有删除此评论的权限.","you_need_to_login_or_be_invited_to_post_new_stories":"你需要登录或被邀请才能发布新的内容.","please_fill_in_a_headline":"请填写一个标题","this_link_has_already_been_posted":"这个链接已发布","sorry_you_cannot_submit_more_than":"对不起, 内容不能超过","posts_per_day":" 评价每日发帖","someone_replied_to_your_comment_on":"有人回复了你的评论","has_replied_to_your_comment_on":" 已经有人回复了你的评论","read_more":"查看更多","a_new_comment_on_your_post":"你发表的主题有新的评论","you_have_a_new_comment_by":"你有一个新的评论在 ","on_your_post":" 在你的帖子","has_created_a_new_post":" 发一个新帖","your_account_has_been_approved":"你的帐号已被批准","welcome_to":"欢迎来到 ","start_posting":"开始发布.","please_fill_in_a_title":"请填写标题","seconds_before_posting_again":"秒前发布","upvoted":"最多投票","posted_date":"发布日期","posted_time":"发布时间","profile":"个人中心","sign_out":"登出","invitedcount":"邀请总数","invites":"邀请","actions":"操作","invites_left":"invites left","id":"ID","github":"GitHub","site":"网址","upvoted_posts":"最多踩","downvoted_posts":"Downvoted Posts","mark_as_read":"Mark as read","pending":"悬而未决...","loading":"加载中...","submit":"提交","you_must_be_logged_in":"你必须登录.","are_you_sure":"是否确定?","please_log_in_first":"请先登录","sign_in_sign_up_with_twitter":"使用微博等/注册","load_more":"加载更多","administration":"管理","best":"精华"});
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:core'] = {
  coreSubscriptions: coreSubscriptions
};

})();

//# sourceMappingURL=telescope_core.js.map
