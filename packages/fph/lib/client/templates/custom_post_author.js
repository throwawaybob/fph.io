Template.registerHelper('adminFlair', function(user) {
  var user = (typeof user === 'string') ? Meteor.users.findOne(user) :  user;

  if (user && user.isAdmin === true) {
    return '<span class="admin-flair">[A]</span>';
  }
});