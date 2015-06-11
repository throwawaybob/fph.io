(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var coreSubscriptions = Package['telescope:core'].coreSubscriptions;
var MailChimp = Package['miro:mailchimp'].MailChimp;
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
var resetNewsletterSchedule, __, Campaigns, defaultFrequency, defaultPosts, getCampaignPosts, buildCampaign, scheduleNextCampaign, scheduleCampaign, addToMailChimpList, Handlebars, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/package-i18n.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
TAPi18n.packages["telescope:newsletter"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                       // 2
// define package's translation function (proxy to the i18next)                                                        // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                       // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/newsletter.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var campaignSchema = new SimpleSchema({                                                                                // 1
 _id: {                                                                                                                // 2
    type: String,                                                                                                      // 3
    optional: true                                                                                                     // 4
  },                                                                                                                   // 5
  createdAt: {                                                                                                         // 6
    type: Date,                                                                                                        // 7
    optional: true                                                                                                     // 8
  },                                                                                                                   // 9
  sentAt: {                                                                                                            // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  },                                                                                                                   // 13
  status: {                                                                                                            // 14
    type: String,                                                                                                      // 15
    optional: true                                                                                                     // 16
  },                                                                                                                   // 17
  posts: {                                                                                                             // 18
    type: [String],                                                                                                    // 19
    optional: true                                                                                                     // 20
  },                                                                                                                   // 21
  webHits: {                                                                                                           // 22
    type: Number,                                                                                                      // 23
    optional: true                                                                                                     // 24
  },                                                                                                                   // 25
});                                                                                                                    // 26
                                                                                                                       // 27
Campaigns = new Meteor.Collection("campaigns", {                                                                       // 28
  schema: campaignSchema                                                                                               // 29
});                                                                                                                    // 30
                                                                                                                       // 31
Posts.addField({                                                                                                       // 32
  fieldName: 'scheduledAt',                                                                                            // 33
  fieldSchema: {                                                                                                       // 34
    type: Date,                                                                                                        // 35
    optional: true,                                                                                                    // 36
    autoform: {                                                                                                        // 37
      omit: true                                                                                                       // 38
    }                                                                                                                  // 39
  }                                                                                                                    // 40
});                                                                                                                    // 41
                                                                                                                       // 42
Users.addField([                                                                                                       // 43
  {                                                                                                                    // 44
    fieldName: 'telescope.newsletter.showBanner',                                                                      // 45
    fieldSchema: {                                                                                                     // 46
      label: 'Show banner',                                                                                            // 47
      type: Boolean,                                                                                                   // 48
      optional: true,                                                                                                  // 49
      editableBy: ['admin', 'member'],                                                                                 // 50
      autoform: {                                                                                                      // 51
        omit: true                                                                                                     // 52
      }                                                                                                                // 53
    }                                                                                                                  // 54
  },                                                                                                                   // 55
  {                                                                                                                    // 56
    fieldName: 'telescope.newsletter.subscribeToNewsletter',                                                           // 57
    fieldSchema: {                                                                                                     // 58
      label: 'Subscribe to newsletter',                                                                                // 59
      type: Boolean,                                                                                                   // 60
      optional: true,                                                                                                  // 61
      editableBy: ['admin', 'member'],                                                                                 // 62
      autoform: {                                                                                                      // 63
        omit: true                                                                                                     // 64
      }                                                                                                                // 65
    }                                                                                                                  // 66
  }                                                                                                                    // 67
]);                                                                                                                    // 68
                                                                                                                       // 69
// Settings                                                                                                            // 70
                                                                                                                       // 71
Settings.addField([                                                                                                    // 72
  {                                                                                                                    // 73
    fieldName: 'enableNewsletter',                                                                                     // 74
    fieldSchema: {                                                                                                     // 75
      type: Boolean,                                                                                                   // 76
      optional: true,                                                                                                  // 77
      autoform: {                                                                                                      // 78
        group: 'newsletter',                                                                                           // 79
        instructions: 'Enable newsletter (requires restart).'                                                          // 80
      }                                                                                                                // 81
    }                                                                                                                  // 82
  },                                                                                                                   // 83
  {                                                                                                                    // 84
    fieldName: 'showBanner',                                                                                           // 85
    fieldSchema: {                                                                                                     // 86
      type: Boolean,                                                                                                   // 87
      optional: true,                                                                                                  // 88
      label: 'Newsletter banner',                                                                                      // 89
      autoform: {                                                                                                      // 90
        group: 'newsletter',                                                                                           // 91
        instructions: 'Show newsletter sign-up form on the front page.'                                                // 92
      }                                                                                                                // 93
    }                                                                                                                  // 94
  },                                                                                                                   // 95
  {                                                                                                                    // 96
    fieldName: "mailChimpAPIKey",                                                                                      // 97
    fieldSchema: {                                                                                                     // 98
      type: String,                                                                                                    // 99
      optional: true,                                                                                                  // 100
      private: true,                                                                                                   // 101
      autoform: {                                                                                                      // 102
        group: "newsletter",                                                                                           // 103
        class: "private-field"                                                                                         // 104
      }                                                                                                                // 105
    }                                                                                                                  // 106
  },                                                                                                                   // 107
  {                                                                                                                    // 108
    fieldName: 'mailChimpListId',                                                                                      // 109
    fieldSchema: {                                                                                                     // 110
      type: String,                                                                                                    // 111
      optional: true,                                                                                                  // 112
      private: true,                                                                                                   // 113
      autoform: {                                                                                                      // 114
        group: 'newsletter',                                                                                           // 115
        instructions: 'The ID of the list you want to send to.',                                                       // 116
        class: "private-field"                                                                                         // 117
      }                                                                                                                // 118
    }                                                                                                                  // 119
  },                                                                                                                   // 120
  {                                                                                                                    // 121
    fieldName: 'postsPerNewsletter',                                                                                   // 122
    fieldSchema: {                                                                                                     // 123
      type: Number,                                                                                                    // 124
      optional: true,                                                                                                  // 125
      autoform: {                                                                                                      // 126
        group: 'newsletter'                                                                                            // 127
      }                                                                                                                // 128
    }                                                                                                                  // 129
  },                                                                                                                   // 130
  {                                                                                                                    // 131
    fieldName: 'newsletterFrequency',                                                                                  // 132
    fieldSchema: {                                                                                                     // 133
      type: Number,                                                                                                    // 134
      optional: true,                                                                                                  // 135
      autoform: {                                                                                                      // 136
        group: 'newsletter',                                                                                           // 137
        instructions: 'Defaults to once a week. Changes require restarting your app to take effect.',                  // 138
        options: [                                                                                                     // 139
          {                                                                                                            // 140
            value: 1,                                                                                                  // 141
            label: 'Every Day'                                                                                         // 142
          },                                                                                                           // 143
          {                                                                                                            // 144
            value: 2,                                                                                                  // 145
            label: 'Mondays, Wednesdays, Fridays'                                                                      // 146
          },                                                                                                           // 147
          {                                                                                                            // 148
            value: 3,                                                                                                  // 149
            label: 'Mondays & Thursdays'                                                                               // 150
          },                                                                                                           // 151
          {                                                                                                            // 152
            value: 7,                                                                                                  // 153
            label: 'Once a week (Mondays)'                                                                             // 154
          }                                                                                                            // 155
        ]                                                                                                              // 156
      }                                                                                                                // 157
    }                                                                                                                  // 158
  },                                                                                                                   // 159
  {                                                                                                                    // 160
    fieldName: 'newsletterTime',                                                                                       // 161
    fieldSchema: {                                                                                                     // 162
      type: String,                                                                                                    // 163
      optional: true,                                                                                                  // 164
      defaultValue: '00:00',                                                                                           // 165
      autoform: {                                                                                                      // 166
        group: 'newsletter',                                                                                           // 167
        instructions: 'Defaults to 00:00/12:00 AM. Time to send out newsletter if enabled.',                           // 168
        type: 'time'                                                                                                   // 169
      }                                                                                                                // 170
    }                                                                                                                  // 171
  },                                                                                                                   // 172
  {                                                                                                                    // 173
    fieldName: 'autoSubscribe',                                                                                        // 174
    fieldSchema: {                                                                                                     // 175
      type: Boolean,                                                                                                   // 176
      optional: true,                                                                                                  // 177
      autoform: {                                                                                                      // 178
        group: 'newsletter',                                                                                           // 179
        instructions: 'Automatically subscribe new users on sign-up.'                                                  // 180
      }                                                                                                                // 181
    }                                                                                                                  // 182
  }                                                                                                                    // 183
]);                                                                                                                    // 184
                                                                                                                       // 185
// create new "campaign" lens for all posts from the past X days that haven't been scheduled yet                       // 186
Posts.views.add("campaign", function (terms) {                                                                         // 187
  return {                                                                                                             // 188
    find: {                                                                                                            // 189
      scheduledAt: {$exists: false},                                                                                   // 190
      postedAt: {                                                                                                      // 191
        $gte: terms.after                                                                                              // 192
      }                                                                                                                // 193
    },                                                                                                                 // 194
    options: {sort: {sticky: -1, score: -1}}                                                                           // 195
  };                                                                                                                   // 196
});                                                                                                                    // 197
                                                                                                                       // 198
Telescope.modules.add("hero", {                                                                                        // 199
  template: 'newsletter_banner',                                                                                       // 200
  order: 10                                                                                                            // 201
});                                                                                                                    // 202
                                                                                                                       // 203
 function subscribeUserOnProfileCompletion (user) {                                                                    // 204
  if (!!Settings.get('autoSubscribe') && !!Users.getEmail(user)) {                                                     // 205
    addToMailChimpList(user, false, function (error, result) {                                                         // 206
      console.log(error);                                                                                              // 207
      console.log(result);                                                                                             // 208
    });                                                                                                                // 209
  }                                                                                                                    // 210
  return user;                                                                                                         // 211
}                                                                                                                      // 212
Telescope.callbacks.add("profileCompletedAsync", subscribeUserOnProfileCompletion);                                    // 213
                                                                                                                       // 214
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/campaign.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
defaultFrequency = 7;                                                                                                  // 1
defaultPosts = 5;                                                                                                      // 2
                                                                                                                       // 3
getCampaignPosts = function (postsCount) {                                                                             // 4
                                                                                                                       // 5
  // look for last scheduled campaign in the database                                                                  // 6
  var lastCampaign = SyncedCron._collection.findOne({name: 'Schedule newsletter'}, {sort: {finishedAt: -1}, limit: 1});
                                                                                                                       // 8
  // if there is a last campaign use its date, else default to posts from the last 7 days                              // 9
  var lastWeek = moment().subtract(7, 'days').toDate();                                                                // 10
  var after = (typeof lastCampaign !== 'undefined') ? lastCampaign.finishedAt : lastWeek                               // 11
                                                                                                                       // 12
  var params = Posts.getSubParams({                                                                                    // 13
    view: 'campaign',                                                                                                  // 14
    limit: postsCount,                                                                                                 // 15
    after: after                                                                                                       // 16
  });                                                                                                                  // 17
  return Posts.find(params.find, params.options).fetch();                                                              // 18
};                                                                                                                     // 19
                                                                                                                       // 20
buildCampaign = function (postsArray) {                                                                                // 21
  var postsHTML = '', subject = '';                                                                                    // 22
                                                                                                                       // 23
  // 1. Iterate through posts and pass each of them through a handlebars template                                      // 24
  postsArray.forEach(function (post, index) {                                                                          // 25
    if(index > 0)                                                                                                      // 26
      subject += ', ';                                                                                                 // 27
                                                                                                                       // 28
    subject += post.title;                                                                                             // 29
                                                                                                                       // 30
    var postUser = Meteor.users.findOne(post.userId);                                                                  // 31
                                                                                                                       // 32
    // the naked post object as stored in the database is missing a few properties, so let's add them                  // 33
    var properties = _.extend(post, {                                                                                  // 34
      authorName: Users.getDisplayName(post),                                                                          // 35
      postLink: Posts.getLink(post),                                                                                   // 36
      profileUrl: Users.getProfileUrl(postUser),                                                                       // 37
      postPageLink: Posts.getPageUrl(post),                                                                            // 38
      date: moment(post.postedAt).format("MMMM D YYYY")                                                                // 39
    });                                                                                                                // 40
                                                                                                                       // 41
    if (post.body)                                                                                                     // 42
      properties.body = marked(Telescope.utils.trimWords(post.body, 20)).replace('<p>', '').replace('</p>', ''); // remove p tags
                                                                                                                       // 44
    if(post.url)                                                                                                       // 45
      properties.domain = Telescope.utils.getDomain(post.url);                                                         // 46
                                                                                                                       // 47
    postsHTML += Telescope.email.getTemplate('emailPostItem')(properties);                                             // 48
  });                                                                                                                  // 49
                                                                                                                       // 50
  // 2. Wrap posts HTML in digest template                                                                             // 51
  var digestHTML = Telescope.email.getTemplate('emailDigest')({                                                        // 52
    siteName: Settings.get('title'),                                                                                   // 53
    date: moment().format("dddd, MMMM Do YYYY"),                                                                       // 54
    content: postsHTML                                                                                                 // 55
  });                                                                                                                  // 56
                                                                                                                       // 57
  // 3. wrap digest HTML in email wrapper template                                                                     // 58
  var emailHTML = Telescope.email.buildTemplate(digestHTML);                                                           // 59
                                                                                                                       // 60
  var campaign = {                                                                                                     // 61
    postIds: _.pluck(postsArray, '_id'),                                                                               // 62
    subject: Telescope.utils.trimWords(subject, 15),                                                                   // 63
    html: emailHTML                                                                                                    // 64
  };                                                                                                                   // 65
                                                                                                                       // 66
  return campaign;                                                                                                     // 67
};                                                                                                                     // 68
                                                                                                                       // 69
scheduleNextCampaign = function (isTest) {                                                                             // 70
  isTest = !! isTest;                                                                                                  // 71
  var posts = getCampaignPosts(Settings.get('postsPerNewsletter', defaultPosts));                                      // 72
  if(!!posts.length){                                                                                                  // 73
    return scheduleCampaign(buildCampaign(posts), isTest);                                                             // 74
  }else{                                                                                                               // 75
    var result = 'No posts to schedule today…';                                                                        // 76
    return result;                                                                                                     // 77
  }                                                                                                                    // 78
};                                                                                                                     // 79
                                                                                                                       // 80
Meteor.methods({                                                                                                       // 81
  sendCampaign: function () {                                                                                          // 82
    if(Users.is.adminById(this.userId))                                                                                // 83
      return scheduleNextCampaign(false);                                                                              // 84
  },                                                                                                                   // 85
  testCampaign: function () {                                                                                          // 86
    if(Users.is.adminById(this.userId))                                                                                // 87
      return scheduleNextCampaign(true);                                                                               // 88
  }                                                                                                                    // 89
});                                                                                                                    // 90
                                                                                                                       // 91
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/cron.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
SyncedCron.options = {                                                                                                 // 1
  log: false,                                                                                                          // 2
  collectionName: 'cronHistory',                                                                                       // 3
  utc: false,                                                                                                          // 4
  collectionTTL: 172800                                                                                                // 5
};                                                                                                                     // 6
                                                                                                                       // 7
var defaultFrequency = 7; // once a week                                                                               // 8
var defaultTime = '00:00';                                                                                             // 9
                                                                                                                       // 10
var getSchedule = function (parser) {                                                                                  // 11
  var frequency = Settings.get('newsletterFrequency', defaultFrequency);                                               // 12
  var recur = parser.recur();                                                                                          // 13
  var schedule;                                                                                                        // 14
  switch (frequency) {                                                                                                 // 15
    case 1: // every day                                                                                               // 16
      // sched = {schedules: [{dw: [1,2,3,4,5,6,0]}]};                                                                 // 17
      schedule = recur.on(1,2,3,4,5,6,0).dayOfWeek();                                                                  // 18
      break;                                                                                                           // 19
                                                                                                                       // 20
    case 2: // Mondays, Wednesdays, Fridays                                                                            // 21
      // sched = {schedules: [{dw: [2,4,6]}]};                                                                         // 22
      schedule = recur.on(2,4,6).dayOfWeek();                                                                          // 23
      break;                                                                                                           // 24
                                                                                                                       // 25
    case 3: // Mondays, Thursdays                                                                                      // 26
      // sched = {schedules: [{dw: [2,5]}]};                                                                           // 27
      schedule = recur.on(2,5).dayOfWeek();                                                                            // 28
      break;                                                                                                           // 29
                                                                                                                       // 30
    case 7: // Once a week (Mondays)                                                                                   // 31
      // sched = {schedules: [{dw: [2]}]};                                                                             // 32
      schedule = recur.on(2).dayOfWeek();                                                                              // 33
      break;                                                                                                           // 34
                                                                                                                       // 35
    default: // Once a week (Mondays)                                                                                  // 36
      schedule = recur.on(2).dayOfWeek();                                                                              // 37
  }                                                                                                                    // 38
  return schedule.on(Settings.get('newsletterTime', defaultTime)).time();                                              // 39
};                                                                                                                     // 40
                                                                                                                       // 41
Meteor.methods({                                                                                                       // 42
  getNextJob: function () {                                                                                            // 43
    var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');                                                // 44
    console.log(nextJob);                                                                                              // 45
    return nextJob;                                                                                                    // 46
  }                                                                                                                    // 47
});                                                                                                                    // 48
                                                                                                                       // 49
var addJob = function () {                                                                                             // 50
  SyncedCron.add({                                                                                                     // 51
    name: 'scheduleNewsletter',                                                                                        // 52
    schedule: function(parser) {                                                                                       // 53
      // parser is a later.parse object                                                                                // 54
      return getSchedule(parser);                                                                                      // 55
    },                                                                                                                 // 56
    job: function() {                                                                                                  // 57
      scheduleNextCampaign();                                                                                          // 58
    }                                                                                                                  // 59
  });                                                                                                                  // 60
};                                                                                                                     // 61
Meteor.startup(function () {                                                                                           // 62
  if (Settings.get('enableNewsletter', false)) {                                                                       // 63
    addJob();                                                                                                          // 64
  }                                                                                                                    // 65
});                                                                                                                    // 66
                                                                                                                       // 67
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/mailchimp.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var htmlToText = Npm.require('html-to-text');                                                                          // 1
                                                                                                                       // 2
scheduleCampaign = function (campaign, isTest) {                                                                       // 3
  var isTest = typeof isTest === 'undefined' ? false : isTest;                                                         // 4
                                                                                                                       // 5
  var apiKey = Settings.get('mailChimpAPIKey');                                                                        // 6
  var listId = Settings.get('mailChimpListId');                                                                        // 7
                                                                                                                       // 8
  if(!!apiKey && !!listId){                                                                                            // 9
                                                                                                                       // 10
		var wordCount = 15;                                                                                                  // 11
		var subject = campaign.subject;                                                                                      // 12
		while (subject.length >= 150){                                                                                       // 13
			subject = Telescope.utils.trimWords(subject, wordCount);                                                            // 14
			wordCount--;                                                                                                        // 15
		}                                                                                                                    // 16
                                                                                                                       // 17
    try {                                                                                                              // 18
                                                                                                                       // 19
      var api = new MailChimp(apiKey);                                                                                 // 20
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});                                                // 21
      var defaultEmail = Settings.get('defaultEmail');                                                                 // 22
      var campaignOptions = {                                                                                          // 23
        type: 'regular',                                                                                               // 24
        options: {                                                                                                     // 25
          list_id: listId,                                                                                             // 26
          subject: subject,                                                                                            // 27
          from_email: defaultEmail,                                                                                    // 28
          from_name: Settings.get('title')+ ' Top Posts',                                                              // 29
        },                                                                                                             // 30
        content: {                                                                                                     // 31
          html: campaign.html,                                                                                         // 32
          text: text                                                                                                   // 33
        }                                                                                                              // 34
      };                                                                                                               // 35
                                                                                                                       // 36
      console.log( '// Creating campaign…');                                                                           // 37
                                                                                                                       // 38
      // create campaign                                                                                               // 39
      var mailchimpCampaign = api.call( 'campaigns', 'create', campaignOptions);                                       // 40
                                                                                                                       // 41
      console.log( '// Campaign created');                                                                             // 42
      // console.log(campaign)                                                                                         // 43
                                                                                                                       // 44
      var scheduledTime = moment().utcOffset(0).add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");                         // 45
                                                                                                                       // 46
      var scheduleOptions = {                                                                                          // 47
        cid: mailchimpCampaign.id,                                                                                     // 48
        schedule_time: scheduledTime                                                                                   // 49
      };                                                                                                               // 50
                                                                                                                       // 51
      // schedule campaign                                                                                             // 52
      var schedule = api.call('campaigns', 'schedule', scheduleOptions);                                               // 53
                                                                                                                       // 54
      console.log('// Campaign scheduled for '+scheduledTime);                                                         // 55
      // console.log(schedule)                                                                                         // 56
                                                                                                                       // 57
      // if this is not a test, mark posts as sent                                                                     // 58
      if (!isTest)                                                                                                     // 59
        var updated = Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})   // 60
                                                                                                                       // 61
      // send confirmation email                                                                                       // 62
      var confirmationHtml = Telescope.email.getTemplate('emailDigestConfirmation')({                                  // 63
        time: scheduledTime,                                                                                           // 64
        newsletterLink: mailchimpCampaign.archive_url,                                                                 // 65
        subject: subject                                                                                               // 66
      });                                                                                                              // 67
      Telescope.email.send(defaultEmail, 'Newsletter scheduled', Telescope.email.buildTemplate(confirmationHtml));     // 68
                                                                                                                       // 69
    } catch (error) {                                                                                                  // 70
      console.log(error);                                                                                              // 71
    }                                                                                                                  // 72
    return subject;                                                                                                    // 73
  }                                                                                                                    // 74
};                                                                                                                     // 75
                                                                                                                       // 76
