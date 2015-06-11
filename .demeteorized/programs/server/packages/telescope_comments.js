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
var Settings = Package['telescope:settings'].Settings;
var Users = Package['telescope:users'].Users;
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
var Comments;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/comments.js                                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The global namespace for Comments.                                                                               // 2
 * @namespace Comments                                                                                              // 3
 */                                                                                                                 // 4
Comments = new Mongo.Collection("comments");                                                                        // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Comments schema                                                                                                  // 8
 * @type {SimpleSchema}                                                                                             // 9
 */                                                                                                                 // 10
Comments.schema = new SimpleSchema({                                                                                // 11
  /**                                                                                                               // 12
    ID                                                                                                              // 13
  */                                                                                                                // 14
  _id: {                                                                                                            // 15
    type: String,                                                                                                   // 16
    optional: true                                                                                                  // 17
  },                                                                                                                // 18
  /**                                                                                                               // 19
    The `_id` of the parent comment, if there is one                                                                // 20
  */                                                                                                                // 21
  parentCommentId: {                                                                                                // 22
    type: String,                                                                                                   // 23
    editableBy: ["member", "admin"],                                                                                // 24
    optional: true,                                                                                                 // 25
    autoform: {                                                                                                     // 26
      omit: true // never show this                                                                                 // 27
    }                                                                                                               // 28
  },                                                                                                                // 29
  /**                                                                                                               // 30
    The `_id` of the top-level parent comment, if there is one                                                      // 31
  */                                                                                                                // 32
  topLevelCommentId: {                                                                                              // 33
    type: String,                                                                                                   // 34
    editableBy: ["member", "admin"],                                                                                // 35
    optional: true,                                                                                                 // 36
    autoform: {                                                                                                     // 37
      omit: true // never show this                                                                                 // 38
    }                                                                                                               // 39
  },                                                                                                                // 40
  /**                                                                                                               // 41
    The timestamp of comment creation                                                                               // 42
  */                                                                                                                // 43
  createdAt: {                                                                                                      // 44
    type: Date,                                                                                                     // 45
    optional: true                                                                                                  // 46
  },                                                                                                                // 47
  /**                                                                                                               // 48
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time     // 49
  */                                                                                                                // 50
  postedAt: {                                                                                                       // 51
    type: Date,                                                                                                     // 52
    optional: true                                                                                                  // 53
  },                                                                                                                // 54
  /**                                                                                                               // 55
    The comment body (Markdown)                                                                                     // 56
  */                                                                                                                // 57
  body: {                                                                                                           // 58
    type: String,                                                                                                   // 59
    editableBy: ["member", "admin"],                                                                                // 60
    autoform: {                                                                                                     // 61
      rows: 5                                                                                                       // 62
    }                                                                                                               // 63
  },                                                                                                                // 64
  /**                                                                                                               // 65
    The HTML version of the comment body                                                                            // 66
  */                                                                                                                // 67
  htmlBody: {                                                                                                       // 68
    type: String,                                                                                                   // 69
    optional: true                                                                                                  // 70
  },                                                                                                                // 71
  /**                                                                                                               // 72
    The comment's base score (doesn't factor in comment age)                                                        // 73
  */                                                                                                                // 74
  baseScore: {                                                                                                      // 75
    type: Number,                                                                                                   // 76
    decimal: true,                                                                                                  // 77
    optional: true                                                                                                  // 78
  },                                                                                                                // 79
  /**                                                                                                               // 80
    The comment's current score (factors in comment age)                                                            // 81
  */                                                                                                                // 82
  score: {                                                                                                          // 83
    type: Number,                                                                                                   // 84
    decimal: true,                                                                                                  // 85
    optional: true                                                                                                  // 86
  },                                                                                                                // 87
  /**                                                                                                               // 88
    The number of upvotes the comment has received                                                                  // 89
  */                                                                                                                // 90
  upvotes: {                                                                                                        // 91
    type: Number,                                                                                                   // 92
    optional: true                                                                                                  // 93
  },                                                                                                                // 94
  /**                                                                                                               // 95
    An array containing the `_id`s of upvoters                                                                      // 96
  */                                                                                                                // 97
  upvoters: {                                                                                                       // 98
    type: [String],                                                                                                 // 99
    optional: true                                                                                                  // 100
  },                                                                                                                // 101
  /**                                                                                                               // 102
    The number of downvotes the comment has received                                                                // 103
  */                                                                                                                // 104
  downvotes: {                                                                                                      // 105
    type: Number,                                                                                                   // 106
    optional: true                                                                                                  // 107
  },                                                                                                                // 108
  /**                                                                                                               // 109
    An array containing the `_id`s of downvoters                                                                    // 110
  */                                                                                                                // 111
  downvoters: {                                                                                                     // 112
    type: [String],                                                                                                 // 113
    optional: true                                                                                                  // 114
  },                                                                                                                // 115
  /**                                                                                                               // 116
    The comment author's name                                                                                       // 117
  */                                                                                                                // 118
  author: {                                                                                                         // 119
    type: String,                                                                                                   // 120
    optional: true                                                                                                  // 121
  },                                                                                                                // 122
  /**                                                                                                               // 123
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often                         // 124
  */                                                                                                                // 125
  inactive: {                                                                                                       // 126
    type: Boolean,                                                                                                  // 127
    optional: true                                                                                                  // 128
  },                                                                                                                // 129
  /**                                                                                                               // 130
    The post's `_id`                                                                                                // 131
  */                                                                                                                // 132
  postId: {                                                                                                         // 133
    type: String,                                                                                                   // 134
    optional: true,                                                                                                 // 135
    editableBy: ["member", "admin"], // TODO: should users be able to set postId, but not modify it?                // 136
    autoform: {                                                                                                     // 137
      omit: true // never show this                                                                                 // 138
    }                                                                                                               // 139
  },                                                                                                                // 140
  /**                                                                                                               // 141
    The comment author's `_id`                                                                                      // 142
  */                                                                                                                // 143
  userId: {                                                                                                         // 144
    type: String,                                                                                                   // 145
    optional: true                                                                                                  // 146
  },                                                                                                                // 147
  /**                                                                                                               // 148
    Whether the comment is deleted. Delete comments' content doesn't appear on the site.                            // 149
  */                                                                                                                // 150
  isDeleted: {                                                                                                      // 151
    type: Boolean,                                                                                                  // 152
    optional: true                                                                                                  // 153
  }                                                                                                                 // 154
});                                                                                                                 // 155
                                                                                                                    // 156
