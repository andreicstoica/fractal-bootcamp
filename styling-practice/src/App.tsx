import './App.css'
//import { Task } from './components/Task'
import { TaskList } from './components/TaskList'
import { Messages } from './components/Messages'

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


  const avatar1: string = '/public/assets/avatar1.png'
  const avatar2: string = '/public/assets/avatar2.png'
  const messageData = [
    {
      isMe: true,
      avatar: avatar1,
      text: "I just completed my first 10k run this morning, and I feel amazing! It was a bit of a struggle towards the end, but pushing through the last kilometer was so rewarding. Now, I'm enjoying a big breakfast to refuel. If anyone wants to join me for a run next week, let me know!"
    },
    {
      isMe: true,
      avatar: avatar1,
      text: "I'm planning a weekend getaway to the mountains and can't wait to disconnect from the hustle and bustle of city life. I've booked a cozy cabin with a fireplace, and I'm looking forward to some hiking, stargazing, and simply enjoying the peace and quiet. "
    },
    {
      isMe: true,
      avatar: avatar1,
      text: "I'm planning a weekend getaway to the mountains and can't wait to disconnect from the hustle and bustle of city life. I've booked a cozy cabin with a fireplace, and I'm looking forward to some hiking, stargazing, and simply enjoying the peace and quiet. "
    },
    {
      isMe: false,
      avatar: avatar2,
      text: "I've decided to take up a new hobby and start learning how to play the piano. It's something I've always wanted to do, and I finally signed up for lessons. The first few sessions have been challenging, but I love the feeling of progress with each practice."
    },
    {
      isMe: true,
      avatar: avatar1,
      text: "I just completed my first 10k run this morning, and I feel amazing! It was a bit of a struggle towards the end, but pushing through the last kilometer was so rewarding. Now, I'm enjoying a big breakfast to refuel. If anyone wants to join me for a run next week, let me know!"
    }
  ]

function App() {
  return (
    <div className='flex flex-col w-3/4 m-auto'>
      { /* <Task taskData={exampleTask} /> */ }
      { /* <TaskList initialTaskData={exampleTaskList} /> */ }
      <Messages messageData={messageData} />
    </div>
  )
}

export default App