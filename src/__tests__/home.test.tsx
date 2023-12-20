import { render } from '@testing-library/react'
import SearchBar from '@/components/SearchBar'
import '@testing-library/jest-dom'

it('renders a search box', () => {
  const { getByPlaceholderText } = render(<SearchBar />)

  const subject = getByPlaceholderText('Search')

  expect(subject).toBeInTheDocument()
})
