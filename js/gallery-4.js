var gallery = readGallery();

// создать объект меню из миниатюр изображений
var galleryMenu = new GalleryMenu({ items: gallery });
// получить сгенерированный DOM-элемент меню
var elem = galleryMenu.getElem();
// вставить меню в нужное место страницы
document.querySelector('.container').appendChild(elem);

function readGallery() {
  var title = document.getElementsByTagName('title')[0].innerHTML || '';
  var folder = '/media/Photo/' + title;
  var list = '/json/' + title + '.json';
  var gallery = [];
  var xhr = new XMLHttpRequest();
  xhr.open('GET', list, false);
  xhr.send();
  if (xhr.status != 200) {
    alert( xhr.status + ': ' + xhr.statusText );
  } else {
    gallery = JSON.parse(xhr.responseText);
  }
  gallery = shuffle(gallery);
  gallery.forEach(function(img) {
    img.thumbnail = folder + '/thumbnail/' + img.thumbnail;
    img.picture = folder + '/sqz20pct/' + img.sqz20pct;
  });
  return gallery;
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function GalleryMenu(options) {
  var elem;

  function getElem() {
    if (!elem) render();
    return elem;
  }

  function render() {
    elem = document.createElement('div');
    elem.className = "gallery__container";

    var items = options.items || [];
    var list = document.createElement('div');
    list.className = 'gallery__list';
    items.forEach(function(item) {
      var card = document.createElement('a');
      var img = document.createElement('img');
      img.src = item.thumbnail;
      img.className = 'gallery__thumbnail';
      card.className = 'gallery__list__card';
      card.setAttribute('href', item.picture);
      card.setAttribute('data-lightbox', 'gallery');
      card.appendChild(img);
      list.appendChild(card);
    });
    elem.appendChild(list);
  }

  this.getElem = getElem;
}
