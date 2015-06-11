(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Telescope = Package['telescope:lib'].Telescope;
var _ = Package.underscore._;
var getTemplate = Package['telescope:lib'].getTemplate;
var templates = Package['telescope:lib'].templates;
var themeSettings = Package['telescope:lib'].themeSettings;
var getVotePower = Package['telescope:lib'].getVotePower;
var Settings = Package['telescope:settings'].Settings;
var i18n = Package['telescope:i18n'].i18n;
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
var Users, __, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/package-i18n.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TAPi18n.packages["telescope:users"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};     // 1
                                                                                                                      // 2
// define package's translation function (proxy to the i18next)                                                       // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                      // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/namespace.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope Users namespace                                                                                          // 2
 * @namespace Users                                                                                                   // 3
 */                                                                                                                   // 4
Users = Meteor.users;                                                                                                 // 5
                                                                                                                      // 6
Users.getUser = function (userOrUserId) {                                                                             // 7
  if (typeof userOrUserId === "undefined") {                                                                          // 8
    if (!Meteor.user()) {                                                                                             // 9
      throw new Error();                                                                                              // 10
    } else {                                                                                                          // 11
      return Meteor.user();                                                                                           // 12
    }                                                                                                                 // 13
  } else if (typeof userOrUserId === "string") {                                                                      // 14
    return Meteor.users.findOne(userOrUserId);                                                                        // 15
  } else {                                                                                                            // 16
    return userOrUserId;                                                                                              // 17
  }                                                                                                                   // 18
};                                                                                                                    // 19
                                                                                                                      // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/roles.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope roles                                                                                                    // 2
 * @namespace Users.is                                                                                                // 3
 */                                                                                                                   // 4
Users.is = {};                                                                                                        // 5
                                                                                                                      // 6
/**                                                                                                                   // 7
 * Check if a user is an admin                                                                                        // 8
 * @param {Object|string} userOrUserId - The user or their userId                                                     // 9
 */                                                                                                                   // 10
Users.is.admin = function (userOrUserId) {                                                                            // 11
  try {                                                                                                               // 12
    var user = Users.getUser(userOrUserId);                                                                           // 13
    return !!user && !!user.isAdmin;                                                                                  // 14
  } catch (e) {                                                                                                       // 15
    return false; // user not logged in                                                                               // 16
  }                                                                                                                   // 17
};                                                                                                                    // 18
Users.is.adminById = Users.is.admin;                                                                                  // 19
                                                                                                                      // 20
/**                                                                                                                   // 21
 * Check if a user owns a document                                                                                    // 22
 * @param {Object|string} userOrUserId - The user or their userId                                                     // 23
 * @param {Object} document - The document to check (post, comment, user object, etc.)                                // 24
 */                                                                                                                   // 25
Users.is.owner = function (userOrUserId, document) {                                                                  // 26
  try {                                                                                                               // 27
    var user = Users.getUser(userOrUserId);                                                                           // 28
    if (!!document.userId) {                                                                                          // 29
      // case 1: document is a post or a comment, use userId to check                                                 // 30
      return user._id === document.userId;                                                                            // 31
    } else {                                                                                                          // 32
      // case 2: document is a user, use _id to check                                                                 // 33
      return user._id === document._id;                                                                               // 34
    }                                                                                                                 // 35
  } catch (e) {                                                                                                       // 36
    return false; // user not logged in                                                                               // 37
  }                                                                                                                   // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Users.is.ownerById = Users.is.owner;                                                                                  // 41
                                                                                                                      // 42
Users.is.invited = function (userOrUserId) {                                                                          // 43
  try {                                                                                                               // 44
    var user = Users.getUser(userOrUserId);                                                                           // 45
    return Users.is.admin(user) || user.telescope.isInvited;                                                          // 46
  } catch (e) {                                                                                                       // 47
    return false; // user not logged in                                                                               // 48
  }                                                                                                                   // 49
};                                                                                                                    // 50
Users.is.invitedById = Users.is.invited;                                                                              // 51
                                                                                                                      // 52
Meteor.users.helpers({                                                                                                // 53
  isAdmin: function() {                                                                                               // 54
    return Users.is.admin(this);                                                                                      // 55
  },                                                                                                                  // 56
  isOwner: function() {                                                                                               // 57
    return Users.is.owner(this);                                                                                      // 58
  },                                                                                                                  // 59
  isInvited: function() {                                                                                             // 60
    return Users.is.invited(this);                                                                                    // 61
  }                                                                                                                   // 62
});                                                                                                                   // 63
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/permissions.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope permissions                                                                                              // 2
 * @namespace Users.can                                                                                               // 3
 */                                                                                                                   // 4
Users.can = {};                                                                                                       // 5
                                                                                                                      // 6
/**                                                                                                                   // 7
 * Permissions checks.  Return true if all is well.                                                                   // 8
 * @param {Object} user - Meteor.user()                                                                               // 9
 */                                                                                                                   // 10
Users.can.view = function (user) {                                                                                    // 11
  if (Settings.get('requireViewInvite', false)) {                                                                     // 12
                                                                                                                      // 13
    if (Meteor.isClient) {                                                                                            // 14
      // on client only, default to the current user                                                                  // 15
      user = (typeof user === 'undefined') ? Meteor.user() : user;                                                    // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    return (!!user && (Users.is.admin(user) || Users.is.invited(user)));                                              // 19
  }                                                                                                                   // 20
  return true;                                                                                                        // 21
};                                                                                                                    // 22
                                                                                                                      // 23
Users.can.viewById = function (userId) {                                                                              // 24
  // if an invite is required to view, run permission check, else return true                                         // 25
  if (Settings.get('requireViewInvite', false)) {                                                                     // 26
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;                                           // 27
  }                                                                                                                   // 28
  return true;                                                                                                        // 29
};                                                                                                                    // 30
                                                                                                                      // 31
Users.can.viewPendingPosts = function (user) {                                                                        // 32
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 33
  return Users.is.admin(user);                                                                                        // 34
};                                                                                                                    // 35
                                                                                                                      // 36
Users.can.viewPendingPost = function (user, post) {                                                                   // 37
  return Users.is.owner(user, post) || Users.can.viewPendingPosts(user);                                              // 38
};                                                                                                                    // 39
                                                                                                                      // 40
                                                                                                                      // 41
Users.can.viewRejectedPosts = function (user) {                                                                       // 42
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 43
  return Users.is.admin(user);                                                                                        // 44
};                                                                                                                    // 45
                                                                                                                      // 46
Users.can.viewRejectedPost = function (user, post) {                                                                  // 47
  return Users.is.owner(user, post) || Users.can.viewRejectedPosts(user);                                             // 48
};                                                                                                                    // 49
                                                                                                                      // 50
Users.can.post = function (user, returnError) {                                                                       // 51
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 52
                                                                                                                      // 53
  if (!user) {                                                                                                        // 54
    return returnError ? "no_account" : false;                                                                        // 55
  } else if (Users.is.admin(user)) {                                                                                  // 56
    return true;                                                                                                      // 57
  } else if (Settings.get('requirePostInvite')) {                                                                     // 58
    if (user.telescope.isInvited) {                                                                                   // 59
      return true;                                                                                                    // 60
    } else {                                                                                                          // 61
      return false;                                                                                                   // 62
    }                                                                                                                 // 63
  } else {                                                                                                            // 64
    return true;                                                                                                      // 65
  }                                                                                                                   // 66
};                                                                                                                    // 67
                                                                                                                      // 68
Users.can.comment = function (user, returnError) {                                                                    // 69
  return Users.can.post(user, returnError);                                                                           // 70
};                                                                                                                    // 71
                                                                                                                      // 72
Users.can.vote = function (user, returnError) {                                                                       // 73
  return Users.can.post(user, returnError);                                                                           // 74
};                                                                                                                    // 75
                                                                                                                      // 76
/**                                                                                                                   // 77
 * Check if a user can edit a document                                                                                // 78
 * @param {Object} user - The user performing the action                                                              // 79
 * @param {Object} document - The document being edited                                                               // 80
 */                                                                                                                   // 81
Users.can.edit = function (user, document) {                                                                          // 82
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 83
                                                                                                                      // 84
  if (!user || !document) {                                                                                           // 85
    return false;                                                                                                     // 86
  }                                                                                                                   // 87
                                                                                                                      // 88
  var adminCheck = Users.is.admin(user);                                                                              // 89
  var ownerCheck = Users.is.owner(user, document);                                                                    // 90
                                                                                                                      // 91
  return adminCheck || ownerCheck;                                                                                    // 92
};                                                                                                                    // 93
                                                                                                                      // 94
Users.can.editById = function (userId, document) {                                                                    // 95
  var user = Meteor.users.findOne(userId);                                                                            // 96
  return Users.can.edit(user, document);                                                                              // 97
};                                                                                                                    // 98
                                                                                                                      // 99
/**                                                                                                                   // 100
 * Check if a user can submit a field                                                                                 // 101
 * @param {Object} user - The user performing the action                                                              // 102
 * @param {Object} field - The field being edited or inserted                                                         // 103
 */                                                                                                                   // 104
Users.can.submitField = function (user, field) {                                                                      // 105
                                                                                                                      // 106
  if (!field.editableBy || !user) {                                                                                   // 107
    return false;                                                                                                     // 108
  }                                                                                                                   // 109
                                                                                                                      // 110
  var adminCheck = _.contains(field.editableBy, "admin") && Users.is.admin(user); // is the field editable by admins? // 111
  var memberCheck = _.contains(field.editableBy, "member"); // is the field editable by regular users?                // 112
                                                                                                                      // 113
  return adminCheck || memberCheck;                                                                                   // 114
                                                                                                                      // 115
};                                                                                                                    // 116
                                                                                                                      // 117
/** @function                                                                                                         // 118
 * Check if a user can edit a field – for now, identical to Users.can.submitField                                     // 119
 * @param {Object} user - The user performing the action                                                              // 120
 * @param {Object} field - The field being edited or inserted                                                         // 121
 */                                                                                                                   // 122
Users.can.editField = Users.can.submitField;                                                                          // 123
                                                                                                                      // 124
Users.can.currentUserEdit = function (item) {                                                                         // 125
  return Users.can.edit(Meteor.user(), item);                                                                         // 126
};                                                                                                                    // 127
                                                                                                                      // 128
Users.can.invite = function (user) {                                                                                  // 129
  return Users.is.invited(user) || Users.is.admin(user);                                                              // 130
};                                                                                                                    // 131
                                                                                                                      // 132
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/users.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Vote schema                                                                                                        // 2
 * @type {SimpleSchema}                                                                                               // 3
 */                                                                                                                   // 4
Telescope.schemas.votes = new SimpleSchema({                                                                          // 5
  itemId: {                                                                                                           // 6
    type: String                                                                                                      // 7
  },                                                                                                                  // 8
  power: {                                                                                                            // 9
    type: Number,                                                                                                     // 10
    optional: true                                                                                                    // 11
  },                                                                                                                  // 12
  votedAt: {                                                                                                          // 13
    type: Date,                                                                                                       // 14
    optional: true                                                                                                    // 15
  }                                                                                                                   // 16
});                                                                                                                   // 17
                                                                                                                      // 18
/**                                                                                                                   // 19
 * User Data schema                                                                                                   // 20
 * @type {SimpleSchema}                                                                                               // 21
 */                                                                                                                   // 22
Telescope.schemas.userData = new SimpleSchema({                                                                       // 23
  /**                                                                                                                 // 24
    Bio (Markdown version)                                                                                            // 25
  */                                                                                                                  // 26
  bio: {                                                                                                              // 27
    type: String,                                                                                                     // 28
    optional: true,                                                                                                   // 29
    editableBy: ["member", "admin"],                                                                                  // 30
    autoform: {                                                                                                       // 31
      rows: 5                                                                                                         // 32
    }                                                                                                                 // 33
  },                                                                                                                  // 34
  /**                                                                                                                 // 35
    Total comment count                                                                                               // 36
  */                                                                                                                  // 37
  commentCount: {                                                                                                     // 38
    type: Number,                                                                                                     // 39
    public: true,                                                                                                     // 40
    optional: true                                                                                                    // 41
  },                                                                                                                  // 42
  /**                                                                                                                 // 43
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique       // 44
  */                                                                                                                  // 45
  displayName: {                                                                                                      // 46
    type: String,                                                                                                     // 47
    optional: true,                                                                                                   // 48
    public: true,                                                                                                     // 49
    profile: true,                                                                                                    // 50
    editableBy: ["member", "admin"]                                                                                   // 51
  },                                                                                                                  // 52
  /**                                                                                                                 // 53
    An array containing comment downvotes                                                                             // 54
  */                                                                                                                  // 55
  downvotedComments: {                                                                                                // 56
    type: [Telescope.schemas.votes],                                                                                  // 57
    public: true,                                                                                                     // 58
    optional: true                                                                                                    // 59
  },                                                                                                                  // 60
  /**                                                                                                                 // 61
    An array containing posts downvotes                                                                               // 62
  */                                                                                                                  // 63
  downvotedPosts: {                                                                                                   // 64
    type: [Telescope.schemas.votes],                                                                                  // 65
    public: true,                                                                                                     // 66
    optional: true                                                                                                    // 67
  },                                                                                                                  // 68
  /**                                                                                                                 // 69
    The user's email. Modifiable.                                                                                     // 70
  */                                                                                                                  // 71
  email: {                                                                                                            // 72
    type: String,                                                                                                     // 73
    optional: true,                                                                                                   // 74
    regEx: SimpleSchema.RegEx.Email,                                                                                  // 75
    required: true,                                                                                                   // 76
    editableBy: ["member", "admin"]                                                                                   // 77
    // unique: true // note: find a way to fix duplicate accounts before enabling this                                // 78
  },                                                                                                                  // 79
  /**                                                                                                                 // 80
    A hash of the email, used for Gravatar // TODO: change this when email changes                                    // 81
  */                                                                                                                  // 82
  emailHash: {                                                                                                        // 83
    type: String,                                                                                                     // 84
    public: true,                                                                                                     // 85
    optional: true                                                                                                    // 86
  },                                                                                                                  // 87
  /**                                                                                                                 // 88
    The HTML version of the bio field                                                                                 // 89
  */                                                                                                                  // 90
  htmlBio: {                                                                                                          // 91
    type: String,                                                                                                     // 92
    public: true,                                                                                                     // 93
    profile: true,                                                                                                    // 94
    optional: true,                                                                                                   // 95
    autoform: {                                                                                                       // 96
      omit: true                                                                                                      // 97
    },                                                                                                                // 98
    template: "user_profile_bio"                                                                                      // 99
  },                                                                                                                  // 100
  /**                                                                                                                 // 101
    The user's karma                                                                                                  // 102
  */                                                                                                                  // 103
  karma: {                                                                                                            // 104
    type: Number,                                                                                                     // 105
    decimal: true,                                                                                                    // 106
    public: true,                                                                                                     // 107
    optional: true                                                                                                    // 108
  },                                                                                                                  // 109
  /**                                                                                                                 // 110
    Total post count                                                                                                  // 111
  */                                                                                                                  // 112
  postCount: {                                                                                                        // 113
    type: Number,                                                                                                     // 114
    public: true,                                                                                                     // 115
    optional: true                                                                                                    // 116
  },                                                                                                                  // 117
  /**                                                                                                                 // 118
    A blackbox modifiable object to store the user's settings                                                         // 119
  */                                                                                                                  // 120
  settings: {                                                                                                         // 121
    type: Object,                                                                                                     // 122
    optional: true,                                                                                                   // 123
    editableBy: ["member", "admin"],                                                                                  // 124
    blackbox: true,                                                                                                   // 125
    autoform: {                                                                                                       // 126
      omit: true                                                                                                      // 127
    }                                                                                                                 // 128
  },                                                                                                                  // 129
  /**                                                                                                                 // 130
    The user's profile URL slug // TODO: change this when displayName changes                                         // 131
  */                                                                                                                  // 132
  slug: {                                                                                                             // 133
    type: String,                                                                                                     // 134
    public: true,                                                                                                     // 135
    optional: true                                                                                                    // 136
  },                                                                                                                  // 137
  /**                                                                                                                 // 138
    The user's Twitter username                                                                                       // 139
  */                                                                                                                  // 140
  twitterUsername: {                                                                                                  // 141
    type: String,                                                                                                     // 142
    optional: true,                                                                                                   // 143
    public: true,                                                                                                     // 144
    profile: true,                                                                                                    // 145
    editableBy: ["member", "admin"],                                                                                  // 146
    template: "user_profile_twitter"                                                                                  // 147
  },                                                                                                                  // 148
  /**                                                                                                                 // 149
    An array containing comments upvotes                                                                              // 150
  */                                                                                                                  // 151
  upvotedComments: {                                                                                                  // 152
    type: [Telescope.schemas.votes],                                                                                  // 153
    public: true,                                                                                                     // 154
    optional: true                                                                                                    // 155
  },                                                                                                                  // 156
  /**                                                                                                                 // 157
    An array containing posts upvotes                                                                                 // 158
  */                                                                                                                  // 159
  upvotedPosts: {                                                                                                     // 160
    type: [Telescope.schemas.votes],                                                                                  // 161
    public: true,                                                                                                     // 162
    optional: true                                                                                                    // 163
  },                                                                                                                  // 164
  /**                                                                                                                 // 165
    A link to the user's homepage                                                                                     // 166
  */                                                                                                                  // 167
  website: {                                                                                                          // 168
    type: String,                                                                                                     // 169
    regEx: SimpleSchema.RegEx.Url,                                                                                    // 170
    public: true,                                                                                                     // 171
    profile: true,                                                                                                    // 172
    optional: true,                                                                                                   // 173
    editableBy: ["member", "admin"]                                                                                   // 174
  }                                                                                                                   // 175
});                                                                                                                   // 176
                                                                                                                      // 177
/**                                                                                                                   // 178
 * Users schema                                                                                                       // 179
 * @type {SimpleSchema}                                                                                               // 180
 */                                                                                                                   // 181
Users.schema = new SimpleSchema({                                                                                     // 182
  _id: {                                                                                                              // 183
    type: String,                                                                                                     // 184
    public: true,                                                                                                     // 185
    optional: true                                                                                                    // 186
  },                                                                                                                  // 187
  username: {                                                                                                         // 188
    type: String,                                                                                                     // 189
    regEx: /^[a-z0-9A-Z_]{3,15}$/,                                                                                    // 190
    public: true,                                                                                                     // 191
    optional: true                                                                                                    // 192
  },                                                                                                                  // 193
  emails: {                                                                                                           // 194
    type: [Object],                                                                                                   // 195
    optional: true                                                                                                    // 196
  },                                                                                                                  // 197
  "emails.$.address": {                                                                                               // 198
    type: String,                                                                                                     // 199
    regEx: SimpleSchema.RegEx.Email,                                                                                  // 200
    optional: true                                                                                                    // 201
  },                                                                                                                  // 202
  "emails.$.verified": {                                                                                              // 203
    type: Boolean,                                                                                                    // 204
    optional: true                                                                                                    // 205
  },                                                                                                                  // 206
  createdAt: {                                                                                                        // 207
    type: Date,                                                                                                       // 208
    public: true,                                                                                                     // 209
    optional: true                                                                                                    // 210
  },                                                                                                                  // 211
  isAdmin: {                                                                                                          // 212
    type: Boolean,                                                                                                    // 213
    optional: true,                                                                                                   // 214
    editableBy: ["admin"],                                                                                            // 215
    autoform: {                                                                                                       // 216
      omit: true                                                                                                      // 217
    }                                                                                                                 // 218
  },                                                                                                                  // 219
  profile: {                                                                                                          // 220
    type: Object,                                                                                                     // 221
    optional: true,                                                                                                   // 222
    blackbox: true                                                                                                    // 223
  },                                                                                                                  // 224
  telescope: { // telescope-specific data                                                                             // 225
    type: Telescope.schemas.userData,                                                                                 // 226
    optional: true                                                                                                    // 227
  },                                                                                                                  // 228
  services: {                                                                                                         // 229
    type: Object,                                                                                                     // 230
    optional: true,                                                                                                   // 231
    blackbox: true                                                                                                    // 232
  }                                                                                                                   // 233
});                                                                                                                   // 234
                                                                                                                      // 235
Users.schema.internationalize();                                                                                      // 236
                                                                                                                      // 237
/**                                                                                                                   // 238
 * Attach schema to Meteor.users collection                                                                           // 239
 */                                                                                                                   // 240
Users.attachSchema(Users.schema);                                                                                     // 241
                                                                                                                      // 242
/**                                                                                                                   // 243
 * Users collection permissions                                                                                       // 244
 */                                                                                                                   // 245
                                                                                                                      // 246
Users.allow({                                                                                                         // 247
  update: _.partial(Telescope.allowCheck, Meteor.users),                                                              // 248
  remove: _.partial(Telescope.allowCheck, Meteor.users)                                                               // 249
});                                                                                                                   // 250
                                                                                                                      // 251
                                                                                                                      // 252
//////////////////////////////////////////////////////                                                                // 253
// Collection Hooks                                 //                                                                // 254
// https://atmospherejs.com/matb33/collection-hooks //                                                                // 255
//////////////////////////////////////////////////////                                                                // 256
                                                                                                                      // 257
/**                                                                                                                   // 258
 * Generate HTML body from Markdown on user bio insert                                                                // 259
 */                                                                                                                   // 260
Users.after.insert(function (userId, user) {                                                                          // 261
                                                                                                                      // 262
  // run create user async callbacks                                                                                  // 263
  Telescope.callbacks.runAsync("onCreateUserAsync", user);                                                            // 264
                                                                                                                      // 265
  // check if all required fields have been filled in. If so, run profile completion callbacks                        // 266
  if (Users.hasCompletedProfile(user)) {                                                                              // 267
    Telescope.callbacks.runAsync("profileCompletedAsync", user);                                                      // 268
  }                                                                                                                   // 269
                                                                                                                      // 270
});                                                                                                                   // 271
                                                                                                                      // 272
/**                                                                                                                   // 273
 * Generate HTML body from Markdown when user bio is updated                                                          // 274
 */                                                                                                                   // 275
Users.before.update(function (userId, doc, fieldNames, modifier) {                                                    // 276
  // if bio is being modified, update htmlBio too                                                                     // 277
  if (Meteor.isServer && modifier.$set && modifier.$set["telescope.bio"]) {                                           // 278
    modifier.$set["telescope.htmlBio"] = Telescope.utils.sanitize(marked(modifier.$set["telescope.bio"]));            // 279
  }                                                                                                                   // 280
});                                                                                                                   // 281
                                                                                                                      // 282
/**                                                                                                                   // 283
 * If user.telescope.email has changed, check for existing emails and change user.emails if needed                    // 284
 */                                                                                                                   // 285
 if (Meteor.isServer) {                                                                                               // 286
  Users.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 287
    var user = doc;                                                                                                   // 288
    // if email is being modified, update user.emails too                                                             // 289
    if (Meteor.isServer && modifier.$set && modifier.$set["telescope.email"]) {                                       // 290
      var newEmail = modifier.$set["telescope.email"];                                                                // 291
      // check for existing emails and throw error if necessary                                                       // 292
      var userWithSameEmail = Users.findByEmail(newEmail);                                                            // 293
      if (userWithSameEmail && userWithSameEmail._id !== doc._id) {                                                   // 294
        throw new Meteor.Error("email_taken2", i18n.t("this_email_is_already_taken") + " (" + newEmail + ")");        // 295
      }                                                                                                               // 296
                                                                                                                      // 297
      // if user.emails exists, change it too                                                                         // 298
      if (!!user.emails) {                                                                                            // 299
        user.emails[0].address = newEmail;                                                                            // 300
        modifier.$set.emails = user.emails;                                                                           // 301
      }                                                                                                               // 302
                                                                                                                      // 303
    }                                                                                                                 // 304
  });                                                                                                                 // 305
}                                                                                                                     // 306
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/avatars.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Avatar.options = {                                                                                                    // 1
  fallbackType: 'initials',                                                                                           // 2
  emailHashProperty: 'telescope.emailHash'                                                                            // 3
};                                                                                                                    // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/callbacks.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Set up user object on creation                                                                                     // 2
 * @param {Object} user – the user object being iterated on and returned                                              // 3
 * @param {Object} options – user options                                                                             // 4
 */                                                                                                                   // 5
function setupUser (user, options) {                                                                                  // 6
  // ------------------------------ Properties ------------------------------ //                                      // 7
  var userProperties = {                                                                                              // 8
    profile: options.profile || {},                                                                                   // 9
    telescope: {                                                                                                      // 10
      karma: 0,                                                                                                       // 11
      isInvited: false,                                                                                               // 12
      postCount: 0,                                                                                                   // 13
      commentCount: 0,                                                                                                // 14
      invitedCount: 0,                                                                                                // 15
      upvotedPosts: [],                                                                                               // 16
      downvotedPosts: [],                                                                                             // 17
      upvotedComments: [],                                                                                            // 18
      downvotedComments: []                                                                                           // 19
    }                                                                                                                 // 20
  };                                                                                                                  // 21
  user = _.extend(user, userProperties);                                                                              // 22
                                                                                                                      // 23
  // set email on user.telescope, and use it to generate email hash                                                   // 24
  if (options.email) {                                                                                                // 25
    user.telescope.email = options.email;                                                                             // 26
    user.telescope.emailHash = Gravatar.hash(options.email);                                                          // 27
  }                                                                                                                   // 28
                                                                                                                      // 29
  // look in a few places for the displayName                                                                         // 30
  if (user.profile.username) {                                                                                        // 31
    user.telescope.displayName = user.profile.username;                                                               // 32
  } else if (user.profile.name) {                                                                                     // 33
    user.telescope.displayName = user.profile.name;                                                                   // 34
  } else {                                                                                                            // 35
    user.telescope.displayName = user.username;                                                                       // 36
  }                                                                                                                   // 37
                                                                                                                      // 38
  // create slug from display name                                                                                    // 39
  user.telescope.slug = Telescope.utils.slugify(user.telescope.displayName);                                          // 40
                                                                                                                      // 41
  // if this is not a dummy account, and is the first user ever, make them an admin                                   // 42
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;
                                                                                                                      // 44
  Events.track('new user', {username: user.username, email: user.profile.email});                                     // 45
                                                                                                                      // 46
  return user;                                                                                                        // 47
}                                                                                                                     // 48
Telescope.callbacks.add("onCreateUser", setupUser);                                                                   // 49
                                                                                                                      // 50
                                                                                                                      // 51
function hasCompletedProfile (user) {                                                                                 // 52
  return Users.hasCompletedProfile(user);                                                                             // 53
}                                                                                                                     // 54
Telescope.callbacks.add("profileCompletedChecks", hasCompletedProfile);                                               // 55
                                                                                                                      // 56
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/modules.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Telescope.modules.add("profileDisplay", [                                                                             // 2
  {                                                                                                                   // 3
    template: 'user_info',                                                                                            // 4
    order: 1                                                                                                          // 5
  },                                                                                                                  // 6
  {                                                                                                                   // 7
    template: 'user_posts',                                                                                           // 8
    order: 2                                                                                                          // 9
  },                                                                                                                  // 10
  {                                                                                                                   // 11
    template: 'user_upvoted_posts',                                                                                   // 12
    order: 3                                                                                                          // 13
  },                                                                                                                  // 14
  {                                                                                                                   // 15
    template: 'user_downvoted_posts',                                                                                 // 16
    order: 5                                                                                                          // 17
  },                                                                                                                  // 18
  {                                                                                                                   // 19
    template: 'user_comments',                                                                                        // 20
    order: 5                                                                                                          // 21
  }                                                                                                                   // 22
]);                                                                                                                   // 23
                                                                                                                      // 24
Telescope.modules.add("profileEdit", [                                                                                // 25
  {                                                                                                                   // 26
    template: 'user_account',                                                                                         // 27
    order: 1                                                                                                          // 28
  }                                                                                                                   // 29
]);                                                                                                                   // 30
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/helpers.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
////////////////////                                                                                                  // 1
//  User Getters  //                                                                                                  // 2
////////////////////                                                                                                  // 3
                                                                                                                      // 4
/**                                                                                                                   // 5
 * Get a user's username (unique, no special characters or spaces)                                                    // 6
 * @param {Object} user                                                                                               // 7
 */                                                                                                                   // 8
Users.getUserName = function (user) {                                                                                 // 9
  try{                                                                                                                // 10
    if (user.username)                                                                                                // 11
      return user.username;                                                                                           // 12
    if (user && user.services && user.services.twitter && user.services.twitter.screenName)                           // 13
      return user.services.twitter.screenName;                                                                        // 14
  }                                                                                                                   // 15
  catch (error){                                                                                                      // 16
    console.log(error);                                                                                               // 17
    return null;                                                                                                      // 18
  }                                                                                                                   // 19
};                                                                                                                    // 20
Users.helpers({getUserName: function () {return Users.getUserName(this);}});                                          // 21
Users.getUserNameById = function (userId) {return Users.getUserName(Meteor.users.findOne(userId))};                   // 22
                                                                                                                      // 23
/**                                                                                                                   // 24
 * Get a user's display name (not unique, can take special characters and spaces)                                     // 25
 * @param {Object} user                                                                                               // 26
 */                                                                                                                   // 27
Users.getDisplayName = function (user) {                                                                              // 28
  if (typeof user === "undefined") {                                                                                  // 29
    return "";                                                                                                        // 30
  } else {                                                                                                            // 31
    return (user.telescope && user.telescope.displayName) ? user.telescope.displayName : Users.getUserName(user);     // 32
  }                                                                                                                   // 33
};                                                                                                                    // 34
Users.helpers({getDisplayName: function () {return Users.getDisplayName(this);}});                                    // 35
Users.getDisplayNameById = function (userId) {return Users.getDisplayName(Meteor.users.findOne(userId));};            // 36
                                                                                                                      // 37
/**                                                                                                                   // 38
 * Get a user's profile URL                                                                                           // 39
 * @param {Object} user                                                                                               // 40
 */                                                                                                                   // 41
Users.getProfileUrl = function (user) {                                                                               // 42
  return Users.getProfileUrlBySlugOrId(user.telescope.slug);                                                          // 43
};                                                                                                                    // 44
Users.helpers({getProfileUrl: function () {return Users.getProfileUrl(this);}});                                      // 45
                                                                                                                      // 46
/**                                                                                                                   // 47
 * Get a user's profile URL by slug or Id                                                                             // 48
 * @param {String} slugOrId                                                                                           // 49
 */                                                                                                                   // 50
Users.getProfileUrlBySlugOrId = function (slugOrId) {                                                                 // 51
  return Telescope.utils.getRouteUrl('user_profile', {_idOrSlug: slugOrId});                                          // 52
};                                                                                                                    // 53
                                                                                                                      // 54
/**                                                                                                                   // 55
 * Get a user's Twitter name                                                                                          // 56
 * @param {Object} user                                                                                               // 57
 */                                                                                                                   // 58
Users.getTwitterName = function (user) {                                                                              // 59
  // return twitter name provided by user, or else the one used for twitter login                                     // 60
  if(Telescope.utils.checkNested(user, 'profile', 'twitter')){                                                        // 61
    return user.profile.twitter;                                                                                      // 62
  }else if(Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')){                                   // 63
    return user.services.twitter.screenName;                                                                          // 64
  }                                                                                                                   // 65
  return null;                                                                                                        // 66
};                                                                                                                    // 67
Users.helpers({getTwitterName: function () {return Users.getTwitterName(this);}});                                    // 68
Users.getTwitterNameById = function (userId) {return Users.getTwitterName(Meteor.users.findOne(userId));};            // 69
                                                                                                                      // 70
/**                                                                                                                   // 71
 * Get a user's GitHub name                                                                                           // 72
 * @param {Object} user                                                                                               // 73
 */                                                                                                                   // 74
Users.getGitHubName = function (user) {                                                                               // 75
  // return twitter name provided by user, or else the one used for twitter login                                     // 76
  if(Telescope.utils.checkNested(user, 'profile', 'github')){                                                         // 77
    return user.profile.github;                                                                                       // 78
  }else if(Telescope.utils.checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;                                                                           // 80
  }                                                                                                                   // 81
  return null;                                                                                                        // 82
};                                                                                                                    // 83
Users.helpers({getGitHubName: function () {return Users.getGitHubName(this);}});                                      // 84
Users.getGitHubNameById = function (userId) {return Users.getGitHubName(Meteor.users.findOne(userId));};              // 85
                                                                                                                      // 86
/**                                                                                                                   // 87
 * Get a user's email                                                                                                 // 88
 * @param {Object} user                                                                                               // 89
 */                                                                                                                   // 90
Users.getEmail = function (user) {                                                                                    // 91
  if(user.telescope && user.telescope.email){                                                                         // 92
    return user.telescope.email;                                                                                      // 93
  }else{                                                                                                              // 94
    return null;                                                                                                      // 95
  }                                                                                                                   // 96
};                                                                                                                    // 97
Users.helpers({getEmail: function () {return Users.getEmail(this);}});                                                // 98
Users.getEmailById = function (userId) {return Users.getEmail(Meteor.users.findOne(userId));};                        // 99
                                                                                                                      // 100
/**                                                                                                                   // 101
 * Get a user's email hash                                                                                            // 102
 * @param {Object} user                                                                                               // 103
 */                                                                                                                   // 104
Users.getEmailHash = function (user) {                                                                                // 105
  // has to be this way to work with Gravatar                                                                         // 106
  return Gravatar.hash(Users.getEmail(user));                                                                         // 107
};                                                                                                                    // 108
Users.helpers({getEmailHash: function () {return Users.getEmailHash(this);}});                                        // 109
Users.getEmailHashById = function (userId) {return Users.getEmailHash(Meteor.users.findOne(userId));};                // 110
                                                                                                                      // 111
/**                                                                                                                   // 112
 * Check if a user's profile is complete                                                                              // 113
 * @param {Object} user                                                                                               // 114
 */                                                                                                                   // 115
Users.userProfileComplete = function (user) {                                                                         // 116
  for (var i = 0; i < Telescope.callbacks.profileCompletedChecks.length; i++) {                                       // 117
    if (!Telescope.callbacks.profileCompletedChecks[i](user)) {                                                       // 118
      return false;                                                                                                   // 119
    }                                                                                                                 // 120
  }                                                                                                                   // 121
  return true;                                                                                                        // 122
};                                                                                                                    // 123
Users.helpers({userProfileComplete: function () {return Users.userProfileComplete(this);}});                          // 124
Users.userProfileCompleteById = function (userId) {return Users.userProfileComplete(Meteor.users.findOne(userId));};  // 125
                                                                                                                      // 126
/**                                                                                                                   // 127
 * Get a user setting                                                                                                 // 128
 * @param {Object} user                                                                                               // 129
 * @param {String} settingName                                                                                        // 130
 * @param {Object} defaultValue                                                                                       // 131
 */                                                                                                                   // 132
Users.getSetting = function (user, settingName, defaultValue) {                                                       // 133
  user = user || Meteor.user();                                                                                       // 134
  defaultValue = defaultValue || null;                                                                                // 135
                                                                                                                      // 136
  // all settings should be in the user.telescope namespace, so add "telescope." if needed                            // 137
  settingName = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;                  // 138
                                                                                                                      // 139
  if (user.telescope) {                                                                                               // 140
    var settingValue = this.getProperty(user, settingName);                                                           // 141
    return (settingValue === null) ? defaultValue : settingValue;                                                     // 142
  } else {                                                                                                            // 143
    return defaultValue;                                                                                              // 144
  }                                                                                                                   // 145
};                                                                                                                    // 146
Users.helpers({getSetting: function (settingName, defaultValue) {return Users.getSetting(this, settingName, defaultValue);}});
                                                                                                                      // 148
/**                                                                                                                   // 149
 * Set a user setting                                                                                                 // 150
 * @param {Object} user                                                                                               // 151
 * @param {String} settingName                                                                                        // 152
 * @param {Object} defaultValue                                                                                       // 153
 */                                                                                                                   // 154
Users.setSetting = function (user, settingName, value) {                                                              // 155
  if (user) {                                                                                                         // 156
                                                                                                                      // 157
    // all settings should be in the user.telescope namespace, so add "telescope." if needed                          // 158
    var field = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;                  // 159
                                                                                                                      // 160
    var modifier = {$set: {}};                                                                                        // 161
    modifier.$set[field] = value;                                                                                     // 162
    Users.update(user._id, modifier);                                                                                 // 163
                                                                                                                      // 164
  }                                                                                                                   // 165
};                                                                                                                    // 166
Users.helpers({setSetting: function () {return Users.setSetting(this);}});                                            // 167
                                                                                                                      // 168
///////////////////                                                                                                   // 169
// Other Helpers //                                                                                                   // 170
///////////////////                                                                                                   // 171
                                                                                                                      // 172
Users.findLast = function (user, collection) {                                                                        // 173
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});                                             // 174
};                                                                                                                    // 175
                                                                                                                      // 176
