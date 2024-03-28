import '@testing-library/jest-dom'

import SearchBar from '@/components/SearchBar'
import { render } from '@testing-library/react'

it('renders a search box', () => {
  const mockData = [
    { id: '1', name: 'College 1', score: '85', address: '...', collegePage: '...' },
    { id: '2', name: 'College 2', score: '70', address: '...', collegePage: '...' },
  ]
  const { getByPlaceholderText } = render(<SearchBar data={mockData} loading={false} />)

  const subject = getByPlaceholderText('Search institute')

  expect(subject).toBeInTheDocument()
})
