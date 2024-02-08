import { matchSorter } from 'match-sorter'

const searchAlgorithm = (input, data) => {
  if (input && data) {
    return matchSorter(data, input, { keys: ['name', 'country', 'city'] })
  } else {
    return []
  }
}
export default searchAlgorithm