Comments.schema.internationalize();                                                                                 // 157
Comments.attachSchema(Comments.schema);                                                                             // 158
                                                                                                                    // 159
Comments.allow({                                                                                                    // 160
  update: _.partial(Telescope.allowCheck, Comments),                                                                // 161
  remove: _.partial(Telescope.allowCheck, Comments)                                                                 // 162
});                                                                                                                 // 163
                                                                                                                    // 164
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/methods.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
// ------------------------------------------------------------------------------------------- //                   // 2
// -------------------------------------- Submit Comment ------------------------------------- //                   // 3
// ------------------------------------------------------------------------------------------- //                   // 4
                                                                                                                    // 5
Comments.submit = function (comment) {                                                                              // 6
                                                                                                                    // 7
  var userId = comment.userId; // at this stage, a userId is expected                                               // 8
                                                                                                                    // 9
  // ------------------------------ Checks ------------------------------ //                                        // 10
                                                                                                                    // 11
  // Don't allow empty comments                                                                                     // 12
  if (!comment.body)                                                                                                // 13
    throw new Meteor.Error(704,i18n.t('your_comment_is_empty'));                                                    // 14
                                                                                                                    // 15
  // ------------------------------ Properties ------------------------------ //                                    // 16
                                                                                                                    // 17
  var defaultProperties = {                                                                                         // 18
    createdAt: new Date(),                                                                                          // 19
    postedAt: new Date(),                                                                                           // 20
    upvotes: 0,                                                                                                     // 21
    downvotes: 0,                                                                                                   // 22
    baseScore: 0,                                                                                                   // 23
    score: 0,                                                                                                       // 24
    author: Users.getDisplayNameById(userId)                                                                        // 25
  };                                                                                                                // 26
                                                                                                                    // 27
  comment = _.extend(defaultProperties, comment);                                                                   // 28
                                                                                                                    // 29
  // ------------------------------ Callbacks ------------------------------ //                                     // 30
                                                                                                                    // 31
  // run all post submit server callbacks on comment object successively                                            // 32
  comment = Telescope.callbacks.run("commentSubmit", comment);                                                      // 33
                                                                                                                    // 34
  // -------------------------------- Insert -------------------------------- //                                    // 35
                                                                                                                    // 36
  comment._id = Comments.insert(comment);                                                                           // 37
                                                                                                                    // 38
  // --------------------- Server-side Async Callbacks --------------------- //                                     // 39
                                                                                                                    // 40
  // run all post submit server callbacks on comment object successively                                            // 41
  Telescope.callbacks.runAsync("commentSubmitAsync", comment);                                                      // 42
                                                                                                                    // 43
  return comment;                                                                                                   // 44
}                                                                                                                   // 45
                                                                                                                    // 46
