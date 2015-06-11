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
var Migrations, allMigrations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:migrations/lib/server/migrations.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// TODO: switch over to Tom's migration package.                                                                       // 1
                                                                                                                       // 2
// database migrations                                                                                                 // 3
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations                               // 4
Migrations = new Meteor.Collection('migrations');                                                                      // 5
                                                                                                                       // 6
Meteor.startup(function () {                                                                                           // 7
  allMigrations = Object.keys(migrationsList);                                                                         // 8
  _.each(allMigrations, function(migrationName){                                                                       // 9
    runMigration(migrationName);                                                                                       // 10
  });                                                                                                                  // 11
});                                                                                                                    // 12
                                                                                                                       // 13
Meteor.methods({                                                                                                       // 14
  removeMigration: function (name) {                                                                                   // 15
    if (Users.is.admin(Meteor.user())) {                                                                               // 16
      console.log('// removing migration: ' + name);                                                                   // 17
      Migrations.remove({name: name});                                                                                 // 18
    }                                                                                                                  // 19
  }                                                                                                                    // 20
});                                                                                                                    // 21
                                                                                                                       // 22
// wrapper function for all migrations                                                                                 // 23
var runMigration = function (migrationName) {                                                                          // 24
  var migration = Migrations.findOne({name: migrationName});                                                           // 25
                                                                                                                       // 26
  if (migration){                                                                                                      // 27
    if(typeof migration.finishedAt === 'undefined'){                                                                   // 28
      // if migration exists but hasn't finished, remove it and start fresh                                            // 29
      console.log('!!! Found incomplete migration "'+migrationName+'", removing and running again.');                  // 30
      Migrations.remove({name: migrationName});                                                                        // 31
    }else{                                                                                                             // 32
      // do nothing                                                                                                    // 33
      // console.log('Migration "'+migrationName+'" already exists, doing nothing.')                                   // 34
      return;                                                                                                          // 35
    }                                                                                                                  // 36
  }                                                                                                                    // 37
                                                                                                                       // 38
  console.log("//----------------------------------------------------------------------//");                           // 39
  console.log("//------------//    Starting "+migrationName+" Migration    //-----------//");                          // 40
  console.log("//----------------------------------------------------------------------//");                           // 41
  Migrations.insert({name: migrationName, startedAt: new Date(), completed: false});                                   // 42
                                                                                                                       // 43
  // execute migration function                                                                                        // 44
  var itemsAffected = migrationsList[migrationName]() || 0;                                                            // 45
                                                                                                                       // 46
  Migrations.update({name: migrationName}, {$set: {finishedAt: new Date(), completed: true, itemsAffected: itemsAffected}});
  console.log("//----------------------------------------------------------------------//");                           // 48
  console.log("//------------//     Ending "+migrationName+" Migration     //-----------//");                          // 49
  console.log("//----------------------------------------------------------------------//");                           // 50
};                                                                                                                     // 51
                                                                                                                       // 52
