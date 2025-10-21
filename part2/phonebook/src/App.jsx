import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';
import Notification from './components/Notification';
import ErrorNotification from './components/ErrorNotification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    let count = 0;
    persons.forEach((element) => {
      if (element.name === newName) {
        count += 1;
      }
    });

    if (count === 0) {
      const newObject = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(newObject)
        .then((response) => {
          setPersons(persons.concat(response));
          setSuccessMessage(`Added ${response.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    } else {
      const updPerson = persons.filter((person) => person.name === newName);

      if (
        confirm(
          `${updPerson[0].name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newObject = {
          name: newName,
          number: newNumber,
        };
        personService
          .update(updPerson[0].id, newObject)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === updPerson[0].id ? response : person
              )
            );
            setSuccessMessage(`Updated ${response.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${updPerson[0].name} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(
              persons.filter((person) => person.id !== updPerson[0].id)
            );
          });
      }
    }
  };

  const handleDelete = (id) => {
    const delPerson = persons.filter((person) => person.id === id);

    if (confirm(`Delete ${delPerson[0].name}?`)) {
      personService.deletePerson(id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
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

  const filteredPersons =
    search !== ''
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
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
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
