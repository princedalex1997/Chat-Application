import React, { useState } from 'react'

const Login = () => {
    const [toggle, setToggle] = useState(false) // login page
    const handleToggle = () => {
        setToggle(prev => !prev)
    }
    return (
        <div>
            <button onClick={handleToggle} > {toggle ? "Login" : "Register"} </button>
            <h1>Login</h1>
        </div>
    )
}

export default Login
