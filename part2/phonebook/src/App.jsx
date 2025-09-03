import { useState, useEffect } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const addName = (event) => {
    event.preventDefault();

    persons.forEach((element) => {
      if (element.name !== newName) {
        setPersons(persons.concat({ name: newName, number: newNumber }));
        setNewName('');
        setNewNumber('');
      } else {
        alert(`${newName} is already added to phonebook`);
      }
    });
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
      ? setPersons(
          persons.filter((person) =>
            person.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      : setPersons(persons);
  }, [search]);
  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with{' '}
        <input type='text' onChange={handleSearch} value={search} />
      </div>
      <h2>add a new</h2>
      <form>
        <div>
          name: <input onChange={handleNameChange} value={newName} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} value={newNumber} />
        </div>
        <div>
          <button type='submit' onClick={addName}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>

      <div>
        {persons.map((person, index) => (
          <div key={index}>
            {person.name} {person.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
