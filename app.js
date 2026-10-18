var Note = Backbone.Model.extend({ defaults: { title: "", body: "" } });
var Notes = Backbone.Collection.extend({ model: Note });

var NoteView = Backbone.View.extend({
  tagName: "li",
  events: { "click button": "remove_" },
  render: function () {
    this.$el.empty().append($("<strong>").text(this.model.get("title")));
    if (this.model.get("body")) this.$el.append($("<span>").text(" — " + this.model.get("body")));
    this.$el.append($("<button>").text("Delete"));
    return this;
  },
  remove_: function () { this.model.collection.remove(this.model); },
});

var AppView = Backbone.View.extend({
  el: "#app",
  events: { "submit #note-form": "add" },
  initialize: function () {
    this.listenTo(this.collection, "update", this.render);
    this.render();
  },
  add: function (event) {
    event.preventDefault();
    var title = $.trim(this.$("#title").val());
    if (!title) return;
    var nextId = (this.collection.max("id") || { get: function () { return 0; } }).get("id") + 1;
    this.collection.add({ id: nextId, title: title });
    this.$("#title").val("");
  },
  render: function () {
    var $list = this.$("#notes").empty();
    this.collection.each(function (note) { $list.append(new NoteView({ model: note }).render().el); });
    this.$("#count").text(this.collection.length + " notes");
  },
});

new AppView({
  collection: new Notes([
    { id: 1, title: "Buy milk", body: "Two litres" },
    { id: 2, title: "Call Sam", body: "About the trip" },
  ]),
});
