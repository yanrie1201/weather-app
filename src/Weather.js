import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Weather.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/forecast?lat=-6.193668&lon=106.821960&appid=69cef2d0bd5b5c3873ec8763da4021b2'
        )
        setWeatherData(response.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  if (!weatherData) {
    return <div className="loading">Loading...</div>
  }

  const renderWeatherIcon = (icon) => {
    // Construct the URL for the weather icon based on the icon code
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`

    return <img src={iconURL} alt="Weather Icon" />
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()

    return `${day}, ${month} ${year}`
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  }

  const currentDate = new Date().toJSON().slice(0, 10)
  const filteredData = weatherData.list.filter((item) =>
    item.dt_txt.includes(currentDate)
  )

  const convertToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2) // Rounded to two decimal places
  }

  const formatDescriptionToCamelCase = (description) => {
    return description
      .split(' ')
      .map((word, index) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
  }

  return (
    <div className="weather-container">
      <h1 className="weather-header">Weather at Plaza Indonesia</h1>
      <div>
        {filteredData.map((item, index) => (
          <div className="weather-item" key={index}>
            <h2 className="weather-date">{formatDate(item.dt_txt)}</h2>
            <h2 className="weather-date">{formatTime(item.dt_txt)}</h2>
            <h3 className="weather-temperature">
              {convertToCelsius(item.main.temp)}°C
            </h3>
            {renderWeatherIcon(item.weather[0].icon)}
            <h4 className="weather-description">
              {formatDescriptionToCamelCase(item.weather[0].description)}
            </h4>
            <p>Humidity: {item.main.humidity}%</p>
            <p>Wind Speed: {item.wind.speed} m/s</p>
            <p>Cloudiness: {item.clouds.all}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Weather
