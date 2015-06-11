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
var Settings, debug, __, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/settings.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * The global namespace for Settings.                                                                                  // 2
 * @namespace Settings                                                                                                 // 3
 */                                                                                                                    // 4
Settings = new Mongo.Collection("settings");                                                                           // 5
                                                                                                                       // 6
Settings.schema = new SimpleSchema({                                                                                   // 7
  title: {                                                                                                             // 8
    type: String,                                                                                                      // 9
    optional: true,                                                                                                    // 10
    autoform: {                                                                                                        // 11
      group: "01_general"                                                                                              // 12
    }                                                                                                                  // 13
  },                                                                                                                   // 14
  siteUrl: {                                                                                                           // 15
    type: String,                                                                                                      // 16
    optional: true,                                                                                                    // 17
    // regEx: SimpleSchema.RegEx.Url,                                                                                  // 18
    autoform: {                                                                                                        // 19
      group: "01_general",                                                                                             // 20
      type: "bootstrap-url",                                                                                           // 21
      instructions: 'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'                       // 22
    }                                                                                                                  // 23
  },                                                                                                                   // 24
  tagline: {                                                                                                           // 25
    type: String,                                                                                                      // 26
    optional: true,                                                                                                    // 27
    autoform: {                                                                                                        // 28
      group: "01_general"                                                                                              // 29
    }                                                                                                                  // 30
  },                                                                                                                   // 31
  description: {                                                                                                       // 32
    type: String,                                                                                                      // 33
    optional: true,                                                                                                    // 34
    autoform: {                                                                                                        // 35
      group: "01_general",                                                                                             // 36
      rows: 5,                                                                                                         // 37
      instructions: 'A short description used for SEO purposes.'                                                       // 38
    }                                                                                                                  // 39
  },                                                                                                                   // 40
  siteImage: {                                                                                                         // 41
    type: String,                                                                                                      // 42
    optional: true,                                                                                                    // 43
    regEx: SimpleSchema.RegEx.Url,                                                                                     // 44
    autoform: {                                                                                                        // 45
      group: "01_general",                                                                                             // 46
      instructions: "URL to an image for the open graph image tag for all pages"                                       // 47
    }                                                                                                                  // 48
  },                                                                                                                   // 49
  navLayout: {                                                                                                         // 50
    type: String,                                                                                                      // 51
    optional: true,                                                                                                    // 52
    autoform: {                                                                                                        // 53
      group: "01_general",                                                                                             // 54
      instructions: 'The layout used for the main menu',                                                               // 55
      options: [                                                                                                       // 56
        {value: 'top-nav', label: 'Top'},                                                                              // 57
        {value: 'side-nav', label: 'Side'}                                                                             // 58
      ]                                                                                                                // 59
    }                                                                                                                  // 60
  },                                                                                                                   // 61
  requireViewInvite: {                                                                                                 // 62
    type: Boolean,                                                                                                     // 63
    optional: true,                                                                                                    // 64
    autoform: {                                                                                                        // 65
      group: 'invites',                                                                                                // 66
      leftLabel: 'Require View Invite'                                                                                 // 67
    }                                                                                                                  // 68
  },                                                                                                                   // 69
  requirePostInvite: {                                                                                                 // 70
    type: Boolean,                                                                                                     // 71
    optional: true,                                                                                                    // 72
    autoform: {                                                                                                        // 73
      group: 'invites',                                                                                                // 74
      leftLabel: 'Require Post Invite'                                                                                 // 75
    }                                                                                                                  // 76
  },                                                                                                                   // 77
  requirePostsApproval: {                                                                                              // 78
    type: Boolean,                                                                                                     // 79
    optional: true,                                                                                                    // 80
    autoform: {                                                                                                        // 81
      group: "01_general",                                                                                             // 82
      instructions: "Posts must be approved by admin",                                                                 // 83
      leftLabel: "Require Posts Approval"                                                                              // 84
    }                                                                                                                  // 85
  },                                                                                                                   // 86
  defaultEmail: {                                                                                                      // 87
    type: String,                                                                                                      // 88
    optional: true,                                                                                                    // 89
    private: true,                                                                                                     // 90
    autoform: {                                                                                                        // 91
      group: "06_email",                                                                                               // 92
      instructions: 'The address all outgoing emails will be sent from.',                                              // 93
      class: "private-field"                                                                                           // 94
    }                                                                                                                  // 95
  },                                                                                                                   // 96
  mailUrl: {                                                                                                           // 97
    type: String,                                                                                                      // 98
    optional: true,                                                                                                    // 99
    private: true,                                                                                                     // 100
    autoform: {                                                                                                        // 101
      group: "06_email",                                                                                               // 102
      instructions: 'MAIL_URL environment variable (requires restart).',                                               // 103
      class: "private-field"                                                                                           // 104
    }                                                                                                                  // 105
  },                                                                                                                   // 106
  scoreUpdateInterval: {                                                                                               // 107
    type: Number,                                                                                                      // 108
    optional: true,                                                                                                    // 109
    defaultValue: 30,                                                                                                  // 110
    private: true,                                                                                                     // 111
    autoform: {                                                                                                        // 112
      group: 'scoring',                                                                                                // 113
      instructions: 'How often to recalculate scores, in seconds (default to 30)',                                     // 114
      class: "private-field"                                                                                           // 115
    }                                                                                                                  // 116
  },                                                                                                                   // 117
  defaultView: {                                                                                                       // 118
    type: String,                                                                                                      // 119
    optional: true,                                                                                                    // 120
    autoform: {                                                                                                        // 121
      group: "02_posts",                                                                                               // 122
      instructions: 'The view used for the front page',                                                                // 123
      options: function () {                                                                                           // 124
        return _.map(Telescope.menuItems.get("viewsMenu"), function (view) {                                           // 125
          return {                                                                                                     // 126
            value: Telescope.utils.camelCaseify(view.label),                                                           // 127
            label: view.label                                                                                          // 128
          };                                                                                                           // 129
        });                                                                                                            // 130
      }                                                                                                                // 131
    }                                                                                                                  // 132
  },                                                                                                                   // 133
  postsLayout: {                                                                                                       // 134
    type: String,                                                                                                      // 135
    optional: true,                                                                                                    // 136
    autoform: {                                                                                                        // 137
      group: "02_posts",                                                                                               // 138
      instructions: 'The layout used for post lists',                                                                  // 139
      options: [                                                                                                       // 140
        {value: 'posts-list', label: 'List'},                                                                          // 141
        {value: 'posts-grid', label: 'Grid'}                                                                           // 142
      ]                                                                                                                // 143
    }                                                                                                                  // 144
  },                                                                                                                   // 145
  postViews: {                                                                                                         // 146
    type: [String],                                                                                                    // 147
    optional: true,                                                                                                    // 148
    autoform: {                                                                                                        // 149
      group: "02_posts",                                                                                               // 150
      instructions: 'Posts views showed in the views menu',                                                            // 151
      editable: true,                                                                                                  // 152
      noselect: true,                                                                                                  // 153
      options: function () {                                                                                           // 154
        return _.map(Telescope.menuItems.get("viewsMenu"), function (item){                                            // 155
          return {                                                                                                     // 156
            value: item.route,                                                                                         // 157
            label: item.label                                                                                          // 158
          };                                                                                                           // 159
        });                                                                                                            // 160
      }                                                                                                                // 161
    }                                                                                                                  // 162
  },                                                                                                                   // 163
  postInterval: {                                                                                                      // 164
    type: Number,                                                                                                      // 165
    optional: true,                                                                                                    // 166
    defaultValue: 30,                                                                                                  // 167
    autoform: {                                                                                                        // 168
      group: "02_posts",                                                                                               // 169
      instructions: 'Minimum time between posts, in seconds (defaults to 30)'                                          // 170
    }                                                                                                                  // 171
  },                                                                                                                   // 172
  commentInterval: {                                                                                                   // 173
    type: Number,                                                                                                      // 174
    optional: true,                                                                                                    // 175
    defaultValue: 15,                                                                                                  // 176
    autoform: {                                                                                                        // 177
      group: "03_comments",                                                                                            // 178
      instructions: 'Minimum time between comments, in seconds (defaults to 15)'                                       // 179
    }                                                                                                                  // 180
  },                                                                                                                   // 181
  maxPostsPerDay: {                                                                                                    // 182
    type: Number,                                                                                                      // 183
    optional: true,                                                                                                    // 184
    defaultValue: 30,                                                                                                  // 185
    autoform: {                                                                                                        // 186
      group: "02_posts",                                                                                               // 187
      instructions: 'Maximum number of posts a user can post in a day (default to 30).'                                // 188
    }                                                                                                                  // 189
  },                                                                                                                   // 190
  startInvitesCount: {                                                                                                 // 191
    type: Number,                                                                                                      // 192
    defaultValue: 3,                                                                                                   // 193
    optional: true,                                                                                                    // 194
    autoform: {                                                                                                        // 195
      group: 'invites'                                                                                                 // 196
    }                                                                                                                  // 197
  },                                                                                                                   // 198
  postsPerPage: {                                                                                                      // 199
    type: Number,                                                                                                      // 200
    defaultValue: 10,                                                                                                  // 201
    optional: true,                                                                                                    // 202
    autoform: {                                                                                                        // 203
      group: "02_posts"                                                                                                // 204
    }                                                                                                                  // 205
  },                                                                                                                   // 206
  logoUrl: {                                                                                                           // 207
    type: String,                                                                                                      // 208
    optional: true,                                                                                                    // 209
    autoform: {                                                                                                        // 210
      group: "04_logo"                                                                                                 // 211
    }                                                                                                                  // 212
  },                                                                                                                   // 213
  logoHeight: {                                                                                                        // 214
    type: Number,                                                                                                      // 215
    optional: true,                                                                                                    // 216
    autoform: {                                                                                                        // 217
      group: "04_logo"                                                                                                 // 218
    }                                                                                                                  // 219
  },                                                                                                                   // 220
  logoWidth: {                                                                                                         // 221
    type: Number,                                                                                                      // 222
    optional: true,                                                                                                    // 223
    autoform: {                                                                                                        // 224
      group: "04_logo"                                                                                                 // 225
    }                                                                                                                  // 226
  },                                                                                                                   // 227
  faviconUrl: {                                                                                                        // 228
    type: String,                                                                                                      // 229
    optional: true,                                                                                                    // 230
    autoform: {                                                                                                        // 231
      group: "04_logo"                                                                                                 // 232
    }                                                                                                                  // 233
  },                                                                                                                   // 234
  language: {                                                                                                          // 235
    type: String,                                                                                                      // 236
    defaultValue: 'en',                                                                                                // 237
    optional: true,                                                                                                    // 238
    autoform: {                                                                                                        // 239
      group: "01_general",                                                                                             // 240
      instructions: 'The app\'s language. Defaults to English.',                                                       // 241
      options: function () {                                                                                           // 242
        var languages = _.map(TAPi18n.getLanguages(), function (item, key) {                                           // 243
          return {                                                                                                     // 244
            value: key,                                                                                                // 245
            label: item.name                                                                                           // 246
          };                                                                                                           // 247
        });                                                                                                            // 248
        return languages;                                                                                              // 249
      }                                                                                                                // 250
    }                                                                                                                  // 251
  },                                                                                                                   // 252
  backgroundCSS: {                                                                                                     // 253
    type: String,                                                                                                      // 254
    optional: true,                                                                                                    // 255
    autoform: {                                                                                                        // 256
      group: 'extras',                                                                                                 // 257
      instructions: 'CSS code for the <body>\'s "background" property',                                                // 258
      rows: 5                                                                                                          // 259
    }                                                                                                                  // 260
  },                                                                                                                   // 261
  accentColor: {                                                                                                       // 262
    type: String,                                                                                                      // 263
    optional: true,                                                                                                    // 264
    autoform: {                                                                                                        // 265
      group: "05_colors",                                                                                              // 266
      instructions: 'Used for button backgrounds.'                                                                     // 267
    }                                                                                                                  // 268
  },                                                                                                                   // 269
  accentContrastColor: {                                                                                               // 270
    type: String,                                                                                                      // 271
    optional: true,                                                                                                    // 272
    autoform: {                                                                                                        // 273
      group: "05_colors",                                                                                              // 274
      instructions: 'Used for button text.'                                                                            // 275
    }                                                                                                                  // 276
  },                                                                                                                   // 277
  secondaryColor: {                                                                                                    // 278
    type: String,                                                                                                      // 279
    optional: true,                                                                                                    // 280
    autoform: {                                                                                                        // 281
      group: "05_colors",                                                                                              // 282
      instructions: 'Used for the navigation background.'                                                              // 283
    }                                                                                                                  // 284
  },                                                                                                                   // 285
  secondaryContrastColor: {                                                                                            // 286
    type: String,                                                                                                      // 287
    optional: true,                                                                                                    // 288
    autoform: {                                                                                                        // 289
      group: "05_colors",                                                                                              // 290
      instructions: 'Used for header text.'                                                                            // 291
    }                                                                                                                  // 292
  },                                                                                                                   // 293
  fontUrl: {                                                                                                           // 294
    type: String,                                                                                                      // 295
    optional: true,                                                                                                    // 296
    autoform: {                                                                                                        // 297
      group: 'fonts',                                                                                                  // 298
      instructions: '@import URL (e.g. https://fonts.googleapis.com/css?family=Source+Sans+Pro)'                       // 299
    }                                                                                                                  // 300
  },                                                                                                                   // 301
  fontFamily: {                                                                                                        // 302
    type: String,                                                                                                      // 303
    optional: true,                                                                                                    // 304
    autoform: {                                                                                                        // 305
      group: 'fonts',                                                                                                  // 306
      instructions: 'font-family (e.g. "Source Sans Pro", sans-serif)'                                                 // 307
    }                                                                                                                  // 308
  },                                                                                                                   // 309
  twitterAccount: {                                                                                                    // 310
    type: String,                                                                                                      // 311
    optional: true,                                                                                                    // 312
    autoform: {                                                                                                        // 313
      group: "07_integrations"                                                                                         // 314
    }                                                                                                                  // 315
  },                                                                                                                   // 316
  googleAnalyticsId: {                                                                                                 // 317
    type: String,                                                                                                      // 318
    optional: true,                                                                                                    // 319
    autoform: {                                                                                                        // 320
      group: "07_integrations"                                                                                         // 321
    }                                                                                                                  // 322
  },                                                                                                                   // 323
  mixpanelId: {                                                                                                        // 324
    type: String,                                                                                                      // 325
    optional: true,                                                                                                    // 326
    autoform: {                                                                                                        // 327
      group: "07_integrations"                                                                                         // 328
    }                                                                                                                  // 329
  },                                                                                                                   // 330
  clickyId: {                                                                                                          // 331
    type: String,                                                                                                      // 332
    optional: true,                                                                                                    // 333
    autoform: {                                                                                                        // 334
      group: "07_integrations"                                                                                         // 335
    }                                                                                                                  // 336
  },                                                                                                                   // 337
  footerCode: {                                                                                                        // 338
    type: String,                                                                                                      // 339
    optional: true,                                                                                                    // 340
    autoform: {                                                                                                        // 341
      group: 'extras',                                                                                                 // 342
      instructions: 'Footer content (accepts Markdown).',                                                              // 343
      rows: 5                                                                                                          // 344
    }                                                                                                                  // 345
  },                                                                                                                   // 346
  extraCode: {                                                                                                         // 347
    type: String,                                                                                                      // 348
    optional: true,                                                                                                    // 349
    autoform: {                                                                                                        // 350
      group: 'extras',                                                                                                 // 351
      instructions: 'Any extra HTML code you want to include on every page.',                                          // 352
      rows: 5                                                                                                          // 353
    }                                                                                                                  // 354
  },                                                                                                                   // 355
  emailFooter: {                                                                                                       // 356
    type: String,                                                                                                      // 357
    optional: true,                                                                                                    // 358
    private: true,                                                                                                     // 359
    autoform: {                                                                                                        // 360
      group: "06_email",                                                                                               // 361
      instructions: 'Content that will appear at the bottom of outgoing emails (accepts HTML).',                       // 362
      rows: 5,                                                                                                         // 363
      class: "private-field"                                                                                           // 364
    }                                                                                                                  // 365
  },                                                                                                                   // 366
  notes: {                                                                                                             // 367
    type: String,                                                                                                      // 368
    optional: true,                                                                                                    // 369
    private: true,                                                                                                     // 370
    autoform: {                                                                                                        // 371
      group: 'extras',                                                                                                 // 372
      instructions: 'You can store any notes or extra information here.',                                              // 373
      rows: 5,                                                                                                         // 374
      class: "private-field"                                                                                           // 375
    }                                                                                                                  // 376
  },                                                                                                                   // 377
  debug: {                                                                                                             // 378
    type: Boolean,                                                                                                     // 379
    optional: true,                                                                                                    // 380
    autoform: {                                                                                                        // 381
      group: 'debug',                                                                                                  // 382
      instructions: 'Enable debug mode for more details console logs'                                                  // 383
    }                                                                                                                  // 384
  },                                                                                                                   // 385
  authMethods: {                                                                                                       // 386
    type: [String],                                                                                                    // 387
    optional: true,                                                                                                    // 388
    autoform: {                                                                                                        // 389
      group: 'auth',                                                                                                   // 390
      editable: true,                                                                                                  // 391
      noselect: true,                                                                                                  // 392
      options: [                                                                                                       // 393
        {                                                                                                              // 394
          value: 'email',                                                                                              // 395
          label: 'Email/Password'                                                                                      // 396
        },                                                                                                             // 397
        {                                                                                                              // 398
          value: 'twitter',                                                                                            // 399
          label: 'Twitter'                                                                                             // 400
        },                                                                                                             // 401
        {                                                                                                              // 402
          value: 'facebook',                                                                                           // 403
          label: 'Facebook'                                                                                            // 404
        }                                                                                                              // 405
      ],                                                                                                               // 406
      instructions: 'Authentication methods (default to email only)'                                                   // 407
    }                                                                                                                  // 408
  }                                                                                                                    // 409
});                                                                                                                    // 410
                                                                                                                       // 411
                                                                                                                       // 412
