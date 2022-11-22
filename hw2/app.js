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

const searchInput = document.querySelector('.searchInput');
const searchButton = document.querySelector('.searchButton');

const fetchData = (data) => {
    const {name} = data;
    const {country} = data.sys;
    const date = new Date(data.dt);
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
    currentTemp.textContent = `${Math.floor(temp-273)}º`;
    minTemp.textContent = `L:${Math.floor(temp_min-273)}º`;
    maxTemp.textContent = `H:${Math.floor(temp_max-273)}º`;
    realFeel.textContent =`R:${Math.floor(feels_like-273)}º`;
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
        countryName.textContent = data[0].altSpellings[1];
    } catch (e) {
        alert('No country such as exists!', e);
    }
}

// Getting API by typing city name
const fetchWeather = async (city) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=85f1cd8997fc9613aec7e86ba854d048`);
        const data = await res.json();
        fetchData(data);
    } catch(e) {
        alert('No city such as exists!', e);
    }
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    fetchWeather(searchInput.value);
    searchInput.value = '';
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
