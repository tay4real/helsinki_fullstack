const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      {props.course.parts.map((part, index) => (
        <Part key={index} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      <strong>
        total of{' '}
        {props.course.parts.reduce((total, part) => {
          return total + part.exercises;
        }, 0)}{' '}
        exercises
      </strong>
    </p>
  );
};

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <Header course={course} />

          <Content course={course} />

          <Total course={course} />
        </div>
      ))}
    </div>
  );
};

export default Course;
