import Controller from '@ember/controller';
import {inject as service} from '@ember/service';

export default Controller.extend({
  queryParams: ['search'],
  search: '',

  dataService: service('data'),

  actions: {
    deleteSpeaker(speaker){
      try{
        this.get('dataService').deleteSpeaker(speaker);
      }
      catch(e) {
        this.transitionToRoute('error', {error: 'Connection failed'});
      }
    },

    searchSpeakers(){
      const searchStr = this.get('searchStr');
      this.set('search', searchStr);
    }
  }
});
