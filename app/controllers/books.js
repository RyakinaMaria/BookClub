import Controller from '@ember/controller';
import {inject as service} from '@ember/service';

export default Controller.extend({
  queryParams: ['search', 'tags_like'],
  search: '',
  tags_like: '',

  dataService: service('data'),

  actions: {
    deleteBook(book){
      try{
        this.get('dataService').deleteBook(book);
      }
      catch(e) {
        this.transitionToRoute('error', {error: 'Connection failed'});
      }
    },

    searchBooks(){
      const searchStr = this.get('searchStr');
      this.set('search', searchStr);
    },

    searchBooksByTags(){
      const tagSearchStr = this.get('tagSearchStr');
      this.set('tags_like', tagSearchStr);
    }
  }
});
