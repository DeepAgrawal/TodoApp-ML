import React from 'react'
import './App.css'
import TodoList from './components/TodoList'

function App() {
  const visRef = React.useRef(null)

  return (
    <>
      <div ref={visRef} className='vis'></div>
      <div className='todo-app'>
        <TodoList visRef={visRef} />
      </div>
    </>
  )
}

export default App