Users.timeSinceLast = function (user, collection){                                                                    // 177
  var now = new Date().getTime();                                                                                     // 178
  var last = this.findLast(user, collection);                                                                         // 179
  if(!last)                                                                                                           // 180
    return 999; // if this is the user's first post or comment ever, stop here                                        // 181
  return Math.abs(Math.floor((now-last.createdAt)/1000));                                                             // 182
};                                                                                                                    // 183
                                                                                                                      // 184
Users.numberOfItemsInPast24Hours = function (user, collection) {                                                      // 185
  var mNow = moment();                                                                                                // 186
  var items = collection.find({                                                                                       // 187
    userId: user._id,                                                                                                 // 188
    createdAt: {                                                                                                      // 189
      $gte: mNow.subtract(24, 'hours').toDate()                                                                       // 190
    }                                                                                                                 // 191
  });                                                                                                                 // 192
  return items.count();                                                                                               // 193
};                                                                                                                    // 194
                                                                                                                      // 195
Users.getProperty = function (object, property) {                                                                     // 196
  // recursive function to get nested properties                                                                      // 197
  var array = property.split('.');                                                                                    // 198
  if(array.length > 1){                                                                                               // 199
    var parent = array.shift();                                                                                       // 200
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] === "undefined") ? null : this.getProperty(object[parent], array.join('.'));        // 202
  }else{                                                                                                              // 203
    // else return property                                                                                           // 204
    return object[array[0]];                                                                                          // 205
  }                                                                                                                   // 206
};                                                                                                                    // 207
                                                                                                                      // 208
