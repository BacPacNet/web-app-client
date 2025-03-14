import Buttons from '@/components/atoms/Buttons'
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { openModal } from '@/components/molecules/Modal/ModalManager'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { Controller, useForm } from 'react-hook-form'
import ModalDropdown from '@/components/atoms/ModalSelect'
import { City, Country } from 'country-state-city'

type Props = {
  setQuery: (value: any) => void
}

const DiscoverFilterMobileComponent = ({ setQuery }: Props) => {
  const { register, control, handleSubmit: handleFormSubmit, watch, reset, setValue } = useForm()
  const [cityOptions, setCityOptions] = useState<string[]>([])

  const handleCountryChange = (selectedCountry: string, field: any) => {
    const getCountyCode = Country.getAllCountries().find((country) => country.name === selectedCountry)?.isoCode
    if (getCountyCode) {
      setCityOptions(City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name))
      field.onChange(selectedCountry)
      setValue('city', '')

      setQuery(JSON.stringify(watch()))
    }
  }

  const handleFilterSubmit = (data: any) => {
    setQuery(JSON.stringify(data))
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="  text-neutral-700 text-[24px] font-poppins ">Search Filter</h3>
      <form onSubmit={handleFormSubmit(handleFilterSubmit)} className=" flex items-center gap-4 ">
        {/* <Buttons className="py-3 px-4 text-xs" variant="border">
          Type
        </Buttons> */}
        <Buttons
          onClick={() =>
            openModal(
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <ModalDropdown
                    options={['Private', 'Public', 'Community']}
                    value={field.value}
                    onChange={(selectedCity: string) => {
                      field.onChange(selectedCity)
                      setQuery(JSON.stringify(watch()))
                    }}
                  />
                )}
              />,
              'w-64 h-64'
            )
          }
          size="small"
          variant="border"
        >
          Type
        </Buttons>
        <Buttons
          onClick={() =>
            openModal(
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <ModalDropdown
                    options={Country.getAllCountries().map((country) => country.name)}
                    value={field.value || ''}
                    onChange={(selectedCountry: string) => {
                      handleCountryChange(selectedCountry, field)
                    }}
                  />
                )}
              />,
              'w-64 '
            )
          }
          size="small"
          variant="border"
        >
          Country
        </Buttons>
        <Buttons
          onClick={() =>
            openModal(
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <ModalDropdown
                    options={cityOptions}
                    key={cityOptions[0]}
                    value={field.value || ''}
                    onChange={(selectedCity: string) => {
                      field.onChange(selectedCity)
                      setQuery(JSON.stringify(watch()))
                    }}
                  />
                )}
              />,
              'w-64'
            )
          }
          size="small"
          variant="border"
        >
          City
        </Buttons>
        <Buttons onClick={() => reset()} size="small" variant="primary">
          Reset
        </Buttons>
      </form>
      <div className="w-full flex flex-col relative">
        <IoIosSearch size={20} className="absolute left-2 z-30 top-1/2 -translate-y-1/2" />
        <input
          className=" py-2 ps-8 pe-3 border-2 border-neutral-200 focus:ring-2 rounded-full drop-shadow-sm  text-neutral-400  outline-none "
          placeholder="Search"
          type="text"
          {...register('Search', {
            onChange: (e) => {
              setQuery(JSON.stringify(watch()))
            },
          })}
        />
      </div>
    </div>
  )
}

export default DiscoverFilterMobileComponent
