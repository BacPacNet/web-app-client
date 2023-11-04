import { useState } from "react"

const SearchBar = ({ data }) => {
  const [filterData, setFilterData] = useState([])

  const handleSearch = (e) => {
    let input = e.target.value.toLowerCase()

    const filterData = data
      .filter((item) => {
        let collegeName = item.name.toLowerCase()
        let collegeAddress = item.address.toLowerCase()
        return collegeName.includes(input) || collegeAddress.includes(input)
      })
      .sort((a, b) => b.score - a.score)
      setFilterData(filterData)
  }

  let searchResults = filterData?.map((item, index) => (
    <div key={index}>{item.name}</div>
  ))

  if(searchResults.length === 0) searchResults = <div>No results found</div>


  return (
    <div>
      <input placeholder="Search Colleges..." onChange = {handleSearch}/>
      {searchResults}
    </div>
  )
}

export default SearchBar
