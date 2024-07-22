const Header = props => {
    const { course } = props
    return <h2>{course.name}</h2>
  };
  
  const Part = (props) => {
    const { name, exercises } = props.part
    return <p>{name} {exercises}</p>
  }
  
  const Content = (props) => {
    return props.parts.map(part => <Part key={part.id} part={part} />)
  }
  
  const Total = (props) => {
    const total = props.parts.reduce((accumulator, part) => accumulator + part.exercises, 0)
    return <b>total of {total} exercises</b>
  }
  
  const Course = (props) => {
    const { course } = props;
    return (<>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} /></>
    )
  }
  
  export default Course