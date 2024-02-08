import { AiOutlineSearch } from 'react-icons/ai'
import CollegeResult from '../app/components/CollegeResult'
import searchAlgorithm from '../utils/searchAlgorithm'
import { useState } from 'react'

const SearchBar = ({ data, loading }) => {
  const [open, setOpen] = useState(false)
  const [filterData, setFilterData] = useState([])
  const handleSearch = (e) => {
    let input = e.target.value.trim().toLowerCase()
    const filterData = searchAlgorithm(input, data).sort((a, b) => b.score - a.score)
    setOpen(input.length !== 0)
    setFilterData(filterData)
  }
  let searchResults = filterData?.map((item, index) => <CollegeResult info={item} serialNo={index} key={index} />)
  if (!loading && searchResults.length === 0) searchResults = <div>No results found</div>
  if (loading) searchResults = <div>Loading....</div>
  return (
    <div className="search-box mt-4 w-5/12 h-12 rounded-2xl">
      <div className="search-icon w-12 absolute h-12 flex justify-center items-center">
        <AiOutlineSearch className="text-xl text-black" />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search"
        className="w-full h-full rounded-2xl border-2 border-gray-800 indent-14 text-black"
      />
      {open && (
        <div className="searchBox border-2 overflow-auto border-gray-300 w-full h-auto max-h-80 mt-4 rounded-lg p-3 bg-white text-black relative">
          {searchResults}
        </div>
      )}
    </div>
  )
}

export default SearchBar
