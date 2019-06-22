const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')

const renderForecast = (dayData) => {
    const paraDay = document.createElement('p');
    const paraSummary = document.createElement('p');
    const paraTempHigh = document.createElement('p');
    const paraTempLow = document.createElement('p');

    message2.appendChild(paraDay);
    message2.appendChild(paraSummary);
    message2.appendChild(paraTempHigh);
    message2.appendChild(paraTempLow);

    paraDay.textContent = dayData.day;
    paraSummary.textContent = `Forecast: ${dayData.summary}`;
    paraTempHigh.textContent = `Temperature (high): ${dayData.temperatureHigh}`;
    paraTempLow.textContent = `Temperature (low): ${dayData.temperatureLow}`;

    paraDay.classList.add('paraDay');
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;

    message1.textContent = 'Data is loading...';
    message2.innerHTML = '';

    fetch(`/weather?address=${location}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                message1.textContent = data.error
            } else {
                message1.textContent = `Displaying results for ${data.location}`;
                for (day in data.forecast) {
                    renderForecast(data.forecast[day]);
                }
            }
    })
})