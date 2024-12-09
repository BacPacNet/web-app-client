'use client'
import Buttons from '@/components/atoms/Buttons'
import { useGetFilteredSubscribedCommunities } from '@/services/university-community'
import { subCategories } from '@/types/CommuityGroup'
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'

const GroupCategories = ['Private', 'Public', 'Official', 'Casual']

type Props = {
  communityId: string
  selectedFiltersMain: Record<string, string[]>
  setSelectedFiltersMain: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  selectedTypeMain: string[]
  setSelectedTypeMain: React.Dispatch<React.SetStateAction<string[]>>
}

const CommunityGroupFilterComponent: React.FC<Props> = ({
  communityId,
  setSelectedFiltersMain,
  selectedFiltersMain,
  setSelectedTypeMain,
  selectedTypeMain,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [selectedType, setSelectedType] = useState<string[]>([])
  const { mutate } = useGetFilteredSubscribedCommunities(communityId)

  // const handleSelect = (category: string, option: string) => {
  //   setSelectedFilters((prev) => {
  //     const categoryFilters = prev[category] || []
  //     if (categoryFilters.includes(option)) {
  //       return {
  //         ...prev,
  //         [category]: categoryFilters.filter((item) => item !== option),
  //       }
  //     } else {
  //       return {
  //         ...prev,
  //         [category]: [...categoryFilters, option],
  //       }
  //     }
  //   })
  // }

  const handleSelect = (category: string, option: string) => {
    setSelectedFilters((prev: any) => {
      const categoryFilters = prev[category] || []
      if (categoryFilters.includes(option)) {
        const updatedFilters = categoryFilters.filter((item: any) => item !== option)
        if (updatedFilters.length === 0) {
          const { [category]: _, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [category]: updatedFilters,
        }
      } else {
        return {
          ...prev,
          [category]: [...categoryFilters, option],
        }
      }
    })
  }

  const handleSelectTypes = (type: string) => {
    setSelectedType((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setSelectedType([])
  }

  const handleClick = () => {
    const data = { selectedType, selectedFilters }
    setSelectedFiltersMain(selectedFilters)
    setSelectedTypeMain(selectedType)
    mutate(data)
  }

  useEffect(() => {
    if (selectedFiltersMain) {
      setSelectedFilters(selectedFiltersMain)
    }
    if (selectedTypeMain) {
      setSelectedType(selectedTypeMain)
    }
  }, [])
  return (
    <div className="max-w-md mx-auto flex flex-col justify-center  ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter</h2>
        <button onClick={clearFilters} className=" text-2xs flex items-center gap-1 border border-neutral-200 shadow-sm px-3 py-2 rounded-lg">
          <span className="flex items-center gap-2">
            Clear <RiDeleteBin6Line />
          </span>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">Group Access & Type</h3>
        <div className="flex flex-wrap gap-2">
          {GroupCategories.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectTypes(option)}
              className={`px-2 py-1 text-2xs  border border-neutral-200 rounded-3xl ${
                selectedType?.includes(option) ? 'bg-primary text-white border-primary-500' : ' text-neutral-700 border-neutral-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(subCategories).map(([category, options]) => {
        if (category == 'Others') return
        return (
          <div key={category} className="mb-6">
            <h3 className="font-medium text-sm mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(category, option)}
                  className={`px-2 py-1 text-2xs  border border-neutral-200 rounded-3xl ${
                    selectedFilters[category]?.includes(option) ? 'bg-primary text-white border-primary-500' : ' text-neutral-700 border-neutral-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <Buttons onClick={() => handleClick()} className="w-max self-center" size="extra_small" variant="primary">
        Apply Filters
      </Buttons>
    </div>
  )
}

export default CommunityGroupFilterComponent
