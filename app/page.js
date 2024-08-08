'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm a coffee-shop support agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    const newMessage = { role: 'user', content: message };
    setMessages((messages) => [
        ...messages,
        newMessage,
        { role: 'assistant', content: '' }, // Placeholder for the assistant's response
    ]);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: [newMessage] }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { content } = await response.json(); // Extract content from JSON

        setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            const otherMessages = messages.slice(0, -1);
            return [
                ...otherMessages,
                { ...lastMessage, content: content }, // Update the last message with the response content
            ];
        });
    } catch (error) {
        console.error('Error:', error);
    }
};



  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
