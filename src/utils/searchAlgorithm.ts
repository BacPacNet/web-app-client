import { matchSorter } from 'match-sorter'
import colleges from '../../data/university_data.json'

const searchAlgorithm = (input) => {
  return matchSorter(colleges, input, { keys: ['name', 'address'] })
}
export default searchAlgorithm