addToMailChimpList = function(userOrEmail, confirm, done){                                                             // 77
                                                                                                                       // 78
  var user, email;                                                                                                     // 79
                                                                                                                       // 80
  var confirm = (typeof confirm === 'undefined') ? false : confirm; // default to no confirmation                      // 81
                                                                                                                       // 82
  // not sure if it's really necessary that the function take both user and email?                                     // 83
  if (typeof userOrEmail === "string") {                                                                               // 84
    user = null;                                                                                                       // 85
    email = userOrEmail;                                                                                               // 86
  } else if (typeof userOrEmail === "object") {                                                                        // 87
    user = userOrEmail;                                                                                                // 88
    email = Users.getEmail(user);                                                                                      // 89
    if (!email)                                                                                                        // 90
      throw 'User must have an email address';                                                                         // 91
  }                                                                                                                    // 92
                                                                                                                       // 93
  var apiKey = Settings.get('mailChimpAPIKey');                                                                        // 94
  var listId = Settings.get('mailChimpListId');                                                                        // 95
                                                                                                                       // 96
  // add a user to a MailChimp list.                                                                                   // 97
  // called when a new user is created, or when an existing user fills in their email                                  // 98
  if(!!apiKey && !!listId){                                                                                            // 99
                                                                                                                       // 100
    try {                                                                                                              // 101
                                                                                                                       // 102
      console.log('// Adding "'+email+'" to MailChimp list…');                                                         // 103
                                                                                                                       // 104
      var api = new MailChimp(apiKey);                                                                                 // 105
      var subscribeOptions = {                                                                                         // 106
        id: listId,                                                                                                    // 107
        email: {"email": email},                                                                                       // 108
        double_optin: confirm                                                                                          // 109
      };                                                                                                               // 110
                                                                                                                       // 111
      // subscribe user                                                                                                // 112
      var subscribe = api.call('lists', 'subscribe', subscribeOptions);                                                // 113
                                                                                                                       // 114
      // mark user as subscribed                                                                                       // 115
      if (!!user) {                                                                                                    // 116
        Users.setSetting(user, 'newsletter.subscribeToNewsletter', true);                                              // 117
      }                                                                                                                // 118
                                                                                                                       // 119
      console.log("// User subscribed");                                                                               // 120
                                                                                                                       // 121
      return subscribe;                                                                                                // 122
                                                                                                                       // 123
    } catch (error) {                                                                                                  // 124
      throw new Meteor.Error("subscription-failed", error.message);                                                    // 125
    }                                                                                                                  // 126
  }                                                                                                                    // 127
};                                                                                                                     // 128
                                                                                                                       // 129