Comments.edit = function (commentId, modifier, comment) {                                                           // 47
                                                                                                                    // 48
  // ------------------------------ Callbacks ------------------------------ //                                     // 49
                                                                                                                    // 50
  modifier = Telescope.callbacks.run("commentEdit", modifier, comment);                                             // 51
                                                                                                                    // 52
  // ------------------------------ Update ------------------------------ //                                        // 53
                                                                                                                    // 54
  Comments.update(commentId, modifier);                                                                             // 55
                                                                                                                    // 56
  // ------------------------------ Callbacks ------------------------------ //                                     // 57
                                                                                                                    // 58
  Telescope.callbacks.runAsync("commentEditAsync", Comments.findOne(commentId));                                    // 59
                                                                                                                    // 60
  // ------------------------------ After Update ------------------------------ //                                  // 61
  return Comments.findOne(commentId);                                                                               // 62
};                                                                                                                  // 63
                                                                                                                    // 64
// ------------------------------------------------------------------------------------------- //                   // 65
// ----------------------------------------- Methods ----------------------------------------- //                   // 66
// ------------------------------------------------------------------------------------------- //                   // 67
                                                                                                                    // 68
Meteor.methods({                                                                                                    // 69
  submitComment: function(comment){                                                                                 // 70
                                                                                                                    // 71
    // required properties:                                                                                         // 72
    // postId                                                                                                       // 73
    // body                                                                                                         // 74
                                                                                                                    // 75
    // optional properties:                                                                                         // 76
    // parentCommentId                                                                                              // 77
                                                                                                                    // 78
    var user = Meteor.user(),                                                                                       // 79
        hasAdminRights = Users.is.admin(user),                                                                      // 80
        schema = Comments.simpleSchema()._schema;                                                                   // 81
                                                                                                                    // 82
    // ------------------------------ Checks ------------------------------ //                                      // 83
                                                                                                                    // 84
    // check that user can comment                                                                                  // 85
    if (!user || !Users.can.comment(user))                                                                          // 86
      throw new Meteor.Error(i18n.t('you_need_to_login_or_be_invited_to_post_new_comments'));                       // 87
                                                                                                                    // 88
    // ------------------------------ Rate Limiting ------------------------------ //                               // 89
                                                                                                                    // 90
    if (!hasAdminRights) {                                                                                          // 91
                                                                                                                    // 92
      var timeSinceLastComment = Users.timeSinceLast(user, Comments),                                               // 93
          commentInterval = Math.abs(parseInt(Settings.get('commentInterval',15)));                                 // 94
                                                                                                                    // 95
      // check that user waits more than 15 seconds between comments                                                // 96
      if((timeSinceLastComment < commentInterval))                                                                  // 97
        throw new Meteor.Error(704, i18n.t('please_wait')+(commentInterval-timeSinceLastComment)+i18n.t('seconds_before_commenting_again'));
                                                                                                                    // 99
    }                                                                                                               // 100
                                                                                                                    // 101
    // ------------------------------ Properties ------------------------------ //                                  // 102
                                                                                                                    // 103
    // admin-only properties                                                                                        // 104
    // userId                                                                                                       // 105
                                                                                                                    // 106
    // clear restricted properties                                                                                  // 107
    _.keys(comment).forEach(function (fieldName) {                                                                  // 108
                                                                                                                    // 109
      var field = schema[fieldName];                                                                                // 110
      if (!Users.can.submitField(user, field)) {                                                                    // 111
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 112
      }                                                                                                             // 113
                                                                                                                    // 114
    });                                                                                                             // 115
                                                                                                                    // 116
    // if no userId has been set, default to current user id                                                        // 117
    if (!comment.userId) {                                                                                          // 118
      comment.userId = user._id;                                                                                    // 119
    }                                                                                                               // 120
                                                                                                                    // 121
    return Comments.submit(comment);                                                                                // 122
  },                                                                                                                // 123
                                                                                                                    // 124
  editComment: function (modifier, commentId) {                                                                     // 125
                                                                                                                    // 126
    var user = Meteor.user(),                                                                                       // 127
        comment = Comments.findOne(commentId),                                                                      // 128
        schema = Comments.simpleSchema()._schema;                                                                   // 129
                                                                                                                    // 130
    // ------------------------------ Checks ------------------------------ //                                      // 131
                                                                                                                    // 132
    // check that user can edit                                                                                     // 133
    if (!user || !Users.can.edit(user, comment)) {                                                                  // 134
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_comment'));                                    // 135
    }                                                                                                               // 136
                                                                                                                    // 137
    // go over each field and throw an error if it's not editable                                                   // 138
    // loop over each operation ($set, $unset, etc.)                                                                // 139
    _.each(modifier, function (operation) {                                                                         // 140
      // loop over each property being operated on                                                                  // 141
      _.keys(operation).forEach(function (fieldName) {                                                              // 142
                                                                                                                    // 143
        var field = schema[fieldName];                                                                              // 144
        if (!Users.can.editField(user, field, comment)) {                                                           // 145
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName); // 146
        }                                                                                                           // 147
                                                                                                                    // 148
      });                                                                                                           // 149
    });                                                                                                             // 150
                                                                                                                    // 151
    Comments.edit(commentId, modifier, comment);                                                                    // 152
  },                                                                                                                // 153
                                                                                                                    // 154
  deleteCommentById: function (commentId) {                                                                         // 155
                                                                                                                    // 156
    var comment = Comments.findOne(commentId);                                                                      // 157
    var user = Meteor.user();                                                                                       // 158
                                                                                                                    // 159
    if(Users.can.edit(user, comment)){                                                                              // 160
                                                                                                                    // 161
      // decrement post comment count and remove user ID from post                                                  // 162
      Posts.update(comment.postId, {                                                                                // 163
        $inc:   {commentCount: -1},                                                                                 // 164
        $pull:  {commenters: comment.userId}                                                                        // 165
      });                                                                                                           // 166
                                                                                                                    // 167
      // decrement user comment count and remove comment ID from user                                               // 168
      Meteor.users.update({_id: comment.userId}, {                                                                  // 169
        $inc:   {'telescope.commentCount': -1}                                                                      // 170
      });                                                                                                           // 171
                                                                                                                    // 172
      // note: should we also decrease user's comment karma ?                                                       // 173
      // We don't actually delete the comment to avoid losing all child comments.                                   // 174
      // Instead, we give it a special flag                                                                         // 175
      Comments.update({_id: commentId}, {$set: {                                                                    // 176
        body: 'Deleted',                                                                                            // 177
        htmlBody: 'Deleted',                                                                                        // 178
        isDeleted: true                                                                                             // 179
      }});                                                                                                          // 180
                                                                                                                    // 181
    }else{                                                                                                          // 182
                                                                                                                    // 183
      Messages.flash("You don't have permission to delete this comment.", "error");                                 // 184
                                                                                                                    // 185
    }                                                                                                               // 186
  }                                                                                                                 // 187
});                                                                                                                 // 188
                                                                                                                    // 189
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/callbacks.js                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
// ------------------------------------------------------------------------------------------- //                   // 2
// ------------------------------------------ Hooks ------------------------------------------ //                   // 3
// ------------------------------------------------------------------------------------------- //                   // 4
                                                                                                                    // 5
