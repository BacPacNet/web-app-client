'use client'
import Buttons from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { Country, City } from 'country-state-city'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoIosSearch } from 'react-icons/io'

type Props = {
  setQuery: (value: any) => void
}

const DiscoverFilterComponent = ({ setQuery }: Props) => {
  const { register, control, handleSubmit: handleFormSubmit, watch, reset } = useForm()
  const [cityOptions, setCityOptions] = useState<string[]>([])
  const [isCityAvailable, setIsCityAvailable] = useState(true)
  const currCountry = watch('country') || ''

  const handleCountryChange = (selectedCountry: string, field: any) => {
    const getCountyCode = Country.getAllCountries().find((country) => country.name === selectedCountry)?.isoCode
    if (getCountyCode) {
      setCityOptions(City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name))
      field.onChange(selectedCountry) // Update the country field value
    }

    //setIsCityAvailable(cities.length > 0)
  }

  const handleFilterSubmit = (data: any) => {
    setQuery(JSON.stringify(data))
  }
  return (
    <div className="max-lg:w-60">
      <form onSubmit={handleFormSubmit(handleFilterSubmit)} className=" border border-neutral-300 shadow-xl rounded-2xl">
        <h3 className="border-b border-neutral-300 text-neutral-700 text-[24px] font-poppins p-4">Search Filter</h3>
        <div className="p-4 flex flex-col gap-4">
          <div className="w-full flex flex-col relative">
            <IoIosSearch size={20} className="absolute left-2 z-30 top-1/2 -translate-y-1/2" />
            <input
              className=" py-2 ps-8 pe-3 border-2 border-neutral-200 focus:ring-2 rounded-full drop-shadow-sm  text-neutral-400  outline-none "
              placeholder="Search"
              type="text"
              {...register('Search', {})}
            />
          </div>
          {/* <div className="w-full flex flex-col">
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <SelectDropdown options={['a', 'b']} value={field.value} onChange={field.onChange} placeholder="Region" icon={'single'} err={false} />
              )}
            />
          </div> */}
          <div className="w-full flex flex-col">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  options={Country.getAllCountries().map((country) => country.name)}
                  value={field.value || ''}
                  onChange={(selectedCountry: string) => handleCountryChange(selectedCountry, field)}
                  placeholder="Country"
                  icon={'single'}
                  search={true}
                  err={false}
                />
              )}
            />
          </div>
          <div className="w-full flex flex-col">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  options={cityOptions}
                  key={cityOptions[0]}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="City"
                  icon={'single'}
                  search={true}
                  err={false}
                />
              )}
            />
          </div>
          <div className="w-full flex flex-col">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  options={['Private', 'Public', 'Community']}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type"
                  icon={'single'}
                  err={false}
                />
              )}
            />
          </div>
        </div>
        <div className="p-4 flex items-center gap-4 justify-end">
          <Buttons size="extra_small">Search</Buttons>
          <Buttons type="button" onClick={() => reset()} size="extra_small">
            Reset
          </Buttons>
        </div>
      </form>
    </div>
  )
}

export default DiscoverFilterComponent
