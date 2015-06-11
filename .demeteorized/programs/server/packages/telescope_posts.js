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
var Comments = Package['telescope:comments'].Comments;
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
var Posts;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/namespace.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The global namespace/collection for Posts.                                                                       // 2
 * @namespace Posts                                                                                                 // 3
 */                                                                                                                 // 4
Posts = new Mongo.Collection("posts");                                                                              // 5
                                                                                                                    // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/config.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Posts config namespace                                                                                           // 2
 * @type {Object}                                                                                                   // 3
 */                                                                                                                 // 4
Posts.config = {};                                                                                                  // 5
                                                                                                                    // 6
                                                                                                                    // 7
/**                                                                                                                 // 8
 * Post Statuses                                                                                                    // 9
 */                                                                                                                 // 10
Posts.config.postStatuses = [                                                                                       // 11
  {                                                                                                                 // 12
    value: 1,                                                                                                       // 13
    label: function(){return i18n.t('pending');}                                                                    // 14
  },                                                                                                                // 15
  {                                                                                                                 // 16
    value: 2,                                                                                                       // 17
    label: function(){return i18n.t('approved');}                                                                   // 18
  },                                                                                                                // 19
  {                                                                                                                 // 20
    value: 3,                                                                                                       // 21
    label: function(){return i18n.t('rejected');}                                                                   // 22
  }                                                                                                                 // 23
];                                                                                                                  // 24
                                                                                                                    // 25
Posts.config.STATUS_PENDING = 1;                                                                                    // 26
Posts.config.STATUS_APPROVED = 2;                                                                                   // 27
Posts.config.STATUS_REJECTED = 3;                                                                                   // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/posts.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Posts schema                                                                                                     // 2
 * @type {SimpleSchema}                                                                                             // 3
 */                                                                                                                 // 4
Posts.schema = new SimpleSchema({                                                                                   // 5
  /**                                                                                                               // 6
    ID                                                                                                              // 7
  */                                                                                                                // 8
  _id: {                                                                                                            // 9
    type: String,                                                                                                   // 10
    optional: true                                                                                                  // 11
  },                                                                                                                // 12
  /**                                                                                                               // 13
    Timetstamp of post creation                                                                                     // 14
  */                                                                                                                // 15
  createdAt: {                                                                                                      // 16
    type: Date,                                                                                                     // 17
    optional: true                                                                                                  // 18
  },                                                                                                                // 19
  /**                                                                                                               // 20
    Timestamp of post first appearing on the site (i.e. being approved)                                             // 21
  */                                                                                                                // 22
  postedAt: {                                                                                                       // 23
    type: Date,                                                                                                     // 24
    optional: true,                                                                                                 // 25
    editableBy: ["admin"],                                                                                          // 26
    autoform: {                                                                                                     // 27
      group: 'admin',                                                                                               // 28
      type: "bootstrap-datetimepicker"                                                                              // 29
    }                                                                                                               // 30
  },                                                                                                                // 31
  /**                                                                                                               // 32
    URL                                                                                                             // 33
  */                                                                                                                // 34
  url: {                                                                                                            // 35
    type: String,                                                                                                   // 36
    optional: true,                                                                                                 // 37
    editableBy: ["member", "admin"],                                                                                // 38
    autoform: {                                                                                                     // 39
      type: "bootstrap-url"                                                                                         // 40
    }                                                                                                               // 41
  },                                                                                                                // 42
  /**                                                                                                               // 43
    Title                                                                                                           // 44
  */                                                                                                                // 45
  title: {                                                                                                          // 46
    type: String,                                                                                                   // 47
    optional: false,                                                                                                // 48
    editableBy: ["member", "admin"]                                                                                 // 49
  },                                                                                                                // 50
  /**                                                                                                               // 51
    Post body (markdown)                                                                                            // 52
  */                                                                                                                // 53
  body: {                                                                                                           // 54
    type: String,                                                                                                   // 55
    optional: true,                                                                                                 // 56
    editableBy: ["member", "admin"],                                                                                // 57
    autoform: {                                                                                                     // 58
      rows: 5                                                                                                       // 59
    }                                                                                                               // 60
  },                                                                                                                // 61
  /**                                                                                                               // 62
    HTML version of the post body                                                                                   // 63
  */                                                                                                                // 64
  htmlBody: {                                                                                                       // 65
    type: String,                                                                                                   // 66
    optional: true                                                                                                  // 67
  },                                                                                                                // 68
  /**                                                                                                               // 69
    Count of how many times the post's page was viewed                                                              // 70
  */                                                                                                                // 71
  viewCount: {                                                                                                      // 72
    type: Number,                                                                                                   // 73
    optional: true                                                                                                  // 74
  },                                                                                                                // 75
  /**                                                                                                               // 76
    Count of the post's comments                                                                                    // 77
  */                                                                                                                // 78
  commentCount: {                                                                                                   // 79
    type: Number,                                                                                                   // 80
    optional: true                                                                                                  // 81
  },                                                                                                                // 82
  /**                                                                                                               // 83
    An array containing the `_id`s of commenters                                                                    // 84
  */                                                                                                                // 85
  commenters: {                                                                                                     // 86
    type: [String],                                                                                                 // 87
    optional: true                                                                                                  // 88
  },                                                                                                                // 89
  /**                                                                                                               // 90
    Timestamp of the last comment                                                                                   // 91
  */                                                                                                                // 92
  lastCommentedAt: {                                                                                                // 93
    type: Date,                                                                                                     // 94
    optional: true                                                                                                  // 95
  },                                                                                                                // 96
  /**                                                                                                               // 97
    Count of how many times the post's link was clicked                                                             // 98
  */                                                                                                                // 99
  clickCount: {                                                                                                     // 100
    type: Number,                                                                                                   // 101
    optional: true                                                                                                  // 102
  },                                                                                                                // 103
  /**                                                                                                               // 104
    The post's base score (not factoring in the post's age)                                                         // 105
  */                                                                                                                // 106
  baseScore: {                                                                                                      // 107
    type: Number,                                                                                                   // 108
    decimal: true,                                                                                                  // 109
    optional: true                                                                                                  // 110
  },                                                                                                                // 111
  /**                                                                                                               // 112
    How many upvotes the post has received                                                                          // 113
  */                                                                                                                // 114
  upvotes: {                                                                                                        // 115
    type: Number,                                                                                                   // 116
    optional: true                                                                                                  // 117
  },                                                                                                                // 118
  /**                                                                                                               // 119
    An array containing the `_id`s of the post's upvoters                                                           // 120
  */                                                                                                                // 121
  upvoters: {                                                                                                       // 122
    type: [String],                                                                                                 // 123
    optional: true                                                                                                  // 124
  },                                                                                                                // 125
  /**                                                                                                               // 126
    How many downvotes the post has received                                                                        // 127
  */                                                                                                                // 128
  downvotes: {                                                                                                      // 129
    type: Number,                                                                                                   // 130
    optional: true                                                                                                  // 131
  },                                                                                                                // 132
  /**                                                                                                               // 133
    An array containing the `_id`s of the post's downvoters                                                         // 134
  */                                                                                                                // 135
  downvoters: {                                                                                                     // 136
    type: [String],                                                                                                 // 137
    optional: true                                                                                                  // 138
  },                                                                                                                // 139
  /**                                                                                                               // 140
    The post's current score (factoring in age)                                                                     // 141
  */                                                                                                                // 142
  score: {                                                                                                          // 143
    type: Number,                                                                                                   // 144
    decimal: true,                                                                                                  // 145
    optional: true                                                                                                  // 146
  },                                                                                                                // 147
  /**                                                                                                               // 148
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)                                       // 149
  */                                                                                                                // 150
  status: {                                                                                                         // 151
    type: Number,                                                                                                   // 152
    optional: true,                                                                                                 // 153
    editableBy: ["admin"],                                                                                          // 154
    autoValue: function () {                                                                                        // 155
      // only provide a default value                                                                               // 156
      // 1) this is an insert operation                                                                             // 157
      // 2) status field is not set in the document being inserted                                                  // 158
      var user = Meteor.users.findOne(this.userId);                                                                 // 159
      if (this.isInsert && !this.isSet)                                                                             // 160
        return Posts.getDefaultStatus(user);                                                                        // 161
    },                                                                                                              // 162
    autoform: {                                                                                                     // 163
      noselect: true,                                                                                               // 164
      options: Posts.config.postStatuses,                                                                           // 165
      group: 'admin'                                                                                                // 166
    }                                                                                                               // 167
  },                                                                                                                // 168
  /**                                                                                                               // 169
    Whether the post is sticky (pinned to the top of posts lists)                                                   // 170
  */                                                                                                                // 171
  sticky: {                                                                                                         // 172
    type: Boolean,                                                                                                  // 173
    optional: true,                                                                                                 // 174
    defaultValue: false,                                                                                            // 175
    editableBy: ["admin"],                                                                                          // 176
    autoform: {                                                                                                     // 177
      group: 'admin',                                                                                               // 178
      leftLabel: "Sticky"                                                                                           // 179
    }                                                                                                               // 180
  },                                                                                                                // 181
  /**                                                                                                               // 182
    Whether the post is inactive. Inactive posts see their score recalculated less often                            // 183
  */                                                                                                                // 184
  inactive: {                                                                                                       // 185
    type: Boolean,                                                                                                  // 186
    optional: true                                                                                                  // 187
  },                                                                                                                // 188
  /**                                                                                                               // 189
    The post author's name                                                                                          // 190
  */                                                                                                                // 191
  author: {                                                                                                         // 192
    type: String,                                                                                                   // 193
    optional: true                                                                                                  // 194
  },                                                                                                                // 195
  /**                                                                                                               // 196
    The post author's `_id`.                                                                                        // 197
  */                                                                                                                // 198
  userId: {                                                                                                         // 199
    type: String,                                                                                                   // 200
    optional: true,                                                                                                 // 201
    editableBy: ["admin"],                                                                                          // 202
    autoform: {                                                                                                     // 203
      group: 'admin',                                                                                               // 204
      options: function () {                                                                                        // 205
        return Meteor.users.find().map(function (user) {                                                            // 206
          return {                                                                                                  // 207
            value: user._id,                                                                                        // 208
            label: Users.getDisplayName(user)                                                                       // 209
          };                                                                                                        // 210
        });                                                                                                         // 211
      }                                                                                                             // 212
    }                                                                                                               // 213
  }                                                                                                                 // 214
});                                                                                                                 // 215
                                                                                                                    // 216
