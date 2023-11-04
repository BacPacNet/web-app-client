import { render, screen } from '@testing-library/react'
import Home from '../app/page.js'
import SearchBar from '@/components/SearchBar.js'
import '@testing-library/jest-dom'
 
describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
 
    const heading = screen.getByRole('heading', {
      name: /BacPac/i,
    })
 
    expect(heading).toBeInTheDocument()
  })
})

it('renders a search box', () => {
  const {getByPlaceholderText} = render(<SearchBar/>)
  
  const subject = getByPlaceholderText('Search Colleges...')

  expect(subject).toBeInTheDocument()
})