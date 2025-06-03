import clsx from 'clsx'
import { useState } from 'react'

interface TaskInfo {
    title: string;
    description: string;
}

type TaskProps = {
  taskData: TaskInfo
}

export function Task({ taskData }: TaskProps) {
  const title: string = taskData.title
  const description: string = taskData.description

  const [checked, setChecked] = useState(false)

  return(
    <div className={clsx('flex flex-row py-3 px-4 max-w-1/2 w-full max-h-1/8 gap-3 items-center border-2 border-gray-200 rounded-lg', checked && 'bg-green-100')}>
      <button className={clsx('aspect-square h-6 border-1 border-gray-300 rounded-lg', checked && 'bg-green-600')} onClick={() => setChecked(prev => !prev)} />
      <div className='flex flex-col gap-1 font-[Inter]'>
        <div className='text-lg font-light'>{title}</div>
        <div className='text-sm font-light text-gray-400'>{description}</div>
      </div>
    </div>
  )
}