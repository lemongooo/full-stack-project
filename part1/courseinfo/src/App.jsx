const Header = (props) => {
  return (
      <p>
        {props.course}
      </p>
  )
}

const Part =(props) => {
  return(
    <p>{props.parts} {props.exercises}</p>
  )
}

const Content = (props) => {
  return (
      <p>
        <Part parts={props.parts[0].name} exercises={props.parts[0].exercises} />
        <Part parts={props.parts[1].name} exercises={props.parts[1].exercises} />
        <Part parts={props.parts[2].name} exercises={props.parts[2].exercises} />
      </p>
  )
}

const Total = (props) => {
  const  total = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
  return (
      <p>
        Total number of exercise is {total}
      </p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  //const course = 'Half Stack application development'
  // const part1 = 
  // const exercises1 = 10
  // const part2 = 'Using props to pass data'
  // const exercises2 = 7
  // const part3 = 'State of a component'
  // const exercises3 = 14

  return (
    
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App