/**                                                                                                                   // 209
 * Build Users subscription with filter, sort, and limit args.                                                        // 210
 * @param {String} filterBy                                                                                           // 211
 * @param {String} sortBy                                                                                             // 212
 * @param {Number} limit                                                                                              // 213
 */                                                                                                                   // 214
Users.getSubParams = function(filterBy, sortBy, limit) {                                                              // 215
  var find = {},                                                                                                      // 216
      sort = {createdAt: -1};                                                                                         // 217
                                                                                                                      // 218
  switch(filterBy){                                                                                                   // 219
    case 'invited':                                                                                                   // 220
      // consider admins as invited                                                                                   // 221
      find = { $or: [{ isInvited: true }, { isAdmin: true }]};                                                        // 222
      break;                                                                                                          // 223
    case 'uninvited':                                                                                                 // 224
      find = { $and: [{ isInvited: false }, { isAdmin: false }]};                                                     // 225
      break;                                                                                                          // 226
    case 'admin':                                                                                                     // 227
      find = { isAdmin: true };                                                                                       // 228
      break;                                                                                                          // 229
  }                                                                                                                   // 230
                                                                                                                      // 231
  switch(sortBy){                                                                                                     // 232
    case 'username':                                                                                                  // 233
      sort = { username: 1 };                                                                                         // 234
      break;                                                                                                          // 235
    case 'karma':                                                                                                     // 236
      sort = { karma: -1 };                                                                                           // 237
      break;                                                                                                          // 238
    case 'postCount':                                                                                                 // 239
      sort = { postCount: -1 };                                                                                       // 240
      break;                                                                                                          // 241
    case 'commentCount':                                                                                              // 242
      sort = { commentCount: -1 };                                                                                    // 243
      break;                                                                                                          // 244
    case 'invitedCount':                                                                                              // 245
      sort = { invitedCount: -1 };                                                                                    // 246
  }                                                                                                                   // 247
  return {                                                                                                            // 248
    find: find,                                                                                                       // 249
    options: { sort: sort, limit: limit }                                                                             // 250
  };                                                                                                                  // 251
};                                                                                                                    // 252
                                                                                                                      // 253
                                                                                                                      // 254
