import EmberObject from '@ember/object';
import {computed} from '@ember/object';

export default EmberObject.extend({
  tagsArr: computed('tags', function(){
    return this.get('tags') ? this.get('tags').split(',') : [];
  })
});
