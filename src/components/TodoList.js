import React, { useState } from 'react'
import TodoForm from './TodoForm'
import Todo from './Todo'

import * as use from '@tensorflow-models/universal-sentence-encoder'
import { trainModel } from '../model'

function TodoList({ visRef }) {
  const [todos, setTodos] = useState([])
  const [model, setModel] = useState(null)
  const [encoder, setEncoder] = useState(null)

  const addTodo = (todo) => {
    if (todo.text.trim() === '') {
      return
    }
    const newTodos = [todo, ...todos]
    setTodos(newTodos)
    console.log(...todos)
  }

  const removeTodo = (id) => {
    const removedArr = [...todos].filter((todo) => todo.id !== id)
    setTodos(removedArr)
  }

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  // ML
  React.useEffect(() => {
    const loadModel = async () => {
      const sentenceEncoder = await use.load()
      const trainedModel = await trainModel(sentenceEncoder, visRef.current)
      setEncoder(sentenceEncoder)
      setModel(trainedModel)
    }
    loadModel()
  }, [])

  return (
    <>
      {model === null && <h1>Loading Model ... </h1>}
      {model !== null && (
        <>
          <h1>What's the Plan for Today?</h1>
          <TodoForm onSubmit={addTodo} model={model} encoder={encoder} />
          <Todo
            todos={todos}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        </>
      )}
    </>
  )
}

export default TodoList
