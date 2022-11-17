import { useEffect, useRef, useState } from 'react'
import { onValue, ref, remove, set, update } from 'firebase/database'
import { db } from './services/firebase'

import Tasks from './components/Tasks/Tasks'

import style from './App.module.less'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const inputRef = useRef()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val()
      if (data !== null) {
        const arrTasks = []
        Object.values(data).map((task) => {
          arrTasks.push(task)
        })
        setTasks(arrTasks)
      }
    })
  }, [])

  /**
   * Функция добавляющая новую задачу
   */
  const addTask = () => {
    const id = Math.floor(Math.random() * 100000)
    const newTask = {
      id,
      title,
      description,
      completed: false,
      fileName: inputRef.current.files[0]
        ? inputRef.current.files[0].name
        : null,
    }
    if (title) {
      setTasks([newTask, ...tasks])
      set(ref(db, `/${id}`), newTask)
      setTitle('')
      setDescription('')
    }
  }

  /**
   * Функция удаления задачи
   * @param {number} id Task id
   */
  const removeTask = (id) => {
    remove(ref(db, `/${id}`))
    setTasks(tasks.filter((task) => task.id !== id))
  }

  /**
   * Функция изменения title у задачи
   * @param {Object} param
   * @param {number} param.id Task id
   * @param {string} param.title Task title
   */
  const editTask = ({ id, title }) => {
    const copy = [...tasks]
    const task = copy.find((task) => task.id === id)
    task.title = title
    update(ref(db, `/${id}`), {
      title,
    })
    setTasks(copy)
  }

  /**
   * Функция изменяющая completed у задачи
   * @param {number} id Task id
   */
  const completedTask = (id) => {
    const date = new Date().toLocaleTimeString()
    const copy = [...tasks]
    const task = copy.find((task) => task.id === id)
    task.completed = !task.completed
    update(ref(db, `/${id}`), {
      completed: task.completed,
    })
    if (task.completed) {
      task.date = date
    }
    setTasks(copy)
  }

  return (
    <div className={style.layout}>
      <div className={style.wrapper}>
        <input
          type="text"
          placeholder="Task"
          className={style.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className={style.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className={style.inputFile}>
          <input type="file" name="file" ref={inputRef} />
          <span>Файл</span>
        </label>
        <button className={style.button} onClick={addTask}>
          +
        </button>
      </div>
      {tasks.length ? (
        tasks.map((task) => (
          <Tasks
            key={task.id}
            task={task}
            removeTask={removeTask}
            completedTask={completedTask}
            editTask={editTask}
          />
        ))
      ) : (
        <p className={style.empty}>Empty tasks</p>
      )}
    </div>
  )
}

export default App
