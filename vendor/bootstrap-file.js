(function() {
  function addClass(element, className) {
    let classesArray;
    classesArray = element.className.split(' ');
    if (classesArray.indexOf(className) == -1) {
      element.className += ' ' + className;
    }
  }

  function removeClass(element, className) {
    let classesArray;
    classesArray = element.className.split(' ');
    if (classesArray.indexOf(className) > -1) {
      classesArray.splice(classesArray.indexOf(className));
    }

    element.className = classesArray.join(' ');
  }

  function setFileName(fileElement) {
    let hasFiles = fileElement.files.length > 0
    let fileName = hasFiles ? fileElement.files[0].name : 'Выберите файл';
    let labelElement = fileElement.nextElementSibling;
    labelElement.innerText = fileName;
    if (hasFiles) {
      removeClass(labelElement, 'placeholder-color')
    }
    else {
      addClass(labelElement, 'placeholder-color')
    }

    let clearElement = labelElement.parentNode.nextElementSibling.querySelector('.custom-file-clear');
    if (clearElement) {
      clearElement.disabled = !hasFiles;
    }
  }

  $(function() {
    if (document.querySelector('.custom-file-input')) {
      document.querySelector('.custom-file-input').addEventListener('change',function(e){
        setFileName(e.target);
      });
    }
  
    if (document.querySelector('.custom-file-clear')) {
      document.querySelector('.custom-file-clear').addEventListener('click',function(e){
        if (e.target.parentNode) {
          let fileElement = e.target.parentNode.previousElementSibling.querySelector('.custom-file-input');
          if (fileElement) {
            fileElement.value = null;
            setFileName(fileElement);
          }
        }
      });
    }
  });
})();