var migrationsList = {                                                                                                 // 53
  updatePostStatus: function () {                                                                                      // 54
    var i = 0;                                                                                                         // 55
    Posts.find({status: {$exists : false}}).forEach(function (post) {                                                  // 56
      i++;                                                                                                             // 57
      Posts.update(post._id, {$set: {status: 2}});                                                                     // 58
      console.log("---------------------");                                                                            // 59
      console.log("Post: "+post.title);                                                                                // 60
      console.log("Updating status to approved");                                                                      // 61
    });                                                                                                                // 62
    return i;                                                                                                          // 63
  },                                                                                                                   // 64
  updateCategories: function () {                                                                                      // 65
    if (typeof Categories === "undefined" || Categories === null) return;                                              // 66
    var i = 0;                                                                                                         // 67
    Categories.find({slug: {$exists : false}}).forEach(function (category) {                                           // 68
        i++;                                                                                                           // 69
        var slug = Telescope.utils.slugify(category.name);                                                             // 70
        Categories.update(category._id, {$set: {slug: slug}});                                                         // 71
        console.log("---------------------");                                                                          // 72
        console.log("Category: "+category.name);                                                                       // 73
        console.log("Updating category with new slug: "+slug);                                                         // 74
    });                                                                                                                // 75
    return i;                                                                                                          // 76
  },                                                                                                                   // 77
  updatePostCategories: function () {                                                                                  // 78
    if (typeof Categories === "undefined" || Categories === null) return;                                              // 79
    var i = 0;                                                                                                         // 80
    Posts.find().forEach(function (post) {                                                                             // 81
      i++;                                                                                                             // 82
      var oldCategories = post.categories;                                                                             // 83
      var newCategories = [];                                                                                          // 84
      var category = {};                                                                                               // 85
      var updating = false; // by default, assume we're not going to do anything                                       // 86
                                                                                                                       // 87
      // iterate over the post.categories array                                                                        // 88
      // if the post has no categories then nothing will happen                                                        // 89
      _.each(oldCategories, function(value){                                                                           // 90
        // make sure the categories are strings                                                                        // 91
        if((typeof value === "string") && (category = Categories.findOne({name: value}))){                             // 92
          // if value is a string, then look for the matching category object                                          // 93
          // and if it exists push it to the newCategories array                                                       // 94
          updating = true; // we're updating at least one category for this post                                       // 95
          newCategories.push(category);                                                                                // 96
        }else{                                                                                                         // 97
          // if category A) is already an object, or B) it's a string but a matching category object doesn't exist     // 98
          // just keep the current value                                                                               // 99
          newCategories.push(value);                                                                                   // 100
        }                                                                                                              // 101
      });                                                                                                              // 102
                                                                                                                       // 103
      if(updating){                                                                                                    // 104
        // update categories property on post                                                                          // 105
        Posts.update(post._id, {$set: {categories: newCategories}});                                                   // 106
      }                                                                                                                // 107
                                                                                                                       // 108
      // START CONSOLE LOGS                                                                                            // 109
      console.log("---------------------");                                                                            // 110
      console.log("Post: "+post.title);                                                                                // 111
      if(updating){                                                                                                    // 112
        console.log(oldCategories.length+" categories: "+oldCategories);                                               // 113
        console.log("Updating categories array to: ");                                                                 // 114
        console.log(newCategories);                                                                                    // 115
      }else{                                                                                                           // 116
        console.log("No updates");                                                                                     // 117
      }                                                                                                                // 118
      // END CONSOLE LOGS                                                                                              // 119
    });                                                                                                                // 120
    return i;                                                                                                          // 121
  },                                                                                                                   // 122
  updateUserProfiles: function () {                                                                                    // 123
    var i = 0;                                                                                                         // 124
    var allUsers = Meteor.users.find();                                                                                // 125
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 126
                                                                                                                       // 127
    allUsers.forEach(function(user){                                                                                   // 128
      i++;                                                                                                             // 129
      console.log('> Updating user '+user._id+' ('+user.username+')');                                                 // 130
                                                                                                                       // 131
      var properties = {};                                                                                             // 132
      properties.telescope = {};                                                                                       // 133
      // update user slug                                                                                              // 134
      if(Users.getUserName(user))                                                                                      // 135
        properties.slug = Telescope.utils.slugify(Users.getUserName(user));                                            // 136
                                                                                                                       // 137
      // update user isAdmin flag                                                                                      // 138
      if(typeof user.isAdmin === 'undefined')                                                                          // 139
        properties.isAdmin = false;                                                                                    // 140
                                                                                                                       // 141
      // update postCount                                                                                              // 142
      var postsByUser = Posts.find({userId: user._id});                                                                // 143
      properties.telescope.postCount = postsByUser.count();                                                            // 144
                                                                                                                       // 145
      // update commentCount                                                                                           // 146
      var commentsByUser = Comments.find({userId: user._id});                                                          // 147
      properties.telescope.commentCount = commentsByUser.count();                                                      // 148
                                                                                                                       // 149
      Meteor.users.update(user._id, {$set:properties});                                                                // 150
                                                                                                                       // 151
    });                                                                                                                // 152
    return i;                                                                                                          // 153
  },                                                                                                                   // 154
  resetUpvotesDownvotes: function () {                                                                                 // 155
    var i = 0;                                                                                                         // 156
    Posts.find().forEach(function (post) {                                                                             // 157
      i++;                                                                                                             // 158
      var upvotes = 0,                                                                                                 // 159
          downvotes = 0;                                                                                               // 160
      console.log("Post: "+post.title);                                                                                // 161
      if(post.upvoters){                                                                                               // 162
        upvotes = post.upvoters.length;                                                                                // 163
        console.log("Found "+upvotes+" upvotes.");                                                                     // 164
      }                                                                                                                // 165
      if(post.downvoters){                                                                                             // 166
        downvotes = post.downvoters.length;                                                                            // 167
        console.log("Found "+downvotes+" downvotes.");                                                                 // 168
      }                                                                                                                // 169
      Posts.update(post._id, {$set: {upvotes: upvotes, downvotes: downvotes}});                                        // 170
      console.log("---------------------");                                                                            // 171
    });                                                                                                                // 172
    return i;                                                                                                          // 173
  },                                                                                                                   // 174
  resetCommentsUpvotesDownvotes: function () {                                                                         // 175
    var i = 0;                                                                                                         // 176
    Comments.find().forEach(function (comment) {                                                                       // 177
      i++;                                                                                                             // 178
      var upvotes = 0,                                                                                                 // 179
          downvotes = 0;                                                                                               // 180
      console.log("Comment: "+comment._id);                                                                            // 181
      if(comment.upvoters){                                                                                            // 182
        upvotes = comment.upvoters.length;                                                                             // 183
        console.log("Found "+upvotes+" upvotes.");                                                                     // 184
      }                                                                                                                // 185
      if(comment.downvoters){                                                                                          // 186
        downvotes = comment.downvoters.length;                                                                         // 187
        console.log("Found "+downvotes+" downvotes.");                                                                 // 188
      }                                                                                                                // 189
      Comments.update(comment._id, {$set: {upvotes: upvotes, downvotes: downvotes}});                                  // 190
      console.log("---------------------");                                                                            // 191
    });                                                                                                                // 192
    return i;                                                                                                          // 193
  },                                                                                                                   // 194
  headlineToTitle: function () {                                                                                       // 195
    var i = 0;                                                                                                         // 196
    Posts.find({title: {$exists : false}}).forEach(function (post) {                                                   // 197
      i++;                                                                                                             // 198
      console.log("Post: "+post.headline+" "+post.title);                                                              // 199
      Posts.update(post._id, { $rename: { 'headline': 'title'}}, {multi: true, validate: false});                      // 200
      console.log("---------------------");                                                                            // 201
    });                                                                                                                // 202
    return i;                                                                                                          // 203
  },                                                                                                                   // 204
  commentsSubmittedToCreatedAt: function () {                                                                          // 205
    var i = 0;                                                                                                         // 206
    Comments.find({createdAt: {$exists: false}}).forEach(function (comment) {                                          // 207
      i++;                                                                                                             // 208
      console.log("Comment: "+comment._id);                                                                            // 209
      Comments.update(comment._id, { $rename: { 'submitted': 'createdAt'}}, {multi: true, validate: false});           // 210
      console.log("---------------------");                                                                            // 211
    });                                                                                                                // 212
    return i;                                                                                                          // 213
  },                                                                                                                   // 214
  commentsPostToPostId: function () {                                                                                  // 215
    var i = 0;                                                                                                         // 216
    Comments.find({postId: {$exists : false}}).forEach(function (comment) {                                            // 217
      i++;                                                                                                             // 218
      console.log("Comment: "+comment._id);                                                                            // 219
      Comments.update(comment._id, { $rename: { 'post': 'postId'}}, {multi: true, validate: false});                   // 220
      console.log("---------------------");                                                                            // 221
    });                                                                                                                // 222
    return i;                                                                                                          // 223
  },                                                                                                                   // 224
  createdAtSubmittedToDate: function () {                                                                              // 225
    var i = 0;                                                                                                         // 226
    Posts.find().forEach(function (post) {                                                                             // 227
      if(typeof post.submitted === "number" || typeof post.createdAt === "number"){                                    // 228
        i++;                                                                                                           // 229
        console.log("Posts: "+post.title);                                                                             // 230
        var createdAt = new Date(post.createdAt);                                                                      // 231
        var submitted = new Date(post.submitted);                                                                      // 232
        console.log(createdAt);                                                                                        // 233
        Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
        console.log("---------------------");                                                                          // 235
      }                                                                                                                // 236
    });                                                                                                                // 237
    return i;                                                                                                          // 238
  },                                                                                                                   // 239
  commentsCreatedAtToDate: function () {                                                                               // 240
    var i = 0;                                                                                                         // 241
    Comments.find().forEach(function (comment) {                                                                       // 242
      if(typeof comment.createdAt === "number"){                                                                       // 243
        i++;                                                                                                           // 244
        console.log("Comment: "+comment._id);                                                                          // 245
        var createdAt = new Date(comment.createdAt);                                                                   // 246
        console.log(createdAt);                                                                                        // 247
        Comments.update(comment._id, { $set: { 'createdAt': createdAt}}, {multi: true, validate: false});              // 248
        console.log("---------------------");                                                                          // 249
      }                                                                                                                // 250
    });                                                                                                                // 251
    return i;                                                                                                          // 252
  },                                                                                                                   // 253
  submittedToPostedAt: function () {                                                                                   // 254
    var i = 0;                                                                                                         // 255
    Posts.find({postedAt: {$exists : false}}).forEach(function (post) {                                                // 256
      i++;                                                                                                             // 257
      console.log("Post: "+post._id);                                                                                  // 258
      Posts.update(post._id, { $rename: { 'submitted': 'postedAt'}}, {multi: true, validate: false});                  // 259
      console.log("---------------------");                                                                            // 260
    });                                                                                                                // 261
    return i;                                                                                                          // 262
  },                                                                                                                   // 263
  addPostedAtToComments: function () {                                                                                 // 264
    var i = 0;                                                                                                         // 265
    Comments.find({postedAt: {$exists : false}}).forEach(function (comment) {                                          // 266
      i++;                                                                                                             // 267
      console.log("Comment: "+comment._id);                                                                            // 268
      Comments.update(comment._id, { $set: { 'postedAt': comment.createdAt}}, {multi: true, validate: false});         // 269
      console.log("---------------------");                                                                            // 270
    });                                                                                                                // 271
    return i;                                                                                                          // 272
  },                                                                                                                   // 273
  parentToParentCommentId: function () {                                                                               // 274
    var i = 0;                                                                                                         // 275
    Comments.find({parent: {$exists: true}, parentCommentId: {$exists : false}}).forEach(function (comment) {          // 276
      i++;                                                                                                             // 277
      console.log("Comment: "+comment._id);                                                                            // 278
      Comments.update(comment._id, { $set: { 'parentCommentId': comment.parent}}, {multi: true, validate: false});     // 279
      console.log("---------------------");                                                                            // 280
    });                                                                                                                // 281
    return i;                                                                                                          // 282
  },                                                                                                                   // 283
  addLastCommentedAt: function () {                                                                                    // 284
    var i = 0;                                                                                                         // 285
    Posts.find({$and: [                                                                                                // 286
      {$or: [{comments: {$gt: 0}}, {commentCount: {$gt: 0}}]},                                                         // 287
      {lastCommentedAt: {$exists : false}}                                                                             // 288
    ]}).forEach(function (post) {                                                                                      // 289
      i++;                                                                                                             // 290
      console.log("Post: "+post._id);                                                                                  // 291
      var postComments = Comments.find({$or: [{postId: post._id}, {post: post._id}]}, {sort: {postedAt: -1}}).fetch(); // 292
      var lastComment;                                                                                                 // 293
      if (_.isEmpty(postComments)) {                                                                                   // 294
        console.log('postComments from post '+post._id+' is empty. Skipping.');                                        // 295
        return;                                                                                                        // 296
      }                                                                                                                // 297
      lastComment = postComments[0];                                                                                   // 298
      Posts.update(post._id, { $set: { lastCommentedAt: lastComment.postedAt}}, {multi: false, validate: false});      // 299
      console.log("---------------------");                                                                            // 300
    });                                                                                                                // 301
    return i;                                                                                                          // 302
  },                                                                                                                   // 303
  commentsToCommentCount: function () {                                                                                // 304
    var i = 0;                                                                                                         // 305
    Posts.find({comments: {$exists : true}, commentCount: {$exists : false}}).forEach(function (post) {                // 306
      i++;                                                                                                             // 307
      console.log("Post: "+post._id);                                                                                  // 308
      Posts.update(post._id, { $set: { 'commentCount': post.comments}, $unset: { 'comments': ''}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 310
    });                                                                                                                // 311
    return i;                                                                                                          // 312
  },                                                                                                                   // 313
  addCommentersToPosts: function () {                                                                                  // 314
    var i = 0;                                                                                                         // 315
    Comments.find().forEach(function (comment) {                                                                       // 316
      i++;                                                                                                             // 317
      console.log("Comment: "+comment._id);                                                                            // 318
      console.log("Post: "+comment.postId);                                                                            // 319
      Posts.update(comment.postId, { $addToSet: { 'commenters': comment.userId}}, {multi: true, validate: false});     // 320
      console.log("---------------------");                                                                            // 321
    });                                                                                                                // 322
    return i;                                                                                                          // 323
  },                                                                                                                   // 324
  moveVotesFromProfile: function () {                                                                                  // 325
    var i = 0;                                                                                                         // 326
    Meteor.users.find().forEach(function (user) {                                                                      // 327
      i++;                                                                                                             // 328
      console.log("User: "+user._id);                                                                                  // 329
      Meteor.users.update(user._id, {                                                                                  // 330
        $rename: {                                                                                                     // 331
          'profile.upvotedPosts': 'telescope.upvotedPosts',                                                            // 332
          'profile.downvotedPosts': 'telescope.downvotedPosts',                                                        // 333
          'profile.upvotedComments': 'telescope.upvotedComments',                                                      // 334
          'profile.downvotedComments': 'telescope.downvotedComments'                                                   // 335
        }                                                                                                              // 336
      }, {multi: true, validate: false});                                                                              // 337
      console.log("---------------------");                                                                            // 338
    });                                                                                                                // 339
    return i;                                                                                                          // 340
  },                                                                                                                   // 341
  addHTMLBody: function () {                                                                                           // 342
    var i = 0;                                                                                                         // 343
    Posts.find({body: {$exists : true}}).forEach(function (post) {                                                     // 344
      i++;                                                                                                             // 345
      var htmlBody = Telescope.utils.sanitize(marked(post.body));                                                      // 346
      console.log("Post: "+post._id);                                                                                  // 347
      Posts.update(post._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});                        // 348
      console.log("---------------------");                                                                            // 349
    });                                                                                                                // 350
    return i;                                                                                                          // 351
  },                                                                                                                   // 352
  addHTMLComment: function () {                                                                                        // 353
    var i = 0;                                                                                                         // 354
    Comments.find({body: {$exists : true}}).forEach(function (comment) {                                               // 355
      i++;                                                                                                             // 356
      var htmlBody = Telescope.utils.sanitize(marked(comment.body));                                                   // 357
      console.log("Comment: "+comment._id);                                                                            // 358
      Comments.update(comment._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});                  // 359
      console.log("---------------------");                                                                            // 360
    });                                                                                                                // 361
    return i;                                                                                                          // 362
  },                                                                                                                   // 363
  clicksToClickCount: function () {                                                                                    // 364
    var i = 0;                                                                                                         // 365
    Posts.find({"clicks": {$exists: true}, "clickCount": {$exists : false}}).forEach(function (post) {                 // 366
      i++;                                                                                                             // 367
      console.log("Post: " + post._id);                                                                                // 368
      Posts.update(post._id, { $set: { 'clickCount': post.clicks}, $unset: { 'clicks': ''}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 370
    });                                                                                                                // 371
    return i;                                                                                                          // 372
  },                                                                                                                   // 373
  commentsCountToCommentCount: function () {                                                                           // 374
    var i = 0;                                                                                                         // 375
    Posts.find({"commentCount": {$exists : false}}).forEach(function (post) {                                          // 376
      i++;                                                                                                             // 377
      console.log("Post: " + post._id);                                                                                // 378
      Posts.update({_id: post._id}, { $set: { 'commentCount': post.commentsCount}, $unset: {'commentsCount': ""}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 380
    });                                                                                                                // 381
    return i;                                                                                                          // 382
  },                                                                                                                   // 383
  userDataCommentsCountToCommentCount: function(){                                                                     // 384
    var i = 0;                                                                                                         // 385
    Meteor.users.find({'commentCount': {$exists: false}}).forEach(function(user){                                      // 386
      i++;                                                                                                             // 387
      var commentCount = Comments.find({userId: user._id}).count();                                                    // 388
      console.log("User: " + user._id);                                                                                // 389
      Meteor.users.update(user._id, {$set: { telescope : {'commentCount': commentCount}}});                            // 390
      console.log("---------------------");                                                                            // 391
    });                                                                                                                // 392
    return i;                                                                                                          // 393
   },                                                                                                                  // 394
  clicksToClickCountForRealThisTime: function () { // since both fields might be co-existing, add to clickCount instead of overwriting it
    var i = 0;                                                                                                         // 396
    Posts.find({'clicks': {$exists: true}}).forEach(function (post) {                                                  // 397
      i++;                                                                                                             // 398
      console.log("Post: " + post._id);                                                                                // 399
      Posts.update(post._id, { $inc: { 'clickCount': post.clicks}, $unset: {'clicks': ""}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 401
    });                                                                                                                // 402
    return i;                                                                                                          // 403
  },                                                                                                                   // 404
  normalizeCategories: function () {                                                                                   // 405
    var i = 0;                                                                                                         // 406
    Posts.find({'categories': {$exists: true}}).forEach(function (post) {                                              // 407
      i++;                                                                                                             // 408
      console.log("Post: " + post._id);                                                                                // 409
      var justCategoryIds = post.categories.map(function (category){                                                   // 410
        return category._id;                                                                                           // 411
      });                                                                                                              // 412
      Posts.update(post._id, {$set: {categories: justCategoryIds, oldCategories: post.categories}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 414
    });                                                                                                                // 415
    return i;                                                                                                          // 416
  },                                                                                                                   // 417
  cleanUpStickyProperty: function () {                                                                                 // 418
    var i = 0;                                                                                                         // 419
    Posts.find({'sticky': {$exists: false}}).forEach(function (post) {                                                 // 420
      i++;                                                                                                             // 421
      console.log("Post: " + post._id);                                                                                // 422
      Posts.update(post._id, {$set: {sticky: false}}, {multi: true, validate: false});                                 // 423
      console.log("---------------------");                                                                            // 424
    });                                                                                                                // 425
    return i;                                                                                                          // 426
  },                                                                                                                   // 427
  show0112ReleaseNotes: function () {                                                                                  // 428
    var i = 0;                                                                                                         // 429
    // if this is the 0.11.2 update, the first run event will not exist yet.                                           // 430
    // if that's the case, make sure to still show release notes                                                       // 431
    if (!Events.findOne({name: 'firstRun'})) {                                                                         // 432
      Releases.update({number:'0.11.2'}, {$set: {read:false}});                                                        // 433
    }                                                                                                                  // 434
    return i;                                                                                                          // 435
  },                                                                                                                   // 436
  removeThumbnailHTTP: function () {                                                                                   // 437
    var i = 0;                                                                                                         // 438
    Posts.find({thumbnailUrl: {$exists : true}}).forEach(function (post) {                                             // 439
      i++;                                                                                                             // 440
      var newThumbnailUrl = post.thumbnailUrl.replace("http:", "");                                                    // 441
      console.log("Post: "+post._id);                                                                                  // 442
      Posts.update(post._id, { $set: { 'thumbnailUrl': newThumbnailUrl}}, {multi: true, validate: false});             // 443
      console.log("---------------------");                                                                            // 444
    });                                                                                                                // 445
    return i;                                                                                                          // 446
  },                                                                                                                   // 447
  updateUserNames: function () {                                                                                       // 448
    var i = 0;                                                                                                         // 449
    var allUsers = Meteor.users.find({username: {$exists: true}, profile: {$exists: true}, 'profile.isDummy': {$ne: true}});
                                                                                                                       // 451
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 452
                                                                                                                       // 453
    allUsers.forEach(function(user){                                                                                   // 454
      i++;                                                                                                             // 455
                                                                                                                       // 456
      // Perform the same transforms done by useraccounts with `lowercaseUsernames` set to `true`                      // 457
      var oldUsername = user.username;                                                                                 // 458
      var username = user.username;                                                                                    // 459
      username = username.trim().replace(/\s+/gm, ' ');                                                                // 460
      user.profile.username = user.profile.name || username;                                                           // 461
      delete user.profile.name;                                                                                        // 462
      username = username.toLowerCase().replace(/\s+/gm, '');                                                          // 463
      user.username = username;                                                                                        // 464
                                                                                                                       // 465
      if (user.emails && user.emails.length > 0) {                                                                     // 466
        _.each(user.emails, function(email){                                                                           // 467
          email.address = email.address.toLowerCase().replace(/\s+/gm, '');                                            // 468
        });                                                                                                            // 469
      }                                                                                                                // 470
                                                                                                                       // 471
      console.log('> Updating user '+user._id+' ('+oldUsername+' -> ' + user.username + ')');                          // 472
                                                                                                                       // 473
      try {                                                                                                            // 474
        Meteor.users.update(user._id, {                                                                                // 475
          $set: {                                                                                                      // 476
            emails: user.emails,                                                                                       // 477
            profile: user.profile,                                                                                     // 478
            username: user.username,                                                                                   // 479
          },                                                                                                           // 480
        });                                                                                                            // 481
      }                                                                                                                // 482
      catch (err) {                                                                                                    // 483
        console.warn('> Unable to convert username ' + user.username + ' to lowercase!');                              // 484
        console.warn('> Please try to fix it by hand!! :(');                                                           // 485
      }                                                                                                                // 486
    });                                                                                                                // 487
    return i;                                                                                                          // 488
  },                                                                                                                   // 489
  changeColorNames: function () {                                                                                      // 490
    var i = 0;                                                                                                         // 491
    var settings = Settings.findOne();                                                                                 // 492
    var set = {};                                                                                                      // 493
                                                                                                                       // 494
    if (!!settings) {                                                                                                  // 495
                                                                                                                       // 496
      if (!!settings.buttonColor)                                                                                      // 497
        set.accentColor = settings.buttonColor;                                                                        // 498
                                                                                                                       // 499
      if (!!settings.buttonTextColor)                                                                                  // 500
        set.accentContrastColor = settings.buttonTextColor;                                                            // 501
                                                                                                                       // 502
      if (!!settings.buttonColor)                                                                                      // 503
        set.secondaryColor = settings.headerColor;                                                                     // 504
                                                                                                                       // 505
      if (!!settings.buttonColor)                                                                                      // 506
        set.secondaryContrastColor = settings.headerTextColor;                                                         // 507
                                                                                                                       // 508
      if (!_.isEmpty(set)) {                                                                                           // 509
        Settings.update(settings._id, {$set: set}, {validate: false});                                                 // 510
      }                                                                                                                // 511
                                                                                                                       // 512
    }                                                                                                                  // 513
    return i;                                                                                                          // 514
  },                                                                                                                   // 515
  migrateUserProfiles: function () {                                                                                   // 516
    var i = 0;                                                                                                         // 517
    var allUsers = Meteor.users.find({telescope: {$exists: false}});                                                   // 518
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 519
                                                                                                                       // 520
    allUsers.forEach(function(user){                                                                                   // 521
      i++;                                                                                                             // 522
                                                                                                                       // 523
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 524
                                                                                                                       // 525
      var telescopeUserData = {};                                                                                      // 526
                                                                                                                       // 527
      // loop over user data schema                                                                                    // 528
      _.each(Telescope.schemas.userData._schema, function (property, key) {                                            // 529
                                                                                                                       // 530
        if (!!user[key]) { // look for property on root of user object                                                 // 531
          telescopeUserData[key] = user[key];                                                                          // 532
        } else if (user.votes && !!user.votes[key]) { // look for it in user.votes object                              // 533
          telescopeUserData[key] = user.votes[key];                                                                    // 534
        } else if (user.profile && user.profile[key]) { // look for it in user.profile object                          // 535
          telescopeUserData[key] = user.profile[key];                                                                  // 536
        }                                                                                                              // 537
                                                                                                                       // 538
      });                                                                                                              // 539
                                                                                                                       // 540
      // console.log(telescopeUserData);                                                                               // 541
                                                                                                                       // 542
      try {                                                                                                            // 543
        Meteor.users.update(user._id, {                                                                                // 544
          $set: {                                                                                                      // 545
            telescope: telescopeUserData                                                                               // 546
          }                                                                                                            // 547
        });                                                                                                            // 548
      } catch (err) {                                                                                                  // 549
        console.log(err);                                                                                              // 550
        console.warn('> Unable to migrate profile for user ' + user.username);                                         // 551
      }                                                                                                                // 552
    });                                                                                                                // 553
    return i;                                                                                                          // 554
  },                                                                                                                   // 555
  migrateEmailHash: function () {                                                                                      // 556
    var i = 0;                                                                                                         // 557
    var allUsers = Meteor.users.find({$and: [{"email_hash": {$exists: true}}, {"telescope.emailHash": {$exists: false}}]});
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 559
                                                                                                                       // 560
    allUsers.forEach(function(user){                                                                                   // 561
      i++;                                                                                                             // 562
                                                                                                                       // 563
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 564
                                                                                                                       // 565
      var emailHash = user.email_hash;                                                                                 // 566
      if (!!emailHash) {                                                                                               // 567
        Meteor.users.update(user._id, {$set: {"telescope.emailHash": emailHash}});                                     // 568
      }                                                                                                                // 569
    });                                                                                                                // 570
    return i;                                                                                                          // 571
  },                                                                                                                   // 572
  // addTopLevelCommentIdToComments: function() {                                                                      // 573
  //   var i = 0;                                                                                                      // 574
                                                                                                                       // 575
  //   // find all root comments and set topLevelCommentId on their root children                                      // 576
  //   Comments.find({parentCommentId: {$exists : false}}).forEach(function (comment) {                                // 577
                                                                                                                       // 578
  //     // topLevelCommentId is the root comment._id                                                                  // 579
  //     var topLevelCommentId = comment._id;                                                                          // 580
  //     console.log("Root Comment found: " + topLevelCommentId);                                                      // 581
                                                                                                                       // 582
  //     // find childComments that have this root comment as parentCommentId                                          // 583
  //     Comments.find({parentCommentId: comment._id}).forEach(function (childComment) {                               // 584
  //       i++;                                                                                                        // 585
  //       updateParentAndChild(topLevelCommentId, childComment._id);                                                  // 586
  //     });                                                                                                           // 587
                                                                                                                       // 588
  //   });                                                                                                             // 589
                                                                                                                       // 590
  //   function updateParentAndChild(topLevelCommentId, parentId) {                                                    // 591
                                                                                                                       // 592
  //     i++;                                                                                                          // 593
  //     console.log("Parent Comment: " + parentId, " top level comment " + topLevelCommentId);                        // 594
                                                                                                                       // 595
  //     Comments.update(parentId, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false}); // 596
                                                                                                                       // 597
  //     var childComments = Comments.find({topLevelCommentId: {$exists : false}, parentCommentId: parentId});         // 598
                                                                                                                       // 599
  //     console.log('> Found '+childComments.count()+' child comments.\n');                                           // 600
                                                                                                                       // 601
  //     childComments.forEach(function(childComment){                                                                 // 602
  //       i++;                                                                                                        // 603
                                                                                                                       // 604
  //       // find all nested childComments and set topLevelCommentId                                                  // 605
  //       console.log("Child Comment: " + childComment._id, " top level comment " + topLevelCommentId);               // 606
                                                                                                                       // 607
  //       // set nested childComment to use parent's topLevelCommentId                                                // 608
  //       Comments.update(childComment._id, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false});
  //       updateParentAndChild(topLevelCommentId, childComment._id, true);                                            // 610
  //     });                                                                                                           // 611
                                                                                                                       // 612
  //   }                                                                                                               // 613
  //   console.log("---------------------");                                                                           // 614
  //   return i;                                                                                                       // 615
  // },                                                                                                                // 616
  migrateDisplayName: function () {                                                                                    // 617
    var i = 0;                                                                                                         // 618
    var displayName;                                                                                                   // 619
    var allUsers = Meteor.users.find({"telescope.displayName": {$exists: false}});                                     // 620
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 621
                                                                                                                       // 622
    allUsers.forEach(function(user){                                                                                   // 623
      i++;                                                                                                             // 624
                                                                                                                       // 625
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 626
      if (!!user.profile) {                                                                                            // 627
        displayName = user.profile.name || user.profile.username;                                                      // 628
      } else {                                                                                                         // 629
        displayName = user.username;                                                                                   // 630
      }                                                                                                                // 631
                                                                                                                       // 632
      console.log('name: ', displayName);                                                                              // 633
      if (!!displayName) {                                                                                             // 634
        Meteor.users.update(user._id, {$set: {"telescope.displayName": displayName}});                                 // 635
      } else {                                                                                                         // 636
        console.log("displayName not found :(");                                                                       // 637
      }                                                                                                                // 638
    });                                                                                                                // 639
    return i;                                                                                                          // 640
  },                                                                                                                   // 641
  migrateNewsletterSettings: function () {                                                                             // 642
    var i = 0;                                                                                                         // 643
    var allUsers = Meteor.users.find({                                                                                 // 644
      $or: [                                                                                                           // 645
        {"profile.showBanner": {$exists: true}},                                                                       // 646
        {"profile.subscribedToNewsletter": {$exists: true}}                                                            // 647
      ]                                                                                                                // 648
    });                                                                                                                // 649
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 650
                                                                                                                       // 651
    allUsers.forEach(function(user){                                                                                   // 652
      i++;                                                                                                             // 653
      var displayName;                                                                                                 // 654
                                                                                                                       // 655
      if (!!user.profile) {                                                                                            // 656
        displayName = user.profile.name || user.profile.username;                                                      // 657
      } else {                                                                                                         // 658
        displayName = user.username;                                                                                   // 659
      }                                                                                                                // 660
                                                                                                                       // 661
      console.log('> Updating user '+user._id+' (' + displayName + ')');                                               // 662
                                                                                                                       // 663
      if (user.profile) {                                                                                              // 664
                                                                                                                       // 665
        var set = {};                                                                                                  // 666
                                                                                                                       // 667
        var showBanner = user.profile.showBanner;                                                                      // 668
        if (typeof showBanner !== "undefined") {                                                                       // 669
          set["telescope.newsletter.showBanner"] = showBanner;                                                         // 670
        }                                                                                                              // 671
                                                                                                                       // 672
        var subscribeToNewsletter = user.profile.subscribedToNewsletter;                                               // 673
        if (typeof subscribeToNewsletter !== "undefined") {                                                            // 674
          set["telescope.newsletter.subscribeToNewsletter"] = subscribeToNewsletter;                                   // 675
        }                                                                                                              // 676
        console.log(set)                                                                                               // 677
        if (!_.isEmpty(set)) {                                                                                         // 678
          Meteor.users.update(user._id, {$set: set});                                                                  // 679
        }                                                                                                              // 680
                                                                                                                       // 681
      }                                                                                                                // 682
                                                                                                                       // 683
    });                                                                                                                // 684
    return i;                                                                                                          // 685
  }                                                                                                                    // 686
};                                                                                                                     // 687
                                                                                                                       // 688
// TODO: normalize categories?                                                                                         // 689
                                                                                                                       // 690
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:migrations'] = {
  Migrations: Migrations
};

})();

//# sourceMappingURL=telescope_migrations.js.map