Users.updateAdmin = function (userId, admin) {                                                                        // 255
  Users.update(userId, {$set: {isAdmin: admin}});                                                                     // 256
};                                                                                                                    // 257
                                                                                                                      // 258
Users.adminUsers = function () {                                                                                      // 259
  return this.find({isAdmin : true}).fetch();                                                                         // 260
};                                                                                                                    // 261
                                                                                                                      // 262
Users.getCurrentUserEmail = function () {                                                                             // 263
  return Meteor.user() ? Users.getEmail(Meteor.user()) : '';                                                          // 264
};                                                                                                                    // 265
                                                                                                                      // 266
Users.findByEmail = function (email) {                                                                                // 267
  return Meteor.users.findOne({"telescope.email": email});                                                            // 268
};                                                                                                                    // 269
                                                                                                                      // 270
                                                                                                                      // 271
/**                                                                                                                   // 272
 * @method Users.getRequiredFields                                                                                    // 273
 * Get a list of all fields required for a profile to be complete.                                                    // 274
 */                                                                                                                   // 275
Users.getRequiredFields = function () {                                                                               // 276
  var schema = Users.simpleSchema()._schema;                                                                          // 277
  var fields = _.filter(_.keys(schema), function (fieldName) {                                                        // 278
    var field = schema[fieldName];                                                                                    // 279
    return !!field.required;                                                                                          // 280
  });                                                                                                                 // 281
  return fields;                                                                                                      // 282
};                                                                                                                    // 283
                                                                                                                      // 284
