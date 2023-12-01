import React from 'react'

import { Card, CardContent, Typography, CardActions,  IconButton, Checkbox, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import type {ITodo} from '@/types'

import { useAppDispatch } from '../../store/store';
import {toggleTodo, editTodo, removeTodo} from '../../store/slices/todoSlice'

const Todo = ({id, title, completed}: ITodo) => {

  const [editing, setEditing] = React.useState(false)
  const [text, setText] = React.useState('')

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    e.target.value = title
    setText(title)
  }

  const editTodoContent = () => {
    console.log('edit')
    dispatch(editTodo({id, text}))
    setText('')
    setEditing(false)
  }

  const dispatch = useAppDispatch()

  const toggle = () => {
    dispatch(toggleTodo({id}))
  }

  const deleteTodo = () => {
    dispatch(removeTodo(id))
  }

  const handleClose = () => {
    setText('')
    setEditing(false)
  }

  return (
    <Card sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Checkbox checked={completed} size='medium' color="secondary" onChange={toggle} />
      <CardContent sx={{flexGrow:1}}>
        {editing ?
        <TextField
          onChange={(e) => setText(e.target.value)}
          onFocus={(e)=> handleFocus(e)}
          autoFocus
          fullWidth
          multiline
          InputProps={{sx:{p:1}}}
        />
        :
        <Typography variant='body1'>
          {title}
        </Typography>
        }
      </CardContent>
      <CardActions >
        {editing ?
          text !== title ?
          <IconButton aria-label="1" color="secondary" onClick={editTodoContent}>
            <CheckIcon />
          </IconButton>
          :
          <IconButton aria-label="1" color="secondary" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        :
        <IconButton aria-label="2"  color="secondary" onClick={() => setEditing(true)}>
          <CreateIcon />
        </IconButton>
        }
        <IconButton aria-label="delete" color="secondary" onClick={deleteTodo}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Todo