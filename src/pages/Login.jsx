import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import PrintMessage from "../components/Message";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [isMessage, setMessage] = useState([]);
    const navigation = useNavigate();
    
    const {state} = useLocation()
    
    useEffect(() => {
      check_message()
  }, [])

  const check_message = () => {
    if (state) {
      setMessage([state.message, state.type])
    }
    else {
      setMessage(["", ""])
    }
  }

  const handel_student_login = (e) => {
    e.preventDefault();
    if (email.length > 0 && password.length > 0){

        axios.post("login/", {
            "email": email,
            "password": password
          })
          .then((response) => {
            if (response.data.status === 200) { 
              navigation("/");
            } else {
                setMessage([response.data.message, response.data.type])
          }
          })
          .catch((error) => {
            if (error.name === "AxiosError"){
              setMessage(["You are already Logged-in", "warning"])
            } else {
            setMessage([error.name, "danger"])
            }
          })
  }
}

const handel_staff_login = (e) => {
  e.preventDefault();
  if (email.length > 0 && password.length > 0){
      axios.post(`staff/login/`, {
          "email": email,
          "password": password
        })
        .then((response) => {
          if (response.data.status === 200) { 
              navigation("/");
            } else {
              setMessage([response.data.message, response.data.type])
        }
        })
        .catch((error) => {
          if (error.name === "AxiosError"){
            setMessage(["You are already Logged-in", "warning"])
          } else {
          setMessage([error.name, error.status])
          }
        })
}
}

  return (
    <>
    {isMessage.length>0 ? (<PrintMessage msg={isMessage[0]} type={isMessage[1]}/>) : <></>}


    <div className="container p-4" style={{ width: "28%", margin: "auto", marginTop: "8%", 
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background :"linear-gradient(to bottom right, #d5bcf5, #a974c4)"}}>
        <Tabs>
          <TabList style={{ textAlign: "center"}}>
            <Tab style={{ background: "none" }}>Student</Tab>
            <Tab style={{ background: "none" }}>Staff</Tab>
          </TabList>
      
          <TabPanel>
            <form onSubmit={handel_student_login}>
                <div className="col my-5">
                <div className="col">
                    <div className="row my-4">
                            <span style={{ fontSize: "12" }}>STUDENT EMAIL</span>
                            <input type="email" name="email" className="form-control" placeholder="student@mail.com"
                                aria-label="division" autoComplete="off" 
                                onChange={(event) => {setEmail(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                        <span style={{ fontSize: "12" }}>PASSWORD</span>
                            <input type="password" name="password" className="form-control"
                                aria-label="division" onChange={(event) => {setPassword(event.target.value)}} required></input>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <button type="submit" className="btn btn-primary"
                            style={{ margin: "auto auto", marginTop: "3%"}}>Submit</button>
                        </div>
                    </div>
                </div>
            </form>
          </TabPanel>
          <TabPanel>
            <form onSubmit={handel_staff_login}>
                <div className="col my-5">
                    <div className="col">
                        <div className="row my-4">
                        <span style={{ fontSize: "12" }}>STAFF EMAIL</span>
                            <input type="email" name="email" className="form-control" placeholder="staff@mail.com"
                                aria-label="division" autoComplete="off" 
                                onChange={(event) => {setEmail(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                            <span style={{ fontSize: "12" }}>PASSWORD</span>
                            <input type="password" name="password" className="form-control"
                                aria-label="division" onChange={(event) => {setPassword(event.target.value)}} required></input>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <button type="submit" className="btn btn-primary" 
                            style={{ margin: "auto auto", marginTop: "3%"}}>Submit</button>
                        </div>
                    </div>
                </div>
            </form>
          </TabPanel>
        </Tabs>
          <p>
          Not a User?<br />
          <a href="/register">REGISTER Here.</a>
          </p>
    </div>
    </>
      );
}

