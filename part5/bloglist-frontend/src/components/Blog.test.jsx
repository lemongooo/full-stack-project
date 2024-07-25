// src/components/Blog.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

test('renders title and author, but not URL or number of likes by default', () => {
  const blog = {
    title: 'Testing Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} toggleImportance={() => {}} handleLike={() => {}} />)

  const element = screen.getByText('Testing Blog Test Author')
  expect(element).toBeDefined()

  const urlElement = screen.queryByText('http://testurl.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 5')
  expect(likesElement).toBeNull()
})

test('URL and number of likes are shown when the button controlling the shown details has been clicked', () => {
  const blog = {
    title: 'Testing Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} toggleImportance={() => {}} handleLike={() => {}} />)

  const button = screen.getByText('view')
  fireEvent.click(button)

  const urlElement = screen.getByText('http://testurl.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes 5')
  expect(likesElement).toBeDefined()
})

test('if the like button is clicked twice, the event handler is called twice', () => {
  const blog = {
    title: 'Testing Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} toggleImportance={() => {}} handleLike={mockHandler} />)

  const button = screen.getByText('view')
  fireEvent.click(button)

  const likeButton = screen.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
