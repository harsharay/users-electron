import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import "./Register.css"

const Register = (props) => {

    let backendUrl = 'https://user-mngmt-backend.herokuapp.com'
    const [data, setData] = useState({
        username: '',
        email: '',
        mobileNumber: '',
        address: ''
    })
    const [displayPage, setDisplayPage] = useState(false)

    useEffect(() => {
        // console.log(17, window.localStorage['authToken'])
        let localStorageToken;

        if(window.localStorage.getItem('authToken')) {
            localStorageToken = JSON.parse(window.localStorage['authToken']).expiry > new Date().getTime() ? JSON.parse(window.localStorage['authToken']).token : ""
        }

        let authToken = props.location.jwtAuthToken || localStorageToken

        if(authToken) {
            setDisplayPage(true)
        }
    },[])

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

    function validateUserData (username, mobileNumber, email) {

        // let message;

        if(username.length > 0 && mobileNumber.length>0 && email.length > 0) {
            let faultyInputs = []

            let usernameRegex = /^[A-Za-z0-9 ]+$/
            let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

            mobileNumber = String(mobileNumber)

            // console.log(45,mobileNumber, mobileNumber.length, email, username)

            if(mobileNumber.length !== 10) {
                faultyInputs.push('mobilenumber')
            }

            if(username.includes(" ") || !(usernameRegex.test(username))) {
                faultyInputs.push('username')
            }

            if(!(emailRegex.test(email))) {
                faultyInputs.push('email')
            }

            return faultyInputs
        }
    }

    const handleAddingUser = () => {
        let localStorageToken;

        if(window.localStorage.getItem('authToken')) {
            localStorageToken = JSON.parse(window.localStorage['authToken']).expiry > new Date().getTime() ? JSON.parse(window.localStorage['authToken']).token : ""
        }

        let authToken = props.location.jwtAuthToken || localStorageToken
        
        if(authToken) {
            let validatedInput = validateUserData(data.username, data.mobileNumber,data.email)

            if(validatedInput) {
                if(validatedInput.length === 0) {
                    console.log(62, props)
                    fetch(backendUrl+"/api/addAUser", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': "Bearer "+ authToken
                        },
                        body : JSON.stringify({
                            username : data.username,
                            email: data.email,
                            mobileNumber: data.mobileNumber,
                            address: data.address
                        })
                    }).then(data => data.json())
                    .then(json => {
                        console.log(json)
                        window.alert(json.message)
                        setData(prev => {
                            return {
                                email: "",
                                mobileNumber: "",
                                username: "",
                                address: ""
                            }
                        })
                    })
                } else {
                    window.alert("Error with the input data")
                }
            } else {
                window.alert("Enter all details")
            }
        } else {
            window.alert("Please login again")
        }
    }

    const handleGoBack = () => {
        props.history.push("/")
    }

    const handleRedirectToSecondTab = () => {

        let localStorageToken;

        if(window.localStorage.getItem("authToken")) {
            localStorageToken = JSON.parse(window.localStorage['authToken']).expiry > new Date().getTime() ? JSON.parse(window.localStorage['authToken']).token : ""

        }

        let authToken = props.location.jwtAuthToken || localStorageToken
        
        if(authToken) {
            props.history.push({
                pathname: "/secondTab",
                authToken
            })
        } else {
            window.alert(`Please ${<Link to="/">login</Link>} again`)
        }
    }

    return (
        <> 
            {/* <button onClick={handleGoBack}>Go back</button> */}
            {displayPage ? 
                <div className="addUser-root">
                    {/* <button onClick={handleGoBack}>Go back</button> */}
                    <button onClick={handleRedirectToSecondTab} className="addUser-tab2">Tab 2</button>
                    <div className="addUser-block">
                        <div>
                            <p>Email</p>
                            <input type="email" name='email' value={data.email} onChange={handleChange} />
                        </div>
                        <div>
                            <p>Username</p>
                            <input type="text" name='username' value={data.username} onChange={handleChange} />
                        </div>
                        <div>
                            <p>Mobile Number</p>
                            <input type="number" name='mobileNumber' value={data.mobileNumber} onChange={handleChange} />
                        </div>
                        <div>
                            <p>Address</p>
                            <textarea name='address' value={data.address} onChange={handleChange} />
                        </div>
                        <button onClick={handleAddingUser}>Add user</button>
                    </div>
                </div>
                :
                <p>Please <Link to="/">Login</Link> again</p>
            } 
        </>
    )
}

export default Register;