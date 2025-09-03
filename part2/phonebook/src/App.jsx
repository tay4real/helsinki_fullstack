import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const addName = (event) => {
    event.preventDefault();

    persons.forEach((element) => {
      if (element.name !== newName) {
        setPersons(persons.concat({ name: newName }));
        setNewName('');
      } else {
        alert(`${newName} is already added to phonebook`);
      }
    });
  };

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input onChange={handleInputChange} value={newName} />
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
          <div key={index}>{person.name}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
