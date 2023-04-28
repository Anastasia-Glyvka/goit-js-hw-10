import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const BASE_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const inputValue = input.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2) {
          renderCountryList(data);
        } else if (data.length === 1) {
          renderCountryInfo(data);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountryList(countries) {
  const countryListMarkup = countries
    .map(country => {
      return `<li class="list-item"><img src="${country.flags.svg}" alt="${country.name.official}" width="50" height="25"><h2>${country.name.official}</h2></li>
`;
    })
    .join('');
  countryList.innerHTML = countryListMarkup;
}

function renderCountryInfo(countries) {
  const countryInfoMarkup = countries
    .map(country => {
      return `<div class="container">
  <img src="${country.flags.svg}" alt="${
        country.name.official
      }" width="50" height="25">
  <h2>${country.name.official}</h2>
</div>
<p><b>Capital:</b> ${country.capital}</p>
<p><b>Population:</b> ${country.population}</p>
<p><b>Languages:</b> ${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = countryInfoMarkup;
}
