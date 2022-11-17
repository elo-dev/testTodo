import { useState } from 'react'

import style from './Tasks.module.less'

const Tasks = ({ task, removeTask, completedTask, editTask }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editTitle, setEditValue] = useState('')

  /**
   * Функция изменения title у задачи
   * @param {string} keyCode Вводимый символ
   */
  const handleEdit = (keyCode) => {
    if (keyCode === 'Enter' && editTitle.length > 0) {
      editTask({ id: task.id, title: editTitle })
      setIsEdit(false)
    }
  }

  return (
    <div
      className={
        task.completed ? style.task + ' ' + style.task__completed : style.task
      }
    >
      <div className={style.task__wrapper}>
        <input
          type={'checkbox'}
          checked={task.completed}
          onChange={() => completedTask(task.id)}
        />
        {isEdit ? (
          <input
            type="text"
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleEdit(e.code)}
          />
        ) : (
          <p className={style.task__title}>{task.title}</p>
        )}
      </div>
      <p className={style.task__description}>{task.description}</p>
      <div className={style.task__info}>
        <div className={style.task__info_wrapper}>
          {task.date && <p className={style.taks__date}>{task.date}</p>}
          <p>Файл: {task.fileName ? task.fileName : 'нет'}</p>
        </div>
        <div className={style.task__edit_panel}>
          <button
            className={style.task__edit}
            onClick={() => setIsEdit((prev) => !prev)}
          >
            Edit
          </button>
          <button
            className={style.task__remove}
            onClick={() => removeTask(task.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
export default Tasks
