import { useState } from "react"
import CollegeResult from "@/app/components/CollegeResult"

const SearchBar = ({ data }) => {
  const [open,setOpen] = useState(false)
  const [filterData, setFilterData] = useState([])

  const handleSearch = (e) => {
    let input = e.target.value.trim().toLowerCase()
    const filterData = data
      .filter((item) => {
        let collegeName = item.name.toLowerCase()
        let collegeAddress = item.address.toLowerCase()
        return collegeName.includes(input) || collegeAddress.includes(input)
      })
      .sort((a, b) => b.score - a.score)
      setOpen(input.length !== 0)
      setFilterData(filterData)
    
  }

  let searchResults = filterData?.map((item, index) => (
    <CollegeResult info={item} serialNo={index} key={index} />
  ))

  if(searchResults.length === 0) searchResults = <div>No results found</div>

  return (
    <div className="search-box mt-4 border-1 border-black w-4/12 h-12 rounded-2xl">
      <input placeholder="Search Colleges..." onChange = {handleSearch}/>

      {open && <div className="searchBox border-2 overflow-auto border-gray-300 w-full h-80 mt-4 rounded-lg p-3 bg-white">
        {searchResults}
      </div>}
    </div>
  )
}

export default SearchBar
