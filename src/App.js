import React from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: [],
      input: "",
      findcountry: [],
      weather: [],
      weather_info: {
        temperature: "",
        description: "",
        image: "",
        windspeed: "",
        winddirection: "",
      },
    };
  }
  componentDidMount() {
    axios.get("https://restcountries.eu/rest/v2/all").then((res) => {
      var country_data = res.data;
      console.log(country_data);
      this.setState({
        country: country_data,
      });
    });
  }

  handleChange = (event) => {
    const filtercountry = this.state.country.filter((item) =>
      item["name"].toLowerCase().includes(event.target.value.toLowerCase())
    );
    console.log(filtercountry);
    this.setState({
      input: event.target.value,
      findcountry: filtercountry,
    });
    if (filtercountry.length == 1) {
      var capital = filtercountry[0]["capital"];
      this.getWeather(capital);
    }
  };

  seeCountry = (key) => {
    // event.preventDefault();
    const filtercountry = this.state.country.filter(
      (item) => item["alpha2Code"] == key
    );
    var capital = filtercountry[0]["capital"];
    this.setState({
      findcountry: filtercountry,
    });
    this.getWeather(capital);
  };

  getWeather = (capital) => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=e44d124ae1e1275b087c59b0841af86d&query=${capital}`
      )
      .then((res) => {
        var country_weather_data = res.data;
        console.log(country_weather_data);
        this.setState({
          weather: country_weather_data,
          weather_info: {
            temperature: country_weather_data["current"]["temperature"],
            image: country_weather_data["current"]["weather_icons"][0],
            description:
              country_weather_data["current"]["weather_descriptions"][0],
            windspeed: country_weather_data["current"]["wind_speed"],
            winddirection: country_weather_data["current"]["wind_dir"],
          },
        });
      });
  };

  render() {
    const searchField = this.state.input;
    var findcountry = this.state.findcountry;
    return (
      <div className="app_container">
        <h1>Country???</h1>
        <form onSubmit={this.findcountry}>
          Find country &nbsp;
          <input
            onChange={this.handleChange}
            value={this.state.input}
            placeholder="Type the country name"
          ></input>
        </form>
        {findcountry.length <= 0 ? (
          <div>Country not found</div>
        ) : findcountry.length > 10 ? (
          <p>To many matches, please specific</p>
        ) : findcountry.length == 1 ? (
          <div>
            {this.state.findcountry.map((item) => (
              <div>
                <h1>{item.name}</h1>
                <div className="app_flag">
                  <img className="app_flag_img" src={`${item.flag}`}></img>
                </div>
                <div className="app_country_info">
                  <div>
                    <strong>Capital:</strong> {item.capital}
                  </div>
                  <div>
                    <strong>Population:</strong> {item.population}
                  </div>
                  <div>
                    <strong>Language(s):</strong>
                    {item.languages.map((lang) => (
                      <li>{lang.name}</li>
                    ))}
                  </div>
                </div>
                <div className="app_weather">
                  <h2>Weather in {item.capital}</h2>
                  <h3>{this.state.weather_info.description}</h3>
                  <img src={`${this.state.weather_info.image}`}></img>
                  <div>
                    <div>
                      <strong>Temperature:</strong>&nbsp;
                      {this.state.weather_info.temperature}
                      °C
                    </div>
                    <div>
                      <strong>Wind speed:</strong>&nbsp;
                      {this.state.weather_info.windspeed}km/h direction{" "}
                      {this.state.weather_info.winddirection}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="app_country_list">
            {this.state.findcountry.map((item) => (
              <li key={item.alpha2Code}>
                <div className="app_country_name">- {item.name}</div>
                <button
                  className="appp_country_more"
                  type="button"
                  onClick={() => this.seeCountry(item.alpha2Code)}
                >
                  Show info
                </button>
              </li>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
