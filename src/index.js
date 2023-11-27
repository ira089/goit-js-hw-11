// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

console.log('чаокака');

const refs = {
  form: document.querySelector('.search-form'),
  btnSearch: document.querySelector('button'),
  containerImg: document.querySelector('.gallery'),
};
let caunter = 1;

// console.log(refs.form);
// console.log(refs.btnSearch);
console.log(refs.containerImg);

refs.form.addEventListener('submit', imagesSabmit);

// -----------функция сабмита--------
async function imagesSabmit(evt) {
  evt.preventDefault();
  console.log('qwa');
  //   const { searchQuery } = evt.currentTarget.elements;
  const searchImg = evt.currentTarget.elements.searchQuery.value;
  //   const searchImg = searchQuery.value;
  console.log(searchImg);
  try {
    const imagesApi = await serviceSearchImg(searchImg);
    console.log(imagesApi);
    const { hits } = imagesApi;
    // const qwe = hits[0].tags;
    // console.log(qwe);
    console.log(hits);
    refs.containerImg.innerHTML = createMarkup(hits);
  } catch (err) {
    console.log(err);
  } finally {
    // event.target.reset();
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
          <b>Likes${likes}</b>
        </p>
        <p class="info-item">Views
          <b>${views}</b>
        </p>
        <p class="info-item">Comments
          <b>${comments}</b>
        </p>
        <p class="info-item">Downloads
          <b>${downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');
}
