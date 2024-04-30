import { BaseUrl } from './baseUrl'

export const searchUniversity = async (searchTerm: any) => {
  if (!searchTerm) {
    // If input is empty, return an empty array or object
    return [] // or return {}
  }

  const res = await fetch(`${BaseUrl}/university/searched?searchTerm=${searchTerm}`)
  const data = await res.json()
  //   console.log('res', data)

  return data
}
