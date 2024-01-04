import { matchSorter } from 'match-sorter'
import colleges from '../../data/university_data.json'

interface College {
  id: string
  name: string
  score: string
  address: string
  collegePage: string
}

const searchAlgorithm = (input: string): College[] => {
  return matchSorter(colleges, input, { keys: ['name', 'address'] })
}
export default searchAlgorithm
