(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var coreSubscriptions = Package['telescope:core'].coreSubscriptions;
var Herald = Package['kestanous:herald'].Herald;
var Handlebars = Package.ui.Handlebars;
var OriginalHandlebars = Package['cmather:handlebars-server'].OriginalHandlebars;
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
var Herald, notificationEmail, __, getUnsubscribeLink, buildEmailNotification, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/notifications.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// add new post notification callback on post submit                                                               // 1
function postSubmitNotification (post) {                                                                           // 2
                                                                                                                   // 3
  var adminIds = _.pluck(Users.find({'isAdmin': true}, {fields: {_id:1}}).fetch(), '_id');                         // 4
  var notifiedUserIds = _.pluck(Users.find({'telescope.notifications.posts': true}, {fields: {_id:1}}).fetch(), '_id');
                                                                                                                   // 6
  // remove post author ID from arrays                                                                             // 7
  adminIds = _.without(adminIds, post.userId);                                                                     // 8
  notifiedUserIds = _.without(notifiedUserIds, post.userId);                                                       // 9
                                                                                                                   // 10
  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {                                          // 11
    // if post is pending, only notify admins                                                                      // 12
    Herald.createNotification(adminIds, {courier: 'newPendingPost', data: post});                                  // 13
  } else if (!!notifiedUserIds.length) {                                                                           // 14
    // if post is approved, notify everybody                                                                       // 15
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: post});                                  // 16
  }                                                                                                                // 17
  return post;                                                                                                     // 18
                                                                                                                   // 19
}                                                                                                                  // 20
Telescope.callbacks.add("postSubmitAsync", postSubmitNotification);                                                // 21
                                                                                                                   // 22
function postApprovedNotification (post) {                                                                         // 23
  Herald.createNotification(post.userId, {courier: 'postApproved', data: post});                                   // 24
  return post;                                                                                                     // 25
}                                                                                                                  // 26
Telescope.callbacks.add("postApprovedAsync", postApprovedNotification);                                            // 27
                                                                                                                   // 28
// add new comment notification callback on comment submit                                                         // 29
function addCommentNotification (comment) {                                                                        // 30
                                                                                                                   // 31
  if(Meteor.isServer && !comment.disableNotifications){                                                            // 32
                                                                                                                   // 33
    var post = Posts.findOne(comment.postId),                                                                      // 34
        notificationData = {                                                                                       // 35
          comment: _.pick(comment, '_id', 'userId', 'author', 'body'),                                             // 36
          post: _.pick(post, '_id', 'userId', 'title', 'url')                                                      // 37
        },                                                                                                         // 38
        postAuthor = Users.findOne(post.userId),                                                                   // 39
        userIdsNotified = [];                                                                                      // 40
                                                                                                                   // 41
    // 1. Notify author of post (if they have new comment notifications turned on)                                 // 42
    //    but do not notify author of post if they're the ones posting the comment                                 // 43
    if (Users.getSetting(postAuthor, "notifications.comments", true) && comment.userId !== postAuthor._id) {       // 44
      Herald.createNotification(post.userId, {courier: 'newComment', data: notificationData});                     // 45
      userIdsNotified.push(post.userId);                                                                           // 46
    }                                                                                                              // 47
                                                                                                                   // 48
    // 2. Notify author of comment being replied to                                                                // 49
    if (!!comment.parentCommentId) {                                                                               // 50
                                                                                                                   // 51
      var parentComment = Comments.findOne(comment.parentCommentId);                                               // 52
                                                                                                                   // 53
      // do not notify author of parent comment if they're also post author or comment author                      // 54
      // (someone could be replying to their own comment)                                                          // 55
      if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {                       // 56
                                                                                                                   // 57
        var parentCommentAuthor = Users.findOne(parentComment.userId);                                             // 58
                                                                                                                   // 59
        // do not notify parent comment author if they have reply notifications turned off                         // 60
        if (Users.getSetting(parentCommentAuthor, "notifications.replies", true)) {                                // 61
                                                                                                                   // 62
          // add parent comment to notification data                                                               // 63
          notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author');                       // 64
                                                                                                                   // 65
          Herald.createNotification(parentComment.userId, {courier: 'newReply', data: notificationData});          // 66
          userIdsNotified.push(parentComment.userId);                                                              // 67
        }                                                                                                          // 68
      }                                                                                                            // 69
                                                                                                                   // 70
    }                                                                                                              // 71
                                                                                                                   // 72
    // 3. Notify users subscribed to the thread                                                                    // 73
    // TODO: ideally this would be injected from the telescope-subscribe-to-posts package                          // 74
    if (!!post.subscribers) {                                                                                      // 75
                                                                                                                   // 76
      // remove userIds of users that have already been notified                                                   // 77
      // and of comment author (they could be replying in a thread they're subscribed to)                          // 78
      var subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);               // 79
      Herald.createNotification(subscriberIdsToNotify, {courier: 'newCommentSubscribed', data: notificationData}); // 80
                                                                                                                   // 81
      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);                                             // 82
                                                                                                                   // 83
    }                                                                                                              // 84
                                                                                                                   // 85
  }                                                                                                                // 86
                                                                                                                   // 87
  return comment;                                                                                                  // 88
                                                                                                                   // 89
}                                                                                                                  // 90
                                                                                                                   // 91
