define([
  'js/page_managers/controller',
  'js/page_managers/one_column_view',
  './public-libraries-page-layout.html'
], function (
  PageManagerController,
  PageManagerView,
  PageManagerTemplate) {

  var PageManager = PageManagerController.extend({

    createView: function(options) {
      options = options || {};
      options.template = PageManagerTemplate;
      return new PageManagerView({template: PageManagerTemplate, className :  "s-public-libraries-layout s-libraries-layout",  id : "landing-page-layout"  })
    }
  });

  return PageManager;

});
