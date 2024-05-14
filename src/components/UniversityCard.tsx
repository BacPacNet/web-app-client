/* eslint-disable @next/next/no-img-element */
const UniversityCard = ({ name, image, logo }: { name: string; image: string; logo: string }) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden relative">
      <img src={image} alt={name} className="w-full h-52 object-cover transition-all duration-500" style={{ opacity: 0.7 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent transition-all duration-500 opacity-0 hover:opacity-100"></div>
      <div className="px-8 py-2 text-gray-700 flex flex-row items-center justify-between gap-20">
        <div className="w-9 h-9 rounded-full flex-shrink-0">
          <img src={logo} alt={name} className="object-cover w-full h-full" />
        </div>
        <p className="font-semibold text-lg flex-grow text-right">{name}</p>
      </div>
    </div>
  )
}

export default UniversityCard
