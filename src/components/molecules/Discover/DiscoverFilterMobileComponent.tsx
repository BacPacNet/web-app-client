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
  const allValues = watch()
  const handleCountryChange = (selectedCountry: string, field: any) => {
    const getCountyCode = Country.getAllCountries().find((country) => country.name === selectedCountry)?.isoCode
    if (getCountyCode) {
      setCityOptions(City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name))
      field.onChange(selectedCountry)
      setValue('city', '')

      setQuery(JSON.stringify(watch()))
    } else {
      setValue('city', '')
      setValue('country', '')

      setQuery(JSON.stringify(watch()))
    }
  }

  const handleFilterSubmit = (data: any) => {
    setQuery(JSON.stringify(data))
  }

  return (
    <div className=" flex flex-col  w-[330px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="  text-neutral-700 font-bold text-[32px] font-poppins ">Search Filter</h3>
        <Buttons
          onClick={() => {
            reset(), setQuery(JSON.stringify(watch()))
          }}
          size="small"
          variant="border_primary"
          className="h-10"
        >
          Reset
        </Buttons>
      </div>
      <form onSubmit={handleFormSubmit(handleFilterSubmit)} className=" flex items-center gap-3 flex-wrap">
        {/* <Buttons className="py-3 px-4 text-xs" variant="border">
          Type
        </Buttons> */}
        <div
          className={`h-10 cursor-pointer ${
            allValues.type ? 'bg-secondary border border-shade-button-border text-primary-500  ' : 'border border-neutral-200 text-neutral-800'
          }  shadow-button text-xs py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 font-normal flex items-center justify-center`}
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
        >
          {allValues.type ? allValues.type : ' Type'}
          {/* {allValues.type && (
            <span
              className="ms-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setValue('type', '')
                setQuery(JSON.stringify(watch()))
              }}
            >
              X
            </span>
          )} */}
        </div>
        <div
          className={`h-10 cursor-pointer ${
            allValues.region ? 'bg-secondary border border-shade-button-border text-primary-500  ' : 'border border-neutral-200 text-neutral-800'
          }  shadow-button text-xs py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 font-normal flex items-center justify-center`}
          onClick={() =>
            openModal(
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <ModalDropdown
                    options={['a', 'b', 'c']}
                    value={field.value}
                    onChange={(selectedCity: string) => {
                      //   field.onChange(selectedCity)
                      setQuery(JSON.stringify(watch()))
                    }}
                  />
                )}
              />,
              'w-64 h-64'
            )
          }
        >
          {/* {allValues.type ? allValues.type : ' Type'}
          {allValues.type && (
            <span
              className="ms-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setValue('type', '')
                setQuery(JSON.stringify(watch()))
              }}
            >
              X
            </span>
          )} */}
          Region
        </div>
        <div
          className={`h-10 cursor-pointer ${
            allValues.country ? 'bg-secondary border border-shade-button-border text-primary-500  ' : 'border border-neutral-200 text-neutral-800'
          }  shadow-button text-xs py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 font-normal flex items-center justify-center`}
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
        >
          {allValues.country ? allValues.country : ' Country'}
          {/* {allValues.country && (
            <span
              className="ms-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                // setValue('country', '')
                handleCountryChange('country', '')
              }}
            >
              X
            </span>
          )} */}
        </div>
        <div
          className={`h-10 cursor-pointer ${
            allValues.city ? 'bg-secondary border border-shade-button-border text-primary-500  ' : 'border border-neutral-200 text-neutral-800'
          }  shadow-button text-xs py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 font-normal flex items-center justify-center`}
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
              'w-64 '
            )
          }
        >
          {allValues.city ? allValues.city : ' City'}
          {/* {allValues.city && (
            <span
              className="ms-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setValue('city', '')
                setQuery(JSON.stringify(watch()))
              }}
            >
              X
            </span>
          )} */}
        </div>
      </form>
      <div className="w-full flex flex-col relative mt-[19px]">
        <IoIosSearch size={20} className="absolute left-2 z-30 top-1/2 -translate-y-1/2" />
        <input
          className=" py-2 ps-8 pe-3 border-2 border-neutral-200 focus:ring-2 rounded-full drop-shadow-sm  outline-none "
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
