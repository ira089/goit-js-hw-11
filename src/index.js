import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  btnSearch: document.querySelector('button'),
  containerImg: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endImg: document.querySelector('.end-img'),
};
let caunter = 1;
let searchImg = '';

refs.form.addEventListener('submit', imagesSabmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

//======SimpleLightbox=====
const settings = {
  captionsData: 'alt',
  captionDelay: 250,
};
let gallery = new SimpleLightbox('.gallery a', settings);

// -----------функция сабмита--------
async function imagesSabmit(evt) {
  evt.preventDefault();
  console.log('qw');
  refs.loadMoreBtn.hidden = true;
  refs.endImg.classList.add('none-load-more');
  refs.containerImg.innerHTML = '';
  searchImg = evt.currentTarget.elements.searchQuery.value;
  if (searchImg.trim() === '') {
    Notify.failure('Sorry, enter text. Please try again.');
    return;
  }
  console.log(searchImg);
  try {
    const imagesApi = await serviceSearchImg(searchImg);
    const totalImg = imagesApi.totalHits;
    // console.log(imagesApi);
    const { hits } = imagesApi;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.info(`Hooray! We found ${totalImg} images.`);
    // console.log(hits);
    refs.containerImg.innerHTML = createMarkup(hits);

    gallery.refresh();
    lastPageCheck(imagesApi.totalHits);
    // refs.loadMoreBtn.hidden = false;

    // const { height: cardHeight } =
    //   refs.containerImg.firstElementChild.getBoundingClientRect();
    // window.scrollBy({
    //   top: cardHeight * 2,
    //   behavior: 'smooth',
    // });
  } catch (err) {
    console.log(err);
  } finally {
  }
}

// -----------функция запроса на API--------
async function serviceSearchImg(search) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40910000-bc8f7501355e0c431b692ba0e';

  const { data } = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${caunter}`
  );
  // console.log(data);
  return data;
}

//------ функция добавить еще----------
async function onLoadMore() {
  try {
    caunter += 1;
    const imagesApi = await serviceSearchImg(searchImg);
    const { hits } = imagesApi;
    refs.containerImg.insertAdjacentHTML('beforeend', createMarkup(hits));
    gallery.refresh();

    lastPageCheck(imagesApi.totalHits);
    const { height: cardHeight } =
      refs.containerImg.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    // console.log(Math.ceil(imagesApi.totalHits / 40));

    // if (caunter === Math.ceil(imagesApi.totalHits / 40)) {
    //   refs.loadMoreBtn.hidden = true;
    //   refs.endImg.classList.remove('none-load-more');
    // }
  } catch (err) {
    console.log(err);
  } finally {
  }
}

// -----------функция разметки-SimpleLightbox-------
function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}" class="gallery__link"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a> 
      <div class="info">
        <p class="info-item">
          <b>Likes</b><br/>${likes}
        </p>
        <p class="info-item">
          <b>Views</b><br/>${views}
        </p>
        <p class="info-item">
          <b>Comments</b><br/>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b><br/>${downloads}
        </p>
      </div>
    </div>`
    )
    .join('');
}
//====проверка последней страницы===
function lastPageCheck(lastPage) {
  if (caunter === Math.ceil(lastPage / 40)) {
    refs.loadMoreBtn.hidden = true;
    refs.endImg.classList.remove('none-load-more');
  } else {
    refs.loadMoreBtn.hidden = false;
  }
}
