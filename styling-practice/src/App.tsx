import './App.css'
import { Task } from './components/Task'

const exampleTask = {
  title: "Sweep the Kitchen",
  description: "Get under the cabinets, do a good job"
}

function App() {

  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Task taskData={exampleTask} />
    </div>
  )
}

export default App