Telescope.callbacks.add("commentSubmitAsync", addCommentNotification);                                             // 92
                                                                                                                   // 93
var emailNotifications = {                                                                                         // 94
  fieldName: 'emailNotifications',                                                                                 // 95
  fieldSchema: {                                                                                                   // 96
    type: Boolean,                                                                                                 // 97
    optional: true,                                                                                                // 98
    defaultValue: true,                                                                                            // 99
    autoform: {                                                                                                    // 100
      group: 'notifications',                                                                                      // 101
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'                // 102
    }                                                                                                              // 103
  }                                                                                                                // 104
};                                                                                                                 // 105
Settings.addField(emailNotifications);                                                                             // 106
                                                                                                                   // 107
// make it possible to disable notifications on a per-comment basis                                                // 108
Comments.addField(                                                                                                 // 109
  {                                                                                                                // 110
    fieldName: 'disableNotifications',                                                                             // 111
    fieldSchema: {                                                                                                 // 112
      type: Boolean,                                                                                               // 113
      optional: true,                                                                                              // 114
      autoform: {                                                                                                  // 115
        omit: true                                                                                                 // 116
      }                                                                                                            // 117
    }                                                                                                              // 118
  }                                                                                                                // 119
);                                                                                                                 // 120
                                                                                                                   // 121
// Add notifications options to user profile settings                                                              // 122
Users.addField([                                                                                                   // 123
  {                                                                                                                // 124
    fieldName: 'telescope.notifications.users',                                                                    // 125
    fieldSchema: {                                                                                                 // 126
      label: 'New users',                                                                                          // 127
      type: Boolean,                                                                                               // 128
      optional: true,                                                                                              // 129
      defaultValue: false,                                                                                         // 130
      editableBy: ['admin'],                                                                                       // 131
      autoform: {                                                                                                  // 132
        group: 'Email Notifications'                                                                               // 133
      }                                                                                                            // 134
    }                                                                                                              // 135
  },                                                                                                               // 136
  {                                                                                                                // 137
    fieldName: 'telescope.notifications.posts',                                                                    // 138
    fieldSchema: {                                                                                                 // 139
      label: 'New posts',                                                                                          // 140
      type: Boolean,                                                                                               // 141
      optional: true,                                                                                              // 142
      defaultValue: false,                                                                                         // 143
      editableBy: ['admin', 'member'],                                                                             // 144
      autoform: {                                                                                                  // 145
        group: 'Email Notifications'                                                                               // 146
      }                                                                                                            // 147
    }                                                                                                              // 148
  },                                                                                                               // 149
  {                                                                                                                // 150
    fieldName: 'telescope.notifications.comments',                                                                 // 151
    fieldSchema: {                                                                                                 // 152
      label: 'Comments on my posts',                                                                               // 153
      type: Boolean,                                                                                               // 154
      optional: true,                                                                                              // 155
      defaultValue: true,                                                                                          // 156
      editableBy: ['admin', 'member'],                                                                             // 157
      autoform: {                                                                                                  // 158
        group: 'Email Notifications'                                                                               // 159
      }                                                                                                            // 160
    }                                                                                                              // 161
  },                                                                                                               // 162
  {                                                                                                                // 163
    fieldName: 'telescope.notifications.replies',                                                                  // 164
    fieldSchema: {                                                                                                 // 165
      label: 'Replies to my comments',                                                                             // 166
      type: Boolean,                                                                                               // 167
      optional: true,                                                                                              // 168
      defaultValue: true,                                                                                          // 169
      editableBy: ['admin', 'member'],                                                                             // 170
      autoform: {                                                                                                  // 171
        group: 'Email Notifications'                                                                               // 172
      }                                                                                                            // 173
    }                                                                                                              // 174
  }                                                                                                                // 175
]);                                                                                                                // 176
                                                                                                                   // 177
