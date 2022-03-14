import Component from "@ember/component";
import Category from "discourse/models/category";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { and } from "@ember/object/computed";

export default Component.extend({
  router: service(),
  tagName: "",

  didInsertElement() {
    this._super(...arguments);
    this._updateBodyClasses();
  },
  willDestroyElement() {
    this._super(...arguments);
    this._updateBodyClasses();
  },

  @observes("shouldShow")
  _updateBodyClasses() {
    const shouldCleanup = this.isDestroying || this.isDestroyed;
  },

  get categoriesLoaded() {
    return Category.list().length !== 0;
  },

  get list() {
    if(settings.feed_list <= 0) return [];

    const list_data = settings.feed_list.split("|").map((item, index) => {
      const classes = ["col", `col-${index}`];
      const length = settings.feed_list.split("|").length;

      if (length % 2 != 0 && index === length - 1) {
        classes.push("last");
      }

      const data = item.split(",");

      return {
        title: data[0].trim(),
        length: data[1].trim(),
        filter: data[2].trim(),
        tag: data[3].trim(),
        category: Category.findById(data[4].trim()),
        link: data[5].trim(),
        classes: classes.join(" ")
      }
    });

    return list_data;
  },

  @discourseComputed("router.currentRouteName")
  shouldShow(currentRouteName) {
    return currentRouteName === `discovery.${defaultHomepage()}`;
  },

  showTopicLists: and("shouldShow", "list.length")
});