Comments.before.insert(function (userId, doc) {                                                                     // 6
  // note: only actually sanitizes on the server                                                                    // 7
  doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));                                                        // 8
});                                                                                                                 // 9
                                                                                                                    // 10
Comments.before.update(function (userId, doc, fieldNames, modifier) {                                               // 11
  // if body is being modified, update htmlBody too                                                                 // 12
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {                                                     // 13
    modifier.$set = modifier.$set || {};                                                                            // 14
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));                                  // 15
  }                                                                                                                 // 16
});                                                                                                                 // 17
                                                                                                                    // 18
function afterCommentOperations (comment) {                                                                         // 19
                                                                                                                    // 20
  var userId = comment.userId,                                                                                      // 21
    commentAuthor = Meteor.users.findOne(userId);                                                                   // 22
                                                                                                                    // 23
  // increment comment count                                                                                        // 24
  Meteor.users.update({_id: userId}, {                                                                              // 25
    $inc:       {'telescope.commentCount': 1}                                                                       // 26
  });                                                                                                               // 27
                                                                                                                    // 28
  // update post                                                                                                    // 29
  Posts.update(comment.postId, {                                                                                    // 30
    $inc:       {commentCount: 1},                                                                                  // 31
    $set:       {lastCommentedAt: new Date()},                                                                      // 32
    $addToSet:  {commenters: userId}                                                                                // 33
  });                                                                                                               // 34
                                                                                                                    // 35
  // upvote comment                                                                                                 // 36
  Telescope.upvoteItem(Comments, comment, commentAuthor);                                                           // 37
                                                                                                                    // 38
  return comment;                                                                                                   // 39
}                                                                                                                   // 40
                                                                                                                    // 41
