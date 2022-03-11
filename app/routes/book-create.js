import Route from '@ember/routing/route';
import baseModel from '../models/base-model';

export default Route.extend({
  model(){
    return baseModel.create({
      title: '',
      author: '',
      pageCount: '',
      coverUrl: '',
      descriptionUrl: '',
      tags: ''
    });
  }
});
