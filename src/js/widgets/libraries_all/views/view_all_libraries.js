define([
  "marionette",
  "../templates/libraries-list-container.html",
  "../templates/library-item.html",
  "../templates/no-libraries.html",
  "../templates/loading-libraries.html",
  "moment"


], function(
  Marionette,
  LibraryContainer,
  LibraryItem,
  NoLibrariesTemplate,
  LoadingTemplate,
  moment

  ){



  var LibraryItemView = Marionette.ItemView.extend({

    //time is returned from library endpoint as utc time, but without info that it is utc
    formatDate : function(d){
      return moment.utc(d).local().format("MMM D YYYY, h:mma");
    },

    serializeData : function(){

      var data = this.model.toJSON();
      data.libNum = Marionette.getOption(this, "libNum")
      data.date_last_modified = this.formatDate(data.date_last_modified);
      return data;
    },

    template : LibraryItem,

    tagName : "tr",

    triggers : {
      "click" : "navigateToLibrary"
    }

  });



  var LibraryCollectionView = Marionette.CompositeView.extend({

    initialize : function(options){
      options = options || {};
    },

    template : LibraryContainer,

    childViewContainer : ".libraries-list-container tbody",

    childView : LibraryItemView,

    childViewOptions: function(model, index) {
      return {
        libNum : index + 1
      }
    },

    childEvents : {
      "navigateToLibrary" : "triggerNavigate"
    },

    events : {
      "click thead button" : "sortCollection"
    },


    modelEvents :   {
      "change" : function(){
        this.collection.sort();
        this.render();
      }
    },

    collectionEvents : {
      "reset" :  function(){
        this.collection.sort();
        this.render();
      }
    },

    triggerNavigate : function(childView){
      this.trigger("navigate:library", childView.model.get("id"));
    },

    sortCollection : function(e){

      var sortData = $(e.currentTarget).data("sort"), sort = sortData.sort;

      var order =  (sort !== this.model.get("sort") ) ? "asc" : (this.model.get("order") == "asc") ? "desc" : "asc";
      this.model.set({"sort" : sort, type : sortData.type, "order" : order});

    },

    render : function(){

      if ( !this.collection.length  ){
        this.$el.html(NoLibrariesTemplate());
        return this
      }

      else {
        return Marionette.CompositeView.prototype.render.apply(this, arguments);
      }
    }

  });

  return LibraryCollectionView;

})
