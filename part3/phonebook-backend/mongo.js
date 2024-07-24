const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mollymeng425:${encodeURIComponent(password)}@cluster0.gs9koev.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // 列出所有电话簿条目
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error fetching persons:', error)
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // 向电话簿添加新条目
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error saving person:', error)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the correct arguments: node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}