Telescope.callbacks.add("commentSubmitAsync", afterCommentOperations);                                              // 42
                                                                                                                    // 43
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/views.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Comment views are filters used for subscribing to and viewing comments                                           // 2
 * @namespace Comments.views                                                                                        // 3
 */                                                                                                                 // 4
Comments.views = {};                                                                                                // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Add a module to a comment view                                                                                   // 8
 * @param {string} viewName - The name of the view                                                                  // 9
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */                                                                                                                 // 11
Comments.views.add = function (viewName, viewFunction) {                                                            // 12
  Comments.views[viewName] = viewFunction;                                                                          // 13
};                                                                                                                  // 14
                                                                                                                    // 15
// will be common to all other view unless specific properties are overwritten                                      // 16
Comments.views.baseParameters = {                                                                                   // 17
  options: {                                                                                                        // 18
    limit: 10                                                                                                       // 19
  }                                                                                                                 // 20
};                                                                                                                  // 21
                                                                                                                    // 22
Comments.views.add("postComments", function (terms) {                                                               // 23
  return {                                                                                                          // 24
    find: {postId: terms.postId},                                                                                   // 25
    options: {limit: 0, sort: {score: -1, postedAt: -1}}                                                            // 26
  };                                                                                                                // 27
});                                                                                                                 // 28
                                                                                                                    // 29