Meteor.methods({                                                                                                       // 130
  addCurrentUserToMailChimpList: function(){                                                                           // 131
    var currentUser = Meteor.users.findOne(this.userId);                                                               // 132
    try {                                                                                                              // 133
      return addToMailChimpList(currentUser, false);                                                                   // 134
    } catch (error) {                                                                                                  // 135
      throw new Meteor.Error(500, error.message);                                                                      // 136
    }                                                                                                                  // 137
  },                                                                                                                   // 138
  addEmailToMailChimpList: function (email) {                                                                          // 139
    if (Users.is.adminById(this.userId)) {                                                                             // 140
      try {                                                                                                            // 141
        return addToMailChimpList(email, true);                                                                        // 142
      } catch (error) {                                                                                                // 143
        throw new Meteor.Error(500, error.message);                                                                    // 144
      }                                                                                                                // 145
    }                                                                                                                  // 146
  }                                                                                                                    // 147
});                                                                                                                    // 148
                                                                                                                       // 149
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/routes.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
                                                                                                                       // 2
  Router.route('/email/campaign', {                                                                                    // 3
    name: 'campaign',                                                                                                  // 4
    where: 'server',                                                                                                   // 5
    action: function() {                                                                                               // 6
      var campaign = buildCampaign(getCampaignPosts(Settings.get('postsPerNewsletter', 5)));                           // 7
      var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
      var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
                                                                                                                       // 10
      this.response.write(campaignSubject+campaignSchedule+campaign.html);                                             // 11
      this.response.end();                                                                                             // 12
    }                                                                                                                  // 13
  });                                                                                                                  // 14
                                                                                                                       // 15
  Router.route('/email/digest-confirmation', {                                                                         // 16
    name: 'digestConfirmation',                                                                                        // 17
    where: 'server',                                                                                                   // 18
    action: function() {                                                                                               // 19
      var confirmationHtml = Telescope.email.getTemplate('emailDigestConfirmation')({                                  // 20
        time: 'January 1st, 1901',                                                                                     // 21
        newsletterLink: 'http://example.com',                                                                          // 22
        subject: 'Lorem ipsum dolor sit amet'                                                                          // 23
      });                                                                                                              // 24
      this.response.write(Telescope.email.buildTemplate(confirmationHtml));                                            // 25
      this.response.end();                                                                                             // 26
    }                                                                                                                  // 27
  });                                                                                                                  // 28
                                                                                                                       // 29
});                                                                                                                    // 30
                                                                                                                       // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailDigest.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<style type=\"text/css\">\n  .email-digest{\n  }\n  .digest-date{\n    color: #999;\n    font-weight: normal;\n    font-size: 16px;\n  }\n  .post-item{\n    border-top: 1px solid #ddd;\n  }\n  .post-date{\n    font-size: 13px;\n    color: #999;\n  }\n  .post-title{\n    font-size: 18px;\n    line-height: 1.6;\n  }\n  .post-thumbnail{\n  }\n  .post-meta{\n    font-size: 13px;\n    color: #999;\n    margin: 5px 0;\n  }\n  .post-meta a{\n    color: #333;\n  }  \n  .post-domain{\n    font-weight: bold;\n  }\n  .post-body-excerpt{\n    font-size: 14px;\n  }\n  .post-body-excerpt p{\n    margin: 0;\n  }\n</style>\n\n<span class=\"heading\">Recently on {{siteName}}</span>\n<span class=\"digest-date\">– {{date}}</span>\n<br><br>\n\n<div class=\"email-digest\">\n  {{{content}}}\n</div>\n<br>");Handlebars.templates["emailDigest"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailDigest"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailDigestConfirmation.js                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">Newsletter scheduled for {{time}}</span><br><br>\n\n<a href=\"{{newsletterLink}}\">{{subject}}</a><br><br>");Handlebars.templates["emailDigestConfirmation"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailDigestConfirmation"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailPostItem.js                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<div class=\"post-item\">\n<br >\n\n<span class=\"post-title\">\n  {{#if thumbnailUrl}}\n    <img class=\"post-thumbnail\" src=\"http:{{thumbnailUrl}}\"/>&nbsp;\n  {{/if}}\n\n  <a href=\"{{postLink}}\" target=\"_blank\">{{title}}</a>\n</span>\n\n<div class=\"post-meta\">\n  {{#if domain}}\n    <a class=\"post-domain\" href=\"\">{{domain}}</a>\n    | \n  {{/if}}\n  <span class=\"post-submitted\">Submitted by <a href=\"{{profileUrl}}\" class=\"comment-link\" target=\"_blank\">{{authorName}}</a></span>\n  <span class=\"post-date\">on {{date}}</span>\n  |\n  <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">{{commentCount}} Comments</a>\n</div>\n\n\n{{#if body}}\n  <div class=\"post-body-excerpt\">\n    {{{htmlBody}}}\n    <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">Read more</a>\n  </div>\n{{/if}}\n\n\n<br>\n</div>\n\n");Handlebars.templates["emailPostItem"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailPostItem"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/de.i18n.js               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                        // 8
  TAPi18n.translations["de"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                             // 12
  TAPi18n.translations["de"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["de"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
                                                                                                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/en.i18n.js               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
// integrate the fallback language translations                                                                        // 8
translations = {};                                                                                                     // 9
translations[namespace] = {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!","newsletter":"newsletter","showBanner":"Show Banner","mailChimpAPIKey":"MailChimp API Key","mailChimpListId":"MailChimp List ID","postsPerNewsletter":"Posts per Newsletter","newsletterFrequency":"Newsletter Frequency","newsletterTime":"Newsletter Time","enableNewsletter":"Enable Newsletter","autoSubscribe":"Auto Subscribe"};
TAPi18n._loadLangFileObject("en", translations);                                                                       // 11
                                                                                                                       // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/es.i18n.js               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                        // 8
  TAPi18n.translations["es"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                             // 12
  TAPi18n.translations["es"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["es"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
                                                                                                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/fr.i18n.js               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                        // 8
  TAPi18n.translations["fr"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                             // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["fr"][namespace], {"receive_the_best_of":"Recevez le meilleur de","right_in_your_inbox":"par email.","get_newsletter":"S'abonner à la newsletter","thanks_for_subscribing":"Merci pour votre abonnement!","newsletter":"newsletter","showBanner":"Afficher la Bannière","mailChimpAPIKey":"Clé API MailChimp","mailChimpListId":"ID Liste MailChimp","postsPerNewsletter":"Posts par Newsletter","newsletterFrequency":"Fréquence de la Newsletter"});
                                                                                                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/it.i18n.js               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                        // 8
  TAPi18n.translations["it"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                             // 12
  TAPi18n.translations["it"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["it"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
                                                                                                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Users/sacha/Dev/Telescope/packages/telescope-newsletter/i18n/zh-CN.i18n.js            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                     // 8
  TAPi18n.translations["zh-CN"] = {};                                                                                  // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                          // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                       // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
                                                                                                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:newsletter'] = {
  resetNewsletterSchedule: resetNewsletterSchedule
};

})();

//# sourceMappingURL=telescope_newsletter.js.map
