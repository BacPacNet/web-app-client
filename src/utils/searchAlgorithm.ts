import { matchSorter } from 'match-sorter'

interface College {
  id: string
  name: string
  score: string
  address?: string
  collegePage?: string
  city?: string
  country?: string
}

const searchAlgorithm = (input: string, data: College[]): College[] => {
  if (input && data) {
    return matchSorter(data, input, { keys: ['name', 'country', 'city'] })
  } else {
    return []
  }
}
export default searchAlgorithm
