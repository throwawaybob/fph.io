(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var MeteorVersion = Package['sanjo:meteor-version'].MeteorVersion;
var PackageVersion = Package['package-version-parser'].PackageVersion;

/* Package-scope variables */
var MeteorFilesHelpers, findAppDir;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/sanjo:meteor-files-helpers/lib/meteor/files.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Copied from Meteor tools/files.js.                                                                                 // 2
 *                                                                                                                    // 3
 * Includes:                                                                                                          // 4
 * - Helper to find the app root path                                                                                 // 5
 */                                                                                                                   // 6
                                                                                                                      // 7
var path = Npm.require('path');                                                                                       // 8
var fs = Npm.require('fs');                                                                                           // 9
                                                                                                                      // 10
// given a predicate function and a starting path, traverse upwards                                                   // 11
// from the path until we find a path that satisfies the predicate.                                                   // 12
//                                                                                                                    // 13
// returns either the path to the lowest level directory that passed                                                  // 14
// the test or null for none found. if starting path isn't given, use                                                 // 15
// cwd.                                                                                                               // 16
var findUpwards = function (predicate, startPath) {                                                                   // 17
  var testDir = startPath || process.cwd();                                                                           // 18
  while (testDir) {                                                                                                   // 19
    if (predicate(testDir)) {                                                                                         // 20
      break;                                                                                                          // 21
    }                                                                                                                 // 22
    var newDir = path.dirname(testDir);                                                                               // 23
    if (newDir === testDir) {                                                                                         // 24
      testDir = null;                                                                                                 // 25
    } else {                                                                                                          // 26
      testDir = newDir;                                                                                               // 27
    }                                                                                                                 // 28
  }                                                                                                                   // 29
  if (!testDir)                                                                                                       // 30
    return null;                                                                                                      // 31
                                                                                                                      // 32
  return testDir;                                                                                                     // 33
};                                                                                                                    // 34
                                                                                                                      // 35
// Determine if 'filepath' (a path, or omit for cwd) is within an app                                                 // 36
// directory. If so, return the top-level app directory.                                                              // 37
findAppDir = function (filepath) {                                                                                    // 38
  var isAppDir = function (filepath) {                                                                                // 39
    // XXX once we are done with the transition to engine, this should                                                // 40
    // change to: `return fs.existsSync(path.join(filepath, '.meteor',                                                // 41
    // 'release'))`                                                                                                   // 42
                                                                                                                      // 43
    // .meteor/packages can be a directory, if .meteor is a warehouse                                                 // 44
    // directory.  since installing meteor initializes a warehouse at                                                 // 45
    // $HOME/.meteor, we want to make sure your home directory (and all                                               // 46
    // subdirectories therein) don't count as being within a meteor app.                                              // 47
    try { // use try/catch to avoid the additional syscall to fs.existsSync                                           // 48
      return fs.statSync(path.join(filepath, '.meteor', 'packages')).isFile();                                        // 49
    } catch (e) {                                                                                                     // 50
      return false;                                                                                                   // 51
    }                                                                                                                 // 52
  };                                                                                                                  // 53
                                                                                                                      // 54
  return findUpwards(isAppDir, filepath);                                                                             // 55
};                                                                                                                    // 56
                                                                                                                      // 57
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/sanjo:meteor-files-helpers/meteor_files_helpers.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var path = Npm.require('path')                                                                                        // 1
var fs = Npm.require('fs')                                                                                            // 2
var readFile = Meteor.wrapAsync(fs.readFile, fs)                                                                      // 3
var exists = Meteor.wrapAsync(function (path, callback) {                                                             // 4
  fs.exists(path, function (result) {                                                                                 // 5
    callback(null, result)                                                                                            // 6
  })                                                                                                                  // 7
})                                                                                                                    // 8
                                                                                                                      // 9
MeteorFilesHelpers = {                                                                                                // 10
  getAppPath: function () {                                                                                           // 11
    var appPath = findAppDir();                                                                                       // 12
    return appPath ? path.resolve(appPath) : null;                                                                    // 13
  },                                                                                                                  // 14
                                                                                                                      // 15
  getMeteorToolPath: function () {                                                                                    // 16
    if (isWindows()) {                                                                                                // 17
      return path.resolve(process.env.NODE_PATH, '../../..')                                                          // 18
    } else {                                                                                                          // 19
      return process.env.OLDPWD                                                                                       // 20
    }                                                                                                                 // 21
  },                                                                                                                  // 22
                                                                                                                      // 23
  getMeteorInstallationPath: function () {                                                                            // 24
    var meteorPath                                                                                                    // 25
    if (isWindows()) {                                                                                                // 26
      meteorPath = process.env.METEOR_INSTALLATION                                                                    // 27
      if (meteorPath[meteorPath.length - 1] === '\\') {                                                               // 28
        meteorPath = meteorPath.substr(0, meteorPath.length - 1)                                                      // 29
      }                                                                                                               // 30
                                                                                                                      // 31
    } else {                                                                                                          // 32
      meteorPath = path.resolve(MeteorFilesHelpers.getMeteorToolPath(), '../../../..')                                // 33
    }                                                                                                                 // 34
                                                                                                                      // 35
    return meteorPath                                                                                                 // 36
  },                                                                                                                  // 37
                                                                                                                      // 38
  getNodeModulePath: function (meteorPackageName, nodeModuleName) {                                                   // 39
    var localIsopackPath = path.join(                                                                                 // 40
      MeteorFilesHelpers.getAppPath(),                                                                                // 41
      '.meteor', 'local', 'isopacks',                                                                                 // 42
      getFilesystemMeteorPackageName(meteorPackageName)                                                               // 43
    )                                                                                                                 // 44
    if (exists(localIsopackPath)) {                                                                                   // 45
      return path.join(localIsopackPath, 'npm', 'node_modules', nodeModuleName)                                       // 46
    } else {                                                                                                          // 47
      if (isWindows()) {                                                                                              // 48
        return path.join(                                                                                             // 49
          MeteorFilesHelpers.getMeteorInstallationPath(),                                                             // 50
          'packages',                                                                                                 // 51
          getFilesystemMeteorPackageName(meteorPackageName), MeteorFilesHelpers.getPackageVersion(meteorPackageName), // 52
          'npm', 'node_modules', nodeModuleName                                                                       // 53
        )                                                                                                             // 54
      } else {                                                                                                        // 55
        return path.join(                                                                                             // 56
          MeteorFilesHelpers.getAppPath(),                                                                            // 57
          '.meteor', 'local', 'build', 'programs', 'server',                                                          // 58
          'npm', getFilesystemMeteorPackageName(meteorPackageName),                                                   // 59
          'node_modules', nodeModuleName                                                                              // 60
        )                                                                                                             // 61
      }                                                                                                               // 62
    }                                                                                                                 // 63
  },                                                                                                                  // 64
                                                                                                                      // 65
  getPackageVersions: _.memoize(function () {                                                                         // 66
    var versionsFilePath = path.join(                                                                                 // 67
      MeteorFilesHelpers.getAppPath(), '.meteor', 'versions'                                                          // 68
    )                                                                                                                 // 69
    var versionsContent = readFile(versionsFilePath, {encoding: 'utf8'})                                              // 70
    var versionsHash = {}                                                                                             // 71
    versionsContent.split(/\r\n|\r|\n/).forEach(function (packageConstraint) {                                        // 72
      var parts = packageConstraint.split('@')                                                                        // 73
      var packageName = parts[0]                                                                                      // 74
      var packageVersion = parts[1]                                                                                   // 75
      versionsHash[packageName] = packageVersion                                                                      // 76
    })                                                                                                                // 77
                                                                                                                      // 78
    return versionsHash                                                                                               // 79
  }),                                                                                                                 // 80
                                                                                                                      // 81
  getPackageVersion: function (packageName) {                                                                         // 82
    var packageVersions = MeteorFilesHelpers.getPackageVersions()                                                     // 83
                                                                                                                      // 84
    return packageVersions[packageName]                                                                               // 85
  },                                                                                                                  // 86
                                                                                                                      // 87
  isPackageInstalled: function (meteorPackageName, meteorPackageVersion) {                                            // 88
    var packagePath = path.join(                                                                                      // 89
      MeteorFilesHelpers.getMeteorInstallationPath(),                                                                 // 90
      'packages',                                                                                                     // 91
      getFilesystemMeteorPackageName(meteorPackageName)                                                               // 92
    )                                                                                                                 // 93
                                                                                                                      // 94
    if (meteorPackageVersion) {                                                                                       // 95
      packagePath = path.join(packagePath, meteorPackageVersion)                                                      // 96
    }                                                                                                                 // 97
                                                                                                                      // 98
    return exists(packagePath)                                                                                        // 99
  }                                                                                                                   // 100
}                                                                                                                     // 101
                                                                                                                      // 102
function isWindows() {                                                                                                // 103
  return process.platform === 'win32'                                                                                 // 104
}                                                                                                                     // 105
                                                                                                                      // 106
function getFilesystemMeteorPackageName(meteorPackageName) {                                                          // 107
  var meteorVersion = MeteorVersion.getSemanticVersion()                                                              // 108
  return (meteorVersion && PackageVersion.lessThan(meteorVersion, '1.0.4')) ?                                         // 109
    meteorPackageName :                                                                                               // 110
    meteorPackageName.replace(':', '_')                                                                               // 111
}                                                                                                                     // 112
                                                                                                                      // 113
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['sanjo:meteor-files-helpers'] = {
  MeteorFilesHelpers: MeteorFilesHelpers
};

})();

//# sourceMappingURL=sanjo_meteor-files-helpers.js.map
