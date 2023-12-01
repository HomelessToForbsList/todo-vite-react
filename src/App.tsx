import React from 'react'
import './App.css'

import Todo from './components/TodoCard/Todo';
import TodoAddForm from './components/TodoAddForm/TodoAddForm';
import PaginationComponent from './components/PaginationComponent/PaginationComponent';

import { createTheme, ThemeProvider} from '@mui/material/styles'
import { deepPurple } from '@mui/material/colors';
import { Container, Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grow from '@mui/material/Grow';

import { useAppDispatch, useAppSelector } from './store/store';
import { fetchTodos, todoSelector } from './store/slices/todoSlice';



function App() {

  const theme = createTheme({
    palette:{
      primary: {
        main: deepPurple['A100'],
      },
      secondary:{
        main: deepPurple[500]
      }
    }
  })

  const dispatch = useAppDispatch()
  const {currentTodoRange} = useAppSelector(todoSelector)

  React.useEffect(()=>{
    dispatch(fetchTodos())
  },[dispatch])


  return (
    <ThemeProvider theme={theme}>
      <Container sx={{
        bgcolor:'primary.main',
        p:2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant='h2' sx={{fontWeight:600, fontStyle: 'italic'}}>ToDo list</Typography>
        <TodoAddForm/>
        <Box maxWidth='sm' sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {currentTodoRange.map((todo, index) =>
            <Grow key={todo.id} in timeout={200*(index+1)} easing={{enter: 'ease-in'}}>
              <Box>
                <Todo id={todo.id} title={todo.title} completed={todo.completed} />
              </Box>
            </Grow>
          )}
        </Stack>
      </Box>
      <PaginationComponent />
      </Container>
    </ThemeProvider>
  )
}

export default App
