'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: `Hi! I'm a coffee-shop support agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Reference to the end of the messages list

  const sendMessage = async (messageContent = message) => {
    if (!messageContent.trim()) return; // Prevent sending empty messages

    setMessage('');
    const newMessage = { role: 'user', content: messageContent };
    setMessages((messages) => [
      ...messages,
      newMessage,
      { role: 'model', content: '...' }, // Placeholder for the model's response
    ]);

    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [newMessage] }),
      });

      const { content } = await response.json();

      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, -1);
        return [
          ...otherMessages,
          { ...lastMessage, content: content },
        ];
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, -1);
        return [
          ...otherMessages,
          { ...lastMessage, content: 'Sorry, something went wrong. Please try again.' },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: 'url(/coffee_agent_bg.webp)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Welcome Message Outside the Box */}
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
        Welcome to 22 Street Coffee Shop
      </Typography>

      <Stack
        direction={'column'}
        width="100%"
        maxWidth="500px"
        height="100%"
        maxHeight="700px"
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
        p={2}
        spacing={3}
      >
        {/* Chatbot Header */}
        <Typography variant="h6" align="center" gutterBottom>
          Coffee Shop Virtual Agent
        </Typography>

        <Stack
          direction={'column'}
          spacing={1}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          p={1}
          bgcolor="#f0f0f0"
          borderRadius={2}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'model' ? 'flex-start' : 'flex-end'
              }
              alignItems="flex-start"
              mt={0.5}
            >
              <Box
                sx={{
                  bgcolor: message.role === 'model' ? '#e0f7fa' : '#c8e6c9',
                  color: 'black',
                  borderRadius: 2,
                  p: 2,
                  maxWidth: '75%',
                  boxShadow: 1,
                  '& .markdown-body': {
                    backgroundColor: 'transparent',
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="markdown-body"
                >
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
          {/* Invisible element to scroll to */}
          <Box ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress} // Handle Enter key press
            disabled={loading}
            variant="outlined"
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
            }}
          />
          <Button
            variant="contained"
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            sx={{
              bgcolor: '#00796b',
              '&:hover': {
                bgcolor: '#004d40',
              },
            }}
          >
            {loading ? '...' : 'Send'}
          </Button>
        </Stack>
        <Stack direction={'row'} spacing={2} mt={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => sendMessage('View Menu')}
            disabled={loading}
            sx={{
              color: '#00796b',
              borderColor: '#00796b',
              '&:hover': {
                bgcolor: '#e0f2f1',
                borderColor: '#004d40',
              },
            }}
          >
            View Menu
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendMessage('Place an Order')}
            disabled={loading}
            sx={{
              color: '#00796b',
              borderColor: '#00796b',
              '&:hover': {
                bgcolor: '#e0f2f1',
                borderColor: '#004d40',
              },
            }}
          >
            Place an Order
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendMessage('Ask a Question')}
            disabled={loading}
            sx={{
              color: '#00796b',
              borderColor: '#00796b',
              '&:hover': {
                bgcolor: '#e0f2f1',
                borderColor: '#004d40',
              },
            }}
          >
            Ask a Question
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
