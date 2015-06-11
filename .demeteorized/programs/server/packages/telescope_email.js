(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var coreSubscriptions = Package['telescope:core'].coreSubscriptions;
var juice = Package['sacha:juice'].juice;
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
var html, Handlebars, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/email.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/**                                                                                                             // 1
 * Telescope Email namespace                                                                                    // 2
 * @namespace Email                                                                                             // 3
 */                                                                                                             // 4
Telescope.email = {};                                                                                           // 5
                                                                                                                // 6
var htmlToText = Npm.require('html-to-text');                                                                   // 7
                                                                                                                // 8
// for template "foo", check if "custom_foo" exists. If it does, use it instead                                 // 9
Telescope.email.getTemplate = function (template) {                                                             // 10
  var customEmailTemplate = Handlebars.templates["custom_"+template];                                           // 11
  if(typeof customEmailTemplate === 'function'){                                                                // 12
    return customEmailTemplate;                                                                                 // 13
  } else {                                                                                                      // 14
    return Handlebars.templates[template];                                                                      // 15
  }                                                                                                             // 16
};                                                                                                              // 17
                                                                                                                // 18
Telescope.email.buildTemplate = function (htmlContent) {                                                        // 19
                                                                                                                // 20
  var emailProperties = {                                                                                       // 21
    secondaryColor: Settings.get('secondaryColor', '#444444'),                                                  // 22
    accentColor: Settings.get('accentColor', '#DD3416'),                                                        // 23
    siteName: Settings.get('title'),                                                                            // 24
    tagline: Settings.get('tagline'),                                                                           // 25
    siteUrl: Telescope.utils.getSiteUrl(),                                                                      // 26
    body: htmlContent,                                                                                          // 27
    unsubscribe: '',                                                                                            // 28
    accountLink: Telescope.utils.getSiteUrl()+'account',                                                        // 29
    footer: Settings.get('emailFooter'),                                                                        // 30
    logoUrl: Settings.get('logoUrl'),                                                                           // 31
    logoHeight: Settings.get('logoHeight'),                                                                     // 32
    logoWidth: Settings.get('logoWidth')                                                                        // 33
  };                                                                                                            // 34
                                                                                                                // 35
  var emailHTML = Telescope.email.getTemplate("emailWrapper")(emailProperties);                                 // 36
                                                                                                                // 37
  var inlinedHTML = juice(emailHTML);                                                                           // 38
                                                                                                                // 39
  var doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
                                                                                                                // 41
  return doctype+inlinedHTML;                                                                                   // 42
};                                                                                                              // 43
                                                                                                                // 44
Telescope.email.send = function(to, subject, html, text){                                                       // 45
                                                                                                                // 46
  // TODO: limit who can send emails                                                                            // 47
  // TODO: fix this error: Error: getaddrinfo ENOTFOUND                                                         // 48
                                                                                                                // 49
  var from = Settings.get('defaultEmail', 'noreply@example.com');                                               // 50
  var siteName = Settings.get('title', 'Telescope');                                                            // 51
  subject = '['+siteName+'] '+subject;                                                                          // 52
                                                                                                                // 53
  if (typeof text === 'undefined'){                                                                             // 54
    // Auto-generate text version if it doesn't exist. Has bugs, but should be good enough.                     // 55
    var text = htmlToText.fromString(html, {                                                                    // 56
        wordwrap: 130                                                                                           // 57
    });                                                                                                         // 58
  }                                                                                                             // 59
                                                                                                                // 60
  console.log('//////// sending email…');                                                                       // 61
  console.log('from: '+from);                                                                                   // 62
  console.log('to: '+to);                                                                                       // 63
  console.log('subject: '+subject);                                                                             // 64
  // console.log('html: '+html);                                                                                // 65
  // console.log('text: '+text);                                                                                // 66
                                                                                                                // 67
  var email = {                                                                                                 // 68
    from: from,                                                                                                 // 69
    to: to,                                                                                                     // 70
    subject: subject,                                                                                           // 71
    text: text,                                                                                                 // 72
    html: html                                                                                                  // 73
  };                                                                                                            // 74
                                                                                                                // 75
  Email.send(email);                                                                                            // 76
                                                                                                                // 77
  return email;                                                                                                 // 78
};                                                                                                              // 79
                                                                                                                // 80
Telescope.email.buildAndSend = function (to, subject, template, properties) {                                   // 81
  var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(template)(properties));                  // 82
  return Telescope.email.send (to, subject, html);                                                              // 83
};                                                                                                              // 84
                                                                                                                // 85
