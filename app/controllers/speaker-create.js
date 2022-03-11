import Controller from '@ember/controller';
import {inject as service} from '@ember/service';

export default Controller.extend({
  dataService: service('data'),

  actions: {
    async saveSpeaker(e) {
      e.preventDefault();
      await this.get('dataService').createSpeaker(this.get('model'));
      this.transitionToRoute('speakers');
    }
  }
});
