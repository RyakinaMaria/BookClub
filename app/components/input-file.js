import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isFileChoosen: computed('uploadData', function () {
    return this.get('uploadData') && this.get('uploadData').files.length;
  }),

  ifRemoveButtonDisabled: computed('isFileChoosen', function () {
    return !this.get('isFileChoosen');
  }),

  fileName: computed('isFileChoosen', function () {
    return this.get('isFileChoosen') ? this.get('uploadData').files[0].name : 'Выберите файл';
  }),

  didInsertElement() {
    this._super(...arguments);

    const onFileAdd = (e, uploadData) => {
      // const hasFiles = uploadData.files.length > 0;
      // const fileName = hasFiles ? uploadData.files[0].name : 'Выберите файл';
      // this.set('fileName', fileName);
      this.uploadDataChanged(uploadData);
    };

    if (!this.$('.custom-file-input').fileupload('instance')) {
      // Initialize jQuery fileupload plugin (https://github.com/blueimp/jQuery-File-Upload/wiki/API).
      this.$('.custom-file-input').fileupload({
        // Disable autoUpload.
        autoUpload: false,

        // Type of data that is expected back from the server.
        dataType: 'json',

        // Maximum number of files to be selected and uploaded.
        maxNumberOfFiles: 1,

        // Enable single file uploads.
        singleFileUploads: true,

        // Disable drag&drop file adding.
        dropZone: null,

        // File add handler.
        add: onFileAdd
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.$('.custom-file-input').fileupload('instance')) {
      this.$('.custom-file-input').fileupload('destroy');
    }
  },

  actions: {
    removeFile() {
      this.set('uploadData', null);
    }
  }
});
