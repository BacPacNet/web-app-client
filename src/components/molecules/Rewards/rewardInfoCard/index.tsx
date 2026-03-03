import Image from 'next/image'

const RewardInfoCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <div className="flex gap-3 p-4 items-start  rounded-xl border border-[#E5E7EB] ">
      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#F3F2FF]">
        <Image src={icon} alt={title} width={20} height={20} />
      </div>

      <div className="w-auto">
        <h3 className="font-normal text-sm text-[#18191A]">{title}</h3>
        <p className="text-sm font-normal text-[#6B7280]">{description}</p>
      </div>
    </div>
  )
}

export default RewardInfoCard
