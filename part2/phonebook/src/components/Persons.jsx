const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      <ul>
        {personsToShow.map(person =>
          <Person 
            key={person.id} 
            person={person} 
            handleDelete={handleDelete} 
          />
        )}
      </ul>
    </div>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </li>
  )
}

export default Persons
