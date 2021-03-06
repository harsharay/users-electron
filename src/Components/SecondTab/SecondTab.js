import React, { useState, useEffect } from "react"

import "./SecondTab.css"

const SecondTab = (props) => {

    const backendUrl = "https://user-mngmt-backend.herokuapp.com"
    const [allUserData, setAllUserData] = useState([])
    const [toBeDeletedData, setToBeDeletedData] = useState([])

    useEffect(() => {

        let localStorageToken;

        if(window.localStorage.getItem('authToken')) {
            localStorageToken = JSON.parse(window.localStorage['authToken']).expiry > new Date().getTime() ? JSON.parse(window.localStorage['authToken']).token : ""
        }

        let authToken = props.location.jwtAuthToken || localStorageToken

        if(authToken) {
            fetch(backendUrl+"/api/getAllUserData", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': "Bearer "+ (props.location.authToken || authToken)
                },
            }).then(data => data.json())
            .then(json => {
                setAllUserData(json.allData)
                // window.alert(json.message)
            })
        } else {
            window.alert("Please login again")
        }
    },[toBeDeletedData])


    const handleGoToFirstTab = () => {
        props.history.push("/addUser")
    }

    const handleDeleteUserData = (uniqId) => {
        
        let data = allUserData

        let deletedData = data.filter(i => i.uniqueId === uniqId)

        setToBeDeletedData(deletedData)
    }

    useEffect(() => {
        if(toBeDeletedData.length > 0) {
            console.log(47, toBeDeletedData[0].email)
            let localStorageToken;

            if(window.localStorage.getItem('authToken')) {
                localStorageToken = JSON.parse(window.localStorage['authToken']).expiry > new Date().getTime() ? JSON.parse(window.localStorage['authToken']).token : ""
            }

            let authToken = props.location.jwtAuthToken || localStorageToken

            fetch(backendUrl+"/api/deleteUserData", {
                method: 'POST',
                body: JSON.stringify({
                    itemToBeDeleted: toBeDeletedData[0].email,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': "Bearer "+ (props.location.authToken || authToken)
                }
            }).then(data => data.json())
            .then(json => window.alert(json.message))
        }
    },[toBeDeletedData])

    return (
        <div>
            <div className="secondTab-buttonGroup">
                <button onClick={() => props.history.push("/")} className="secondTab-toTab1">Login</button>
                <button onClick={handleGoToFirstTab} className="secondTab-toTab1">Tab 1</button>
            </div>
            <p>List of all the user details added</p>
            { (allUserData && allUserData.length>0) ? 
                <div>
                   { allUserData.map((userData, index) => {
                    return (
                        <div className="singleUserData-div" key={index}>
                            <p>{index+1}</p>
                            <p>{userData.email}</p>
                            <p>{userData.username}</p>
                            <p>{userData.mobileNumber}</p>
                            <p>{userData.address}</p>
                            <button onClick={() => handleDeleteUserData(userData.uniqueId)}>Delete</button>
                        </div>
                    )
                    }) }
                </div>
                :
                <p>No data to dispaly, add some</p>
            }
        </div>
    )
};

export default SecondTab