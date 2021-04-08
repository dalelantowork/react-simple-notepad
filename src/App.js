import { useState, useEffect } from 'react'
import Notes from './Notes'

 //
function App() {
  const [notes,setNotes] = useState([])
  const [page,setPage] = useState('')
  const [date,setDate] = useState('')
  const [isEditing,setIsEditing] = useState(false)
  const [editID,setEditID] = useState()
  const [clearNotes,setClearNotes] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      setNotes(data)
      console.log(data)
    }

    fetchTasks()
  }, [])

  // fetchTasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    //console.log(data)
    return data
  }

  // Fetch Task for edit
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    //console.log(data)
    return data
  }

  // Add Task
  const addTask = async (page) => {
    const res = await fetch(`http://localhost:5000/tasks`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'

      },
      body: JSON.stringify(page)
    })

    const data = await res.json()

    setNotes([...notes, data])
  }

  // Delete All Task
  const deleteAllTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE',
    })
    
  }

  // Clear list
  const clearList = () => {
    
    {notes.map((note)=>{
      console.log(note.id)
      deleteAllTask(note.id)
    })}
    setNotes([])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE',
    })
    setNotes(notes.filter((item)=> item.id !== id ))
    console.log('delete', id) 
  }

  const removeItem = (id) => {
    deleteTask(id)
  }

  
  const editItem = (id) => {
    const specificItem = notes.find((item)=> item.id === id)
    setIsEditing(true)
    setEditID(id)
    setPage(specificItem.text)
    setDate(specificItem.day)
  }

  // Toggle Reminder
  const editItemServer = async (id) => {
    const noteToChange = await fetchTask(id)
    const updNote = { ...noteToChange,
    text: page, day: date }
    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updNote)
    })

    const data = await res.json()

    setNotes(notes.map((item)=>{
      if(item.id === editID){
        return {...item,text:page,day:date}
      }
      return item
    }))
    //console.log('doubleClick',id)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(page)
    if(!page){
      // if empty
    } else if(page && isEditing){
      // do something if editing
      // setNotes(notes.map((item)=>{
      //   if(item.id === editID){
      //     return {...item,text:page,day:date}
      //   }
      //   return item
      // }))
      editItemServer(editID)
      setPage('')
      setEditID(null);
      setIsEditing(false);
    }else{
      const newItem = {id: new Date().getTime().toString(),text:page,day:"today",reminder:false}
      addTask(newItem);
      setPage('')
      console.log(newItem)
    }
  }


  return (
    <div className="App">
      My Notepad
      <br></br>
      <form onSubmit={handleSubmit}>
        <input type="text" value={page} onChange={(e)=>setPage(e.target.value)}/>
       {isEditing && <input type="text" value={date} onChange={(e)=>setDate(e.target.value)}/> } 
        <button type="submit">{isEditing ? 'Submit New Name': 'Add Note'}</button>
      </form>
      
      <hr></hr>
      <Notes notes={notes} removeItem={removeItem} editItem={editItem}/>
      <button onClick={clearList}>clear notes</button>
    </div>
  );
}

export default App;
