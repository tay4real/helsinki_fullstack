const PersonForm = ({
  handleNameChange,
  newName,
  handleNumberChange,
  newNumber,
  addName,
}) => {
  return (
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
  );
};

export default PersonForm;
