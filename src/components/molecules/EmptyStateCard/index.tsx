import Card from '@/components/atoms/Card'
import Title from '@/components/atoms/Title'
import Image from 'next/image'

interface EmptyStateCardProps {
  imageSrc: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  title: React.ReactNode
  description: string
}

const EmptyStateCard = ({ imageSrc, imageAlt = 'placeholder', imageWidth = 250, imageHeight = 171, title, description }: EmptyStateCardProps) => {
  return (
    <Card className="rounded-2xl px-6 my-4">
      <div className="flex flex-col gap-8 justify-center items-center">
        <Image src={imageSrc} width={imageWidth} height={imageHeight} alt={imageAlt} />
        <Title className="text-center">{title}</Title>
      </div>
      <p className="text-neutral-700 font-normal pt-4">{description}</p>
    </Card>
  )
}

export default EmptyStateCard
