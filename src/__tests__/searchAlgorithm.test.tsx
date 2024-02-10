import searchAlgorithm from '../utils/searchAlgorithm'
describe('searchAlgorithm', () => {
  const colleges = [
    { id: 'e7127c23742af44c', name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', city: 'Cambridge', score: '100' },
  ]
  it('returns filtered results when input and data are provided', () => {
    const input = 'mass'

    const result = searchAlgorithm(input, colleges)

    expect(result).toEqual(colleges)
  })
  it('returns an empty array when either input is not provided', () => {
    const input = ''

    const result = searchAlgorithm(input, colleges)

    expect(result).toEqual([])
  })
  it('returns an empty array when either input doesnot match with the college name,city or country', () => {
    const input = 'xyw'

    const result = searchAlgorithm(input, colleges)

    expect(result).toEqual([])
  })
})