Settings.schema.internationalize();                                                                                    // 413
                                                                                                                       // 414
Settings.attachSchema(Settings.schema);                                                                                // 415
                                                                                                                       // 416
Settings.get = function(setting, defaultValue) {                                                                       // 417
  var settings = Settings.find().fetch()[0];                                                                           // 418
                                                                                                                       // 419
  if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // if on the server, look in Meteor.settings // 420
    return Meteor.settings[setting];                                                                                   // 421
                                                                                                                       // 422
  } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public
    return Meteor.settings.public[setting];                                                                            // 424
                                                                                                                       // 425
  } else if(settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection                   // 426
    return settings[setting];                                                                                          // 427
                                                                                                                       // 428
  } else if (typeof defaultValue !== 'undefined') { // fallback to default                                             // 429
    return  defaultValue;                                                                                              // 430
                                                                                                                       // 431
  } else { // or return undefined                                                                                      // 432
    return undefined;                                                                                                  // 433
  }                                                                                                                    // 434
};                                                                                                                     // 435
                                                                                                                       // 436
// use custom template for checkboxes - not working yet                                                                // 437
// if(Meteor.isClient){                                                                                                // 438
//   AutoForm.setDefaultTemplateForType('afCheckbox', 'settings');                                                     // 439
// }                                                                                                                   // 440
                                                                                                                       // 441
