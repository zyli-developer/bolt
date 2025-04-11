const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user"

  return (
    <div className={`mb-4 ${isUser ? "flex justify-end" : ""}`}>
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-other"}>
        <div>{message.text}</div>
        <div className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</div>
      </div>
    </div>
  )
}

export default ChatMessage
