import { AiOutlineSearch } from 'react-icons/ai'
import CollegeResult from '../app/components/CollegeResult'
import searchAlgorithm from '@/utils/searchAlgorithm'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
  className?: string
  iconDivStyle?: string
  iconStyle?: string
  iconSize?: string
  inputStyle?: string
  resultStyle?: string
  placeholderText?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  data,
  loading,
  className,
  iconDivStyle,
  iconStyle,
  iconSize,
  inputStyle,
  resultStyle,
  placeholderText,
}) => {
  const [open, setOpen] = useState(false)
  const [filterData, setFilterData] = useState<FilteredCollege[]>([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase()
    const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
    setOpen(input.length !== 0)
    setFilterData(filterData)
  }

  let searchResults: JSX.Element[] = filterData?.map((item, index) => <CollegeResult info={item} serialNo={index} key={index} />)

  if (!loading && searchResults.length === 0) searchResults = [<div key="no-results">No results found</div>]
  if (loading) searchResults = [<div key="loading">Loading....</div>]

  return (
    <div className={cn('search-box mt-4 w-5/12 h-12 rounded-2xl', className)}>
      <div className={cn('search-icon w-12 absolute h-12 flex justify-center items-center', iconDivStyle)}>
        <AiOutlineSearch className={cn('text-xl text-black', iconStyle)} size={iconSize ? iconSize : ''} />
      </div>
      <input
        type="text"
        onChange={handleSearch}
        placeholder={placeholderText ? placeholderText : 'Search'}
        className={cn('w-full h-full rounded-2xl border-2 border-gray-800 indent-14 text-black', inputStyle)}
      />
      {open && (
        <div
          className={cn(
            'searchBox border-2 overflow-auto border-gray-300 w-full h-auto max-h-80 mt-4 rounded-lg p-3 bg-white text-black relative',
            resultStyle
          )}
        >
          {searchResults}
        </div>
      )}
    </div>
  )
}

export default SearchBar