// schema transforms                                                                                                // 217
Posts.schema.internationalize();                                                                                    // 218
                                                                                                                    // 219
/**                                                                                                                 // 220
 * Attach schema to Posts collection                                                                                // 221
 */                                                                                                                 // 222
Posts.attachSchema(Posts.schema);                                                                                   // 223
                                                                                                                    // 224
Posts.allow({                                                                                                       // 225
  update: _.partial(Telescope.allowCheck, Posts),                                                                   // 226
  remove: _.partial(Telescope.allowCheck, Posts)                                                                    // 227
});                                                                                                                 // 228
                                                                                                                    // 229
//////////////////////////////////////////////////////                                                              // 230
// Collection Hooks                                 //                                                              // 231
// https://atmospherejs.com/matb33/collection-hooks //                                                              // 232
//////////////////////////////////////////////////////                                                              // 233
                                                                                                                    // 234
/**                                                                                                                 // 235
 * Generate HTML body from Markdown on post insert                                                                  // 236
 */                                                                                                                 // 237
Posts.before.insert(function (userId, doc) {                                                                        // 238
  if(!!doc.body)                                                                                                    // 239
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));                                                      // 240
});                                                                                                                 // 241
                                                                                                                    // 242
/**                                                                                                                 // 243
 * Generate HTML body from Markdown when post body is updated                                                       // 244
 */                                                                                                                 // 245
Posts.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 246
  // if body is being modified, update htmlBody too                                                                 // 247
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {                                                     // 248
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));                                  // 249
  }                                                                                                                 // 250
});                                                                                                                 // 251
                                                                                                                    // 252
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/parameters.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Gives an object containing the appropriate find                                                                  // 2
 * and options arguments for the subscriptions's Posts.find()                                                       // 3
 * @param {Object} terms                                                                                            // 4
 */                                                                                                                 // 5
Posts.getSubParams = function (terms) {                                                                             // 6
                                                                                                                    // 7
  var maxLimit = 200;                                                                                               // 8
                                                                                                                    // 9
  // console.log(terms)                                                                                             // 10
                                                                                                                    // 11
  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()                  // 12
  // see: http://api.jquery.com/jQuery.extend/                                                                      // 13
                                                                                                                    // 14
  // initialize parameters by extending baseParameters object, to avoid passing it by reference                     // 15
  var parameters = Telescope.utils.deepExtend(true, {}, Posts.views.baseParameters);                                // 16
                                                                                                                    // 17
  // if view is not defined, default to "top"                                                                       // 18
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'top';                                        // 19
                                                                                                                    // 20
  // get query parameters according to current view                                                                 // 21
  if (typeof Posts.views[view] !== 'undefined')                                                                     // 22
    parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));                            // 23
                                                                                                                    // 24
  // extend sort to sort posts by _id to break ties                                                                 // 25
  Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});                                       // 26
                                                                                                                    // 27
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")                            // 28
  if (typeof terms.limit !== 'undefined')                                                                           // 29
    _.extend(parameters.options, {limit: parseInt(terms.limit)});                                                   // 30
                                                                                                                    // 31
  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit                 // 32
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {           // 33
    parameters.options.limit = maxLimit;                                                                            // 34
  }                                                                                                                 // 35
                                                                                                                    // 36
  // hide future scheduled posts unless "showFuture" is set to true or postedAt is already defined                  // 37
  if (!parameters.showFuture && !parameters.find.postedAt)                                                          // 38
    parameters.find.postedAt = {$lte: new Date()};                                                                  // 39
                                                                                                                    // 40
  // filter by category if category _id is provided                                                                 // 41
  // NOTE: this is a temporary fix because views cannot currently be combined                                       // 42
  if (!!terms.category) {                                                                                           // 43
    var categoryId = Categories.findOne({slug: terms.category})._id;                                                // 44
    parameters.find.categories = {$in: [categoryId]};                                                               // 45
  }                                                                                                                 // 46
                                                                                                                    // 47
  // console.log(parameters);                                                                                       // 48
                                                                                                                    // 49
  return parameters;                                                                                                // 50
};                                                                                                                  // 51
                                                                                                                    // 52
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/views.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Post views are filters used for subscribing to and viewing posts                                                 // 2
 * @namespace Posts.views                                                                                           // 3
 */                                                                                                                 // 4
