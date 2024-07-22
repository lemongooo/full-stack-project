import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  // Fetch initial data from server
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // Function to add a new name and number to the phonebook or update an existing one
  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(entry => entry.name === newName)
    
    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        // 2.15*: Update existing person's number on the backend server
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
          })
          .catch(error => {
            setNotification({ message: `Information of ${existingPerson.name} has already been removed from server`, type: 'error' })
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
          })
      }
    } else if (newNumber.trim() === '') { // Check if the phone number is empty
      alert('Please enter a phone number.')
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }

      // 2.12: Save new person to the backend server
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // 2.14: Function to delete a person from the phonebook
  const handleDelete = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ message: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
        .catch(error => {
          setNotification({ message: `Information of ${person.name} has already been removed from server`, type: 'error' })
          setPersons(persons.filter(p => p.id !== id))
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h3>Numbers</h3>
      <Persons 
        personsToShow={personsToShow} 
        handleDelete={handleDelete} 
      />
    </div>
  )
}

export default App
