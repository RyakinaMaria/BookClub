import Service from '@ember/service';
import ENV from 'book-club/config/environment';
import {A} from '@ember/array';
import baseModel from '../models/base-model';
import {on} from '@ember/object/evented';

export default Service.extend({
  init(){
    this._super(...arguments);
    this.set('books', A());
    this.set('speakers', A());

    let _service = this;

    baseModel.reopen({
      initCompleted: on('init', function(){
        this.set('dataService', _service);
      })
    });
  },

  async getBooks(search, tags_like){
    let queryParams = '';
    if(search) {
      queryParams = `?q=${search}`;
    }

    if(tags_like) {
      queryParams = queryParams === '' ? `?tags_like=${tags_like}` : `${queryParams}&tags_like=${tags_like}`;
    }

    let response = await fetch(`${ENV.backendURL}/books${queryParams}`);
    let books = await response.json();
    this.get('books').clear();
    let dataObjects = books.map(book => baseModel.create(book));
    this.get('books').pushObjects(dataObjects);
    return this.get('books');
  },

  async getSpeakers(search){
    let queryParams = '';
    if(search) {
      queryParams = `?q=${search}`;
    }

    let response = await fetch(`${ENV.backendURL}/speakers${queryParams}`);
    let speakers = await response.json();
    this.get('speakers').clear();
    let dataObjects = speakers.map(speaker => baseModel.create(speaker));
    this.get('speakers').pushObjects(dataObjects);
    return this.get('speakers');
  },

  getBook(id){
    return this.get('books').find(book => book.get('id') === parseInt(id));
  },

  getSpeaker(id){
    return this.get('speakers').find(speakers => speakers.get('id') === parseInt(id));
  },

  deleteBook(book){
    this.get('books').removeObject(book);
    return fetch(`${ENV.backendURL}/books/${book.id}`, {method: 'DELETE'});
  },

  deleteSpeaker(speaker){
    this.get('speakers').removeObject(speaker);
    return fetch(`${ENV.backendURL}/speakers/${speaker.id}`, {method: 'DELETE'}  );
  },

  async createBook(book, uploadData) {
    return new Promise(async (resolve, reject) => {
      try{
        let response = await fetch(`${ENV.backendURL}/books`,
        {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify(book)
        });
        let newBook = await response.json();
        this.get('books').pushObject(baseModel.create(newBook));

        if (!uploadData) {
          resolve(this.get('books'));
        }

        uploadData.url = `${ENV.fileUploadURL}`;
        // uploadData.headers = getOwner(this).lookup('adapter:application').get('headers');
        uploadData.submit().done(async (result/*, textStatus, jqXhr*/) => {
          try {
            const dataToUpload = {
              entityName: 'books',
              id: newBook.id,
              fileName: result.filename
            };

            await fetch(`${ENV.backendURL}/saveURL`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToUpload)
            });

            // eslint-disable-next-line no-console
            console.log('Ok');
            resolve(this.get('books'));
          }
          catch (e) {
            reject(e);
          }
        }).fail((jqXhr, textStatus, errorThrown) => {
          reject(errorThrown);
        });
      }
      catch (e) {
        reject(e);
      }
    });
  },

  async createSpeaker(speaker) {
    let response = await fetch(`${ENV.backendURL}/speakers`,
    {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(speaker)
    });
    let newSpeaker = await response.json();
    this.get('speakers').pushObject(baseModel.create(newSpeaker));
    return this.get('speakers');
  },

  async updateBook(book, uploadData) {
    return new Promise(async (resolve, reject) => {
      try {
        this.get('books').forEach(bookItem => {
          if(bookItem.get('id') === book.id){
            bookItem.set('title', book.title);
            bookItem.set('author', book.author);
            bookItem.set('pageCount', book.pageCount);
            bookItem.set('coverUrl', book.coverUrl);
            bookItem.set('descriptionUrl', book.descriptionUrl);
            bookItem.set('tags', book.tags);
          }
        });

        let response = await fetch(`${ENV.backendURL}/books/${book.id}`,
        {
          method: 'PATCH',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify(book.getProperties('id', 'title', 'author', 'pageCount', 'coverUrl', 'descriptionUrl', 'tags'))
        });
        let savedBook = await response.json();

        if (!uploadData) {
          resolve(savedBook);
        }

        uploadData.url = `${ENV.fileUploadURL}`;
        // uploadData.headers = getOwner(this).lookup('adapter:application').get('headers');
        uploadData.submit().done(async (result/*, textStatus, jqXhr*/) => {
          try {
            const dataToUpload = {
              entityName: 'books',
              id: savedBook.id,
              fileName: result.filename
            };

            await fetch(`${ENV.backendURL}/saveURL`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToUpload)
            });

            // eslint-disable-next-line no-console
            console.log('Ok');
            resolve(savedBook);
          }
          catch (e) {
            reject(e);
          }
        }).fail((jqXhr, textStatus, errorThrown) => {
          reject(errorThrown);
        });
      }
      catch (e) {
        reject(e);
      }
    });
  },

  updateSpeaker(speaker) {
    this.get('speakers').forEach(speakerItem => {
      if(speakerItem.get('id') === speaker.id){
        speakerItem.set('lastName', speaker.lastName);
        speakerItem.set('firstName', speaker.firstName);
        speakerItem.set('patronymic', speaker.patronymic);
      }
    });

    return fetch(`${ENV.backendURL}/speakers/${speaker.id}`,
    {
      method: 'PATCH',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(speaker.getProperties('id', 'lastName', 'firstName', 'patronymic'))
    });
  }

});
