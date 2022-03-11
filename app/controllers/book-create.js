import Controller from '@ember/controller';
import {inject as service} from '@ember/service';

export default Controller.extend({
  dataService: service('data'),

  actions: {
    changeTags(newTags) {
      this.set('model.tags', [...newTags].join(','));

      // eslint-disable-next-line no-console
      console.log(this.get('model.tags'));
    },

    changeUploadData(uploadData) {
      this.set('uploadData', uploadData);
    },

    async saveBook(e) {
      e.preventDefault();
      const uploadData = this.get('uploadData');
      await this.get('dataService').createBook(this.get('model'), uploadData);
      this.transitionToRoute('books');
    }
  }
});