/**                                                                                                                   // 285
 * Check if the user has completed their profile.                                                                     // 286
 * @param {Object} user                                                                                               // 287
 */                                                                                                                   // 288
Users.hasCompletedProfile = function (user) {                                                                         // 289
  return _.every(Users.getRequiredFields(), function (fieldName) {                                                    // 290
    return !!Telescope.getNestedProperty(user, fieldName);                                                            // 291
  });                                                                                                                 // 292
};                                                                                                                    // 293
Users.helpers({hasCompletedProfile: function () {return Users.hasCompletedProfile(this);}});                          // 294
Users.hasCompletedProfileById = function (userId) {return Users.hasCompletedProfile(Meteor.users.findOne(userId));};  // 295
                                                                                                                      // 296
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/menu.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Telescope.menuItems.add("userMenu", [                                                                                 // 1
  {                                                                                                                   // 2
    route: function () {                                                                                              // 3
      return Router.path('user_profile', {_idOrSlug: Meteor.user().telescope.slug});                                  // 4
    },                                                                                                                // 5
    label: 'profile',                                                                                                 // 6
    description: 'view_your_profile'                                                                                  // 7
  },                                                                                                                  // 8
  {                                                                                                                   // 9
    route: function () {                                                                                              // 10
      return Router.path('user_edit', {slug: Meteor.user().telescope.slug});                                          // 11
    },                                                                                                                // 12
    label: 'edit_account',                                                                                            // 13
    description: 'edit_your_profile'                                                                                  // 14
  },                                                                                                                  // 15
  {                                                                                                                   // 16
    route: 'settings',                                                                                                // 17
    label: 'settings',                                                                                                // 18
    description: 'settings',                                                                                          // 19
    adminOnly: true                                                                                                   // 20
  },                                                                                                                  // 21
  {                                                                                                                   // 22
    route: 'signOut',                                                                                                 // 23
    label: 'sign_out',                                                                                                // 24
    description: 'sign_out'                                                                                           // 25
  }                                                                                                                   // 26
]);                                                                                                                   // 27
                                                                                                                      // 28
