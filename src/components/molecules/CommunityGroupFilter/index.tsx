'use client'
import Buttons from '@/components/atoms/Buttons'
import { subCategories } from '@/types/CommuityGroup'
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useModal } from '@/context/ModalContext'
import CollapsibleMultiSelect from '@/components/atoms/CollapsibleMultiSelect'
import Pill from '@/components/atoms/Pill'
import { TRACK_EVENT } from '@/content/constant'
import mixpanel from 'mixpanel-browser'
import { useCommunityFilter } from '@/context/CommunityGroupHookContext'

const GroupCategories = ['Private', 'Public', 'Official', 'Casual']
const GroupLabelCategories = ['Course', 'Club', 'Circle', 'Other']

type Props = {
  communityId: string
  sort: string
  selectedFiltersMain: Record<string, string[]>
  setSelectedFiltersMain: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  selectedTypeMain: string[]
  setSelectedTypeMain: React.Dispatch<React.SetStateAction<string[]>>
  selectedLabel: string[]
  setSelectedLabel: React.Dispatch<React.SetStateAction<string[]>>
}

const CommunityGroupFilterComponent: React.FC<Props> = ({
  communityId,
  setSelectedFiltersMain,
  selectedFiltersMain,
  setSelectedTypeMain,
  selectedTypeMain,
  setSelectedLabel,
  selectedLabel,
  sort,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedLabelLocal, setSelectedLabelLocal] = useState<string[]>([])
  const { applyFilters } = useCommunityFilter()
  const { closeModal } = useModal()

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

  const handleSelectGroupLabels = (label: string) => {
    setSelectedLabelLocal((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const handleSelectFilters = (item: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      Object.keys(newFilters).forEach((category) => {
        newFilters[category] = newFilters[category].filter((filterItem) => filterItem !== item)
        if (newFilters[category].length === 0) {
          delete newFilters[category]
        }
      })
      return newFilters
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setSelectedType([])
    setSelectedLabelLocal([])
  }

  const handleClick = () => {
    const data = { communityId, selectedType, selectedFilters, selectedLabel: selectedLabelLocal, sort }
    mixpanel.track(TRACK_EVENT.SIDEBAR_GROUP_FILTER, {
      communityId,
      selectedFilters,
      selectedType,
      selectedLabel: selectedLabelLocal,
      sort,
    })

    setSelectedFiltersMain(selectedFilters)
    setSelectedTypeMain(selectedType)
    setSelectedLabel(selectedLabelLocal)
    applyFilters(data as any)
    closeModal()
  }

  useEffect(() => {
    if (selectedFiltersMain) {
      setSelectedFilters(selectedFiltersMain)
    }
    if (selectedTypeMain) {
      setSelectedType(selectedTypeMain)
    }
    if (selectedLabel) {
      setSelectedLabelLocal(selectedLabel)
    }
  }, [selectedFiltersMain, selectedTypeMain, selectedLabel])
  return (
    <div className="h-[58vh] hideScrollbar overflow-y-scroll">
      <div className="max-w-md mx-auto flex flex-col justify-center relative">
        <div className="border-b border-neutral-200 pb-4">
          <div className="flex justify-between items-center ">
            <h2 className="text-2xl font-bold font-poppins">Group Filters</h2>
            <button onClick={clearFilters} className=" text-2xs flex items-center gap-1 border border-neutral-200 shadow-sm px-3 py-2 rounded-lg">
              <span className="flex items-center gap-2">
                Clear <RiDeleteBin6Line />
              </span>
            </button>
          </div>

          <div
            className={`flex flex-wrap gap-2 ${
              selectedType?.length > 0 || selectedLabelLocal?.length > 0 || Object.values(selectedFilters)?.flat()?.length > 0 ? 'mt-4' : ''
            }`}
          >
            {selectedType?.map((item) => (
              <Pill key={item} variant="primary" size="extra_small" removeIconShown={true} onClick={() => handleSelectTypes(item)}>
                {item}
              </Pill>
            ))}
            {selectedLabelLocal?.map((item) => (
              <Pill key={item} variant="primary" size="extra_small" removeIconShown={true} onClick={() => handleSelectGroupLabels(item)}>
                {item}
              </Pill>
            ))}

            {Object.values(selectedFilters)
              ?.flat()
              ?.map((item) => (
                <Pill key={item} variant="primary" size="extra_small" removeIconShown={true} onClick={() => handleSelectFilters(item)}>
                  {item}
                </Pill>
              ))}
          </div>
        </div>

        <div className="">
          <CollapsibleMultiSelect
            title="Group Access & Type"
            titleFontSize="sm"
            options={GroupCategories}
            selectedOptions={selectedType || []}
            onSelect={(value: string) => handleSelectTypes(value)}
            alwaysExpanded={true}
            alignStart={true}
            borderBottom={false}
            columnView={true}
          />
        </div>

        <div className="">
          <CollapsibleMultiSelect
            title="Group Label"
            titleFontSize="sm"
            options={GroupLabelCategories}
            selectedOptions={selectedLabelLocal || []}
            onSelect={(value: string) => handleSelectGroupLabels(value)}
            alwaysExpanded={true}
            alignStart={true}
            borderBottom={false}
            columnView={true}
          />
        </div>

        {Object.entries(subCategories).map(([category, options], index) => {
          if (category == 'Others') return
          return (
            <CollapsibleMultiSelect
              key={index}
              title={category}
              titleFontSize="sm"
              options={options}
              selectedOptions={selectedFilters[category] || []}
              onSelect={(value: string) => handleSelect(category, value)}
              alwaysExpanded={true}
              alignStart={true}
              borderBottom={false}
            />
          )
        })}
        <div className="py-2"></div>
        <div className="fixed w-full bottom-0 left-0 bg-white rounded-lg  border-t-[1px] border-neutral-200 ">
          <Buttons onClick={() => handleClick()} className="mx-auto my-4 w-[300px]" size="large" variant="primary">
            Apply Filters
          </Buttons>
        </div>
      </div>
    </div>
  )
}

export default CommunityGroupFilterComponent
