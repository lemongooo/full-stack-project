import React from 'react'

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area} km²</div>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
    </div>
  )
}

export default CountryDetail
