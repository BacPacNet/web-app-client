import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'

import SearchBar from '@/components/SearchBar'
import data from '../../data/university_data.json'

it('display filtered data based on input', () => {
  const { getByPlaceholderText, queryByText } = render(<SearchBar data={data} />)
  const input = getByPlaceholderText('Search')

  fireEvent.change(input, { target: { value: 'Bhubaneswar' } })

  expect(queryByText('Indian Institute of Technology Bhubaneswar')).toBeInTheDocument()
  expect(queryByText('Massachusetts Institute of Technology (MIT)')).toBeNull()
})

it('handles case-insensitive filtering', () => {
  const { getByPlaceholderText, queryByText } = render(<SearchBar data={data} />)
  const input = getByPlaceholderText('Search')

  fireEvent.change(input, { target: { value: 'bhub' } })

  expect(queryByText('Indian Institute of Technology Bhubaneswar')).toBeInTheDocument()
  expect(queryByText('Massachusetts Institute of Technology (MIT)')).toBeNull()
})

it('should display "No results found" if no matching results are found', () => {
  const { getByPlaceholderText, queryByText } = render(<SearchBar data={data} />)
  const input = getByPlaceholderText('Search')

  fireEvent.change(input, { target: { value: 'qwertyuiop' } })

  expect(queryByText('No results found')).toBeInTheDocument()
})
