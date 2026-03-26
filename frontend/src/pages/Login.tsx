import React, { useState } from 'react'
import { SignIn } from '../components/SignIn'
import { Register } from '../components/Register'

const Login = () => {
    const [toggle, setToggle] = useState(false) // login page
    const handleToggle = () => {
        setToggle(prev => !prev)
    }
    return (
        <div>
            <button onClick={handleToggle} > {toggle ?  "Register" : "Login" } </button>
           {toggle ? <Register /> :  <SignIn  /> }
        </div>
    )
}

export default Login
