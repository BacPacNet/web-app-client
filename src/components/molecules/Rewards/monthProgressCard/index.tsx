const MonthProgressCard = ({ monthProgress, monthEarnings }: { monthProgress: number; monthEarnings: number }) => {
  return (
    <div className="p-5 rounded-lg bg-primary flex gap-10 items-center">
      <div>
        <p className="text-sm font-normal text-white">Month&apos;s Progress</p>
        <p className="text-md font-bold text-white font-poppins">{monthProgress} Invites</p>
      </div>
      <div>
        <p className="text-sm font-normal text-white"> Month&apos;s Earnings</p>
        <p className="text-md font-bold text-white font-poppins">₹{monthEarnings}</p>
      </div>
    </div>
  )
}

export default MonthProgressCard
