import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import SearchBar from '../components/SearchBar'

it('renders a search box', () => {
  const { getByPlaceholderText } = render(<SearchBar />)

  const subject = getByPlaceholderText('Search')

  expect(subject).toBeInTheDocument()
})