Posts.views = {};                                                                                                   // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Add a post view                                                                                                  // 8
 * @param {string} viewName - The name of the view                                                                  // 9
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */                                                                                                                 // 11
Posts.views.add = function (viewName, viewFunction) {                                                               // 12
  Posts.views[viewName] = viewFunction;                                                                             // 13
};                                                                                                                  // 14
                                                                                                                    // 15
/**                                                                                                                 // 16
 * Base parameters that will be common to all other view unless specific properties are overwritten                 // 17
 */                                                                                                                 // 18
Posts.views.baseParameters = {                                                                                      // 19
  find: {                                                                                                           // 20
    status: Posts.config.STATUS_APPROVED                                                                            // 21
  },                                                                                                                // 22
  options: {                                                                                                        // 23
    limit: 10                                                                                                       // 24
  }                                                                                                                 // 25
};                                                                                                                  // 26
                                                                                                                    // 27
/**                                                                                                                 // 28
 * Top view                                                                                                         // 29
 */                                                                                                                 // 30
Posts.views.add("top", function (terms) {                                                                           // 31
  return {                                                                                                          // 32
    options: {sort: {sticky: -1, score: -1}}                                                                        // 33
  };                                                                                                                // 34
});                                                                                                                 // 35
                                                                                                                    // 36
/**                                                                                                                 // 37
 * New view                                                                                                         // 38
 */                                                                                                                 // 39
Posts.views.add("new", function (terms) {                                                                           // 40
  return {                                                                                                          // 41
    options: {sort: {sticky: -1, postedAt: -1}}                                                                     // 42
  };                                                                                                                // 43
});                                                                                                                 // 44
                                                                                                                    // 45
/**                                                                                                                 // 46
 * Best view                                                                                                        // 47
 */                                                                                                                 // 48
Posts.views.add("best", function (terms) {                                                                          // 49
  return {                                                                                                          // 50
    options: {sort: {sticky: -1, baseScore: -1}}                                                                    // 51
  };                                                                                                                // 52
});                                                                                                                 // 53
                                                                                                                    // 54
/**                                                                                                                 // 55
 * Pending view                                                                                                     // 56
 */                                                                                                                 // 57
Posts.views.add("pending", function (terms) {                                                                       // 58
  return {                                                                                                          // 59
    find: {                                                                                                         // 60
      status: 1                                                                                                     // 61
    },                                                                                                              // 62
    options: {sort: {createdAt: -1}},                                                                               // 63
    showFuture: true                                                                                                // 64
  };                                                                                                                // 65
});                                                                                                                 // 66
                                                                                                                    // 67
/**                                                                                                                 // 68
 * Scheduled view                                                                                                   // 69
 */                                                                                                                 // 70
Posts.views.add("scheduled", function (terms) {                                                                     // 71
  return {                                                                                                          // 72
    find: {postedAt: {$gte: new Date()}},                                                                           // 73
    options: {sort: {postedAt: -1}}                                                                                 // 74
  };                                                                                                                // 75
});                                                                                                                 // 76
                                                                                                                    // 77
/**                                                                                                                 // 78
 * User posts view                                                                                                  // 79
 */                                                                                                                 // 80
Posts.views.add("userPosts", function (terms) {                                                                     // 81
  return {                                                                                                          // 82
    find: {userId: terms.userId},                                                                                   // 83
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 84
  };                                                                                                                // 85
});                                                                                                                 // 86
                                                                                                                    // 87
/**                                                                                                                 // 88
 * User upvoted posts view                                                                                          // 89
 */                                                                                                                 // 90
Posts.views.add("userUpvotedPosts", function (terms) {                                                              // 91
  var user = Meteor.users.findOne(terms.userId);                                                                    // 92
  var postsIds = _.pluck(user.telescope.upvotedPosts, "itemId");                                                    // 93
  return {                                                                                                          // 94
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts                                 // 95
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 96
  };                                                                                                                // 97
});                                                                                                                 // 98
                                                                                                                    // 99
/**                                                                                                                 // 100
 * User downvoted posts view                                                                                        // 101
 */                                                                                                                 // 102
Posts.views.add("userDownvotedPosts", function (terms) {                                                            // 103
  var user = Meteor.users.findOne(terms.userId);                                                                    // 104
  var postsIds = _.pluck(user.telescope.downvotedPosts, "itemId");                                                  // 105
  // TODO: sort based on votedAt timestamp and not postedAt, if possible                                            // 106
  return {                                                                                                          // 107
    find: {_id: {$in: postsIds}},                                                                                   // 108
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 109
  };                                                                                                                // 110
});                                                                                                                 // 111
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/helpers.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
//////////////////                                                                                                  // 1
// Post Helpers //                                                                                                  // 2
//////////////////                                                                                                  // 3
                                                                                                                    // 4
/**                                                                                                                 // 5
 * Grab common post properties.                                                                                     // 6
 * @param {Object} post                                                                                             // 7
 */                                                                                                                 // 8
Posts.getProperties = function (post) {                                                                             // 9
  var postAuthor = Meteor.users.findOne(post.userId);                                                               // 10
  var p = {                                                                                                         // 11
    postAuthorName : Users.getDisplayName(postAuthor),                                                              // 12
    postTitle : Telescope.utils.cleanUp(post.title),                                                                // 13
    profileUrl: Users.getProfileUrlBySlugOrId(post.userId),                                                         // 14
    postUrl: Posts.getPageUrl(post),                                                                                // 15
    thumbnailUrl: post.thumbnailUrl,                                                                                // 16
    linkUrl: !!post.url ? Posts.getOutgoingUrl(post.url) : Posts.getPageUrl(post._id)                               // 17
  };                                                                                                                // 18
                                                                                                                    // 19
  if(post.url)                                                                                                      // 20
    p.url = post.url;                                                                                               // 21
                                                                                                                    // 22
  if(post.htmlBody)                                                                                                 // 23
    p.htmlBody = post.htmlBody;                                                                                     // 24
                                                                                                                    // 25
  return p;                                                                                                         // 26
};                                                                                                                  // 27
                                                                                                                    // 28
/**                                                                                                                 // 29
 * Get default status for new posts.                                                                                // 30
 * @param {Object} user                                                                                             // 31
 */                                                                                                                 // 32
Posts.getDefaultStatus = function (user) {                                                                          // 33
  var hasAdminRights = typeof user === 'undefined' ? false : Users.is.admin(user);                                  // 34
  if (hasAdminRights || !Settings.get('requirePostsApproval', false)) {                                             // 35
    // if user is admin, or else post approval is not required                                                      // 36
    return Posts.config.STATUS_APPROVED                                                                             // 37
  } else {                                                                                                          // 38
    // else                                                                                                         // 39
    return Posts.config.STATUS_PENDING                                                                              // 40
  }                                                                                                                 // 41
};                                                                                                                  // 42
                                                                                                                    // 43
