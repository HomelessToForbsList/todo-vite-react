import React, { ChangeEvent } from 'react'
import { TextField, Box, Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch } from '../../store/store';
import { addTodo } from '../../store/slices/todoSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  width: 0.8,
  boxSizing: 'border-box',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TodoAddForm = () => {

  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState('')

  const dispatch = useAppDispatch()

  const toggleOpen = () => {
    setOpen(prev => !prev)
  }

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleClose = () => {
    setText('')
    setOpen(false)
  }

  const addNewTodo = () => {
    dispatch(addTodo(text))
    setText('')
    setOpen(false)
  }

  return (
    <Box>
      <Button
        sx={{m:2}}
        size='large'
        variant='contained'
        color='secondary'
        endIcon={<AddIcon/>}
        onClick={toggleOpen}
      >
        Add todo
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            value={text}
            onChange={handleChangeText}
            autoFocus
            fullWidth
            multiline
            minRows={6}
          />
          <Button
            color='secondary'
            size='large'
            variant='contained'
            sx={{minWidth: 200}}
            onClick={addNewTodo}
            disabled={!text}
            >
              Add
            </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default TodoAddForm