import Component from "@ember/component";
import { action, computed } from "@ember/object";

export default Component.extend({
  init() {
    this._super(...arguments);
    let params = {};

    if (this.data.category) {
      params.category = this.data.category.id;
    }

    if (this.data.tag) {
      params.tags = this.data.tag;
    }

    if (this.data.solved === "true") {
      params.solved = 'yes';
    } else if (this.data.solved === "false") {
      params.solved = 'no'
    }

    const filter = {
      filter: this.data.filter,
      params,
    };

    this.set("isLoading", true)

    this.store.findFiltered("topicList", filter).then((topicList) => {
      this.set(
        "topicList",
        topicList.topics.slice(0, this.data.length)
      );

      this.set("isLoading", false)
    });
  },

  @computed("settings.more_topics_button_text")
  get moreTopicsButtonText() {
    return settings.more_topics_button_text;
  },

  @computed("settings.post_button_text")
  get postButtonText() {
    return settings.post_button_text;
  },

  @action
  createTopic() {
    if (this.currentUser) {
      // This is not ideal - we should not be using __container__ here
      // We can't inject it properly, because ember doesn't allow injecting controllers into components
      // We can't `sendAction` up to routes/application createNewTopicViaParams because only clojure actions are allowed
      // We can't use clojure actions because then an openComposer action would have to be passed to every plugin outlet
      // The best solution is probably a core appEvent or service which themes could trigger
      Discourse.__container__.lookup("controller:composer").open({
        action: "createTopic",
        draftKey: "createTopic",
        categoryId: this.data.category ? this.data.category.id : null,
      });
    } else {
      this.router.transitionTo("login");
    }
  },
});