/**                                                                                                                 // 44
 * Get URL of a post page.                                                                                          // 45
 * @param {Object} post                                                                                             // 46
 */                                                                                                                 // 47
Posts.getPageUrl = function(post){                                                                                  // 48
  return Telescope.utils.getSiteUrl()+'posts/'+post._id;                                                            // 49
};                                                                                                                  // 50
                                                                                                                    // 51
/**                                                                                                                 // 52
 * Get post edit page URL.                                                                                          // 53
 * @param {String} id                                                                                               // 54
 */                                                                                                                 // 55
Posts.getEditUrl = function(id){                                                                                    // 56
  return Telescope.utils.getSiteUrl()+'posts/'+id+'/edit';                                                          // 57
};                                                                                                                  // 58
                                                                                                                    // 59
/**                                                                                                                 // 60
 * Return a post's link if it has one, else return its post page URL                                                // 61
 * @param {Object} post                                                                                             // 62
 */                                                                                                                 // 63
Posts.getLink = function (post) {                                                                                   // 64
  return !!post.url ? Posts.getOutgoingUrl(post.url) : this.getPageUrl(post);                                       // 65
};                                                                                                                  // 66
                                                                                                                    // 67
/**                                                                                                                 // 68
 * Check to see if post URL is unique.                                                                              // 69
 * We need the current user so we know who to upvote the existing post as.                                          // 70
 * @param {String} url                                                                                              // 71
 * @param {Object} currentUser                                                                                      // 72
 */                                                                                                                 // 73
Posts.checkForSameUrl = function (url, currentUser) {                                                               // 74
                                                                                                                    // 75
  // check that there are no previous posts with the same link in the past 6 months                                 // 76
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();                                                       // 77
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});                                 // 78
                                                                                                                    // 79
  if(typeof postWithSameLink !== 'undefined'){                                                                      // 80
    Telescope.upvoteItem(Posts, postWithSameLink, currentUser);                                                     // 81
                                                                                                                    // 82
    // note: error.details returns undefined on the client, so add post ID to reason                                // 83
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_posted') + '|' + postWithSameLink._id, postWithSameLink._id);
  }                                                                                                                 // 85
};                                                                                                                  // 86
                                                                                                                    // 87
/**                                                                                                                 // 88
 * When on a post page, return the current post                                                                     // 89
 */                                                                                                                 // 90
Posts.current = function () {                                                                                       // 91
  return Posts.findOne(Router.current().data()._id);                                                                // 92
};                                                                                                                  // 93
                                                                                                                    // 94
Posts.getOutgoingUrl = function(url) {                                                                              // 95
  return Telescope.utils.getRouteUrl('out', {}, {query: {url: url}});                                               // 96
};                                                                                                                  // 97
                                                                                                                    // 98
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/modules.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
Telescope.modules.add("postsListTop", {                                                                             // 2
  template: 'posts_views_nav',                                                                                      // 3
  order: 99                                                                                                         // 4
});                                                                                                                 // 5
                                                                                                                    // 6
Telescope.modules.add("postComponents", [                                                                           // 7
  {                                                                                                                 // 8
    template: 'post_rank',                                                                                          // 9
    order: 1                                                                                                        // 10
  },                                                                                                                // 11
  {                                                                                                                 // 12
    template: 'post_upvote',                                                                                        // 13
    order: 10                                                                                                       // 14
  },                                                                                                                // 15
  {                                                                                                                 // 16
    template: 'post_content',                                                                                       // 17
    order: 20                                                                                                       // 18
  },                                                                                                                // 19
  {                                                                                                                 // 20
    template: 'post_avatars',                                                                                       // 21
    order: 30                                                                                                       // 22
  },                                                                                                                // 23
  {                                                                                                                 // 24
    template: 'post_discuss',                                                                                       // 25
    order: 40                                                                                                       // 26
  },                                                                                                                // 27
  {                                                                                                                 // 28
    template: 'post_actions',                                                                                       // 29
    order: 50                                                                                                       // 30
  }                                                                                                                 // 31
]);                                                                                                                 // 32
                                                                                                                    // 33
Telescope.modules.add("postHeading", [                                                                              // 34
  {                                                                                                                 // 35
    template: 'post_title',                                                                                         // 36
    order: 10                                                                                                       // 37
  },                                                                                                                // 38
  {                                                                                                                 // 39
    template: 'post_domain',                                                                                        // 40
    order: 20                                                                                                       // 41
  }                                                                                                                 // 42
]);                                                                                                                 // 43
                                                                                                                    // 44
Telescope.modules.add("postMeta", [                                                                                 // 45
  {                                                                                                                 // 46
    template: 'post_author',                                                                                        // 47
    order: 10                                                                                                       // 48
  },                                                                                                                // 49
  {                                                                                                                 // 50
    template: 'post_info',                                                                                          // 51
    order: 20                                                                                                       // 52
  },                                                                                                                // 53
  {                                                                                                                 // 54
    template: 'post_comments_link',                                                                                 // 55
    order: 30                                                                                                       // 56
  },                                                                                                                // 57
  {                                                                                                                 // 58
    template: 'post_admin',                                                                                         // 59
    order: 50                                                                                                       // 60
  }                                                                                                                 // 61
]);                                                                                                                 // 62
                                                                                                                    // 63
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/callbacks.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Increment the user's post count and upvote the post                                                              // 2
 */                                                                                                                 // 3
function afterPostSubmitOperations (post) {                                                                         // 4
  var userId = post.userId,                                                                                         // 5
      postAuthor = Meteor.users.findOne(userId);                                                                    // 6
                                                                                                                    // 7
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});                                           // 8
  Telescope.upvoteItem(Posts, post, postAuthor);                                                                    // 9
  return post;                                                                                                      // 10
}                                                                                                                   // 11
Telescope.callbacks.add("postSubmitAsync", afterPostSubmitOperations);                                              // 12
                                                                                                                    // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/methods.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 *                                                                                                                  // 2
 * Post Methods                                                                                                     // 3
 *                                                                                                                  // 4
 */                                                                                                                 // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Insert a post in the database (note: optional post properties not listed here)                                   // 8
 * @param {Object} post - the post being inserted                                                                   // 9
 * @param {string} post.userId - the id of the user the post belongs to                                             // 10
 * @param {string} post.title - the post's title                                                                    // 11
 */                                                                                                                 // 12
