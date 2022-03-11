import Controller from '@ember/controller';
import {inject as service} from '@ember/service';

export default Controller.extend({
  dataService: service('data'),

  actions: {
    async editSpeaker(e) {
      e.preventDefault();
      await this.get('dataService').updateSpeaker(this.get('model'));
      this.transitionToRoute('speakers');
    }
  }});
