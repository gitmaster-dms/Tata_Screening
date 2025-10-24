import React from 'react'

const Demo = ({ onAcceptClick }) => {

    const handleActive = () =>{
        console.log("submitted");
        onAcceptClick();
    }
  return (
    <div>
      <form onSubmit={handleActive}>
      <button type='submit'>accept</button>
      </form>
      
    </div>
  )
}

export default Demo