Comments.views.add("userComments", function (terms) {                                                               // 30
  return {                                                                                                          // 31
    find: {userId: terms.userId},                                                                                   // 32
    options: {sort: {postedAt: -1}}                                                                                 // 33
  };                                                                                                                // 34
});                                                                                                                 // 35
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/parameters.js                                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Gives an object containing the appropriate find                                                                  // 2
 * and options arguments for the subscriptions's Comments.find()                                                    // 3
 * @param {Object} terms                                                                                            // 4
 */                                                                                                                 // 5
Comments.getSubParams = function (terms) {                                                                          // 6
                                                                                                                    // 7
  var maxLimit = 200;                                                                                               // 8
                                                                                                                    // 9
  // console.log(terms)                                                                                             // 10
                                                                                                                    // 11
  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()                  // 12
  // see: http://api.jquery.com/jQuery.extend/                                                                      // 13
                                                                                                                    // 14
  // initialize parameters by extending baseParameters object, to avoid passing it by reference                     // 15
  var parameters = Telescope.utils.deepExtend(true, {}, Comments.views.baseParameters);                             // 16
                                                                                                                    // 17
  // get query parameters according to current view                                                                 // 18
  if (typeof Comments.views[terms.view] !== 'undefined')                                                            // 19
    parameters = Telescope.utils.deepExtend(true, parameters, Comments.views[terms.view](terms));                   // 20
                                                                                                                    // 21
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")                            // 22
  if (typeof terms.limit !== 'undefined')                                                                           // 23
    _.extend(parameters.options, {limit: parseInt(terms.limit)});                                                   // 24
                                                                                                                    // 25
  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit                 // 26
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {           // 27
    parameters.options.limit = maxLimit;                                                                            // 28
  }                                                                                                                 // 29
                                                                                                                    // 30
  // console.log(parameters);                                                                                       // 31
                                                                                                                    // 32
  return parameters;                                                                                                // 33
};                                                                                                                  // 34
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/routes.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// Controller for comment pages                                                                                     // 1
                                                                                                                    // 2
Comments.controllers = {};                                                                                          // 3
                                                                                                                    // 4
Comments.controllers.page = RouteController.extend({                                                                // 5
  waitOn: function() {                                                                                              // 6
    return [                                                                                                        // 7
      coreSubscriptions.subscribe('singleCommentAndChildren', this.params._id),                                     // 8
      coreSubscriptions.subscribe('commentUsers', this.params._id),                                                 // 9
      coreSubscriptions.subscribe('commentPost', this.params._id)                                                   // 10
    ];                                                                                                              // 11
  },                                                                                                                // 12
  data: function() {                                                                                                // 13
    return {                                                                                                        // 14
      comment: Comments.findOne(this.params._id)                                                                    // 15
    };                                                                                                              // 16
  },                                                                                                                // 17
  onAfterAction: function () {                                                                                      // 18
    window.queueComments = false;                                                                                   // 19
  },                                                                                                                // 20
  fastRender: true                                                                                                  // 21
});                                                                                                                 // 22
                                                                                                                    // 23
Meteor.startup( function () {                                                                                       // 24
                                                                                                                    // 25
  // Comment Reply                                                                                                  // 26
                                                                                                                    // 27
  Router.route('/comments/:_id', {                                                                                  // 28
    name: 'comment_reply',                                                                                          // 29
    template: 'comment_reply',                                                                                      // 30
    controller: Comments.controllers.page,                                                                          // 31
    onAfterAction: function() {                                                                                     // 32
      window.queueComments = false;                                                                                 // 33
    }                                                                                                               // 34
  });                                                                                                               // 35
                                                                                                                    // 36
  // Comment Edit                                                                                                   // 37
                                                                                                                    // 38
  Router.route('/comments/:_id/edit', {                                                                             // 39
    name: 'comment_edit',                                                                                           // 40
    template: 'comment_edit',                                                                                       // 41
    controller: Comments.controllers.page,                                                                          // 42
    onAfterAction: function() {                                                                                     // 43
      window.queueComments = false;                                                                                 // 44
    }                                                                                                               // 45
  });                                                                                                               // 46
                                                                                                                    // 47
});                                                                                                                 // 48
                                                                                                                    // 49
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/server/publications.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Comments._ensureIndex({"postId": 1});                                                                               // 1
                                                                                                                    // 2
                                                                                                                    // 3