Posts.submit = function (post) {                                                                                    // 13
                                                                                                                    // 14
  var userId = post.userId, // at this stage, a userId is expected                                                  // 15
      user = Users.findOne(userId);                                                                                 // 16
                                                                                                                    // 17
  // ------------------------------ Checks ------------------------------ //                                        // 18
                                                                                                                    // 19
  // check that a title was provided                                                                                // 20
  if(!post.title)                                                                                                   // 21
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));                                                  // 22
                                                                                                                    // 23
  // check that there are no posts with the same URL                                                                // 24
  if(!!post.url)                                                                                                    // 25
    Posts.checkForSameUrl(post.url, user);                                                                          // 26
                                                                                                                    // 27
  // ------------------------------ Properties ------------------------------ //                                    // 28
                                                                                                                    // 29
  var defaultProperties = {                                                                                         // 30
    createdAt: new Date(),                                                                                          // 31
    author: Users.getDisplayNameById(userId),                                                                       // 32
    upvotes: 0,                                                                                                     // 33
    downvotes: 0,                                                                                                   // 34
    commentCount: 0,                                                                                                // 35
    clickCount: 0,                                                                                                  // 36
    viewCount: 0,                                                                                                   // 37
    baseScore: 0,                                                                                                   // 38
    score: 0,                                                                                                       // 39
    inactive: false,                                                                                                // 40
    sticky: false,                                                                                                  // 41
    status: Posts.getDefaultStatus()                                                                                // 42
  };                                                                                                                // 43
                                                                                                                    // 44
  post = _.extend(defaultProperties, post);                                                                         // 45
                                                                                                                    // 46
  // if post is approved but doesn't have a postedAt date, give it a default date                                   // 47
  // note: pending posts get their postedAt date only once theyre approved                                          // 48
  if (post.status === Posts.config.STATUS_APPROVED && !post.postedAt)                                               // 49
    post.postedAt = new Date();                                                                                     // 50
                                                                                                                    // 51
  // clean up post title                                                                                            // 52
  post.title = Telescope.utils.cleanUp(post.title);                                                                 // 53
                                                                                                                    // 54
  // ------------------------------ Callbacks ------------------------------ //                                     // 55
                                                                                                                    // 56
  // run all post submit server callbacks on post object successively                                               // 57
  post = Telescope.callbacks.run("postSubmit", post);                                                               // 58
                                                                                                                    // 59
  // -------------------------------- Insert ------------------------------- //                                     // 60
                                                                                                                    // 61
  post._id = Posts.insert(post);                                                                                    // 62
                                                                                                                    // 63
  // --------------------- Server-Side Async Callbacks --------------------- //                                     // 64
                                                                                                                    // 65
  Telescope.callbacks.runAsync("postSubmitAsync", post);                                                            // 66
                                                                                                                    // 67
  return post;                                                                                                      // 68
};                                                                                                                  // 69
                                                                                                                    // 70
/**                                                                                                                 // 71
 * Edit a post in the database                                                                                      // 72
 * @param {string} postId – the ID of the post being edited                                                         // 73
 * @param {Object} modifier – the modifier object                                                                   // 74
 * @param {Object} post - the current post object                                                                   // 75
 */                                                                                                                 // 76
Posts.edit = function (postId, modifier, post) {                                                                    // 77
                                                                                                                    // 78
  if (typeof post === "undefined") {                                                                                // 79
    post = Posts.findOne(postId);                                                                                   // 80
  }                                                                                                                 // 81
                                                                                                                    // 82
                                                                                                                    // 83
  // ------------------------------ Callbacks ------------------------------ //                                     // 84
                                                                                                                    // 85
  // run all post edit server callbacks on modifier successively                                                    // 86
  modifier = Telescope.callbacks.run("postEdit", modifier, post);                                                   // 87
                                                                                                                    // 88
  // ------------------------------ Update ------------------------------ //                                        // 89
                                                                                                                    // 90
  Posts.update(postId, modifier);                                                                                   // 91
                                                                                                                    // 92
  // ------------------------------ Callbacks ------------------------------ //                                     // 93
                                                                                                                    // 94
  Telescope.callbacks.runAsync("postEditAsync", Posts.findOne(postId));                                             // 95
                                                                                                                    // 96
  // ------------------------------ After Update ------------------------------ //                                  // 97
  return Posts.findOne(postId);                                                                                     // 98
};                                                                                                                  // 99
                                                                                                                    // 100
// ------------------------------------------------------------------------------------------- //                   // 101
// ----------------------------------------- Methods ----------------------------------------- //                   // 102
// ------------------------------------------------------------------------------------------- //                   // 103
                                                                                                                    // 104
var postViews = [];                                                                                                 // 105
                                                                                                                    // 106
