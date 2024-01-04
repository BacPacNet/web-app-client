import searchAlgorithm from '../utils/searchAlgorithm'

// import the query for college List over here and then do the test becz for college we need that
describe('searchAlgorithm', () => {
  it('returns filtered results when input and data are provided', () => {
    const input = 'mass'
    const colleges = [
      { name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', city: 'Cambridge' },
      { name: 'Columbia University', country: 'United States', city: 'New York City' },
    ]
    const result = searchAlgorithm(input, colleges)
    expect(result).toEqual([{ name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', city: 'Cambridge' }])
  })

  it('returns an empty array when either input is not provided', () => {
    const input = ''
    const resultWithoutData = searchAlgorithm(input, null)
    expect(resultWithoutData).toEqual([])
  })
  it('returns an empty array when either input doesnot match with the college name,city or country', () => {
    const input = 'xyw'
    const resultWithoutData = searchAlgorithm(input, null)
    expect(resultWithoutData).toEqual([])
  })
})
