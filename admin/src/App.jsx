import React from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'

function App() {
  const { isSignedIn } = useUser();
  return (
    <>
      <h1>Admin Dashboard</h1>
      <header>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton mode="modal">Sign In</SignInButton>
            <SignUpButton mode="modal">Sign Up</SignUpButton>
          </>
        )}
      </header>
    </>
  )
}

export default App
