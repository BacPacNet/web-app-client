import { render, screen, fireEvent, getByTestId, waitFor } from '@testing-library/react'
import SearchBar from '@/components/SearchBar.js'
import data from '../../data/university_data'
import '@testing-library/jest-dom'

it('renders a search box', () => {
  const {getByPlaceholderText} = render(<SearchBar data={data}/>)
  
  const subject = getByPlaceholderText('Search Colleges...')

  expect(subject).toBeInTheDocument()
})

it('display filtered data based on input', () => {
  const {getByPlaceholderText, queryByText} = render(<SearchBar data={data}/>)
  const input = getByPlaceholderText('Search Colleges...')
  
  fireEvent.change(input, { target: { value: 'Bhubaneswar' } })
  // console.log(screen.debug()); //For Debugging: Print the rendered component to the console

  expect(queryByText('Indian Institute of Technology Bhubaneswar')).toBeInTheDocument()
  expect(queryByText('Massachusetts Institute of Technology (MIT)')).toBeNull();
})

it('handles case-insensitive filtering', () => {
  const { getByPlaceholderText, queryByText } = render(<SearchBar data={data} />);
  const input = getByPlaceholderText('Search Colleges...');

  fireEvent.change(input, { target: { value: 'bhub' } });

  expect(queryByText('Indian Institute of Technology Bhubaneswar')).toBeInTheDocument()
  expect(queryByText('Massachusetts Institute of Technology (MIT)')).toBeNull();
});

it('should display "No results found" if no matching results are found', () => {
  const { getByPlaceholderText, queryByText } = render(<SearchBar data={data} />);
  const input = getByPlaceholderText('Search Colleges...');

  fireEvent.change(input, { target: { value: 'qwertyuiop' } });
  
  expect(queryByText('No results found')).toBeInTheDocument();
});