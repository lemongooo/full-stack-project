import React from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { NotificationContextProvider, useNotificationDispatch, useNotificationValue } from './NotificationContext';
import { CounterContextProvider, useCounterDispatch, useCounterValue } from './CounterContext';

// API calls
const baseUrl = 'http://localhost:3001/anecdotes';

const getAnecdotes = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createAnecdote = async (newAnecdote) => {
  const response = await axios.post(baseUrl, newAnecdote);
  return response.data;
};

const updateAnecdote = async (updatedAnecdote) => {
  const response = await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote);
  return response.data;
};

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification) return null;

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1 }}>
      {notification}
    </div>
  );
};

const Display = () => {
  const counter = useCounterValue();
  return <div>{counter}</div>;
};

const Button = ({ type, label }) => {
  const dispatch = useCounterDispatch();
  return <button onClick={() => dispatch({ type })}>{label}</button>;
};

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries('anecdotes');
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${newAnecdote.content}' created` });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    onError: (error) => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `Error: ${error.response.data.error}` });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries('anecdotes');
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${updatedAnecdote.content}' voted` });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const handleNewAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    if (content.length >= 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 });
    } else {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: 'Anecdote content must be at least 5 characters long' });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  };

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  });

  if (isLoading) {
    return <div>Loading anecdotes...</div>;
  }

  if (error) {
    return <div>Anecdote service not available due to server issues</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <form onSubmit={handleNewAnecdote}>
        <input name="anecdote" />
        <button type="submit">Add anecdote</button>
      </form>
      {data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes}</div>
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
      ))}
      <Display />
      <div>
        <Button type="INC" label="+" />
        <Button type="DEC" label="-" />
        <Button type="ZERO" label="0" />
      </div>
    </div>
  );
};

// Main component
const queryClient = new QueryClient();

const Main = () => (
  <QueryClientProvider client={queryClient}>
    <CounterContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </CounterContextProvider>
  </QueryClientProvider>
);

export default Main;
