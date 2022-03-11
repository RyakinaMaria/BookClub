import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('books');
  this.route('speakers');
  this.route('book-edit', {path: 'book/:id'});
  this.route('speaker-edit', {path: 'speaker/:id'});
  this.route('404', {path: '*path'});
  this.route('book-create');
  this.route('speaker-create');
});

export default Router;
