import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error("Error fetching data: ", error)
      })
  }, [])

  const handleFilterChange = (event) => {
    const query = event.target.value
    setFilter(query)
    if (query && countries) {
      const results = countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCountries(results)
    } else {
      setFilteredCountries([])
    }
  }

  // Do not render anything if countries is still null
  if (!countries) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Country Information</h1>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountryList countries={filteredCountries} setFilter={setFilter} />
    </div>
  )
}

export default App
