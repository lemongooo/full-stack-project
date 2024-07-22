import React from 'react'
import CountryDetail from './CountryDetail'

const CountryList = ({ countries, setFilter }) => {
  if (countries.length === 0) {
    return <div>No matches found</div>
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  } else {
    return (
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button>
          </div>
        ))}
      </div>
    )
  }
}

export default CountryList
