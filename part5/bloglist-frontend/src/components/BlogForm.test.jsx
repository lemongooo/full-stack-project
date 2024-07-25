// src/components/BlogForm.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('form calls the event handler it received as props with the right details when a new blog is created', () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')

  fireEvent.change(titleInput, { target: { value: 'Testing Title' } })
  fireEvent.change(authorInput, { target: { value: 'Testing Author' } })
  fireEvent.change(urlInput, { target: { value: 'http://testingurl.com' } })
  fireEvent.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testingurl.com')
})