function setNotificationDefaults (user) {                                                                          // 178
  // set notifications default preferences                                                                         // 179
  user.telescope.notifications = {                                                                                 // 180
    users: false,                                                                                                  // 181
    posts: false,                                                                                                  // 182
    comments: true,                                                                                                // 183
    replies: true                                                                                                  // 184
  };                                                                                                               // 185
  return user;                                                                                                     // 186
}                                                                                                                  // 187
Telescope.callbacks.add("onCreateUser", setNotificationDefaults);                                                  // 188
                                                                                                                   // 189
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/herald.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
                                                                                                                   // 1
// send emails every second when in dev environment                                                                // 2
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)                                                              // 3
  Herald.settings.queueTimer = 1000;                                                                               // 4
                                                                                                                   // 5
Meteor.startup(function () {                                                                                       // 6
                                                                                                                   // 7
  Herald.collection.deny({                                                                                         // 8
    update: !Users.can.editById,                                                                                   // 9
    remove: !Users.can.editById                                                                                    // 10
  });                                                                                                              // 11
                                                                                                                   // 12
  // disable all email notifications when "emailNotifications" is set to false                                     // 13
  Herald.settings.overrides.email = !Settings.get('emailNotifications', true);                                     // 14
                                                                                                                   // 15
});                                                                                                                // 16
                                                                                                                   // 17
var commentEmail = function (userToNotify) {                                                                       // 18
  var notification = this;                                                                                         // 19
  // put in setTimeout so it doesn't hold up the rest of the method                                                // 20
  Meteor.setTimeout(function () {                                                                                  // 21
    notificationEmail = buildEmailNotification(notification);                                                      // 22
    Telescope.email.send(Users.getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);         // 23
  }, 1);                                                                                                           // 24
};                                                                                                                 // 25
                                                                                                                   // 26
var getCommenterProfileUrl = function (comment) {                                                                  // 27
  var user = Meteor.users.findOne(comment.userId);                                                                 // 28
  if (user) {                                                                                                      // 29
    return Users.getProfileUrl(user);                                                                              // 30
  } else {                                                                                                         // 31
    return Users.getProfileUrlBySlugOrId(comment.userId);                                                          // 32
  }                                                                                                                // 33
};                                                                                                                 // 34
                                                                                                                   // 35
var getAuthor = function (comment) {                                                                               // 36
  var user = Meteor.users.findOne(comment.userId);                                                                 // 37
  if (user) {                                                                                                      // 38
    return Users.getUserName(user);                                                                                // 39
  } else {                                                                                                         // 40
    return comment.author;                                                                                         // 41
  }                                                                                                                // 42
};                                                                                                                 // 43
                                                                                                                   // 44
// ------------------------------------------------------------------------------------------- //                  // 45
// -----------------------------------------  Posts ------------------------------------------ //                  // 46
// ------------------------------------------------------------------------------------------- //                  // 47
                                                                                                                   // 48
Herald.addCourier('newPost', {                                                                                     // 49
  media: {                                                                                                         // 50
    email: {                                                                                                       // 51
      emailRunner: function (user) {                                                                               // 52
        var p = Posts.getProperties(this.data);                                                                    // 53
        var subject = p.postAuthorName+' has created a new post: '+p.postTitle;                                    // 54
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPost')(p));                  // 55
        Telescope.email.send(Users.getEmail(user), subject, html);                                                 // 56
      }                                                                                                            // 57
    }                                                                                                              // 58
  }                                                                                                                // 59
  // message: function (user) { return 'email template?' }                                                         // 60
});                                                                                                                // 61
                                                                                                                   // 62
