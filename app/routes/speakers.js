import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  queryParams: {
    search: {
      refreshModel: true
    }
  },

  dataService: service('data'),

  model({search}){
    return new Promise((resolve, reject) => {
      try{
        let speakers = this.get('dataService').getSpeakers(search);
        resolve(speakers);
      }
      catch(e){
        reject('Connection failed');
      }
    });
  }
});
