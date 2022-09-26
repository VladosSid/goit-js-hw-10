import './css/styles.css';
// var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  inp: document.querySelector('#search-box'),
  resultList: document.querySelector('.country-list'),
  infoBox: document.querySelector('.country-info'),
};

// считавает введенные данные
refs.inp.addEventListener('input', debounce(requestDebounce, DEBOUNCE_DELAY));

function requestDebounce(ev) {
  const sring = ev.target.value.trim();

  if (ev.target.value !== '') {
    requestServer(sring)
      .then(country => {
        showResults(country);
      })
      .catch(error => {
        console.log(error);
        errorSearch();
      });
  }

  remuveCountry();
}

// запрос на сервер поиска стран
function requestServer(request) {
  return fetch(
    `https://restcountries.com/v3.1/name/${request}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.log(error);
      errorSearch();
    });
}

// вариативность вывода информации пользователю
function showResults(result) {
  if (result.length > 10) {
    remuveCountry();
    return notifixALotOfCountry();
  } else if (result.length > 1 && result.length < 11) {
    remuveCountry();
    return listGeneration(result);
  } else if (result.length === 1) {
    remuveCountry();
    return descriptionCountry(result);
  }
}

// Нотификация 10+ стран
function notifixALotOfCountry() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

// Создание списка от 2 - 10 стран
function listGeneration(listCountry) {
  const markup = listCountry
    .map(
      country => `<li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
    <img src=${country.flags.svg} alt="Flag ${country.name.common}" style="width: 20px; 
    height: 100%; aline-item: centre;" >
    <p style='margin: 0;'>${country.name.official}</p>`
    )
    .join('');

  refs.resultList.innerHTML = markup;
}

// Создание описания 1 страны
function descriptionCountry(listCountry) {
  const markup = listCountry
    .map(
      country => `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
      <img src=${country.flags.svg} alt="Flag ${
        country.name.common
      }" style="width: 40px; 
      height: 100%; aline-item: centre;" >
      <h2 style='margin: 0; font-size: 40px'>${country.name.official}</h2>
      </div>
      <ul style="list-style: none;">
      <li style="font-size: 25px; font-weight: 700">Capital: <span style='font-weight: 400'>${
        country.name.official
      }</span></li>
      <li style="font-size: 25px; font-weight: 700">Population: <span style='font-weight: 400'>${
        country.population
      }</span></li>
      <li style="font-size: 25px; font-weight: 700">Languages: <span style='font-weight: 400'>${Object.values(
        country.languages
      )}</span></li>`
    )
    .join('');

  refs.infoBox.innerHTML = markup;
}

// ошибка при неверном запросе
function errorSearch() {
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}

// удаление созданных результатов поиска
function remuveCountry() {
  refs.resultList.innerHTML = '';
  refs.infoBox.innerHTML = '';
}