// array containing items in the admin menu                                                                           // 29
Telescope.menuItems.add("adminMenu", [                                                                                // 30
  {                                                                                                                   // 31
    route: 'users_dashboard',                                                                                         // 32
    label: 'users',                                                                                                   // 33
    description: 'users_dashboard'                                                                                    // 34
  }                                                                                                                   // 35
]);                                                                                                                   // 36
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/pubsub.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
////////////////////////////////////                                                                                  // 1
// Publications and Subscriptions //                                                                                  // 2
////////////////////////////////////                                                                                  // 3
                                                                                                                      // 4
/**                                                                                                                   // 5
 * Users pub/sub configs and methods                                                                                  // 6
 * @namespace Users.pubsub                                                                                            // 7
 */                                                                                                                   // 8
Users.pubsub = {};                                                                                                    // 9
                                                                                                                      // 10
/**                                                                                                                   // 11
 * Default user object fields in publication                                                                          // 12
 * @type {Object}                                                                                                     // 13
 */                                                                                                                   // 14
                                                                                                                      // 15
var publicFields = Users.simpleSchema().getPublicFields();                                                            // 16
                                                                                                                      // 17
// add public fields as specified in schema                                                                           // 18
Users.pubsub.publicProperties = _.object(publicFields, _.map(publicFields, function () {return true}));               // 19
                                                                                                                      // 20
// add a few more fields                                                                                              // 21
Users.pubsub.publicProperties = _.extend(Users.pubsub.publicProperties, {                                             // 22
  'services.twitter.profile_image_url': true,                                                                         // 23
  'services.twitter.profile_image_url_https': true,                                                                   // 24
  'services.facebook.id': true,                                                                                       // 25
  'services.twitter.screenName': true,                                                                                // 26
});                                                                                                                   // 27
                                                                                                                      // 28
/**                                                                                                                   // 29
 * Options for your own user account (for security reasons, block certain properties)                                 // 30
 * @type {Object}                                                                                                     // 31
 */                                                                                                                   // 32
Users.pubsub.hiddenProperties = {                                                                                     // 33
  'services.password.bcrypt': false                                                                                   // 34
};                                                                                                                    // 35
                                                                                                                      // 36
/**                                                                                                                   // 37
 * Minimum required properties to display avatars and display names                                                   // 38
 * @type {Object}                                                                                                     // 39
 */                                                                                                                   // 40