Meteor.methods({                                                                                                // 86
  testEmail: function () {                                                                                      // 87
    if(Users.is.adminById(this.userId)){                                                                        // 88
      var email = Telescope.email.buildAndSend (Settings.get('defaultEmail'), 'Telescope email test', 'emailTest', {date: new Date()});
    }                                                                                                           // 90
  }                                                                                                             // 91
});                                                                                                             // 92
                                                                                                                // 93
function adminUserCreationNotification (user) {                                                                 // 94
  // send notifications to admins                                                                               // 95
  var admins = Users.adminUsers();                                                                              // 96
  admins.forEach(function(admin){                                                                               // 97
    if (Users.getSetting(admin, "notifications.users", false)) {                                                // 98
      var emailProperties = {                                                                                   // 99
        profileUrl: Users.getProfileUrl(user),                                                                  // 100
        username: Users.getUserName(user)                                                                       // 101
      };                                                                                                        // 102
      var html = Telescope.email.getTemplate('emailNewUser')(emailProperties);                                  // 103
      Telescope.email.send(Users.getEmail(admin), 'New user account: '+Users.getUserName(user), Telescope.email.buildTemplate(html));
    }                                                                                                           // 105
  });                                                                                                           // 106
  return user;                                                                                                  // 107
}                                                                                                               // 108
Telescope.callbacks.add("onCreateUser", adminUserCreationNotification);                                         // 109
                                                                                                                // 110
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/routes.js                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Meteor.startup(function () {                                                                                    // 1
                                                                                                                // 2
  // New user email                                                                                             // 3
                                                                                                                // 4
  Router.route('/email/new-user/:id?', {                                                                        // 5
    name: 'newUser',                                                                                            // 6
    where: 'server',                                                                                            // 7
    action: function() {                                                                                        // 8
      var user = Meteor.users.findOne(this.params.id);                                                          // 9
      var emailProperties = {                                                                                   // 10
        profileUrl: Users.getProfileUrl(user),                                                                  // 11
        username: Users.getUserName(user)                                                                       // 12
      };                                                                                                        // 13
      html = Telescope.email.getTemplate('emailNewUser')(emailProperties);                                      // 14
      this.response.write(Telescope.email.buildTemplate(html));                                                 // 15
      this.response.end();                                                                                      // 16
    }                                                                                                           // 17
  });                                                                                                           // 18
                                                                                                                // 19
  // New post email                                                                                             // 20
                                                                                                                // 21
  Router.route('/email/new-post/:id?', {                                                                        // 22
    name: 'newPost',                                                                                            // 23
    where: 'server',                                                                                            // 24
    action: function() {                                                                                        // 25
      var post = Posts.findOne(this.params.id);                                                                 // 26
      if (!!post) {                                                                                             // 27
        html = Telescope.email.getTemplate('emailNewPost')(Posts.getProperties(post));                          // 28
      } else {                                                                                                  // 29
        html = "<h3>No post found.</h3>"                                                                        // 30
      }                                                                                                         // 31
      this.response.write(Telescope.email.buildTemplate(html));                                                 // 32
      this.response.end();                                                                                      // 33
    }                                                                                                           // 34
  });                                                                                                           // 35
                                                                                                                // 36
                                                                                                                // 37
});                                                                                                             // 38
                                                                                                                // 39
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailAccountApproved.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">{{username}}, welcome to {{siteTitle}}!</span><br><br>\n\nYou've just been invited. <a href=\"{{siteUrl}}\">Start posting</a>.<br><br>");Handlebars.templates["emailAccountApproved"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailAccountApproved"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailInvite.js                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{invitedBy}}</a>\ninvited you to join {{communityName}}\n</span><br><br>\n\n{{#if newUser}}\n<a href=\"{{actionLink}}\">Join {{communityName}}</a>\n{{else}}\n<a href=\"{{actionLink}}\">Sign in to {{communityName}}</a>\n{{/if}}\n<br><br>\n");Handlebars.templates["emailInvite"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailInvite"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailNewComment.js                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{comment.author}}</a>\nleft a new comment on \n<a href=\"{{postLink}}\" class=\"action-link\">{{post.title}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{body}}}\n</div>\n<br>\n\n<a href=\"{{postCommentUrl}}\" class=\"action-link\">Discuss</a><br/><br/>");Handlebars.templates["emailNewComment"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewComment"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailNewPost.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{postAuthorName}}</a>\nhas created a new post:\n{{#if url}}\n  <a href=\"{{linkUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n{{else}}\n  {{postTitle}}}\n{{/if}}\n</span><br><br>\n\n{{#if htmlBody}}\n  <div class=\"post-body\">\n  {{{htmlBody}}}\n  </div>\n  <br>\n{{/if}}\n\n<a href=\"{{postUrl}}\">Discuss</a><br><br>\n");Handlebars.templates["emailNewPost"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewPost"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailNewPendingPost.js                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{postAuthorName}}</a>\nhas a new post pending approval:\n{{#if url}}\n  <a href=\"{{linkUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n{{else}}\n  {{postTitle}}}\n{{/if}}\n</span><br><br>\n\n{{#if htmlBody}}\n  <div class=\"post-body\">\n  {{{htmlBody}}}\n  </div>\n  <br>\n{{/if}}\n\n<a href=\"{{postUrl}}\">Go to post</a><br><br>\n");Handlebars.templates["emailNewPendingPost"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewPendingPost"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailPostApproved.js                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\nCongratulations, your post has been approved:\n</span>\n<br><br>\n<a href=\"{{postUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n<br><br>");Handlebars.templates["emailPostApproved"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailPostApproved"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailNewReply.js                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\"><a href=\"{{profileUrl}}\">{{comment.author}}</a>\nhas replied to your comment on\n<a href=\"{{postLink}}\" class=\"action-link\">{{post.title}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{body}}}\n</div>\n<br>\n\n<a href=\"{{postCommentUrl}}\" class=\"action-link\">Discuss</a><br/><br/>");Handlebars.templates["emailNewReply"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewReply"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailNewUser.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">A new user account has been created: <a href=\"{{profileUrl}}\">{{username}}</a></span><br><br>");Handlebars.templates["emailNewUser"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewUser"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailTest.js                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">This is just a test</span><br><br>\n\nSent at {{date}}.<br><br>");Handlebars.templates["emailTest"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailTest"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/lib/server/templates/handlebars.emailWrapper.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<html lang=\"en\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">    <!-- So that mobile webkit will display zoomed in -->\n    <meta name=\"format-detection\" content=\"telephone=no\"> <!-- disable auto telephone linking in iOS -->\n\n    <title>{{siteName}}</title>\n    <style type=\"text/css\">\n\n        /* Resets: see reset.css for details */\n        .ReadMsgBody { width: 100%; background-color: #ebebeb;}\n        .ExternalClass {width: 100%; background-color: #ebebeb;}\n        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height:100%;}\n        body {-webkit-text-size-adjust:none; -ms-text-size-adjust:none;}\n        body {margin:0; padding:0;}\n        table {border-spacing:0;}\n        table td {border-collapse:collapse;}\n        .yshortcuts a {border-bottom: none !important;}\n\n\n        /* Constrain email width for small screens */\n        @media screen and (max-width: 600px) {\n            table[class=\"container\"] {\n                width: 95% !important;\n            }\n            .main-container{\n              font-size: 14px !important;\n            }\n        }\n\n        /* Give content more room on mobile */\n        @media screen and (max-width: 480px) {\n            td[class=\"container-padding\"] {\n                padding-left: 12px !important;\n                padding-right: 12px !important;\n            }\n        }\n        a{\n          color: {{accentColor}};\n          font-weight: bold;\n          text-decoration: none;\n        }\n        .wrapper{\n          padding: 20px 0;\n        }\n        .container{\n          border-radius: 3px;\n        }\n        .heading-container{\n          background: {{secondaryColor}};\n          padding: 15px;\n          text-align: center;\n          border-radius: 3px 3px 0px 0px;\n        }\n        .heading-container, .logo{\n          text-align: center;\n          color: white;\n          font-family: Helvetica, sans-serif;\n          font-weight: bold;\n          font-size: 20px;\n        }\n        .main-container{\n          line-height: 1.7;\n          background: white;\n          padding: 0 30px;\n          font-size: 15px;\n          font-family: Helvetica, sans-serif;\n          color: #555;\n        }\n        .heading{\n          font-weight: bold;\n          font-size: 18px;\n          line-height: 1.5;\n          margin: 0;\n        }\n        .footer-container{\n          background: #ddd;\n          font-family: Helvetica, sans-serif;\n          padding: 30px;\n          color: #777;\n          border-radius: 0px 0px 3px 3px;\n          font-size: 13px;\n        }\n        .post-thumbnail{\n          height: 28px;\n          width: 37px;\n          vertical-align: top;\n        }\n        .post-body, .comment-body{\n          border-top: 1px solid #ddd;\n          border-bottom: 1px solid #ddd;\n          padding: 10px 0;\n        }\n    </style>\n</head>\n<body style=\"margin:0; padding:10px 0;\" bgcolor=\"#ebebeb\" leftmargin=\"0\" topmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">\n\n<br>\n\n<!-- 100% wrapper (grey background) -->\n<table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ebebeb\">\n  <tr>\n    <td class=\"wrapper\" align=\"center\" valign=\"top\" bgcolor=\"#ebebeb\" style=\"background-color: #ebebeb;\">\n\n      <!-- 600px container (white background) -->\n      <table border=\"0\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" class=\"container\" bgcolor=\"#ffffff\">\n        <tr>\n          <td class=\"heading-container\">\n            <a href=\"{{siteUrl}}\">\n              {{#if logoUrl}}\n                <img class=\"logo\" src=\"{{logoUrl}}\" height=\"{{logoHeight}}\" width=\"{{logoWidth}}\" alt=\"{{siteName}}\"/>\n              {{else}}\n                {{siteName}}\n              {{/if}}\n            </a>\n          </td>\n        </tr>\n        <tr>\n          <td class=\"main-container container-padding\" bgcolor=\"#ffffff\">\n            <br>\n\n            {{{body}}}\n\n          </td>\n        </tr>\n        <tr>\n          <td class=\"footer-container\">\n            <a href=\"{{accountLink}}\">Change your notifications settings</a><br/><br/>\n            {{{footer}}}\n          </td>\n        </tr>\n      </table>\n      <!--/600px container -->\n\n    </td>\n  </tr>\n</table>\n<!--/100% wrapper-->\n<br>\n<br>\n</body>\n</html>\n");Handlebars.templates["emailWrapper"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailWrapper"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/de.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_names["de"] = ["German","Deutsch"];                                                           // 8
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null}); // 9
TAPi18n.languages_names["en"] = ["English","English"];                                                          // 10
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                 // 11
  TAPi18n.translations["de"] = {};                                                                              // 12
}                                                                                                               // 13
                                                                                                                // 14
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                      // 15
  TAPi18n.translations["de"][namespace] = {};                                                                   // 16
}                                                                                                               // 17
                                                                                                                // 18