Meteor.startup(function () {                                                                                           // 442
  Settings.allow({                                                                                                     // 443
    insert: Users.is.adminById,                                                                                        // 444
    update: Users.is.adminById,                                                                                        // 445
    remove: Users.is.adminById                                                                                         // 446
  });                                                                                                                  // 447
});                                                                                                                    // 448
                                                                                                                       // 449
Meteor.startup(function () {                                                                                           // 450
  // override Meteor.absoluteUrl() with URL provided in settings                                                       // 451
  Meteor.absoluteUrl.defaultOptions.rootUrl = Settings.get('siteUrl', Meteor.absoluteUrl());                           // 452
  debug = Settings.get('debug', false);                                                                                // 453
});                                                                                                                    // 454
                                                                                                                       // 455
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/router.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
  // Settings                                                                                                          // 2
                                                                                                                       // 3
  Router.route('/settings', {                                                                                          // 4
    controller: Telescope.controllers.admin,                                                                           // 5
    name: 'settings',                                                                                                  // 6
    // layoutTemplate: 'adminLayout',                                                                                  // 7
    data: function () {                                                                                                // 8
      // we only have one set of settings for now                                                                      // 9
                                                                                                                       // 10
      var settings = Settings.findOne();                                                                               // 11
      return {                                                                                                         // 12
        hasSettings: !!settings,                                                                                       // 13
        settings: settings                                                                                             // 14
      };                                                                                                               // 15
    }                                                                                                                  // 16
  });                                                                                                                  // 17
});                                                                                                                    // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/menus.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Telescope.menuItems.add("adminMenu", [                                                                                 // 1
  {                                                                                                                    // 2
    route: 'settings',                                                                                                 // 3
    label: 'settings',                                                                                                 // 4
    description: 'telescope_settings_panel'                                                                            // 5
  }                                                                                                                    // 6
]);                                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/package-i18n.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
TAPi18n.packages["telescope:settings"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};   // 1
                                                                                                                       // 2