Users.pubsub.avatarProperties = {                                                                                     // 41
  _id: true,                                                                                                          // 42
  'telescope.emailHash': true,                                                                                        // 43
  'telescope.slug': true,                                                                                             // 44
  'telescope.displayName': true,                                                                                      // 45
  username: true,                                                                                                     // 46
  'profile.username': true,                                                                                           // 47
  'profile.github': true,                                                                                             // 48
  'profile.twitter': true,                                                                                            // 49
  'services.twitter.profile_image_url': true,                                                                         // 50
  'services.twitter.profile_image_url_https': true,                                                                   // 51
  'services.facebook.id': true,                                                                                       // 52
  'services.twitter.screenName': true,                                                                                // 53
  'services.github.screenName': true, // Github is not really used, but there are some mentions to it in the code     // 54
};                                                                                                                    // 55
                                                                                                                      // 56
                                                                                                                      // 57
/**                                                                                                                   // 58
 * Build Users subscription with filter, sort, and limit args.                                                        // 59
 * @param {String} filterBy                                                                                           // 60
 * @param {String} sortBy                                                                                             // 61
 * @param {Number} limit                                                                                              // 62
 */                                                                                                                   // 63
Users.pubsub.getSubParams = function(filterBy, sortBy, limit) {                                                       // 64
  var find = {},                                                                                                      // 65
      sort = {createdAt: -1};                                                                                         // 66
                                                                                                                      // 67
  switch(filterBy){                                                                                                   // 68
    case 'invited':                                                                                                   // 69
      // consider admins as invited                                                                                   // 70
      find = { $or: [{ isInvited: true }, { isAdmin: true }]};                                                        // 71
      break;                                                                                                          // 72
    case 'uninvited':                                                                                                 // 73
      find = { $and: [{ isInvited: false }, { isAdmin: false }]};                                                     // 74
      break;                                                                                                          // 75
    case 'admin':                                                                                                     // 76
      find = { isAdmin: true };                                                                                       // 77
      break;                                                                                                          // 78
  }                                                                                                                   // 79
                                                                                                                      // 80
  switch(sortBy){                                                                                                     // 81
    case 'username':                                                                                                  // 82
      sort = { username: 1 };                                                                                         // 83
      break;                                                                                                          // 84
    case 'karma':                                                                                                     // 85
      sort = { karma: -1 };                                                                                           // 86
      break;                                                                                                          // 87
    case 'postCount':                                                                                                 // 88
      sort = { postCount: -1 };                                                                                       // 89
      break;                                                                                                          // 90
    case 'commentCount':                                                                                              // 91
      sort = { commentCount: -1 };                                                                                    // 92
      break;                                                                                                          // 93
    case 'invitedCount':                                                                                              // 94
      sort = { invitedCount: -1 };                                                                                    // 95
  }                                                                                                                   // 96
  return {                                                                                                            // 97
    find: find,                                                                                                       // 98
    options: { sort: sort, limit: limit }                                                                             // 99
  };                                                                                                                  // 100
};                                                                                                                    // 101
                                                                                                                      // 102
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/methods.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var completeUserProfile = function (modifier, userId, user) {                                                         // 1
                                                                                                                      // 2
  Users.update(userId, modifier);                                                                                     // 3
                                                                                                                      // 4
  Telescope.callbacks.runAsync("profileCompletedAsync", Users.findOne(userId));                                       // 5
                                                                                                                      // 6
  return Users.findOne(userId);                                                                                       // 7
                                                                                                                      // 8
};                                                                                                                    // 9
                                                                                                                      // 10
Meteor.methods({                                                                                                      // 11
  completeUserProfile: function (modifier, userId) {                                                                  // 12
    var currentUser = Meteor.user(),                                                                                  // 13
        user = Users.findOne(userId),                                                                                 // 14
        schema = Users.simpleSchema()._schema;                                                                        // 15
                                                                                                                      // 16
    // ------------------------------ Checks ------------------------------ //                                        // 17
                                                                                                                      // 18
    // check that user can edit document                                                                              // 19
    if (!user || !Users.can.edit(currentUser, user)) {                                                                // 20
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_user'));                                         // 21
    }                                                                                                                 // 22
                                                                                                                      // 23
    // if an $unset modifier is present, it means one or more of the fields is missing                                // 24
    if (modifier.$unset) {                                                                                            // 25
      throw new Meteor.Error(601, i18n.t('all_fields_are_required'));                                                 // 26
    }                                                                                                                 // 27
                                                                                                                      // 28
    // check for existing emails and throw error if necessary                                                         // 29
    // NOTE: redundant with collection hook, but better to throw the error here to avoid wiping out the form          // 30
    if (modifier.$set && modifier.$set["telescope.email"]) {                                                          // 31
      var email = modifier.$set["telescope.email"];                                                                   // 32
      if (Users.findByEmail(email)) {                                                                                 // 33
        throw new Meteor.Error("email_taken1", i18n.t("this_email_is_already_taken") + " (" + email + ")");           // 34
      }                                                                                                               // 35
                                                                                                                      // 36
    }                                                                                                                 // 37
                                                                                                                      // 38
    // go over each field and throw an error if it's not editable                                                     // 39
    // loop over each operation ($set, $unset, etc.)                                                                  // 40
    _.each(modifier, function (operation) {                                                                           // 41
      // loop over each property being operated on                                                                    // 42
      _.keys(operation).forEach(function (fieldName) {                                                                // 43
        var field = schema[fieldName];                                                                                // 44
        if (!Users.can.editField(user, field, user)) {                                                                // 45
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 46
        }                                                                                                             // 47
                                                                                                                      // 48
      });                                                                                                             // 49
    });                                                                                                               // 50
                                                                                                                      // 51
    completeUserProfile(modifier, userId, user);                                                                      // 52
  }                                                                                                                   // 53
});                                                                                                                   // 54
                                                                                                                      // 55
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/routes.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Controller for user pages                                                                                          // 1
                                                                                                                      // 2
Users.controllers = {};                                                                                               // 3
                                                                                                                      // 4
Users.controllers.page = RouteController.extend({                                                                     // 5
                                                                                                                      // 6
  waitOn: function() {                                                                                                // 7
    return [                                                                                                          // 8
      coreSubscriptions.subscribe('singleUser', this.params._idOrSlug)                                                // 9
    ];                                                                                                                // 10
  },                                                                                                                  // 11
                                                                                                                      // 12
  getUser: function () {                                                                                              // 13
    return Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});                                           // 14
  },                                                                                                                  // 15
                                                                                                                      // 16
  data: function() {                                                                                                  // 17
                                                                                                                      // 18
    var findById = Meteor.users.findOne(this.params._idOrSlug);                                                       // 19
    var findBySlug = Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});                                 // 20
                                                                                                                      // 21
    if (typeof findById !== 'undefined') {                                                                            // 22
      // redirect to slug-based URL                                                                                   // 23
      Router.go(Users.getProfileUrl(findById), {replaceState: true});                                                 // 24
    } else {                                                                                                          // 25
      return {                                                                                                        // 26
        user: findById || findBySlug                                                                                  // 27
      };                                                                                                              // 28
    }                                                                                                                 // 29
                                                                                                                      // 30
  },                                                                                                                  // 31
                                                                                                                      // 32
  getTitle: function () {                                                                                             // 33
    return Users.getDisplayName(this.getUser());                                                                      // 34
  },                                                                                                                  // 35
                                                                                                                      // 36
  getDescription: function () {                                                                                       // 37
    return i18n.t('the_profile_of') + ' ' + Users.getDisplayName(this.getUser());                                     // 38
  },                                                                                                                  // 39
                                                                                                                      // 40
  fastRender: true                                                                                                    // 41
                                                                                                                      // 42
});                                                                                                                   // 43
                                                                                                                      // 44
// Controller for user account editing                                                                                // 45
                                                                                                                      // 46
Users.controllers.edit = RouteController.extend({                                                                     // 47
  waitOn: function() {                                                                                                // 48
    return [                                                                                                          // 49
      coreSubscriptions.subscribe('singleUser', this.params.slug)                                                     // 50
    ];                                                                                                                // 51
  },                                                                                                                  // 52
  data: function() {                                                                                                  // 53
    // if there is no slug, default to current user                                                                   // 54
    var user = !!this.params.slug ? Meteor.users.findOne({"telescope.slug": this.params.slug}) : Meteor.user();       // 55
    return {                                                                                                          // 56
      user: user                                                                                                      // 57
    };                                                                                                                // 58
  },                                                                                                                  // 59
  fastRender: true                                                                                                    // 60
});                                                                                                                   // 61
                                                                                                                      // 62