Herald.addCourier('newPendingPost', {                                                                              // 63
  media: {                                                                                                         // 64
    email: {                                                                                                       // 65
      emailRunner: function (user) {                                                                               // 66
        var p = Posts.getProperties(this.data);                                                                    // 67
        var subject = p.postAuthorName+' has a new post pending approval: '+p.postTitle;                           // 68
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPendingPost')(p));           // 69
        Telescope.email.send(Users.getEmail(user), subject, html);                                                 // 70
      }                                                                                                            // 71
    }                                                                                                              // 72
  }                                                                                                                // 73
});                                                                                                                // 74
                                                                                                                   // 75
Herald.addCourier('postApproved', {                                                                                // 76
  media: {                                                                                                         // 77
    onsite: {},                                                                                                    // 78
    email: {                                                                                                       // 79
      emailRunner: function (user) {                                                                               // 80
        var p = Posts.getProperties(this.data);                                                                    // 81
        var subject = 'Your post “'+p.postTitle+'” has been approved';                                             // 82
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailPostApproved')(p));             // 83
        Telescope.email.send(Users.getEmail(user), subject, html);                                                 // 84
      }                                                                                                            // 85
    }                                                                                                              // 86
  },                                                                                                               // 87
  message: {                                                                                                       // 88
    default: function () {                                                                                         // 89
      return Blaze.toHTML(Blaze.With(this, function () {                                                           // 90
        return Template.notification_post_approved;                                                                // 91
      }));                                                                                                         // 92
    }                                                                                                              // 93
  },                                                                                                               // 94
  transform: {                                                                                                     // 95
    postUrl: function () {                                                                                         // 96
      var p = Posts.getProperties(this.data);                                                                      // 97
      return p.postUrl;                                                                                            // 98
    },                                                                                                             // 99
    postTitle: function () {                                                                                       // 100
      var p = Posts.getProperties(this.data);                                                                      // 101
      return p.postTitle;                                                                                          // 102
    }                                                                                                              // 103
  }                                                                                                                // 104
});                                                                                                                // 105
                                                                                                                   // 106
// ------------------------------------------------------------------------------------------- //                  // 107
// ---------------------------------------- Comments ----------------------------------------- //                  // 108
// ------------------------------------------------------------------------------------------- //                  // 109
                                                                                                                   // 110
// specify how to get properties used in template from comment data                                                // 111
var commentCourierTransform = {                                                                                    // 112
  profileUrl: function () {                                                                                        // 113
    return getCommenterProfileUrl(this.data.comment);                                                              // 114
  },                                                                                                               // 115
  postCommentUrl: function () {                                                                                    // 116
    return Router.path('post_page', {_id: this.data.post._id});                                                    // 117
  },                                                                                                               // 118
  author: function () {                                                                                            // 119
    return getAuthor(this.data.comment);                                                                           // 120
  },                                                                                                               // 121
  postTitle: function () {                                                                                         // 122
    return this.data.post.title;                                                                                   // 123
  },                                                                                                               // 124
  url: function () {                                                                                               // 125
    return Router.path('comment_reply', {_id: this.parentComment._id});                                            // 126
  }                                                                                                                // 127
};                                                                                                                 // 128
                                                                                                                   // 129
Herald.addCourier('newComment', {                                                                                  // 130
  media: {                                                                                                         // 131
    onsite: {},                                                                                                    // 132
    email: {                                                                                                       // 133
      emailRunner: commentEmail                                                                                    // 134
    }                                                                                                              // 135
  },                                                                                                               // 136
  message: {                                                                                                       // 137
    default: function () {                                                                                         // 138
      return Blaze.toHTML(Blaze.With(this, function () {                                                           // 139
        return Template.notification_new_comment;                                                                  // 140
      }));                                                                                                         // 141
    }                                                                                                              // 142
  },                                                                                                               // 143
  transform: commentCourierTransform                                                                               // 144
});                                                                                                                // 145
                                                                                                                   // 146