_.extend(TAPi18n.translations["de"][namespace], {"has_created_a_new_post":"has created a new post"});           // 19
                                                                                                                // 20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/en.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
// integrate the fallback language translations                                                                 // 8
translations = {};                                                                                              // 9
translations[namespace] = {"has_created_a_new_post":"has created a new post"};                                  // 10
TAPi18n._loadLangFileObject("en", translations);                                                                // 11
                                                                                                                // 12
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/es.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_names["es"] = ["Spanish (Spain)","Español"];                                                  // 8
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                 // 9
  TAPi18n.translations["es"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                      // 13
  TAPi18n.translations["es"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["es"][namespace], {"has_created_a_new_post":"has created a new post"});           // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/fr.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_names["fr"] = ["French (France)","Français"];                                                 // 8
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                 // 9
  TAPi18n.translations["fr"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                      // 13
  TAPi18n.translations["fr"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["fr"][namespace], {"has_created_a_new_post":"a créé un nouveau post"});           // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/it.i18n.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_names["it"] = ["Italian","Italiano"];                                                         // 8
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                 // 9
  TAPi18n.translations["it"] = {};                                                                              // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                      // 13
  TAPi18n.translations["it"][namespace] = {};                                                                   // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["it"][namespace], {"has_created_a_new_post":"has created a new post"});           // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:email/Users/sacha/Dev/Telescope/packages/telescope-email/i18n/zh-CN.i18n.js               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","中文"];                                                    // 8
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                              // 9
  TAPi18n.translations["zh-CN"] = {};                                                                           // 10
}                                                                                                               // 11
                                                                                                                // 12
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                   // 13
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                // 14
}                                                                                                               // 15
                                                                                                                // 16
_.extend(TAPi18n.translations["zh-CN"][namespace], {"has_created_a_new_post":"has created a new post"});        // 17
                                                                                                                // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:email'] = {};

})();

//# sourceMappingURL=telescope_email.js.map
