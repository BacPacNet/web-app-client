import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Stack,
  // InputGroup, InputLeftElement, Input
} from '@chakra-ui/react'
import Image from 'next/image'
import searchIcon from '../../assets/search-icon.svg'
import studentImg from '../../assets/demopic.jpg'

const ConnectionsTab = () => {
  return (
    <Tabs colorScheme="purple">
      <TabList css={{ borderBottom: 'none' }}>
        <Tab>Find People</Tab>
        <Tab>Following</Tab>
        <Tab>Followers</Tab>
      </TabList>

      <TabPanels>
        <TabPanel css={{ padding: '20px 0px' }}>
          {/* <InputGroup>
            <InputLeftElement pointerEvents="none">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">
                  <Image src={searchIcon} alt="BACPAC LOGO" />
                </span>
              </div>
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Search People"
              css={{
                '::placeholder': {
                  position: 'absolute',
                  left: '50px', // Adjust left position
                  top: '50%', // Adjust top position
                  transform: 'translateY(-50%)', // Center vertically
                },
              }}
            />
          </InputGroup> */}

          {/* search bar */}
          <div className="relative mt-2 mb-6 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">
                <Image src={searchIcon} alt="BACPAC LOGO" />
              </span>
            </div>
            <input
              type="text"
              name="price"
              id="price"
              //   onChange={handleSearch}
              //   onClick={handleSearchHistory}
              placeholder="Search People"
              className="block w-full h-12 rounded-full border-0 py-1.5 pl-12 pr-20 text-gray-900 ring-1 ring-gray-light ring-inset ring-gray-300 placeholder:text-gray-400  text-sm lg:text-lg sm:leading-6"
            />
          </div>

          {/* data filter options */}

          <Stack spacing={4} direction="row" align="center">
            <Button colorScheme="purple" borderRadius="full" variant="outline" size="md">
              Year
            </Button>
            <Button colorScheme="purple" borderRadius="full" variant="outline" size="md">
              Degree
            </Button>
            <Button colorScheme="purple" borderRadius="full" variant="outline" size="md">
              Major
            </Button>
            <Button colorScheme="purple" borderRadius="full" variant="outline" size="md">
              Occupation
            </Button>
            <Button colorScheme="purple" borderRadius="full" variant="outline" size="md">
              Affiliation
            </Button>
          </Stack>

          {/* student data */}
          <div className="flex items-center justify-between py-6 border-b-[1px]">
            <div className="flex gap-2">
              <div>
                <Image src={studentImg} className="w-[100px] h-[100px]" alt="STUDENT" />
              </div>
              <div>
                <h2 className="text-xl">Alina Shetti</h2>
                <p className="text-base">Nagoya University</p>
                <p className="text-base">2nd Yr. Undergraduate, Psychology</p>
                <Stack spacing={2} direction="row" align="center" className="mt-2">
                  <Button colorScheme="blue" borderRadius="full" size="sm">
                    2nd Yr
                  </Button>
                  <Button colorScheme="green" borderRadius="full" size="sm">
                    Undergraduate
                  </Button>
                  <Button colorScheme="red" borderRadius="full" size="sm">
                    Law
                  </Button>
                </Stack>
              </div>
            </div>
            <div>
              <Image src={searchIcon} alt="BACPAC LOGO" />
            </div>
          </div>
          <div className="flex items-center justify-between py-6 border-b-[1px]">
            <div className="flex gap-2">
              <div>
                <Image src={studentImg} className="w-[100px] h-[100px]" alt="STUDENT" />
              </div>
              <div>
                <h2 className="text-xl">Alina Shetti</h2>
                <p className="text-base">Nagoya University</p>
                <p className="text-base">2nd Yr. Undergraduate, Psychology</p>
                <Stack spacing={2} direction="row" align="center" className="mt-2">
                  <Button colorScheme="blue" borderRadius="full" size="sm">
                    2nd Yr
                  </Button>
                  <Button colorScheme="green" borderRadius="full" size="sm">
                    Undergraduate
                  </Button>
                  <Button colorScheme="red" borderRadius="full" size="sm">
                    Law
                  </Button>
                </Stack>
              </div>
            </div>
            <div>
              <Image src={searchIcon} alt="BACPAC LOGO" />
            </div>
          </div>
          <div className="flex items-center justify-between py-6 border-b-[1px] ">
            <div className="flex gap-2">
              <div>
                <Image src={studentImg} className="w-[100px] h-[100px]" alt="STUDENT" />
              </div>
              <div>
                <h2 className="text-xl">Alina Shetti</h2>
                <p className="text-base">Nagoya University</p>
                <p className="text-base">2nd Yr. Undergraduate, Psychology</p>
                <Stack spacing={2} direction="row" align="center" className="mt-2">
                  <Button colorScheme="blue" borderRadius="full" size="sm">
                    2nd Yr
                  </Button>
                  <Button colorScheme="green" borderRadius="full" size="sm">
                    Undergraduate
                  </Button>
                  <Button colorScheme="red" borderRadius="full" size="sm">
                    Law
                  </Button>
                </Stack>
              </div>
            </div>
            <div>
              <Image src={searchIcon} alt="BACPAC LOGO" />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default ConnectionsTab
