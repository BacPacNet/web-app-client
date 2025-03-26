'use client'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { cities } from '@/content/city'
import { REGION } from '@/content/constant'
import { COUNTRY } from '@/content/country'
import { Country } from 'country-state-city'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoIosSearch } from 'react-icons/io'
import COUNTRY_TO_CITY from '@/content/country_to_city.json'
import REGION_TO_COUNTRY from '@/content/region_to_country.json'
import REGION_TO_CITY from '@/content/region_to_city.json'

type Props = {
  setQuery: (value: any) => void
  query: string
  resetSearchInput: () => void
}

const DiscoverFilterComponent = ({ setQuery, query, resetSearchInput }: Props) => {
  const { register, control, handleSubmit: handleFormSubmit, watch, reset, setValue } = useForm()
  const [cityOptions, setCityOptions] = useState<string[]>(cities)
  const [countryOptions, setCountryOptions] = useState<string[]>(COUNTRY)
  const [regionOption, setRegionOption] = useState<string[]>(REGION)

  const handleRegionChange = (selectedRegion: string, field: any) => {
    if (selectedRegion) {
      field.onChange(selectedRegion)
      setCountryOptions((REGION_TO_COUNTRY as any)[selectedRegion])
      setCityOptions((REGION_TO_CITY as any)[selectedRegion])
    } else {
      setValue('region', '')
      setCountryOptions(COUNTRY)
      setCityOptions(cities)
    }

    setQuery(JSON.stringify(watch()))
  }

  const handleCountryChange = (selectedCountry: string, field: any) => {
    if (selectedCountry) {
      setCityOptions((COUNTRY_TO_CITY as any)[selectedCountry])
      field.onChange(selectedCountry)
      setValue('city', '')
    } else {
      setValue('country', '')
      setCityOptions(cities)
    }
    setQuery(JSON.stringify(watch()))
    //setIsCityAvailable(cities.length > 0)
  }

  const handleFilterSubmit = (data: any) => {
    setQuery(JSON.stringify(data))
  }

  useEffect(() => {
    const parsedQuery = query ? JSON.parse(query) : {}
    if (parsedQuery.Search !== undefined) {
      setValue('Search', parsedQuery.Search)
    }
  }, [query, setValue])

  return (
    <div className=" lg:block hidden">
      <form onSubmit={handleFormSubmit(handleFilterSubmit)} className=" border border-neutral-300 shadow-xl rounded-2xl ">
        <h3 className="border-b border-neutral-300 text-neutral-700 text-[20px] font-bold font-poppins p-6 w-[297px]">Search Filter</h3>
        <div className="p-6 flex flex-col gap-4">
          {/* <div className="w-full flex flex-col relative">
            <IoIosSearch size={20} className="absolute left-2 z-30 top-1/2 -translate-y-1/2" />
            <input
              className=" py-2 ps-8 pe-3 border-2 border-neutral-200 focus:ring-2 rounded-full drop-shadow-sm outline-none "
              placeholder="Search"
              type="text"
              //   {...register('Search', {})}
              {...register('Search', {
                onChange: (e) => {
                  setQuery(JSON.stringify(watch()))
                },
              })}
            />
          </div> */}
          <div className="w-full flex flex-col">
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  options={regionOption}
                  value={field.value}
                  onChange={(selectedRegion: string) => handleRegionChange(selectedRegion, field)}
                  placeholder="Region"
                  icon={'single'}
                  err={false}
                />
              )}
            />
          </div>
          <div className="w-full flex flex-col">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  options={countryOptions}
                  value={field.value || ''}
                  onChange={(selectedCountry: string) => handleCountryChange(selectedCountry, field)}
                  placeholder="Country"
                  icon={'single'}
                  search={true}
                  err={false}
                  setCityOptions={setCityOptions}
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
                  onChange={(selectedCity: string) => {
                    field.onChange(selectedCity)
                    setQuery(JSON.stringify(watch()))
                  }}
                  placeholder="City"
                  icon={'single'}
                  search={true}
                  err={false}
                  setCityOptions={setCityOptions}
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
                  onChange={(selectedCity: string) => {
                    field.onChange(selectedCity)
                    setQuery(JSON.stringify(watch()))
                  }}
                  placeholder="Type"
                  icon={'single'}
                  err={false}
                  setCityOptions={setCityOptions}
                />
              )}
            />
          </div>
        </div>
        {/* <div className="p-4 flex items-center gap-4 w-full">
          <Buttons type="button" onClick={() => resetForm()} size="small" className="w-full">
            Reset
          </Buttons>
        </div> */}
      </form>
    </div>
  )
}

export default DiscoverFilterComponent