Herald.addCourier('newReply', {                                                                                    // 147
  media: {                                                                                                         // 148
    onsite: {},                                                                                                    // 149
    email: {                                                                                                       // 150
      emailRunner: commentEmail                                                                                    // 151
    }                                                                                                              // 152
  },                                                                                                               // 153
  message: {                                                                                                       // 154
    default: function () {                                                                                         // 155
      return Blaze.toHTML(Blaze.With(this, function () {                                                           // 156
        return Template.notification_new_reply;                                                                    // 157
      }));                                                                                                         // 158
    }                                                                                                              // 159
  },                                                                                                               // 160
  transform: commentCourierTransform                                                                               // 161
});                                                                                                                // 162
                                                                                                                   // 163
Herald.addCourier('newCommentSubscribed', {                                                                        // 164
  media: {                                                                                                         // 165
    onsite: {},                                                                                                    // 166
    email: {                                                                                                       // 167
      emailRunner: commentEmail                                                                                    // 168
    }                                                                                                              // 169
  },                                                                                                               // 170
  message: {                                                                                                       // 171
    default: function () {                                                                                         // 172
      return Blaze.toHTML(Blaze.With(this, function () {                                                           // 173
        return Template.notification_new_reply;                                                                    // 174
      }));                                                                                                         // 175
    }                                                                                                              // 176
  },                                                                                                               // 177
  transform: commentCourierTransform                                                                               // 178
});                                                                                                                // 179
                                                                                                                   // 180
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/modules.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Telescope.modules.add("secondaryNav", {                                                                            // 1
  template:'notifications_menu',                                                                                   // 2
  order: 20                                                                                                        // 3
});                                                                                                                // 4
                                                                                                                   // 5
Telescope.modules.add("mobileNav", {                                                                               // 6
  template:'notifications_menu',                                                                                   // 7
  order: 20                                                                                                        // 8
});                                                                                                                // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/package-i18n.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
TAPi18n.packages["telescope:notifications"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};
                                                                                                                   // 2
// define package's translation function (proxy to the i18next)                                                    // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                   // 4
                                                                                                                   // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/notifications-server.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
getUnsubscribeLink = function(user){                                                                               // 1
  return Telescope.utils.getRouteUrl('unsubscribe', {hash: user.telescope.emailHash});                             // 2
};                                                                                                                 // 3
                                                                                                                   // 4
// given a notification, return the correct subject and html to send an email                                      // 5
buildEmailNotification = function (notification) {                                                                 // 6
                                                                                                                   // 7
  var subject,                                                                                                     // 8
      template,                                                                                                    // 9
      post = notification.data.post,                                                                               // 10
      comment = notification.data.comment;                                                                         // 11
                                                                                                                   // 12
  switch(notification.courier){                                                                                    // 13
                                                                                                                   // 14
    case 'newComment':                                                                                             // 15
      subject = notification.author()+' left a new comment on your post "' + post.title + '"';                     // 16
      template = 'emailNewComment';                                                                                // 17
      break;                                                                                                       // 18
                                                                                                                   // 19
    case 'newReply':                                                                                               // 20
      subject = notification.author()+' replied to your comment on "'+post.title+'"';                              // 21
      template = 'emailNewReply';                                                                                  // 22
      break;                                                                                                       // 23
                                                                                                                   // 24
    case 'newCommentSubscribed':                                                                                   // 25
      subject = notification.author()+' left a new comment on "' + post.title + '"';                               // 26
      template = 'emailNewComment';                                                                                // 27
      break;                                                                                                       // 28
                                                                                                                   // 29
    default:                                                                                                       // 30
      break;                                                                                                       // 31
  }                                                                                                                // 32
                                                                                                                   // 33
  var emailProperties = _.extend(notification.data, {                                                              // 34
    body: marked(comment.body),                                                                                    // 35
    profileUrl: Users.getProfileUrlBySlugOrId(comment.userId),                                                     // 36
    postCommentUrl: Telescope.utils.getPostCommentUrl(post._id, comment._id),                                      // 37
    postLink: Posts.getLink(post)                                                                                  // 38
  });                                                                                                              // 39
                                                                                                                   // 40
  // console.log(emailProperties)                                                                                  // 41
                                                                                                                   // 42
  var notificationHtml = Telescope.email.getTemplate(template)(emailProperties);                                   // 43
  var html = Telescope.email.buildTemplate(notificationHtml);                                                      // 44
                                                                                                                   // 45
  return {                                                                                                         // 46
    subject: subject,                                                                                              // 47
    html: html                                                                                                     // 48
  };                                                                                                               // 49
};                                                                                                                 // 50
                                                                                                                   // 51
