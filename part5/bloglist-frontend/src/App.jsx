import React, { useState, useEffect, useRef } from 'react';
import loginService from './services/login';
import blogService from './services/blogs';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes));
    setErrorMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const likeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const likedBlog = { ...blog, likes: blog.likes + 1 };

    const returnedBlog = await blogService.update(id, likedBlog);
    setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog).sort((a, b) => b.likes - a.likes));
  };

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id);
      setBlogs(blogs.filter(b => b.id !== id).sort((a, b) => b.likes - a.likes));
    }
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />

      {user === null
        ? <Togglable buttonLabel="log in">
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        : <div>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
      }

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={() => likeBlog(blog.id)}
          deleteBlog={() => deleteBlog(blog.id)}
          user={user}
        />
      )}
    </div>
  );
};

export default App;