// define package's translation function (proxy to the i18next)                                                        // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                       // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/server/publications.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('settings', function() {                                                                                // 1
  var options = {};                                                                                                    // 2
  var privateFields = {};                                                                                              // 3
                                                                                                                       // 4
  // look at Settings.simpleSchema._schema to see which fields should be kept private                                  // 5
  _.each(Settings.simpleSchema._schema, function (property, key) {                                                     // 6
    if (property.private)                                                                                              // 7
      privateFields[key] = false;                                                                                      // 8
  });                                                                                                                  // 9
                                                                                                                       // 10
  if(!Users.is.adminById(this.userId)){                                                                                // 11
    options = _.extend(options, {                                                                                      // 12
      fields: privateFields                                                                                            // 13
    });                                                                                                                // 14
  }                                                                                                                    // 15
                                                                                                                       // 16
  return Settings.find({}, options);                                                                                   // 17
});                                                                                                                    // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Users/sacha/Dev/Telescope/packages/telescope-settings/i18n/en.i18n.js                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
// integrate the fallback language translations                                                                        // 8
translations = {};                                                                                                     // 9
translations[namespace] = {"settings_saved":"Settings saved"};                                                         // 10
TAPi18n._loadLangFileObject("en", translations);                                                                       // 11
                                                                                                                       // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:settings'] = {
  Settings: Settings
};

})();

//# sourceMappingURL=telescope_settings.js.map