Meteor.methods({                                                                                                    // 107
                                                                                                                    // 108
  /**                                                                                                               // 109
   * Meteor method for submitting a post from the client                                                            // 110
   * @memberof Posts                                                                                                // 111
   * @param {Object} post - the post being inserted                                                                 // 112
   */                                                                                                               // 113
  submitPost: function(post){                                                                                       // 114
                                                                                                                    // 115
    // required properties:                                                                                         // 116
    // title                                                                                                        // 117
                                                                                                                    // 118
    // optional properties                                                                                          // 119
    // URL                                                                                                          // 120
    // body                                                                                                         // 121
    // categories                                                                                                   // 122
    // thumbnailUrl                                                                                                 // 123
                                                                                                                    // 124
    // NOTE: the current user and the post author user might be two different users!                                // 125
    var user = Meteor.user(),                                                                                       // 126
        hasAdminRights = Users.is.admin(user),                                                                      // 127
        schema = Posts.simpleSchema()._schema;                                                                      // 128
                                                                                                                    // 129
    // ------------------------------ Checks ------------------------------ //                                      // 130
                                                                                                                    // 131
    // check that user can post                                                                                     // 132
    if (!user || !Users.can.post(user))                                                                             // 133
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_post_new_stories'));                   // 134
                                                                                                                    // 135
    // --------------------------- Rate Limiting -------------------------- //                                      // 136
                                                                                                                    // 137
    if(!hasAdminRights){                                                                                            // 138
                                                                                                                    // 139
      var timeSinceLastPost = Users.timeSinceLast(user, Posts),                                                     // 140
        numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),                                 // 141
        postInterval = Math.abs(parseInt(Settings.get('postInterval', 30))),                                        // 142
        maxPostsPer24Hours = Math.abs(parseInt(Settings.get('maxPostsPerDay', 30)));                                // 143
                                                                                                                    // 144
      // check that user waits more than X seconds between posts                                                    // 145
      if(timeSinceLastPost < postInterval)                                                                          // 146
        throw new Meteor.Error(604, i18n.t('please_wait')+(postInterval-timeSinceLastPost)+i18n.t('seconds_before_posting_again'));
                                                                                                                    // 148
      // check that the user doesn't post more than Y posts per day                                                 // 149
      if(numberOfPostsInPast24Hours > maxPostsPer24Hours)                                                           // 150
        throw new Meteor.Error(605, i18n.t('sorry_you_cannot_submit_more_than')+maxPostsPer24Hours+i18n.t('posts_per_day'));
                                                                                                                    // 152
    }                                                                                                               // 153
                                                                                                                    // 154
    // ------------------------------ Properties ------------------------------ //                                  // 155
                                                                                                                    // 156
    // admin-only properties                                                                                        // 157
    // status                                                                                                       // 158
    // postedAt                                                                                                     // 159
    // userId                                                                                                       // 160
    // sticky (default to false)                                                                                    // 161
                                                                                                                    // 162
    // go over each schema field and throw an error if it's not editable                                            // 163
    _.keys(post).forEach(function (fieldName) {                                                                     // 164
                                                                                                                    // 165
      var field = schema[fieldName];                                                                                // 166
      if (!Users.can.submitField(user, field)) {                                                                    // 167
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 168
      }                                                                                                             // 169
                                                                                                                    // 170
    });                                                                                                             // 171
                                                                                                                    // 172
    // if no post status has been set, set it now                                                                   // 173
    if (!post.status) {                                                                                             // 174
      post.status = Posts.getDefaultStatus(user);                                                                   // 175
    }                                                                                                               // 176
                                                                                                                    // 177
    // if no userId has been set, default to current user id                                                        // 178
    if (!post.userId) {                                                                                             // 179
      post.userId = user._id;                                                                                       // 180
    }                                                                                                               // 181
                                                                                                                    // 182
    return Posts.submit(post);                                                                                      // 183
  },                                                                                                                // 184
                                                                                                                    // 185
  /**                                                                                                               // 186
   * Meteor method for editing a post from the client                                                               // 187
   * @memberof Posts                                                                                                // 188
   * @param {Object} modifier - the update modifier                                                                 // 189
   * @param {Object} postId - the id of the post being updated                                                      // 190
   */                                                                                                               // 191
  editPost: function (modifier, postId) {                                                                           // 192
                                                                                                                    // 193
    var user = Meteor.user(),                                                                                       // 194
        post = Posts.findOne(postId),                                                                               // 195
        schema = Posts.simpleSchema()._schema;                                                                      // 196
                                                                                                                    // 197
    // ------------------------------ Checks ------------------------------ //                                      // 198
                                                                                                                    // 199
    // check that user can edit document                                                                            // 200
    if (!user || !Users.can.edit(user, post)) {                                                                     // 201
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_post'));                                       // 202
    }                                                                                                               // 203
                                                                                                                    // 204
    // go over each field and throw an error if it's not editable                                                   // 205
    // loop over each operation ($set, $unset, etc.)                                                                // 206
    _.each(modifier, function (operation) {                                                                         // 207
      // loop over each property being operated on                                                                  // 208
      _.keys(operation).forEach(function (fieldName) {                                                              // 209
                                                                                                                    // 210
        var field = schema[fieldName];                                                                              // 211
        if (!Users.can.editField(user, field, post)) {                                                              // 212
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName); // 213
        }                                                                                                           // 214
                                                                                                                    // 215
      });                                                                                                           // 216
    });                                                                                                             // 217
                                                                                                                    // 218
    return Posts.edit(postId, modifier, post);                                                                      // 219
                                                                                                                    // 220
  },                                                                                                                // 221
                                                                                                                    // 222
  setPostedAt: function(post, customPostedAt){                                                                      // 223
                                                                                                                    // 224
    var postedAt = new Date(); // default to current date and time                                                  // 225
                                                                                                                    // 226
    if(Users.is.admin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;                                                                                    // 228
                                                                                                                    // 229
    Posts.update(post._id, {$set: {postedAt: postedAt}});                                                           // 230
  },                                                                                                                // 231
                                                                                                                    // 232
  approvePost: function(post){                                                                                      // 233
    if(Users.is.admin(Meteor.user())){                                                                              // 234
      var set = {status: 2};                                                                                        // 235
                                                                                                                    // 236
      // unless post is already scheduled and has a postedAt date, set its postedAt date to now                     // 237
      if (!post.postedAt)                                                                                           // 238
        set.postedAt = new Date();                                                                                  // 239
                                                                                                                    // 240
      Posts.update(post._id, {$set: set}, {validate: false});                                                       // 241
                                                                                                                    // 242
      Telescope.callbacks.runAsync("postApprovedAsync", post);                                                      // 243
                                                                                                                    // 244
    }else{                                                                                                          // 245
      Messages.flash('You need to be an admin to do that.', "error");                                               // 246
    }                                                                                                               // 247
  },                                                                                                                // 248
                                                                                                                    // 249
  unapprovePost: function(post){                                                                                    // 250
    if(Users.is.admin(Meteor.user())){                                                                              // 251
      Posts.update(post._id, {$set: {status: 1}});                                                                  // 252
    }else{                                                                                                          // 253
      Messages.flash('You need to be an admin to do that.', "error");                                               // 254
    }                                                                                                               // 255
  },                                                                                                                // 256
                                                                                                                    // 257
  increasePostViews: function(postId, sessionId){                                                                   // 258
    this.unblock();                                                                                                 // 259
                                                                                                                    // 260
    // only let users increment a post's view counter once per session                                              // 261
    var view = {_id: postId, userId: this.userId, sessionId: sessionId};                                            // 262
                                                                                                                    // 263
    if(_.where(postViews, view).length === 0){                                                                      // 264
      postViews.push(view);                                                                                         // 265
      Posts.update(postId, { $inc: { viewCount: 1 }});                                                              // 266
    }                                                                                                               // 267
  },                                                                                                                // 268
                                                                                                                    // 269
  deletePostById: function(postId) {                                                                                // 270
    // remove post comments                                                                                         // 271
    // if(!this.isSimulation) {                                                                                     // 272
    //   Comments.remove({post: postId});                                                                           // 273
    // }                                                                                                            // 274
    // NOTE: actually, keep comments after all                                                                      // 275
                                                                                                                    // 276
    var post = Posts.findOne({_id: postId});                                                                        // 277
                                                                                                                    // 278
    if(!Meteor.userId() || !Users.can.editById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');
                                                                                                                    // 280
    // decrement post count                                                                                         // 281
    Users.update({_id: post.userId}, {$inc: {"telescope.postCount": -1}});                                          // 282
                                                                                                                    // 283
    // delete post                                                                                                  // 284
    Posts.remove(postId);                                                                                           // 285
  }                                                                                                                 // 286
                                                                                                                    // 287
});                                                                                                                 // 288
                                                                                                                    // 289
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/menus.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// array containing items in the views menu                                                                         // 1
Telescope.menuItems.add("viewsMenu", [                                                                              // 2
  {                                                                                                                 // 3
    route: 'posts_top',                                                                                             // 4
    label: 'top',                                                                                                   // 5
    description: 'most_popular_posts'                                                                               // 6
  },                                                                                                                // 7
  {                                                                                                                 // 8
    route: 'posts_new',                                                                                             // 9
    label: 'new',                                                                                                   // 10
    description: 'newest_posts'                                                                                     // 11
  },                                                                                                                // 12
  {                                                                                                                 // 13
    route: 'posts_best',                                                                                            // 14
    label: 'best',                                                                                                  // 15
    description: 'highest_ranked_posts_ever'                                                                        // 16
  },                                                                                                                // 17
  {                                                                                                                 // 18
    route: 'posts_pending',                                                                                         // 19
    label: 'pending',                                                                                               // 20
    description: 'posts_awaiting_moderation',                                                                       // 21
    adminOnly: true                                                                                                 // 22
  },                                                                                                                // 23
  {                                                                                                                 // 24
    route: 'posts_scheduled',                                                                                       // 25
    label: 'scheduled',                                                                                             // 26
    description: 'future_scheduled_posts',                                                                          // 27
    adminOnly: true                                                                                                 // 28
  },                                                                                                                // 29
]);                                                                                                                 // 30
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/routes.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The Posts.controllers namespace                                                                                  // 2
 * @namespace Posts.controllers                                                                                     // 3
 */                                                                                                                 // 4
Posts.controllers = {};                                                                                             // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Controller for all posts lists                                                                                   // 8
 */                                                                                                                 // 9