// Publish a list of comments                                                                                       // 4
                                                                                                                    // 5
Meteor.publish('commentsList', function(terms) {                                                                    // 6
  if(Users.can.viewById(this.userId)){                                                                              // 7
    var parameters = Comments.getSubParams(terms);                                                                  // 8
    var comments = Comments.find(parameters.find, parameters.options);                                              // 9
                                                                                                                    // 10
    // if there are comments, find out which posts were commented on                                                // 11
    var commentedPostIds = comments.count() ? _.pluck(comments.fetch(), 'postId') : [];                             // 12
    return [                                                                                                        // 13
      comments,                                                                                                     // 14
      Posts.find({_id: {$in: commentedPostIds}})                                                                    // 15
    ];                                                                                                              // 16
  }                                                                                                                 // 17
});                                                                                                                 // 18
                                                                                                                    // 19
// Publish a single comment                                                                                         // 20
                                                                                                                    // 21
Meteor.publish('singleCommentAndChildren', function(commentId) {                                                    // 22
  if(Users.can.viewById(this.userId)){                                                                              // 23
    // publish both current comment and child comments                                                              // 24
    var commentIds = [commentId];                                                                                   // 25
    var childCommentIds = _.pluck(Comments.find({parentCommentId: commentId}, {fields: {_id: 1}}).fetch(), '_id');  // 26
    commentIds = commentIds.concat(childCommentIds);                                                                // 27
    return Comments.find({_id: {$in: commentIds}}, {sort: {score: -1, postedAt: -1}});                              // 28
  }                                                                                                                 // 29
  return [];                                                                                                        // 30
});                                                                                                                 // 31
                                                                                                                    // 32
// Publish the post related to the current comment                                                                  // 33
                                                                                                                    // 34
Meteor.publish('commentPost', function(commentId) {                                                                 // 35
  if(Users.can.viewById(this.userId)){                                                                              // 36
    var comment = Comments.findOne(commentId);                                                                      // 37
    return Posts.find({_id: comment && comment.postId});                                                            // 38
  }                                                                                                                 // 39
  return [];                                                                                                        // 40
});                                                                                                                 // 41
                                                                                                                    // 42
// Publish author of the current comment, and author of the post related to the current comment                     // 43
                                                                                                                    // 44
Meteor.publish('commentUsers', function(commentId) {                                                                // 45
                                                                                                                    // 46
  var userIds = [];                                                                                                 // 47
                                                                                                                    // 48
  if(Users.can.viewById(this.userId)){                                                                              // 49
                                                                                                                    // 50
    var comment = Comments.findOne(commentId);                                                                      // 51
                                                                                                                    // 52
    if (!!comment) {                                                                                                // 53
      userIds.push(comment.userId);                                                                                 // 54
                                                                                                                    // 55
      var post = Posts.findOne(comment.postId);                                                                     // 56
      if (!!post) {                                                                                                 // 57
        userIds.push(post.userId);                                                                                  // 58
      }                                                                                                             // 59
                                                                                                                    // 60
      return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.publicProperties});                     // 61
                                                                                                                    // 62
    }                                                                                                               // 63
                                                                                                                    // 64
  }                                                                                                                 // 65
                                                                                                                    // 66
  return [];                                                                                                        // 67
                                                                                                                    // 68
});                                                                                                                 // 69
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:comments'] = {
  Comments: Comments
};

})();

//# sourceMappingURL=telescope_comments.js.map