Meteor.methods({                                                                                                   // 52
  unsubscribeUser : function(hash){                                                                                // 53
    // TO-DO: currently, if you have somebody's email you can unsubscribe them                                     // 54
    // A user-specific salt should be added to the hashing method to prevent this                                  // 55
    var user = Meteor.users.findOne({"telescope.emailHash": hash});                                                // 56
    if(user){                                                                                                      // 57
      Meteor.users.update(user._id, {                                                                              // 58
        $set: {                                                                                                    // 59
          'profile.notifications.users' : 0,                                                                       // 60
          'profile.notifications.posts' : 0,                                                                       // 61
          'profile.notifications.comments' : 0,                                                                    // 62
          'profile.notifications.replies' : 0                                                                      // 63
        }                                                                                                          // 64
      });                                                                                                          // 65
      return true;                                                                                                 // 66
    }                                                                                                              // 67
    return false;                                                                                                  // 68
  }                                                                                                                // 69
});                                                                                                                // 70
                                                                                                                   // 71
                                                                                                                   // 72
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/routes.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1
                                                                                                                   // 2
  // Notification email                                                                                            // 3
                                                                                                                   // 4
  Router.route('/email/notification/:id?', {                                                                       // 5
    name: 'notification',                                                                                          // 6
    where: 'server',                                                                                               // 7
    action: function() {                                                                                           // 8
      var notification = Herald.collection.findOne(this.params.id);                                                // 9
      var notificationContents = buildEmailNotification(notification);                                             // 10
      this.response.write(notificationContents.html);                                                              // 11
      this.response.end();                                                                                         // 12
    }                                                                                                              // 13
  });                                                                                                              // 14
                                                                                                                   // 15
});                                                                                                                // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/de.i18n.js     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                    // 8
  TAPi18n.translations["de"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                         // 12
  TAPi18n.translations["de"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["de"][namespace], {"left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","no_notifications":"No notifications","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","1_notification":"1 notification","notifications":"notifications"});
                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/en.i18n.js     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
// integrate the fallback language translations                                                                    // 8
translations = {};                                                                                                 // 9
translations[namespace] = {"left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","no_notifications":"No notifications","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","1_notification":"1 notification","notifications":"notifications","notifications_fieldset":"Notifications","emailNotifications":"Email Notifications","your_post":"Your post","has_been_approved":"has been approved"};
TAPi18n._loadLangFileObject("en", translations);                                                                   // 11
                                                                                                                   // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/es.i18n.js     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                    // 8
  TAPi18n.translations["es"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                         // 12
  TAPi18n.translations["es"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["es"][namespace], {"left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","no_notifications":"No notifications","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","1_notification":"1 notification","notifications":"notifications"});
                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/fr.i18n.js     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                    // 8
  TAPi18n.translations["fr"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                         // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["fr"][namespace], {"left_a_new_comment_on":"a laissé un nouveau commentaire sur","has_replied_to_your_comment_on":"a répondu à","mark_as_read":"Marquer comme lu","no_notifications":"Aucune notification","you_have_been_unsubscribed_from_all_notifications":"Vous avez été désabonné de toutes les notifications.","user_not_found":"Utilisateur non trouvé","1_notification":"1 notification","notifications":"notifications","emailNotifications":"Notifications par Email","your_post":"Votre post","has_been_approved":"a été approuvé"});
                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/it.i18n.js     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                    // 8
  TAPi18n.translations["it"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                         // 12
  TAPi18n.translations["it"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["it"][namespace], {"left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","no_notifications":"No notifications","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","1_notification":"1 notification","notifications":"notifications"});
                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Users/sacha/Dev/Telescope/packages/telescope-notifications/i18n/zh-CN.i18n.js  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                 // 8
  TAPi18n.translations["zh-CN"] = {};                                                                              // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                      // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                   // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","no_notifications":"No notifications","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","1_notification":"1 notification","notifications":"notifications"});
                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:notifications'] = {
  Herald: Herald
};

})();

//# sourceMappingURL=telescope_notifications.js.map
