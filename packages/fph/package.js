Package.describe({
  summary: 'Fat People Hate',
  version: '0.1.0',
  name: 'fph'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use("telescope:core");
  api.use("telescope:comments");


  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // client & server

  api.addFiles([
    //...
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/custom_comment_item.js',
    'lib/client/templates/custom_comment_item.html',
    'lib/client/templates/custom_post_author.js',
    'lib/client/templates/custom_post_author.html',
    'lib/client/templates/custom_post_info.html',
    'lib/client/templates/custom_post_info.js',
    'lib/client/templates/custom_layout.html',
    //'lib/client/templates/custom_header_block.html',
    //'lib/client/templates/custom_header_block.js',
    'lib/client/templates/custom_nav.html',
    'lib/client/templates/custom_posts_views_nav.html',
    'lib/client/stylesheets/custom.scss',
    'lib/client/custom_templates.js'
  ], ['client']);

  // server

  api.addFiles([
    //...
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

});
