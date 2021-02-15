import React, { useState, useEffect } from "react"

import "./Login.css"

const Login = (props) => {

    let backendUrl = 'https://user-mngmt-backend.herokuapp.com'
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [authData, setAuthData] = useState({})

    const handleChange = e => {
        let name = e.target.name
        let value = e.target.value

        setData(prev => {
            return {
                ...prev,
                [name] : value
            }
        })

    }

    const retrieveLoginInfo = () => {
        fetch(backendUrl+"/api/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : data.email,
                password : data.password
            })
        }).then(data => data.json())
        .then(json => {
            setAuthData(json)
            console.log(json,41)
            if(json.token.length > 0) {
                props.history.push({
                    pathname: "/addUser",
                    jwtAuthToken: json.token
                })

                let token = JSON.stringify({
                    token: json.token,
                    expiry: (new Date().getTime())+300000
                })
    
                localStorage.setItem('authToken', token)
            } else if(json.message === 'unauthorized') {
                window.alert("Wrong login details")
            }

            
        })
    }


    return (
        <div className="login-root">
            <div className="login-block">
                <div>
                    <p>Email</p>
                    <input type="email" name='email' value={data.email} onChange={handleChange} />
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" name='password' value={data.password} onChange={handleChange} />
                </div>
                <button onClick={retrieveLoginInfo}>Login</button>
            </div>
        </div>
    )
}

export default Login;