Posts.controllers.list = RouteController.extend({                                                                   // 10
                                                                                                                    // 11
  template: "posts_list_controller",                                                                                // 12
                                                                                                                    // 13
  onBeforeAction: function () {                                                                                     // 14
    var showViewsNav = (typeof this.showViewsNav === 'undefined') ? true : this.showViewsNav;                       // 15
                                                                                                                    // 16
    if (showViewsNav) {                                                                                             // 17
      this.render('posts_list_top', {to: 'postsListTop'});                                                          // 18
    }                                                                                                               // 19
    this.next();                                                                                                    // 20
  },                                                                                                                // 21
                                                                                                                    // 22
  data: function () {                                                                                               // 23
                                                                                                                    // 24
    var terms = {                                                                                                   // 25
      view: this.view,                                                                                              // 26
      limit: this.params.limit || Settings.get('postsPerPage', 10)                                                  // 27
    };                                                                                                              // 28
                                                                                                                    // 29
    // console.log('----------------- router running');                                                             // 30
                                                                                                                    // 31
    // note: the post list controller template will handle all subscriptions, so we just need to pass in the terms  // 32
    return {                                                                                                        // 33
      terms: terms                                                                                                  // 34
    };                                                                                                              // 35
  },                                                                                                                // 36
                                                                                                                    // 37
  getTitle: function () {                                                                                           // 38
    return i18n.t(this.view);                                                                                       // 39
  },                                                                                                                // 40
                                                                                                                    // 41
  getDescription: function () {                                                                                     // 42
    if (Router.current().route.getName() === 'posts_default') { // return site description on root path             // 43
      return Settings.get('description');                                                                           // 44
    } else {                                                                                                        // 45
      return i18n.t(_.findWhere(Telescope.menuItems.get("viewsMenu"), {label: this.view}).description);             // 46
    }                                                                                                               // 47
  },                                                                                                                // 48
                                                                                                                    // 49
  fastRender: true                                                                                                  // 50
});                                                                                                                 // 51
                                                                                                                    // 52
var getDefaultViewController = function () {                                                                        // 53
  var defaultView = Settings.get('defaultView', 'top');                                                             // 54
  // if view we got from settings is available in Posts.views object, use it                                        // 55
  if (!!Posts.controllers[defaultView]) {                                                                           // 56
    return Posts.controllers[defaultView];                                                                          // 57
  } else {                                                                                                          // 58
    return Posts.controllers.top;                                                                                   // 59
  }                                                                                                                 // 60
};                                                                                                                  // 61
                                                                                                                    // 62
// wrap in startup block to make sure Settings collection is defined                                                // 63
Meteor.startup(function () {                                                                                        // 64
  Posts.controllers.default = getDefaultViewController().extend({                                                   // 65
    getTitle: function () {                                                                                         // 66
      var title = Settings.get('title', 'Telescope');                                                               // 67
      var tagline = Settings.get('tagline');                                                                        // 68
      var fullTitle = !!tagline ? title + ' – ' + tagline : title ;                                                 // 69
      return fullTitle;                                                                                             // 70
    }                                                                                                               // 71
  });                                                                                                               // 72
                                                                                                                    // 73
});                                                                                                                 // 74
                                                                                                                    // 75
/**                                                                                                                 // 76
 * Controller for top view                                                                                          // 77
 */                                                                                                                 // 78
Posts.controllers.top = Posts.controllers.list.extend({                                                             // 79
  view: 'top'                                                                                                       // 80
});                                                                                                                 // 81
                                                                                                                    // 82
/**                                                                                                                 // 83
 * Controller for new view                                                                                          // 84
 */                                                                                                                 // 85
Posts.controllers.new = Posts.controllers.list.extend({                                                             // 86
  view: 'new'                                                                                                       // 87
});                                                                                                                 // 88
                                                                                                                    // 89
/**                                                                                                                 // 90
 * Controller for best view                                                                                         // 91
 */                                                                                                                 // 92
Posts.controllers.best = Posts.controllers.list.extend({                                                            // 93
  view: 'best'                                                                                                      // 94
});                                                                                                                 // 95
                                                                                                                    // 96
/**                                                                                                                 // 97
 * Controller for pending view                                                                                      // 98
 */                                                                                                                 // 99
Posts.controllers.pending = Posts.controllers.list.extend({                                                         // 100
  view: 'pending'                                                                                                   // 101
});                                                                                                                 // 102
                                                                                                                    // 103
/**                                                                                                                 // 104
 * Controller for scheduled view                                                                                    // 105
 */                                                                                                                 // 106
Posts.controllers.scheduled = Posts.controllers.list.extend({                                                       // 107
  view: 'scheduled'                                                                                                 // 108
});                                                                                                                 // 109
                                                                                                                    // 110
/**                                                                                                                 // 111
 * Controller for single post page                                                                                  // 112
 */                                                                                                                 // 113
Posts.controllers.page = RouteController.extend({                                                                   // 114
                                                                                                                    // 115
  template: 'post_page',                                                                                            // 116
                                                                                                                    // 117
  waitOn: function() {                                                                                              // 118
    this.postSubscription = coreSubscriptions.subscribe('singlePost', this.params._id);                             // 119
    this.postUsersSubscription = coreSubscriptions.subscribe('postUsers', this.params._id);                         // 120
    this.commentSubscription = coreSubscriptions.subscribe('commentsList', {view: 'postComments', postId: this.params._id});
  },                                                                                                                // 122
                                                                                                                    // 123
  post: function() {                                                                                                // 124
    return Posts.findOne(this.params._id);                                                                          // 125
  },                                                                                                                // 126
                                                                                                                    // 127
  getTitle: function () {                                                                                           // 128
    if (!!this.post())                                                                                              // 129
      return this.post().title;                                                                                     // 130
  },                                                                                                                // 131
                                                                                                                    // 132
  onBeforeAction: function() {                                                                                      // 133
    if (! this.post()) {                                                                                            // 134
      if (this.postSubscription.ready()) {                                                                          // 135
        this.render('not_found');                                                                                   // 136
      } else {                                                                                                      // 137
        this.render('loading');                                                                                     // 138
      }                                                                                                             // 139
    } else {                                                                                                        // 140
      this.next();                                                                                                  // 141
    }                                                                                                               // 142
  },                                                                                                                // 143
                                                                                                                    // 144
  onRun: function() {                                                                                               // 145
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increasePostViews', this.params._id, sessionId);                                                   // 147
    this.next();                                                                                                    // 148
  },                                                                                                                // 149
                                                                                                                    // 150
  data: function() {                                                                                                // 151
    return this.post();                                                                                             // 152
  },                                                                                                                // 153
  fastRender: true                                                                                                  // 154
});                                                                                                                 // 155
                                                                                                                    // 156
