import React, { component, useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PrintMessage from "../components/Message";
import { useLocation } from 'react-router-dom';



function Register() {

    const [message, setMessage] = useState([]);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("")
    const [password_confirm, setPasswordConfirm] = useState("");
    const {state} = useLocation()
    const navigation = useNavigate();

    useEffect(() => {
        check_message()
    }, [])

    const check_message = () => {
        if (state) {
          setMessage([state.message, state.type])
        }
        else {
        }
      }

    const handel_student_register = (e) => {
        e.preventDefault();
        if (email.length > 0 && password.length > 0){
            axios.post("std_register/", {
                "email": email,
                "password": password,
                "first_name": firstName,
                "last_name": lastName,
                "password_confirm": password_confirm
              })
              .then((response) => {
                if (response.data.status === 201 ) {
                    navigation("/login", {state: response.data});
                } else {
                    setMessage([response.data.message, response.data.type])
                }
              })
              .catch((error) => {
                setMessage([error.name, "danger"])
              })
        }
      }

      const handel_staff_register = (e) => {
        e.preventDefault();
        if (email.length > 0 && password.length > 0){
            axios.post("staff/staff_register/", {
                "email": email,
                "password": password,
                "first_name": firstName,
                "last_name": lastName,
                "password_confirm": password_confirm
              })
              .then((response) => {
                if (response.data.status === 201 ) {
                    navigation("/login", {state: response.data});
                } else {
                    setMessage([response.data.message, response.data.type])
                }
              })
              .catch((error) => {
                setMessage([error.name, "danger"])
              })
        }
      }

    return <>
        {message.length>0 && <PrintMessage msg={message[0]} type={message[1]}/>}

        <div className="container p-3" style={{ width: "28%", margin: "auto", marginTop: "8%", 
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background :"linear-gradient(to bottom right, #d5bcf5, #a974c4)"}}>
        <Tabs>
          <TabList style={{ textAlign: "center"}}>
            <Tab style={{ background: "none" }}>Student</Tab>
            <Tab style={{ background: "none" }}>Staff</Tab>
          </TabList>
      
          <TabPanel>
            <form onSubmit={handel_student_register}>
                <div className="col my-5">
                <div className="col">
                    <div className="row my-4">
                            <span style={{ fontSize: "12" }}>STUDENT EMAIL</span>
                            <input type="email" name="email" className="form-control" placeholder="student@mail.com"
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setEmail(event.target.value)}} required></input>
                        </div>

                        <div className="row my-4">
                            <span style={{ fontSize: "12" }}>FIRST NAME</span>
                            <input type="text" name="first_name" className="form-control"
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setFirstName(event.target.value)}} required></input>
                        </div>
                        <div className="row my-4">
                            <span style={{ fontSize: "12" }}>LAST NAME</span>
                            <input type="text" name="last_name" className="form-control" 
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setLastName(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                        <span style={{ fontSize: "12" }}>PASSWORD</span>
                            <input type="password" name="password" className="form-control"
                                aria-label="division" onChange={(event) => {setPassword(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                        <span style={{ fontSize: "12" }}>PASSWORD Confirm</span>
                            <input type="password" name="password_confirm" className="form-control"
                                aria-label="division" onChange={(event) => {setPasswordConfirm(event.target.value)}} required></input>
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
          <form onSubmit={handel_staff_register}>
                <div className="col my-5">
                <div className="col">
                    <div className="row my-4">
                            <span style={{ fontSize: "12" }}>STAFF EMAIL</span>
                            <input type="email" name="email" className="form-control" placeholder="staff@mail.com"
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setEmail(event.target.value)}} required></input>
                        </div>

                        <div className="row my-4">
                            <span style={{ fontSize: "12" }}>FIRST NAME</span>
                            <input type="text" name="first_name" className="form-control"
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setFirstName(event.target.value)}} required></input>
                        </div>
                        <div className="row my-4">
                            <span style={{ fontSize: "12" }}>LAST NAME</span>
                            <input type="text" name="last_name" className="form-control" 
                                aria-label="division" autocomplete="off" 
                                onChange={(event) => {setLastName(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                        <span style={{ fontSize: "12" }}>PASSWORD</span>
                            <input type="password" name="password" className="form-control"
                                aria-label="division" onChange={(event) => {setPassword(event.target.value)}} required></input>
                        </div>
                        <div className="row">
                        <span style={{ fontSize: "12" }}>PASSWORD Confirm</span>
                            <input type="password" name="password_confirm" className="form-control"
                                aria-label="division" onChange={(event) => {setPasswordConfirm(event.target.value)}} required></input>
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
    </div>
    </>

}
export default Register;
