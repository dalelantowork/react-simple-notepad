import React from 'react'

const Notes = ({notes,removeItem,editItem}) => {
    return (
        <div>
            
            {notes.map((note)=>{
                const {text,day,reminder,id} = note
                return (
                    <div key={id}>
                        <button type="button" onClick={()=>editItem(id)}>Edit</button>    
                        <button type="button" onClick={()=>removeItem(id)}>Delete</button>
                        <h3>{text}</h3>
                        <p>{day}</p>
                        <p>{reminder ? 'Remind Me' : "Don't Remind"}</p>
                        <hr></hr>
                    </div>
                );
            })}
        </div>
    )
}

export default Notes
