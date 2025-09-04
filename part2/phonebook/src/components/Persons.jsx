const Persons = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map((person, index) => (
        <div key={index}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  );
};

export default Persons;
