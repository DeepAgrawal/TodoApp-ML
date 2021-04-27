import React from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import { RiTodoLine } from 'react-icons/ri'
import { FaFirstAid } from 'react-icons/fa'
import { FaBook } from 'react-icons/fa'
import { MdCake } from 'react-icons/md'
import { FaRunning } from 'react-icons/fa'
import { AiTwotoneCar } from 'react-icons/ai'

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
        {todo.icon === 'AID' && <FaFirstAid className='todo-icon' />}
        {todo.icon === 'BOOK' && <FaBook className='todo-icon' />}
        {todo.icon === 'CAKE' && <MdCake className='todo-icon' />}
        {todo.icon === 'SPORT' && <FaRunning className='todo-icon' />}
        {todo.icon === 'TRAVEL' && <AiTwotoneCar className='todo-icon' />}
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
