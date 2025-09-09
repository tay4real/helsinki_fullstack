const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
