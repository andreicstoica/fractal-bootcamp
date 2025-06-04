type HeatmapProps = {
  heatmapData: number[][]
}

export function Heatmap({ heatmapData }: HeatmapProps) {
  const heatmapColors = ['bg-[#D9D9D9]', 'bg-[#9EB0E5]', 'bg-[#D9E2FA]', 'bg-[#3E5FCC]']

  return(
    // need to fix how i send the rows, was trying grid before but i think rows with flex will be easier
    <div className='flex flex-col'>
      {heatmapData.map(row => {
        return(
          <div>
            {row.map((cell) => {
              {console.log(heatmapColors[cell])}
              return(
                <div className={heatmapColors[cell]}></div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}