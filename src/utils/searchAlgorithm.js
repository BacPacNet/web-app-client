// import colleges from '../../data/university_data.json'

import { matchSorter } from 'match-sorter'

const searchAlgorithm = (input, data) => {
  return matchSorter(data, input, { keys: ['name', 'country', 'city'] })
}
export default searchAlgorithm
