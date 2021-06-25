import React, { useState, useEffect, useRef } from 'react'
import { suggestIcon } from '../model'

import { RiTodoLine } from 'react-icons/ri'
import { FaFirstAid } from 'react-icons/fa'
import { FaBook } from 'react-icons/fa'
import { MdCake } from 'react-icons/md'
import { FaRunning } from 'react-icons/fa'
import { AiTwotoneCar } from 'react-icons/ai'

const CONFIDENCE_THRESHOLD = 0.4

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
        {suggestedIcon === 'AID' && <FaFirstAid className='todo-icon' />}
        {suggestedIcon === 'BOOK' && <FaBook className='todo-icon' />}
        {suggestedIcon === 'CAKE' && <MdCake className='todo-icon' />}
        {suggestedIcon === 'SPORT' && <FaRunning className='todo-icon' />}
        {suggestedIcon === 'TRAVEL' && <AiTwotoneCar className='todo-icon' />}
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
