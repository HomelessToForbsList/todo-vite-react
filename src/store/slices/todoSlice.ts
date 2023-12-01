import { AppDispatch } from '../store';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ITodo } from '@/types'

export interface TodosState {
  todos: ITodo[];
  currentTodoRange: ITodo[];
  totalPages: number;
  currentPage: number
}

type ThunkApi = {
  dispatch: AppDispatch;
  state: RootState
}

const url = import.meta.env.VITE_API_URL

export const fetchTodos = createAsyncThunk <ITodo[]>(
  'todos/fetchTodos',
  async () => {
    const data = await fetch(`${url}`)
    const todos = await data.json()
    return todos
  }
)

export const addTodo = createAsyncThunk <ITodo, string, ThunkApi>(
  'todos/addTodo',
  async (text,{dispatch}) => {
    const todo = {
      title:text,
      completed: false
    }
    const data = await fetch(`${url}`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    })
    dispatch(fetchTodos())
    const newTodo = await data.json()
    return newTodo
  }
)

export const toggleTodo = createAsyncThunk <ITodo,{id:string}, ThunkApi>(
  'todos/toggleTodo',
  async ({id},{getState}) => {
    const todo = getState().todo.todos.find(todo => todo.id === id)!
    const data = await fetch(`${url}/${id}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !todo.completed
      })
    })
    const newTodo = await data.json()
    return newTodo
  }
)

export const editTodo = createAsyncThunk <ITodo,{id:string, text: string}>(
  'todos/editTodo',
  async ({id, text}) => {
    const data = await fetch(`${url}/${id}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: text
      })
    })
    const newTodo = await data.json()
    return newTodo
  }
)

export const removeTodo = createAsyncThunk<string, string, ThunkApi>(
  'todos/removeTodo',
  async (id,{dispatch}) => {
    await fetch(`${url}/${id}`,{
      method: 'DELETE',
    })
    dispatch(fetchTodos())
    return id
  }
)

const initialState: TodosState = {
  todos: [],
  currentTodoRange: [],
  totalPages: 0,
  currentPage: 1
}

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
      state.currentTodoRange = state.todos.filter((_,i) => {
        return i >= (state.currentPage-1)*Number(import.meta.env.VITE_LIMIT) && i <= (state.currentPage*Number(import.meta.env.VITE_LIMIT))-1
      })
    },
    setCurrentTodos: (state) =>{
      state.currentTodoRange = state.todos.filter((_,i) => {
        return i >= (state.currentPage-1)*Number(import.meta.env.VITE_LIMIT) && i <= (state.currentPage*Number(import.meta.env.VITE_LIMIT))-1
      })
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchTodos.fulfilled,(state, action)=>{
      state.todos = action.payload.reverse()
      state.totalPages = Math.ceil(action.payload.length/Number(import.meta.env.VITE_LIMIT))
      todoSlice.caseReducers.setCurrentTodos(state)
    }),
    builder.addCase(addTodo.fulfilled,(state, action) => {
      state.todos.unshift(action.payload)
    }),
    builder.addCase(toggleTodo.fulfilled,(state, action)=>{
      const todo  = state.todos.find(todo => todo.id === action.payload.id)!
      todo.completed = action.payload.completed
      todoSlice.caseReducers.setCurrentTodos(state)
    }),
    builder.addCase(editTodo.fulfilled, (state, action)=>{
      const todo  = state.todos.find(todo => todo.id === action.payload.id)!
      todo.title = action.payload.title
      todoSlice.caseReducers.setCurrentTodos(state)
    }),
    builder.addCase(removeTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    })
  }
})

export const {setPage} = todoSlice.actions
export const todoSelector = (state: RootState) => state.todo

export default todoSlice.reducer