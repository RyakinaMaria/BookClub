import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  queryParams: {
    search: {
      refreshModel: true
    },
    tags_like: {
      refreshModel: true
    }
  },

  dataService: service('data'),

  model({search, tags_like}){
    return new Promise((resolve, reject) => {
      try{
        let books = this.get('dataService').getBooks(search, tags_like);
        resolve(books);
      }
      catch(e){
        reject('Connection failed');
      }
    });
  }
});
