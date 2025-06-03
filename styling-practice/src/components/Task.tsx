import clsx from 'clsx'

export interface TaskData {
  id: number;
  title: string;
  description: string;
  checked: boolean
}

type TaskProps = {
  taskData: TaskData
  toggleChecked: () => void
}

export function Task({ taskData, toggleChecked }: TaskProps) {
  const title: string = taskData.title
  const description: string = taskData.description
  const checked: boolean = taskData.checked

  return(
    <div className={clsx('flex flex-row py-3 px-4 w-full max-w-1/2 max-h-1/4 gap-3 items-center border-1 border-borderGray rounded-lg', checked && 'bg-bgGreen')}>
      <button className={clsx('aspect-square h-6 border-1 border-borderGray rounded-lg', checked && 'bg-selectGreen')} onClick={toggleChecked} />
      <div className='flex flex-col gap-1 font-[Inter]'>
        <div className='text-lg font-light'>{title}</div>
        <div className='text-sm font-light text-textGray'>{description}</div>
      </div>
    </div>
  )
}