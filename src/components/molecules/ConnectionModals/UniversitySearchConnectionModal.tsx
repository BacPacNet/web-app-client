import Buttons from '@/components/atoms/Buttons'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import RadioOption from '@/components/atoms/RadioSelect'
import CollegeResult from '@/components/CollegeResult'

import { filterData, filterFacultyData } from '@/lib/communityGroup'
import { useCommunityUsers } from '@/services/community'
import { useUniversitySearch } from '@/services/universitySearch'
import { useUniStore } from '@/store/store'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import React, { useState, useRef, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiChevronDown } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'

interface ConnectionUserSelectModalProps {
  closeModal: () => void
  setFilteredUsers: (users: any) => void
  setIsFiltered: (filtered: boolean) => void

  filteredYearCount: Record<string, number> | undefined
  setFilteredYearsCount: React.Dispatch<React.SetStateAction<Record<string, number> | undefined>>

  filteredMajorsCount: Record<string, number> | undefined
  setFilteredMajorsCount: React.Dispatch<React.SetStateAction<Record<string, number> | undefined>>

  filteredOccupationCount: Record<string, number> | undefined
  setFilteredOccupationCount: React.Dispatch<React.SetStateAction<Record<string, number> | undefined>>

  filteredAffiliationCount: Record<string, number> | undefined
  setFilteredAffiliationCount: React.Dispatch<React.SetStateAction<Record<string, number> | undefined>>

