import { useState } from "react";
import axios from 'axios';


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [wrongLocation, setWrongLocation] = useState(false);

  const url = `${process.env.REACT_APP_url_1}${location}${process.env.REACT_APP_url_2}`;

  const searchLocation = (event) => {
    setWrongLocation(false);
    event.preventDefault();
    axios.get(url).then((response) => {
      setData(response.data);
    })
      .catch((error) => {
        console.log(error);
        if (error.name === 'AxiosError') {
          return setWrongLocation(true);
        }
      });
    setLocation('');
  };

  const tempCelsius = (kelvin) => {
    const temp = (kelvin - 273.15).toFixed(1);
    return `${temp} °c`;
  };

  const timeStamp = (unix, timezone) => {
    let offset = timezone / 3600;
    let date = new Date(unix * 1000);
    let hours = date.getHours().toString().padStart(2, 0);
    let minutes = date.getMinutes().toString().padStart(2, 0);
    let timezoneOffset = (+hours + offset - 1) % 24;
    if (timezoneOffset <= 0) {
      timezoneOffset = timezoneOffset + 24;
    }
    if (timezoneOffset > 12) {
      return `${timezoneOffset - 12}:${minutes}pm`;
    } else if (timezoneOffset === 12) {
      return `${timezoneOffset}:${minutes}pm`;
    } else {
      return `${timezoneOffset}:${minutes}am`;
    }
  };

  return (
    <div className="app">
      <div className="search">
        <form onSubmit={searchLocation}>
          <input
            className={wrongLocation ? 'locationWrong' : ''}
            value={location}
            onChange={event => setLocation(event.target.value)}
            placeholder={wrongLocation ? "Location Not Found..." : "Enter Location"}
            type="text"
          />
        </form>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            <h1>{data.main ? tempCelsius(data.main.temp) : null}</h1>
          </div>
          <div className="description">
            <p>{data.weather ? data.weather[0].main : null}</p>
          </div>
        </div>
        {data.main ? <div className="sunriseSet">
          <div className="sunrise">
            <h2 className="thinWeight">Sunrise</h2>
            <p>{data.sys ? timeStamp(data.sys.sunrise, data.timezone) : null}</p>
          </div>
          <div className="sunset">
            <h2 className="thinWeight">Sunset</h2>
            <p>{data.sys ? timeStamp(data.sys.sunset, data.timezone) : null}</p>
          </div>
        </div> : null}
        {data.main ? <div className="bottom">
          <div className="feels">
            <p className="bold">{data.main ? tempCelsius(data.main.feels_like) : null}</p>
            <p className="thinWeight">Feels like</p>
          </div>
          <div className="wind">
            <p className="bold">{data.wind ? `${((data.wind.speed * 3.6)).toFixed(0)} km/h` : null}</p>
            <p className="thinWeight">Wind</p>
          </div>
          <div className="humiditiy">
            <p className="bold">{data.main ? data.main.humidity + '%' : null}</p>
            <p className="thinWeight">Humiditiy</p>
          </div>

        </div> : null}
      </div>
      <div className="credit">
        <p> Photo By | &nbsp;
          <a href="https://www.amackintosh.com/">© Anthony Mackintosh Photography 2022</a>
        </p>
      </div>
    </div>
  );
}

export default App;
