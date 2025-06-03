import './App.css'
//import { Task } from './components/Task'
import { TaskList } from './components/TaskList'

/*
const exampleTask = {
  id: 0,
  title: "Sweep the Kitchen",
  description: "Get under the cabinets, do a good job",
  checked: false
}
*/

const exampleTaskList = 
  [
    {
      id: 0,
      title: "Dishwashing", 
      description: "Wash and dry dishes, pots, pans, and utensils",
      checked: false
    },
    {
      id: 1,
      title: "Laundry",
      description: "Wash, dry, fold, and put away clothes and linens.",
      checked: false
    },
    {
      id: 2,
      title: "Vaccuming",
      description: "Vacuum carpets, rugs, and floors throughout the house",
      checked: false
    },
    {
      id: 3,
      title: "Dusting",
      description: "Dust furniture, shelves, and other surfaces",
      checked: false
    }
  ]


function App() {

  return (
    <div className='flex flex-col items-center'>
      { /* <Task taskData={exampleTask} /> */ }
      <TaskList initialTaskData={exampleTaskList} />
    </div>
  )
}

export default App