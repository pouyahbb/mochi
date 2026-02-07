import React from 'react'

type Props= {generatedUIId : string; isOpen : boolean; onClose: () => void}

const ChatWindow = ({generatedUIId , isOpen ,onClose} : Props) => {
  return (
    <div>ChatWindow</div>
  )
}

export default ChatWindow