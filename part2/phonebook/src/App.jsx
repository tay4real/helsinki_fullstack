import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [filteredPersons, setFilteredPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const addName = (event) => {
    event.preventDefault();
    let count = 0;
    persons.forEach((element) => {
      if (element.name === newName) {
        count += 1;
      }
    });

    if (count === 0) {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName('');
      setNewNumber('');
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    search !== ''
      ? setFilteredPersons(
          persons.filter((person) =>
            person.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      : setFilteredPersons(persons);
  }, [search, persons]);
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter handleSearch={handleSearch} search={search} />

      <h3>add a new</h3>
      <PersonForm
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
        addName={addName}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
