import './SearchBar.css'

import { AiOutlineSearch } from 'react-icons/ai'
import CollegeResult from '../CollegeResult'
import SearchHistoryBox from '@/components/SearchHistoryBox/SearchHistoryBox'
import searchAlgorithm from '@/utils/searchAlgorithm'
import { useState } from 'react'

// search bar
interface FilteredCollege {
  id: string
  name: string
  score: string
  city?: string
  country?: string
  collegePage?: string
}
interface SearchBarProps {
  data: FilteredCollege[]
  loading: boolean
}
interface College {
  id: string
  name: string
  score: string
}
const SearchBar: React.FC<SearchBarProps> = ({ data, loading }) => {
  const [open, setIsOpen] = useState(false)
  const [filterData, setFilterData] = useState<FilteredCollege[]>([])
  const [searchHistoryShown, setSearchHistoryShown] = useState(true)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase()
    const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
    setIsOpen(input.length !== 0)
    setFilterData(filterData)
    setSearchHistoryShown(false)
  }
  function handleSearchHistory() {
    if (!open) {
      // Only update history if the input is not already open
      const storedSelectedCollegeNames = localStorage.getItem('selectedCollegeNames')
      if (storedSelectedCollegeNames) {
        // Parse the string back into an array
        const selectedCollegeNamesArray = JSON.parse(storedSelectedCollegeNames).reverse()
        console.log('selected college history', selectedCollegeNamesArray)
        // Extract name and score from each object and create a new array
        const selectedCollegeInfoArray = selectedCollegeNamesArray.map((college: College) => ({
          name: college.name,
          score: college.score,
          id: college.id, // You may need to set the ID here if it's available
        }))
        setFilterData(selectedCollegeInfoArray)
        setIsOpen(true) // Open the input to show history
        setSearchHistoryShown(true) // Set search history shown to true
      }
    } else {
      // Close the search history if the input is already open
      setIsOpen(false)
      setSearchHistoryShown(false)
    }
  }
  let searchResults: JSX.Element[] = filterData?.map((item, index) =>
    searchHistoryShown ? <SearchHistoryBox info={item} serialNo={index} key={index} /> : <CollegeResult info={item} serialNo={index} key={index} />
  )
  if (!loading && searchResults.length === 0) searchResults = [<div key="no-results">No results found</div>]
  if (loading) searchResults = [<div key="loading">Loading....</div>]
  return (
    <div className="search-box mt-2 h-12 rounded-3xl">
      <div className="search-icon w-6 top-9 left-4 relative h-6 flex justify-center items-center z-auto">
        <AiOutlineSearch className="search-icon text-lg h-full w-full text-[#D4D4D4]" />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        onClick={handleSearchHistory}
        placeholder="Search institute"
        className={
          open
            ? 'search-input2 w-full h-full border border-solid border-gray-300 indent-14 text-black'
            : 'search-input w-full h-full border border-solid border-gray-300 indent-14 text-black'
        }
      />
      {open && (
        <div className="searchBox overflow-auto w-full h-auto max-h-80 border border-solid border-gray-300 pt-4 bg-white text-black relative">
          {searchResults}
        </div>
      )}
    </div>
  )
}

export default SearchBar
