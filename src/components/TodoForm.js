import React, { useState, useEffect, useRef } from 'react'
import { suggestIcon } from '../model'

import { RiTodoLine } from 'react-icons/ri'
import { IoFitness } from 'react-icons/io5'
import { MdLocalDrink } from 'react-icons/md'
import { BiBookBookmark } from 'react-icons/bi'

const CONFIDENCE_THRESHOLD = 0.7

const TodoForm = ({ onSubmit, model, encoder }) => {
  const [input, setInput] = useState({
    name: '',
    icon: 'TODO'
  })
  const [suggestedIcon, setSuggestedIcon] = useState('TODO')
  const [typeTimeout, setTypeTimeout] = useState(null)

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  })

  const handleChange = (e) => {
    const taskName = e.target.value
    setInput(() => ({ ...input, name: taskName }))
    if (typeTimeout) {
      clearTimeout(typeTimeout)
    }
    setTypeTimeout(
      setTimeout(async () => {
        const predictedIcon = await suggestIcon(
          model,
          encoder,
          taskName,
          CONFIDENCE_THRESHOLD
        )
        setSuggestedIcon(() => predictedIcon)
      }, 500)
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input.name,
      icon: suggestedIcon
    })
    setInput(() => ({ name: '', icon: 'TODO' }))
    setSuggestedIcon(() => 'TODO')
  }

  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      <input
        placeholder='Add a todo'
        value={input.name}
        onChange={handleChange}
        name='text'
        className='todo-input'
        ref={inputRef}
      />
      <button onClick={handleSubmit} className='todo-button'>
        {suggestedIcon === 'TODO' && <RiTodoLine className='todo-input-icon' />}
        {suggestedIcon === '' && <RiTodoLine className='todo-input-icon' />}
        {suggestedIcon === null && <RiTodoLine className='todo-input-icon' />}
        {suggestedIcon === 'RUN' && <IoFitness className='todo-input-icon' />}
        {suggestedIcon === 'DRINK' && (
          <MdLocalDrink className='todo-input-icon' />
        )}
        {suggestedIcon === 'BOOK' && (
          <BiBookBookmark className='todo-input-icon' />
        )}
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