  selectedFilters: {
    selectedRadio: string
    studentYear: string[]
    major: string[]
    occupation: string[]
    affiliation: string[]
    university: { name: string; id: string; communityId: string }
  }
  setSelectedFilters: React.Dispatch<React.SetStateAction<any>>
  handleClear: () => void
}
export default function ConnectionUserSelectModal({
  setFilteredUsers,
  setIsFiltered,
  filteredAffiliationCount,
  filteredMajorsCount,
  filteredOccupationCount,
  filteredYearCount,
  selectedFilters,
  setSelectedFilters,
  handleClear,
  closeModal,
}: ConnectionUserSelectModalProps) {
  const { userData } = useUniStore()
  const [selectedUniversity, setSelectedUniversity] = useState({ name: '', id: '', communityId: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [universityError, setUniversityError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { data: universitiesData, isLoading } = useUniversitySearch(searchTerm || 'india', 1, 10)
  const universities = universitiesData?.result?.universities

  //   const filtered = universities.filter((u) => u.toLowerCase().includes(query.toLowerCase()))

  const { data: communityUsersData } = useCommunityUsers(selectedUniversity?.communityId)
  const communityUsers = communityUsersData?.pages.flatMap((page) => page.data).filter((user) => user.users_id !== userData?.id) || []

  // const [filteredUsers, setFilterUsers] = useState<any>()
  // const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any>()

  const {
    register,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      selectedRadio: selectedFilters.selectedRadio,
      studentYear: selectedFilters.studentYear,
      major: selectedFilters.major,
      occupation: selectedFilters.occupation,
      affiliation: selectedFilters.affiliation,
    },
  })
  const studentYear = watch('studentYear') || ''
  const major = watch('major') || ''
  const selectedRadio = watch('selectedRadio')
  const occupation = watch('occupation') || ''
  const affiliation = watch('affiliation') || ''

  useEffect(() => {
    setSelectedUniversity(selectedFilters.university)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (showDropdown == true) {
      inputRef.current?.focus()
    }
  }, [showDropdown])

  // useEffect(() => {
  //   const allUsers = communityUsers || []
  //   // const allStudentUsers = allUsers.filter((user) => user.role == 'student')
  //   // const allStudentUsers = allUsers.filter((user) => user.role === 'student' && user._id !== userData?.id)

  //   if (selectedRadio == 'Student' && studentYear.length < 1 && major.length < 1) {
  //     return setFilterUsers(allUsers)
  //   }
  //   const filters = { year: studentYear, major: major }

  //   const filtered = filterData(allUsers, filters)
  //   setFilterUsers(filtered)

  //   // const yearOnlyFiltered = filterData(allUsers, { year: studentYear, major: [] })
  //   // const yearCounts = getFilteredYearCounts(yearOnlyFiltered)

  //   // const majorCounts = getFilteredMajorCounts(filtered)

  //   // setFilteredYearsCount(yearCounts)
  //   // setFilteredMajorsCount(majorCounts)
  // }, [studentYear, major, communityUsers, selectedRadio])

  // useEffect(() => {
  //   const allUsers = communityUsers || []
  //   // const allFacultyUsers = allUsers.filter((user) => user.role == 'faculty' && user._id !== userData?.id)

  //   if (selectedRadio == 'Faculty' && occupation.length < 1 && affiliation.length < 1) {
  //     return setFilterFacultyUsers(allUsers)
  //   }
  //   const filters = { occupation: occupation, affiliation: affiliation }
  //   const filtered = filterFacultyData(allUsers, filters)
  //   setFilterFacultyUsers(filtered)

  //   // const occupationOnlyFiltered = filterFacultyData(allUsers, { occupation: occupation, affiliation: [] })

  //   // const occupationCounts = getOccupationCounts(occupationOnlyFiltered)

  //   // const affiliationCounts = getFilteredAffiliationCounts(filtered)

  //   // setFilteredOccupationCount(occupationCounts)
  //   // setFilteredAffiliationCount(affiliationCounts)
  // }, [occupation, affiliation, selectedRadio])

  const filteredUsers = React.useMemo(() => {
    const allUsers = communityUsers || []
    const filters = { year: studentYear, major: major }
    return filterData(allUsers, filters)
  }, [studentYear, major, communityUsers])

  const filteredFacultyUsers = React.useMemo(() => {
    const allUsers = communityUsers || []
    const filters = { occupation: occupation, affiliation: affiliation }
    return filterFacultyData(allUsers, filters)
  }, [occupation, affiliation, communityUsers])

  const handleClick = () => {
    if (selectedUniversity?.name?.length < 1 || selectedUniversity?.name == undefined) {
      return setUniversityError(true)
    }
    setIsFiltered(true)

    if (selectedRadio == 'Faculty') {
      setFilteredUsers(filteredFacultyUsers)
    } else if (selectedRadio == 'Student') {
      setFilteredUsers(filteredUsers)
    } else {
      const allUsers = communityUsers || []
      const allFilteredUsers = allUsers.filter((user) => user._id !== userData?.id)
      setFilteredUsers(allFilteredUsers)
    }

    setSelectedFilters({
      selectedRadio,
      studentYear,
      major,
      occupation,
      affiliation,
      university: selectedUniversity,
    })
    closeModal()
  }

  const handleClearButton = () => {
    handleClear()

    setSelectedUniversity({
      name: '',
      id: '',
      communityId: '',
    })
    setIsFiltered(false)
    reset({
      selectedRadio: '',
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div ref={modalRef} className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg overflow-visible">
          <div className="flex justify-between items-center mb-8">
            <h2 className=" font-bold font-poppins text-md ">Search Filter</h2>
            <Buttons variant="shade" size="small" onClick={handleClearButton} className="w-max">
              Clear
            </Buttons>
          </div>

          <div className="relative " ref={dropdownRef}>
            <label className="text-xs font-medium mb-2">University</label>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex justify-between items-center border ${
                universityError ? 'border-destructive-600' : 'border-neutral-200'
              }  rounded-lg p-3  text-xs text-neutral-700 h-10 bg-white shadow-sm`}
            >
              {selectedUniversity?.name || 'Select University'}
              {selectedUniversity?.name ? (
                <FaXmark
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUniversity({ name: '', id: '', communityId: '' })
                  }}
                  className="w-4 h-4 ml-2"
                />
              ) : (
                <BiChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>
            {universityError && <p className="text-destructive-600 text-xs mt-1">Select university to filter based on student or faculty.</p>}
            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full max-h-64 bg-white shadow-lg border border-neutral-300 rounded-lg z-50 overflow-y-auto custom-scrollbar">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2  outline-none"
                  ref={inputRef}
                />

                {universities && universities?.length > 0 ? (
                  <>
                    {universities?.map((university: any) => (
                      <div
                        onClick={() => {
                          setSelectedUniversity({ name: university.name, id: university?._id, communityId: university.communityId })
                          setShowDropdown(false)
                          setUniversityError(false)
                        }}
                        key={university?.id}
                        className=" bg-white rounded-md hover:bg-surface-primary-50 py-1 cursor-pointer"
                      >
                        <CollegeResult university={university} />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className=" bg-white rounded-lg hover:bg-gray-100 border-b border-neutral-200 last:border-b-0 text-black">
                    <p className="p-3 text-gray-500">No results found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <RadioOption
            label="Student"
            // description="Permission to join required"
            value="Student"
            register={register}
            name="selectedRadio"
            error={errors.selectedRadio && 'This field is required'}
            checkedValue={selectedRadio}
            isDisabled={selectedUniversity?.name?.length < 1 || selectedUniversity?.name == undefined}
            onAttemptSelect={() => {
              setUniversityError(true)
            }}
            checkedContent={
              <div className="flex flex-col gap-8 mb-4">
                <Controller
                  name="studentYear"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      options={Object.keys(degreeAndMajors)}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add By Year"
                      label="Year (Students)"
                      err={false}
                      filteredCount={filteredYearCount}
                      multiSelect={false}
                    />
                  )}
                />
                <Controller
                  name="major"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      options={value}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add By Major"
                      label="Major (Students)"
                      err={false}
                      search={true}
                      filteredCount={filteredMajorsCount}
                      parentCategory={studentYear}
                    />
                  )}
                />
              </div>
            }
          />

          <RadioOption
            label="Faculty"
            // description="Permission to join required"
            value="Faculty"
            register={register}
            name="selectedRadio"
            error={errors.selectedRadio && 'This field is required'}
            checkedValue={selectedRadio}
            isDisabled={selectedUniversity?.name?.length < 1 || selectedUniversity?.name == undefined}
            checkedContent={
              <div className="flex flex-col gap-8">
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      options={Object.keys(occupationAndDepartment)}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add By Major"
                      label="Occupation (Faculty)"
                      err={false}
                      search={true}
                      multiSelect={false}
                      filteredCount={filteredOccupationCount}
                    />
                  )}
                />
                <Controller
                  name="affiliation"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectDropdown
                      options={value}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add By Major"
                      label="Affiliation/Department (Faculty)"
                      err={false}
                      search={true}
                      filteredCount={filteredAffiliationCount}
                      parentCategory={occupation}
                      isRelative={true}
                    />
                  )}
                />
              </div>
            }
          />
          <Buttons onClick={() => handleClick()} className="w-full mt-8" size="large">
            Apply Filters
          </Buttons>
        </div>
      </div>
    </>
  )
}
