import React, { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'

export const About = () => {
    const a = useContext(NoteContext)
  return (
    <div>This is {a.name}</div>
  )
}
