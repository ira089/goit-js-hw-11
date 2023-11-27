import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

console.log('чаокакаm');

const refs = {
  form: document.querySelector('.search-form'),
  btnSearch: document.querySelector('button'),
  containerImg: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endImg: document.querySelector('.end-img'),
  totalImgs: document.querySelector('.found-total-img'),
};
let caunter = 11;
let searchImg = '';

// console.log(refs.form);
// console.log(refs.btnSearch);
console.log(refs.endImg);

refs.form.addEventListener('submit', imagesSabmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// -----------функция сабмита--------
async function imagesSabmit(evt) {
  evt.preventDefault();
  console.log(refs.endImg);
  refs.endImg.classList.add('none-load-more');

  //   const { searchQuery } = evt.currentTarget.elements;
  refs.containerImg.innerHTML = '';
  // caunter = 1;
  searchImg = evt.currentTarget.elements.searchQuery.value;
  //   const searchImg = searchQuery.value;
  console.log(searchImg);
  try {
    const imagesApi = await serviceSearchImg(searchImg);
    const totalImg = imagesApi.totalHits;
    refs.totalImgs.innerHTML = `<p>"Hooray! We found ${totalImg} images."</p>`;

    console.log(imagesApi);
    const { hits } = imagesApi;
    // const qwe = hits[0].tags;
    // console.log(qwe);
    console.log(hits);
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    refs.containerImg.innerHTML = createMarkup(hits);
  } catch (err) {
    console.log(err);
  } finally {
    refs.loadMoreBtn.hidden = false;
    // evt.target.reset();
    // refs.formContainer.innerHTML = '<input type="text" name="country" />';
  }
}

// -----------функция запроса на API--------
async function serviceSearchImg(search) {
  const BASE_URL = 'https://pixabay.com/api/';
  //   const ENDPOINT = "forecast.json";
  const API_KEY = '40910000-bc8f7501355e0c431b692ba0e';

  const { data } = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${caunter}`
  );
  // caunter += 1;
  console.log(data);
  return data;
}

// -----------функция разметки--------
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
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
//------ функция добавить еще----------
async function onLoadMore() {
  try {
    caunter += 1;
    const imagesApi = await serviceSearchImg(searchImg);

    const { hits } = imagesApi;
    // const qwe = hits[0].tags;
    console.log('qwe');

    refs.containerImg.insertAdjacentHTML('beforeend', createMarkup(hits));

    console.log(Math.ceil(imagesApi.totalHits / 40));
    if (caunter === Math.ceil(imagesApi.totalHits / 40)) {
      refs.loadMoreBtn.hidden = true;
      refs.endImg.classList.remove('none-load-more');
    }
  } catch (err) {
    console.log(err);
  } finally {
  }
}
