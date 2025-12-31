import Card from '@/components/atoms/Card'

interface ErrorCardProps {
  title: React.ReactNode
  description: string
}

const ErrorCard = ({ title, description }: ErrorCardProps) => {
  return (
    <Card className="rounded-lg px-6 my-4">
      <div className="flex flex-col gap-8 justify-center items-center">
        <p className="text-center text-[#18191A] text-2xl font-bold font-poppins">{title}</p>
      </div>
      <p className="text-[#6B7280] text-sm font-normal pt-4 text-center px-8">{description}</p>
    </Card>
  )
}

export default ErrorCard
