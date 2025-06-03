import { useState } from 'react'
import type { TaskData } from './Task'
import { Task } from './Task'

type TaskListProps = {
  initialTaskData: TaskData[]
}

export function TaskList({ initialTaskData }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTaskData)

  const toggleTask = (taskId: number): void => {
    setTasks((prev) => {
      const newTasks = structuredClone(prev)
      // finding the task that got clicked via ID
      const taskToChange = newTasks.find((task) => task.id === taskId)
      // if it doesn't exist return
      if (!taskToChange) return newTasks
      // swapping check
      taskToChange.checked = !taskToChange.checked
      return newTasks
    })
  }

  // sorting based on boolean 
  tasks.sort((a: TaskData, b: TaskData) => a.checked ? -1 : 1)

  return(
    <div className='flex flex-col gap-4 w-full items-center'>
      {tasks.map(task => {
        return(<Task taskData={task} toggleChecked={() => toggleTask(task.id)} />)
      })}
    </div>
  )
}
