import clsx from 'clsx'

type Message = {
  isMe: boolean,
  avatar: string,
  text: string
}

type MessageProps = {
  messageData: Message[]
}

export function Messages({ messageData }: MessageProps) {
  const sortedMessages = [[messageData[0]]]
  for (let i = 1; i < messageData.length; i ++) {
    const prev = messageData[i-1]
    const current = messageData[i]

    // if the sender is the same as previous
    if (prev.isMe === current.isMe) {
      // if same sender, add to existing sub list 
      sortedMessages[sortedMessages.length - 1].push(current)
    } else {
      // create new sub list 
      sortedMessages.push([current])
    }
  }

  const baseMessageStyle = clsx('flex place-content-start gap-4')
  const baseTextStyle = clsx('text-xs p-3 rounded-lg self-start')
  const baseImgStyle = clsx('aspect-square max-w-1/30 rounded-full self-start')

  const firstMessageRounding = clsx('rounded-r-none rounded-tr-lg')
  const endMessageRounding = clsx('rounded-r-none rounded-br-lg')

  return(
    <div className="flex flex-col gap-2 p-2">
      {sortedMessages.map((subMessageArr) => {
        return (
          subMessageArr.map((subMessage, i) => {
            const conditionalStyle = clsx(
              baseTextStyle,
              subMessage.isMe
                ? 'bg-messageBlue ml-24'
                : 'bg-messageGrey mr-24', 
              {
                [firstMessageRounding]: (i === 0 && subMessageArr.length > 1)
              }, 
              {
                [endMessageRounding]: (i === subMessageArr.length - 1 && subMessageArr.length > 1)
              })

            return(
              // horizontal message block (text & image)
              <div className={clsx(
                baseMessageStyle, 
                subMessage.isMe 
                  ? 'flex-row' 
                  : 'flex-row-reverse'
                )}>
                {/*  actual text block */}
                <div className={conditionalStyle} >
                  {subMessage.text}
                </div>
                <img 
                  src={subMessage.avatar} 
                  alt='profile photo' 
                  className={clsx(baseImgStyle, {'invisible': i > 0})} />
              </div>
            )
          })
        )
      })}
    </div>
  )
}