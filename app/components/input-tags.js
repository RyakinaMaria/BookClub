import Component from '@ember/component';
import { get, set } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import $ from 'jquery';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    const el = this.$();

    set(this, 'addTag', (e) => {
      this.tagAdded(e.item);
    });

    set(this, 'removeTag', (e) => {
      this.tagRemoved(e.item);
    });

    el.on('itemAdded', this.addTag);
    el.on('itemRemoved', this.removeTag);
  },

  didReceiveAttrs() {
    const tags = get(this, 'tags');
    assert('Passed tags must be an array', typeOf(tags) === 'array');
    set(this, '_tags', [...tags]);
  },

  didRender() {
    const arraysAreEqual = (arr1, arr2) => {
      arr2 = arr2.itemsArray ? arr2.itemsArray : arr2;
      return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
    }

    const el = this.$();

    const currentValues = el.tagsinput('items');
    const tags = get(this, '_tags');

    if (!arraysAreEqual(tags, currentValues)) {
      el.tagsinput('removeAll');
      tags.forEach(tag => {
        el.tagsinput('add', tag);
      });
    }
  },

  tagAdded(newTag) {
    get(this, '_tags').push(newTag);
    this.get('onChange')(this._tags);
  },

  tagRemoved(tag) {
    const tagIndex = get(this, '_tags').indexOf(tag);
    if (tagIndex > -1) {
      const part1 = get(this, '_tags').slice(0, tagIndex);
      const part2 = get(this, '_tags').slice(tagIndex + 1);
      set(this, '_tags', [...part1, ...part2]);
      this.get('onChange')(this._tags);
    }
  },

  willDestroyElement() {
    const el = this.$();
    el.off('itemAdded', this.addTag);
    el.off('itemRemoved', this.removeTag);
  }
});
