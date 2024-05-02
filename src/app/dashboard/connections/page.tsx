import ConnectionsTab from '@/components/Tabs/connections'
import Image from 'next/image'
// import studentImg from '../../assets/demopic.jpg'
import studentImg from '../../../assets/demopic.jpg'
import { Button } from '@chakra-ui/react'

const Connections = () => {
  return (
    <div className="flex justify-center gap-12 mt-10">
      <div className="w-[590px] h-[80vh] border rounded-md px-10 py-5">
        <div>
          <ConnectionsTab />
        </div>
      </div>
      <div className="w-[482px] h-[70vh] border rounded-md px-6 py-3">
        <h2 className="text-2xl">Recommendations</h2>
        <div className="flex items-center justify-between py-6">
          <div className="flex gap-2">
            <div>
              <Image src={studentImg} className="w-[80px] h-[80px]" alt="STUDENT" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Alina Shetti</h2>
              <p className="text-sm">Nagoya University</p>
              <p className="text-sm">2nd Yr. Undergraduate, Psychology</p>
            </div>
          </div>
          <div>
            <Button colorScheme="gray" color="blue" size="sm" className="rounded-sm">
              Visit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connections
