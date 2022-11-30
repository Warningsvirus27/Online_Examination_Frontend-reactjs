import React from 'react';
import { Component, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PrintMessage from '../components/Message';
import axios from 'axios';


function Logout() {

    const [loggedInUser, setLoggedInUser] = useState({})
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState();
    const [message, setMessage] = useState([]);

    useEffect( () => {
        get_user();
        return () => {
            logout_user();
        }
    }, []);
    
    const logout_user = async () => {
        await axios.get("logout/", {
        })
        .then((response) => {
            setIsLoaded(true)
        })
        .catch((error) => {
            setIsLoaded(true)
            setMessage(error.name, "danger")
        })
    }

    const get_user = async() => {
        await axios.get("user/", {
          })
          .then((response) => {
            if (response.data.status === 200) {
            setLoggedInUser(response.data)
            } else {
                setMessage([response.data.message, response.data.type])
            }
          })
          .catch((error) => {
            setError(true)
            setMessage([error.name, "danger"])
          })
    }

    if (!isLoaded) {
        return (
            <>
        <p style={{fontSize:"10vw",textAlign:"center",marginTop:"2vw"}}>Logging-Out...</p>
        </>
        )
    }  else {
    return <>
        {error ? (<PrintMessage msg={message[0]} type={message[1]}/>) : <></>}
        {message ? (<PrintMessage msg={message[0]} type={message[1]}/>) : <></>}

        <div>
            <div className="container">
                    <h1>You have been successfully logged out.</h1>
                    <h2>Click <a href="/login">here</a> to Log-In again</h2>
            </div>
        </div>
    </>
    }
}

export default Logout;