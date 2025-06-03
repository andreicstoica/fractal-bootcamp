//import { useState } from 'react'
import './App.css'

const exampleTask = {
  title: "Sweep the Kitchen",
  description: "Get under the cabinets, do a good job"
}

interface TaskProps {
  taskProps: {
    title: string;
    description: string
  }
}

function Task({ taskProps }: TaskProps) {
  const title: string = taskProps.title
  const description: string = taskProps.description
  return(
    <div>
      <button className='border'/>
      <div>
        {title}
        {description}
      </div>
    </div>
  )
}

function App() {
  //const [checked, setChecked] = useState(false)

  return (
    <div >
      <Task taskProps={exampleTask} />
    </div>
  )
}

export default App