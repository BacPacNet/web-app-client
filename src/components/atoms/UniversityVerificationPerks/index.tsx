import { HiCheckCircle } from 'react-icons/hi'

export default function UniversityVerificationPerks() {
  const features = [
    'Can join more than 1 university community',
    'Can join private groups in university community',
    'Can create groups within university community',
  ]

  return (
    <div className="max-w-xl mb-2">
      <p className="text-neutral-700 font-medium text-xs mb-4">Verify your account through your university email to unlock full features:</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-neutral-600 font-normal text-xs">
            <HiCheckCircle className="text-primary-500 w-5 h-5 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
