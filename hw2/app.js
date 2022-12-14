const cityName = document.querySelector('.city-name');
const countryName = document.querySelector('.country-name');
const currentTime = document.querySelector('.time');
const currentDate = document.querySelector('.date')
const wCondition = document.querySelector('.w-condition');
const dDescription = document.querySelector('.detailed-description');
const currentTemp = document.querySelector('.current-temp');
const minTemp = document.querySelector('.min-temp');
const maxTemp = document.querySelector('.max-temp');
const realFeel = document.querySelector('.real-feel');
const humidtyT = document.querySelector('.humidty');
const pressureT = document.querySelector('.pressure');
const windSpeed = document.querySelector('.wind-speed');
const windDirection = document.querySelector('.wind-direction');
const imgCont = document.querySelector('.img-container');

const searchFormByCity = document.querySelector('.search-bar-c');
const searchFormByL = document.querySelector('.search-bar-l');

const searchInputC = document.querySelector('#cityInput');
const searchButtonC = document.querySelector('#cButton');

const searchInputLon = document.querySelector('#lonInput');
const searchInputLat = document.querySelector('#latInput');
const searchButtonL = document.querySelector('#lButton');

const checkBtns = document.querySelectorAll("input[name='searchMethod']");

// Radio Buttons selection
const findSelected = () => {
    let selectedCheck = document.querySelector("input[name='searchMethod']:checked")
    if(selectedCheck.id === 'cityCheck'){
        searchFormByCity.classList.remove('display-none');
        searchFormByL.classList.add('display-none');  
    } else {
        searchFormByL.classList.remove('display-none');
        searchFormByCity.classList.add('display-none');
    }
}

checkBtns.forEach((check) => {
    check.addEventListener('change', findSelected);
});

// For avoiding repeation

const fetchData = (data) => {
    const {name} = data;
    const {country} = data.sys;
    const date = new Date(data.dt*1000);
    const {main, description} = data.weather[0];
    const {feels_like, humidity, pressure, temp, temp_max, temp_min} = data.main;
    const {deg,speed} = data.wind;
    const {id} = data.weather[0];
    
    cityName.textContent = name;
    getCountry(country);
    currentTime.textContent = date.toLocaleTimeString();
    currentDate.textContent = date.toLocaleDateString();
    wCondition.textContent = main;
    dDescription.textContent = description;
    currentTemp.textContent = `${Math.floor(temp-273)}??`;
    minTemp.textContent = `L:${Math.floor(temp_min-273)}??`;
    maxTemp.textContent = `H:${Math.floor(temp_max-273)}??`;
    realFeel.textContent =`R:${Math.floor(feels_like-273)}??`;
    humidtyT.textContent = `Humidty: ${humidity}%`;
    pressureT.textContent = `Pressure: ${pressure}HG`;

    windSpeed.textContent = `Wind Speed and Direction: ${speed}m/s`
    if (deg >= 0 && deg < 90){
        windDirection.textContent = 'North';
    } else if (deg >= 90 && deg <180){
        windDirection.textContent = 'East';
    } else if (deg >= 180 && deg < 270){
        windDirection.textContent = 'South';
    } else {
        windDirection.textContent = 'West';
    }    

    if(id >= 200 && id <= 232){
        imgCont.style.backgroundImage = `url(icons/wi-storm-showers.svg)`;
    } else if (id >= 300 &&  id <= 532){
        imgCont.style.backgroundImage = `url(icons/wi-rain-mix.svg)`;
    } else if (id >= 600 && id <= 622) {
        imgCont.style.backgroundImage = `url(icons/wi-snow-wind.svg)`;
    } else if (id >= 700 && id <= 781) {
        imgCont.style.backgroundImage = `url(icons/wi-fog.svg)`;
    } else if (id == 800) {
        imgCont.style.backgroundImage = `url(icons/wi-day-sunny.svg)`;
    } else {
        imgCont.style.backgroundImage = `url(icons/wi-cloudy.svg)`;
    };
        
}

const getCountry = async (country) => {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
        const data = await res.json();
        if(data[0].altSpellings[1]){
            countryName.textContent = data[0].altSpellings[1];
        } 
        else{
            countryName.textContent = data[0].altSpellings[0];
        }
    } catch (e) {
        alert('No country such as exists!', e);
    }
}

// Getting API by typing city name
const fetchWeatherByName = async (city) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=85f1cd8997fc9613aec7e86ba854d048`);
        const data = await res.json();
        fetchData(data);
    } catch(e) {
        alert('No city such as exists!', e);
    }
}

searchButtonC.addEventListener('click', (e) => {
    e.preventDefault();
    fetchWeatherByName(searchInputC.value);
    searchButtonC.value = '';
});

// Getting API by typing longitude and latitude name
const fetchWeatherByL = async (lat, lon) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=85f1cd8997fc9613aec7e86ba854d048`);
        const data = await res.json();
        fetchData(data);
    } catch(e) {
        alert('No city such as exists!', e);
    }
}

searchButtonL.addEventListener('click', (e) => {
    e.preventDefault();
    fetchWeatherByL(searchInputLat.value, searchInputLon.value);
    searchInputLat.value = '';
    searchInputLon.value = '';
});


// Automatically shows the weather of your current location
window.addEventListener('load', () => {
    let lon;
    let lat;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos) => {
            lon = pos.coords.longitude;
            lat = pos.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=85f1cd8997fc9613aec7e86ba854d048`

            fetch(api,{mode: 'cors'}).then((res) => {
                return res.json();
            })
            .then((data) => {
                fetchData(data);
            })
            .catch((err)=> {
                alert("There is no data like that", err);
            })
        })
    }
})
