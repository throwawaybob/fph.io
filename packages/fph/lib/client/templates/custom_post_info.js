Template.post_info.events({
  'click .delete-link': function(e){
    e.preventDefault();

    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deletePostById", this._id, function(error) {
        if (error) {
          console.log(error);
          Messages.flash(error.reason, 'error');
        } else {
          Messages.flash(i18n.t('your_post_has_been_deleted'), 'success');
        }
      });
    }
  }
});