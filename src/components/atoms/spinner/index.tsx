export default function Spinner() {
  return (
    <div className=" flex items-center justify-center">
      <div className="flex justify-center items-center">
        <svg width={40} height={40} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#6744FF" strokeWidth="5" strokeLinecap="round" strokeDasharray="80, 200" />
        </svg>
      </div>
    </div>
  )
}
