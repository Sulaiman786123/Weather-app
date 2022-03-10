// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';


export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		//FETCH CITY + WEATHER CONDITION + TEMPERATURE + WINDSPEED
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=d86e42981c23288b74c6311023cfed76";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		//FETCH PARTICLE MATTER
		var url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=51.5072&lon=0.1276&appid=d86e42981c23288b74c6311023cfed76";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse_Particle,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		//FETCH HOURLY TEMPERATURE
		var url = "http://api.weatherapi.com/v1/forecast.json?key=814e082b092e4cae8fc150902220803&q=London&days=1&aqi=no&alerts=yes";
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseResponse_Hourly,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		//FETCH DAILY WEATHER TEMPERATURE
		var url = "http://api.weatherapi.com/v1/forecast.json?key=814e082b092e4cae8fc150902220803&q=London&days=1&aqi=no&alerts=yes";
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseResponse_Daily,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		//FETCH ANY ALERTS! CHECK IF WEATHER IS DANGEROUS - IF SO NOTIFY USER
		var url = "http://api.weatherapi.com/v1/forecast.json?key=814e082b092e4cae8fc150902220803&q=London&days=1&aqi=no&alerts=yes";
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseResponse_Alert,
			error : function(req, err){ console.log('API call failed ' + err); }
		})

		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		//const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		// display all weather data
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
						<span class={ style.hourly }>{ this.state.temp }</span>
						<span class={ style.hourly }>{ this.state.wind }</span>
						<span class={ style.hourly }>{ this.state.particle }</span>
						<br></br>
						<span class = { style.hourly }>{ this.state.hourly }</span>
						<br></br>
						<span class = { style.hourly }>{ this.state.daily }</span>
						<br></br>
						<span class = { style.hourly }>{ this.state.alert }</span>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }> 
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData}/ > : null }
				</div>
			</div>
		);
	}

	//PARSE THE RESULTS FOR CITY+TEMP+CONDITION+WINDSPEED
	parseResponse = (parsed_json) => {
		//get city name
		var location = parsed_json['name'];

		//get temperature
		var temp_c = parsed_json['main']['temp'];
		temp_c = "Temperature: " +String(Math.round(temp_c)+ "°");

		//get weather condition
		var conditions = parsed_json['weather']['0']['description'];

		// get wind speed
		var wind_s = parsed_json['wind']['speed'];
		wind_s = "Windspeed: " + String(Math.round(wind_s)) + " m/s";
		
		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			wind : wind_s,
		});      
	}

	//PARSE THE RESULTS FOR PARTICLE
	parseResponse_Particle = (parsed_json) => {
		var particle_p = parsed_json['list']['0']['components']['pm10'];
		particle_p = "Particulate matter: " + String(Math.round(particle_p)+ " kg/m3");
		// set states for fields so they could be rendered later on
		this.setState({
			particle : particle_p
		});      
	}

	//PARSE THE RESULTS FOR HOURLY
	parseResponse_Hourly = (parsed_json) => {
		var hourly_h = [];
		for (let i = 0; i <= 23; i=i+4) {
			var temp = parsed_json['forecast']['forecastday']['0']['hour'][i]['temp_c'];
			temp = String(Math.round(temp)+ "°");
			hourly_h.push("Temperature at "+ i + " o'clock : "+ temp + " ");

			//Check console to see all the times
			//console.log([hourly_h[i]])
		  }
	
		// set states for fields so they could be rendered later on
		this.setState({
			hourly : hourly_h,
		});      
	}

	//PARSE THE RESULTS FOR DAILY TEMP
	parseResponse_Daily = (parsed_json) => {
		var daily_d = parsed_json['forecast'];
		console.log(daily_d);

		// set states for fields so they could be rendered later on
		this.setState({
			daily : daily_d
		});      
	}

	//PARSE THE RESULTS FOR ALERT
	parseResponse_Alert = (parsed_json) => {
		var alert_a = parsed_json['alerts']['alert'];
		
		if (alert_a.length != 0){
			alert_a = "WARNING! " + parsed_json['alerts']['alert'];
		}
		else{
			alert_a = "Normal weather conditions";
		}
		// set states for fields so they could be rendered later on
		this.setState({
			alert : alert_a
		});      
	}
}
