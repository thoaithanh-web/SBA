import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const SESSION_KEY = 'fu-news:session:v1'

function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'Admin'
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(readSession)

  function login(username, password) {
    if (username.trim() !== 'Admin' || password !== 'Admin') {
      throw new Error('Incorrect username or password. Please try again.')
    }
    try {
      sessionStorage.setItem(SESSION_KEY, 'Admin')
    } catch {
      throw new Error('Session storage is unavailable. Allow site storage and try again.')
    }
    setAuthenticated(true)
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } finally {
      setAuthenticated(false)
    }
  }

  return <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
