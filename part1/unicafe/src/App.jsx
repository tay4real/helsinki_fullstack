import { useState } from 'react';

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good} />
        <StatisticLine text='neutral' value={props.neutral} />
        <StatisticLine text='bad' value={props.bad} />
        <StatisticLine text='all' value={props.total} />
        <StatisticLine text='average' value={props.average} />
        <StatisticLine text='positive' value={props.positive} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState();

  const handleGood = () => {
    const val = good + 1;
    setGood(val);
    setTotal(val + neutral + bad);
    setAverage((val * 1 + neutral * 0 + bad * -1) / (val + neutral + bad));
    setPositive(((val * 1) / (val + neutral + bad)) * 100 + ' %');
  };

  const handleNeutral = () => {
    const val = neutral + 1;
    setNeutral(val);
    setTotal(good + val + bad);
    setAverage((good * 1 + val * 0 + bad * -1) / (good + val + bad));
    setPositive(((good * 1) / (good + val + bad)) * 100 + ' %');
  };

  const handleBad = () => {
    const val = bad + 1;
    setBad(val);
    setTotal(good + neutral + val);
    setAverage((good * 1 + neutral * 0 + val * -1) / (good + neutral + val));
    setPositive(((good * 1) / (good + neutral + val)) * 100 + ' %');
  };

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={handleGood} text='good' />
      <Button onClick={handleNeutral} text='neutral' />
      <Button onClick={handleBad} text='bad' />

      <h2>statistics</h2>
      {total !== 0 ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
          positive={positive}
        />
      ) : (
        'No feedback given'
      )}
    </div>
  );
};

export default App;