Meteor.startup(function () {                                                                                        // 157
                                                                                                                    // 158
  Router.route('/', {                                                                                               // 159
    name: 'posts_default',                                                                                          // 160
    controller: Posts.controllers.default                                                                           // 161
  });                                                                                                               // 162
                                                                                                                    // 163
  Router.route('/top/:limit?', {                                                                                    // 164
    name: 'posts_top',                                                                                              // 165
    controller: Posts.controllers.top                                                                               // 166
  });                                                                                                               // 167
                                                                                                                    // 168
  // New                                                                                                            // 169
                                                                                                                    // 170
  Router.route('/new/:limit?', {                                                                                    // 171
    name: 'posts_new',                                                                                              // 172
    controller: Posts.controllers.new                                                                               // 173
  });                                                                                                               // 174
                                                                                                                    // 175
  // Best                                                                                                           // 176
                                                                                                                    // 177
  Router.route('/best/:limit?', {                                                                                   // 178
    name: 'posts_best',                                                                                             // 179
    controller: Posts.controllers.best                                                                              // 180
  });                                                                                                               // 181
                                                                                                                    // 182
  // Pending                                                                                                        // 183
                                                                                                                    // 184
  Router.route('/pending/:limit?', {                                                                                // 185
    name: 'posts_pending',                                                                                          // 186
    controller: Posts.controllers.pending                                                                           // 187
  });                                                                                                               // 188
                                                                                                                    // 189
  // Scheduled                                                                                                      // 190
                                                                                                                    // 191
  Router.route('/scheduled/:limit?', {                                                                              // 192
    name: 'posts_scheduled',                                                                                        // 193
    controller: Posts.controllers.scheduled                                                                         // 194
  });                                                                                                               // 195
                                                                                                                    // 196
  // Post Page                                                                                                      // 197
                                                                                                                    // 198
  Router.route('/posts/:_id', {                                                                                     // 199
    name: 'post_page',                                                                                              // 200
    controller: Posts.controllers.page                                                                              // 201
  });                                                                                                               // 202
                                                                                                                    // 203
  Router.route('/posts/:_id/comment/:commentId', {                                                                  // 204
    name: 'post_page_comment',                                                                                      // 205
    controller: Posts.controllers.page,                                                                             // 206
    onAfterAction: function () {                                                                                    // 207
      // TODO: scroll to comment position                                                                           // 208
    }                                                                                                               // 209
  });                                                                                                               // 210
                                                                                                                    // 211
  // Post Edit                                                                                                      // 212
                                                                                                                    // 213
  Router.route('/posts/:_id/edit', {                                                                                // 214
    name: 'post_edit',                                                                                              // 215
    template: 'post_edit',                                                                                          // 216
    waitOn: function () {                                                                                           // 217
      return [                                                                                                      // 218
        coreSubscriptions.subscribe('singlePost', this.params._id),                                                 // 219
        coreSubscriptions.subscribe('allUsersAdmin')                                                                // 220
      ];                                                                                                            // 221
    },                                                                                                              // 222
    data: function() {                                                                                              // 223
      return {                                                                                                      // 224
        postId: this.params._id,                                                                                    // 225
        post: Posts.findOne(this.params._id)                                                                        // 226
      };                                                                                                            // 227
    },                                                                                                              // 228
    fastRender: true                                                                                                // 229
  });                                                                                                               // 230
                                                                                                                    // 231
  // Post Submit                                                                                                    // 232
                                                                                                                    // 233
  Router.route('/submit', {                                                                                         // 234
    name: 'post_submit',                                                                                            // 235
    template: 'post_submit',                                                                                        // 236
    waitOn: function () {                                                                                           // 237
      return coreSubscriptions.subscribe('allUsersAdmin');                                                          // 238
    }                                                                                                               // 239
  });                                                                                                               // 240
                                                                                                                    // 241
});                                                                                                                 // 242
                                                                                                                    // 243
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/server/publications.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Posts._ensureIndex({"status": 1, "postedAt": 1});                                                                   // 1
                                                                                                                    // 2
// Publish a list of posts                                                                                          // 3
                                                                                                                    // 4
Meteor.publish('postsList', function(terms) {                                                                       // 5
  if(Users.can.viewById(this.userId)){                                                                              // 6
    var parameters = Posts.getSubParams(terms),                                                                     // 7
        posts = Posts.find(parameters.find, parameters.options);                                                    // 8
                                                                                                                    // 9
    return posts;                                                                                                   // 10
  }                                                                                                                 // 11
  return [];                                                                                                        // 12
});                                                                                                                 // 13
                                                                                                                    // 14
// Publish all the users that have posted the currently displayed list of posts                                     // 15
// plus the commenters for each post                                                                                // 16
                                                                                                                    // 17
Meteor.publish('postsListUsers', function(terms) {                                                                  // 18
  if(Users.can.viewById(this.userId)){                                                                              // 19
    var parameters = Posts.getSubParams(terms),                                                                     // 20
        posts = Posts.find(parameters.find, parameters.options),                                                    // 21
        userIds = _.pluck(posts.fetch(), 'userId');                                                                 // 22
                                                                                                                    // 23
    // for each post, add first four commenter's userIds to userIds array                                           // 24
    posts.forEach(function (post) {                                                                                 // 25
      userIds = userIds.concat(_.first(post.commenters,4));                                                         // 26
    });                                                                                                             // 27
                                                                                                                    // 28
    userIds = _.unique(userIds);                                                                                    // 29
                                                                                                                    // 30
    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarProperties, multi: true});          // 31
  }                                                                                                                 // 32
  return [];                                                                                                        // 33
});                                                                                                                 // 34
                                                                                                                    // 35
// Publish a single post                                                                                            // 36
                                                                                                                    // 37
Meteor.publish('singlePost', function(id) {                                                                         // 38
  if (Users.can.viewById(this.userId)){                                                                             // 39
    return Posts.find(id);                                                                                          // 40
  }                                                                                                                 // 41
  return [];                                                                                                        // 42
});                                                                                                                 // 43
                                                                                                                    // 44
// Publish author of the current post, authors of its comments, and upvoters of the post                            // 45
                                                                                                                    // 46
Meteor.publish('postUsers', function(postId) {                                                                      // 47
  if (Users.can.viewById(this.userId)){                                                                             // 48
    // publish post author and post commenters                                                                      // 49
    var post = Posts.findOne(postId);                                                                               // 50
    var users = [];                                                                                                 // 51
                                                                                                                    // 52
    if (post) {                                                                                                     // 53
                                                                                                                    // 54
      users.push(post.userId); // publish post author's ID                                                          // 55
                                                                                                                    // 56
      // get IDs from all commenters on the post                                                                    // 57
      var comments = Comments.find({postId: post._id}).fetch();                                                     // 58
      if (comments.length) {                                                                                        // 59
        users = users.concat(_.pluck(comments, "userId"));                                                          // 60
      }                                                                                                             // 61
                                                                                                                    // 62
      // publish upvoters                                                                                           // 63
      if (post.upvoters && post.upvoters.length) {                                                                  // 64
        users = users.concat(post.upvoters);                                                                        // 65
      }                                                                                                             // 66
                                                                                                                    // 67
      // publish downvoters                                                                                         // 68
      if (post.downvoters && post.downvoters.length) {                                                              // 69
        users = users.concat(post.downvoters);                                                                      // 70
      }                                                                                                             // 71
                                                                                                                    // 72
    }                                                                                                               // 73
                                                                                                                    // 74
    // remove any duplicate IDs                                                                                     // 75
    users = _.unique(users);                                                                                        // 76
                                                                                                                    // 77
    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});                         // 78
  }                                                                                                                 // 79
  return [];                                                                                                        // 80
});                                                                                                                 // 81
                                                                                                                    // 82
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:posts'] = {
  Posts: Posts
};

})();

//# sourceMappingURL=telescope_posts.js.map
