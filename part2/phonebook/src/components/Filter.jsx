const Filter = ({ handleSearch, search }) => {
  return (
    <div>
      filter shown with{' '}
      <input type='text' onChange={handleSearch} value={search} />
    </div>
  );
};

export default Filter;