Meteor.startup(function () {                                                                                          // 63
                                                                                                                      // 64
// User Logout                                                                                                        // 65
                                                                                                                      // 66
  Router.route('/sign-out', {                                                                                         // 67
    name: 'signOut',                                                                                                  // 68
    template: 'sign_out',                                                                                             // 69
    onBeforeAction: function() {                                                                                      // 70
      Meteor.logout(function() {                                                                                      // 71
      });                                                                                                             // 72
      this.next();                                                                                                    // 73
    }                                                                                                                 // 74
  });                                                                                                                 // 75
                                                                                                                      // 76
  // User Profile                                                                                                     // 77
                                                                                                                      // 78
  Router.route('/users/:_idOrSlug', {                                                                                 // 79
    name: 'user_profile',                                                                                             // 80
    template: 'user_profile',                                                                                         // 81
    controller: Users.controllers.page                                                                                // 82
  });                                                                                                                 // 83
                                                                                                                      // 84
  // User Edit                                                                                                        // 85
                                                                                                                      // 86
  Router.route('/users/:slug/edit', {                                                                                 // 87
    name: 'user_edit',                                                                                                // 88
    template: 'user_edit',                                                                                            // 89
    controller: Users.controllers.edit,                                                                               // 90
    onBeforeAction: function () {                                                                                     // 91
      // Only allow users with permissions to see the user edit page.                                                 // 92
      if (Meteor.user() && (                                                                                          // 93
        Users.is.admin(Meteor.user()) ||                                                                              // 94
        this.params.slug === Meteor.user().telescope.slug                                                             // 95
      )) {                                                                                                            // 96
        this.next();                                                                                                  // 97
      } else {                                                                                                        // 98
        this.render('no_rights');                                                                                     // 99
      }                                                                                                               // 100
    }                                                                                                                 // 101
  });                                                                                                                 // 102
                                                                                                                      // 103
  Router.route('/account', {                                                                                          // 104
    name: 'userAccountShortcut',                                                                                      // 105
    template: 'user_edit',                                                                                            // 106
    controller: Users.controllers.edit                                                                                // 107
  });                                                                                                                 // 108
                                                                                                                      // 109
  // All Users                                                                                                        // 110
                                                                                                                      // 111
  Router.route('/users-dashboard', {                                                                                  // 112
    controller: Telescope.controllers.admin,                                                                          // 113
    name: 'users_dashboard'                                                                                           // 114
  });                                                                                                                 // 115
                                                                                                                      // 116
  // Unsubscribe (from notifications)                                                                                 // 117
                                                                                                                      // 118
  Router.route('/unsubscribe/:hash', {                                                                                // 119
    name: 'unsubscribe',                                                                                              // 120
    template: 'unsubscribe',                                                                                          // 121
    data: function() {                                                                                                // 122
      return {                                                                                                        // 123
        hash: this.params.hash                                                                                        // 124
      };                                                                                                              // 125
    }                                                                                                                 // 126
  });                                                                                                                 // 127
                                                                                                                      // 128
});                                                                                                                   // 129
                                                                                                                      // 130
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/server/publications.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// accept either an ID or a slug                                                                                      // 1
Meteor.publish('singleUser', function(idOrSlug) {                                                                     // 2
  var findById = Meteor.users.findOne(idOrSlug);                                                                      // 3
  var findBySlug = Meteor.users.findOne({"telescope.slug": idOrSlug});                                                // 4
  var user = typeof findById !== 'undefined' ? findById : findBySlug;                                                 // 5
  var options = Users.is.adminById(this.userId) ? {} : {fields: Users.pubsub.publicProperties};                       // 6
  if (user) {                                                                                                         // 7
    return Meteor.users.find({_id: user._id}, options);                                                               // 8
  }                                                                                                                   // 9
  return [];                                                                                                          // 10
});                                                                                                                   // 11
                                                                                                                      // 12
Meteor.publish('userPosts', function(terms) {                                                                         // 13
  var parameters = Posts.getSubParams(terms);                                                                         // 14
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 15
  return posts;                                                                                                       // 16
});                                                                                                                   // 17
                                                                                                                      // 18
Meteor.publish('userUpvotedPosts', function(terms) {                                                                  // 19
  var parameters = Posts.getSubParams(terms);                                                                         // 20
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 21
  return posts;                                                                                                       // 22
});                                                                                                                   // 23
                                                                                                                      // 24
Meteor.publish('userDownvotedPosts', function(terms) {                                                                // 25
  var parameters = Posts.getSubParams(terms);                                                                         // 26
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 27
  return posts;                                                                                                       // 28
});                                                                                                                   // 29
                                                                                                                      // 30
// Publish the current user                                                                                           // 31
                                                                                                                      // 32
Meteor.publish('currentUser', function() {                                                                            // 33
  var user = Meteor.users.find({_id: this.userId}, {fields: Users.pubsub.hiddenProperties});                          // 34
  return user;                                                                                                        // 35
});                                                                                                                   // 36
                                                                                                                      // 37
// publish all users for admins to make autocomplete work                                                             // 38
// TODO: find a better way                                                                                            // 39
                                                                                                                      // 40
Meteor.publish('allUsersAdmin', function() {                                                                          // 41
  var selector = Settings.get('requirePostInvite') ? {isInvited: true} : {}; // only users that can post              // 42
  if (Users.is.adminById(this.userId)) {                                                                              // 43
    return Meteor.users.find(selector, {fields: Users.pubsub.avatarProperties});                                      // 44
  }                                                                                                                   // 45
  return [];                                                                                                          // 46
});                                                                                                                   // 47
                                                                                                                      // 48
// Publish all users to reactive-table (if admin)                                                                     // 49
// Limit, filter, and sort handled by reactive-table.                                                                 // 50
// https://github.com/aslagle/reactive-table#server-side-pagination-and-filtering-beta                                // 51
                                                                                                                      // 52
ReactiveTable.publish("all-users", function() {                                                                       // 53
  if(Users.is.adminById(this.userId)){                                                                                // 54
    return Meteor.users;                                                                                              // 55
  } else {                                                                                                            // 56
    return [];                                                                                                        // 57
  }                                                                                                                   // 58
});                                                                                                                   // 59
                                                                                                                      // 60
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/server/create_user.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Accounts.onCreateUser(function(options, user){                                                                        // 1
  user = Telescope.callbacks.run("onCreateUser", user, options);                                                      // 2
  return user;                                                                                                        // 3
});                                                                                                                   // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Users/sacha/Dev/Telescope/packages/telescope-users/i18n/en.i18n.js                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
// integrate the fallback language translations                                                                       // 8
translations = {};                                                                                                    // 9
translations[namespace] = {"please_fill_in_missing_information_to_finish_signing_up":"Please fill in missing information below to finish signing up.","bio":"Bio","displayName":"Name","email":"Email","twitterUsername":"Twitter Username","website":"Website","htmlBio":"Bio","user_profile_saved":"User profile saved","this_email_is_already_taken":"This email is already taken","all_fields_are_required":"All fields are required"};
TAPi18n._loadLangFileObject("en", translations);                                                                      // 11
                                                                                                                      // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Users/sacha/Dev/Telescope/packages/telescope-users/i18n/fr.i18n.js                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
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
_.extend(TAPi18n.translations["fr"][namespace], {"please_fill_in_missing_information_to_finish_signing_up":"Veuillez remplir les informations manquantes pour compléter votre inscription.","bio":"Bio","displayName":"Nom Affiché","email":"Email","twitterUsername":"Identifiant Twitter","website":"Site Web"});
                                                                                                                      // 17
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:users'] = {
  Users: Users
};

})();

//# sourceMappingURL=telescope_users.js.map
