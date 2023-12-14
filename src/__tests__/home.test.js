import { render, screen } from '@testing-library/react'
import Home from '../app/page.js'
import SearchBar from '@/components/SearchBar.js'
import '@testing-library/jest-dom'

it('renders a search box', () => {
  const {getByPlaceholderText} = render(<SearchBar/>)
  
  const subject = getByPlaceholderText('Search')

  expect(subject).toBeInTheDocument()
})