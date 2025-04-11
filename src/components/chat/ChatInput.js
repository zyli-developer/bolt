"use client"

import { useState } from "react"

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSendMessage(message)
    setMessage("")
  }

  return (
    <div className="p-4 border-t border-divider">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="请输入文字"
          className="flex-1 border border-divider rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="button" className="ml-2 text-text-tertiary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          type="submit"
          className="ml-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChatInput
