import React from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import { RiTodoLine } from 'react-icons/ri'
import { IoFitness } from 'react-icons/io5'
import { MdLocalDrink } from 'react-icons/md'
import { BiBookBookmark } from 'react-icons/bi'

const Todo = ({ todos, completeTodo, removeTodo }) => {
  return todos.map((todo, index) => (
    <div
      className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div
        className='todo-row-content'
        key={todo.id}
        onClick={() => completeTodo(todo.id)}
      >
        {todo.icon === 'TODO' && <RiTodoLine className='todo-icon' />}
        {todo.icon === 'RUN' && <IoFitness className='todo-icon' />}
        {todo.icon === 'DRINK' && <MdLocalDrink className='todo-icon' />}
        {todo.icon === 'BOOK' && <BiBookBookmark className='todo-icon' />}
        {todo.text}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id)}
          className='delete-icon'
        />
      </div>
    </div>
  ))
}

export default Todo
