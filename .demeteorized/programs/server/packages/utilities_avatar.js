(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Gravatar = Package['jparker:gravatar'].Gravatar;

/* Package-scope variables */
var Avatar, getDescendantProp, getService, getGravatarUrl, getEmailOrHash;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/utilities:avatar/utils.js                                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string     // 1
getDescendantProp = function (obj, desc) {                                                                       // 2
  var arr = desc.split(".");                                                                                     // 3
  while(arr.length && (obj = obj[arr.shift()]));                                                                 // 4
  return obj;                                                                                                    // 5
};                                                                                                               // 6
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/utilities:avatar/export.js                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// Avatar object to be exported                                                                                  // 1
Avatar = {                                                                                                       // 2
                                                                                                                 // 3
  // If defined (e.g. from a startup config file in your app), these options                                     // 4
  // override default functionality                                                                              // 5
  options: {                                                                                                     // 6
                                                                                                                 // 7
    // Determines the type of fallback to use when no image can be found via                                     // 8
    // linked services (Gravatar included):                                                                      // 9
    //   "default image" (the default option, which will show either the image                                   // 10
    //   specified by defaultImageUrl, the package's default image, or a Gravatar                                // 11
    //   default image)                                                                                          // 12
    //     OR                                                                                                    // 13
    //   "initials" (show the user's initials).                                                                  // 14
    fallbackType: '',                                                                                            // 15
                                                                                                                 // 16
    // This will replace the included default avatar image's URL                                                 // 17
    // ('packages/bengott_avatar/default.png'). It can be a relative path                                        // 18
    // (relative to website's base URL, e.g. 'images/defaultAvatar.png').                                        // 19
    defaultImageUrl: '',                                                                                         // 20
                                                                                                                 // 21
    // This property name will be used to fetch an avatar url from the user's profile                            // 22
    // (e.g. 'avatar'). If this property is set and a property of that name exists                               // 23
    // on the user's profile (e.g. user.profile.avatar) that property will be used                               // 24
    // as the avatar url.                                                                                        // 25
    customImageProperty: '',                                                                                     // 26
                                                                                                                 // 27
    // Gravatar default option to use (overrides default image URL)                                              // 28
    // Options are available at:                                                                                 // 29
    // https://secure.gravatar.com/site/implement/images/#default-image                                          // 30
    gravatarDefault: '',                                                                                         // 31
                                                                                                                 // 32
    // This property on the user object will be used for retrieving gravatars                                    // 33
    // (useful when user emails are not published).                                                              // 34
    emailHashProperty: ''                                                                                        // 35
  },                                                                                                             // 36
                                                                                                                 // 37
  // Get the initials of the user                                                                                // 38
  getInitials: function (user) {                                                                                 // 39
                                                                                                                 // 40
    var initials = '';                                                                                           // 41
    var name = '';                                                                                               // 42
    var parts = [];                                                                                              // 43
                                                                                                                 // 44
    if (user && user.profile && user.profile.firstName) {                                                        // 45
      initials = user.profile.firstName.charAt(0).toUpperCase();                                                 // 46
                                                                                                                 // 47
      if (user.profile.lastName) {                                                                               // 48
        initials += user.profile.lastName.charAt(0).toUpperCase();                                               // 49
      }                                                                                                          // 50
      else if (user.profile.familyName) {                                                                        // 51
        initials += user.profile.familyName.charAt(0).toUpperCase();                                             // 52
      }                                                                                                          // 53
      else if (user.profile.secondName) {                                                                        // 54
        initials += user.profile.secondName.charAt(0).toUpperCase();                                             // 55
      }                                                                                                          // 56
    }                                                                                                            // 57
    else {                                                                                                       // 58
      if (user && user.profile && user.profile.name) {                                                           // 59
        name = user.profile.name;                                                                                // 60
      }                                                                                                          // 61
      else if (user && user.username) {                                                                          // 62
        name = user.username;                                                                                    // 63
      }                                                                                                          // 64
                                                                                                                 // 65
      parts = name.split(' ');                                                                                   // 66
      // Limit getInitials to first and last initial to avoid problems with                                      // 67
      // very long multi-part names (e.g. "Jose Manuel Garcia Galvez")                                           // 68
      initials = _.first(parts).charAt(0).toUpperCase();                                                         // 69
      if (parts.length > 1) {                                                                                    // 70
        initials += _.last(parts).charAt(0).toUpperCase();                                                       // 71
      }                                                                                                          // 72
    }                                                                                                            // 73
                                                                                                                 // 74
    return initials;                                                                                             // 75
  },                                                                                                             // 76
                                                                                                                 // 77
  // Get the url of the user's avatar                                                                            // 78
  getUrl: function (user) {                                                                                      // 79
                                                                                                                 // 80
    var url = '';                                                                                                // 81
    var defaultUrl, svc;                                                                                         // 82
                                                                                                                 // 83
    if (user) {                                                                                                  // 84
      svc = getService(user);                                                                                    // 85
      if (svc === 'twitter') {                                                                                   // 86
        // use larger image (200x200 is smallest custom option)                                                  // 87
        url = user.services.twitter.profile_image_url_https.replace('_normal.', '_200x200.');                    // 88
      }                                                                                                          // 89
      else if (svc === 'facebook') {                                                                             // 90
        // use larger image (~200x200)                                                                           // 91
        url = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture?type=large';                 // 92
      }                                                                                                          // 93
      else if (svc === 'google') {                                                                               // 94
        url = user.services.google.picture;                                                                      // 95
      }                                                                                                          // 96
      else if (svc === 'github') {                                                                               // 97
        url = 'https://avatars.githubusercontent.com/' + user.services.github.username + '?s=200';               // 98
      }                                                                                                          // 99
      else if (svc === 'instagram') {                                                                            // 100
        url = user.services.instagram.profile_picture;                                                           // 101
      }                                                                                                          // 102
      else if (svc === "custom") {                                                                               // 103
        url = getDescendantProp(user, Avatar.options.customImageProperty);                                       // 104
      }                                                                                                          // 105
      else if (svc === 'none') {                                                                                 // 106
        defaultUrl = Avatar.options.defaultImageUrl || 'packages/bengott_avatar/default.png';                    // 107
        // If it's a relative path (no '//' anywhere), complete the URL                                          // 108
        if (defaultUrl.indexOf('//') === -1) {                                                                   // 109
          // Strip starting slash if it exists                                                                   // 110
          if (defaultUrl.charAt(0) === '/') defaultUrl = defaultUrl.slice(1);                                    // 111
          // Then add the relative path to the server's base URL                                                 // 112
          defaultUrl = Meteor.absoluteUrl() + defaultUrl;                                                        // 113
        }                                                                                                        // 114
        url = getGravatarUrl(user, defaultUrl);                                                                  // 115
      }                                                                                                          // 116
    }                                                                                                            // 117
                                                                                                                 // 118
    return url;                                                                                                  // 119
  }                                                                                                              // 120
};                                                                                                               // 121
                                                                                                                 // 122
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/utilities:avatar/helpers.js                                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// Get the account service to use for the user's avatar                                                          // 1
// Priority: Twitter > Facebook > Google > GitHub > Instagram                                                    // 2
getService = function (user) {                                                                                   // 3
  var services = user && user.services;                                                                          // 4
  var customProp = user && Avatar.options.customImageProperty;                                                   // 5
  if      (customProp && getDescendantProp(user, customProp)) { return 'custom'; }                               // 6
  else if (services && services.twitter)   { return 'twitter'; }                                                 // 7
  else if (services && services.facebook)  { return 'facebook'; }                                                // 8
  else if (services && services.google)    { return 'google'; }                                                  // 9
  else if (services && services.github)    { return 'github'; }                                                  // 10
  else if (services && services.instagram) { return 'instagram'; }                                               // 11
  else                                     { return 'none'; }                                                    // 12
};                                                                                                               // 13
                                                                                                                 // 14
getGravatarUrl = function (user, defaultUrl) {                                                                   // 15
  var gravatarDefault;                                                                                           // 16
  var validGravatars = ['404', 'mm', 'identicon', 'monsterid', 'wavatar', 'retro', 'blank'];                     // 17
                                                                                                                 // 18
  // Initials are shown when Gravatar returns 404.                                                               // 19
  if (Avatar.options.fallbackType !== 'initials') {                                                              // 20
    var valid = _.contains(validGravatars, Avatar.options.gravatarDefault);                                      // 21
    gravatarDefault = valid ? Avatar.options.gravatarDefault : defaultUrl;                                       // 22
  }                                                                                                              // 23
  else {                                                                                                         // 24
    gravatarDefault = '404';                                                                                     // 25
  }                                                                                                              // 26
                                                                                                                 // 27
  var options = {                                                                                                // 28
    // NOTE: Gravatar's default option requires a publicly accessible URL,                                       // 29
    // so it won't work when your app is running on localhost and you're                                         // 30
    // using an image with either the standard default image URL or a custom                                     // 31
    // defaultImageUrl that is a relative path (e.g. 'images/defaultAvatar.png').                                // 32
    default: gravatarDefault,                                                                                    // 33
    size: 200, // use 200x200 like twitter and facebook above (might be useful later)                            // 34
    secure: true                                                                                                 // 35
  };                                                                                                             // 36
                                                                                                                 // 37
  var emailOrHash = getEmailOrHash(user);                                                                        // 38
  return Gravatar.imageUrl(emailOrHash, options);                                                                // 39
};                                                                                                               // 40
                                                                                                                 // 41
// Get the user's email address or (if the emailHashProperty is defined) hash                                    // 42
getEmailOrHash = function (user) {                                                                               // 43
  var emailOrHash;                                                                                               // 44
  if (user && Avatar.options.emailHashProperty && !!getDescendantProp(user, Avatar.options.emailHashProperty)) { // 45
    emailOrHash = getDescendantProp(user, Avatar.options.emailHashProperty);                                     // 46
  }                                                                                                              // 47
  else if (user && user.emails) {                                                                                // 48
    emailOrHash = user.emails[0].address; // TODO: try all emails                                                // 49
  }                                                                                                              // 50
  else {                                                                                                         // 51
    // If all else fails, return 32 zeros (trash hash, hehe) so that Gravatar                                    // 52
    // has something to build a URL with at least.                                                               // 53
    emailOrHash = '00000000000000000000000000000000';                                                            // 54
  }                                                                                                              // 55
  return emailOrHash;                                                                                            // 56
};                                                                                                               // 57
                                                                                                                 // 58
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['utilities:avatar'] = {
  Avatar: Avatar
};

})();

//# sourceMappingURL=utilities_avatar.js.map
