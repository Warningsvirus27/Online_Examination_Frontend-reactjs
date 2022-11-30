import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import PrintMessage from "../components/Message";
import { useNavigate } from 'react-router-dom';



function Profile({user, role}){
        const [userData, setUserData] = useState({});
        const [message, setMessage] = useState([]);
        const [course_count, setCourseCount] = useState("")
        const [suscriptions, setSubscriptions] = useState(0)
        const navigation = useNavigate();

        useEffect( () => {
            if (role === "Staff") {
                get_user_data()
                get_subscription()
            } else {
                get_staffuser_data()
            }
        }, [])

        const get_user_data = async() => {
            await axios.get("staff/course/", {})
            .then((response) => {
                console.log('profile', response.data)
                if (response.data.status === 200) {
                    setCourseCount(response.data.data.length)
                } else {
                    setMessage([response.data.message, "danger"])
                }
            })
            .catch((error) => {
                setMessage([error.name, "danger"])
            })
        }

        const get_subscription = async() => {
            await axios.get("staff/subscription_number/", {})
            .then((response) => {
                console.log('profile', response.data)
                if (response.data.status === 200) {
                    setSubscriptions(response.data.data)
                } else {
                    setMessage([response.data.message, "danger"])
                }
            })
            .catch((error) => {
                setMessage([error.name, "danger"])
            })
        }

        const get_staffuser_data = async() => {
            await axios.get("course/user_data/", {})
            .then((response) => {
                if (response.data.status === 200) {
                    setUserData(response.data.data)
                } else {
                    setMessage([response.data.message, "danger"])
                }
            })
            .catch((error) => {
                setMessage([error.name, "danger"])
            })
        }

        const my_subscription = (e) => {
            navigation("/subscriptions")
        }

        const test_history = (e) => {
            navigation("/test_history")
        }

        const add_course = () => {
            navigation("/course", {state: {'add': true}})
        }

        return (<>
        { message ? <PrintMessage msg={message[0]} type={message[1]}/> : <></>}

        <div style={{ position: "absolute",width:"20vw",marginLeft:"3%",marginRight:"auto",marginTop:"2vw" }}>
            <div style={{display:'flex', 
                flexDirection:"column",padding:"30px",
                borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "#f5ecd7"}}>
                    <div style={{ borderBottomColor: "black" }}>
                        <h2 style={{ alignSelf: "center", borderBottom: "2px dashed #f090b9"}}>{role}</h2>
                    </div>
                <div style={{display:'flex', flexDirection:"column"}}>
                    { user.data && <>
                    <div>
                        <span style={{ fontWeight: "bold"}}>Email</span>
                        <p>{user.data.email}</p>
                    </div>
                    <div>
                        <span style={{  fontWeight: "bold" }}>First Name</span>
                        <p>{user.data.first_name}</p>
                    </div>
                    <div>
                        <span style={{  fontWeight: "bold" }}>Last Name</span>
                        <p>{user.data.last_name}</p>
                    </div>
                    <div>
                        <span style={{  fontWeight: "bold" }}>Last Login</span>
                        <p>{convert_date(user.data.last_login)}</p>
                    </div>
                    </>
                        }
                </div>
            </div>

            <div  className='mt-2' style={{width:"20vw",display:'flex', 
            flexDirection:"column",padding:"10px 10px",
            borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "#e5e6e3"}}>
                <div style={{display:'flex', flexDirection:"column"}}>
                    <div style={{borderBottom: "1px solid black"}}>
                        { role === "Staff" ? 
                        (<>
                            <span style={{ fontWeight: "bold"}}>My Courses:</span>
                            <p>{course_count}</p>
                            <button className='btn btn-link float-right mb-2'
                            onClick={(e) => {add_course(e)}}>Add Course</button>
                        </>) : 
                        (<>
                            <span style={{ fontWeight: "bold"}}>Subscribed Courses:</span>
                            <p>{userData.course}</p>
                            <button className='btn btn-link float-right mb-2'
                            onClick={(e) => {my_subscription(e)}}>My Subscription</button>
                        </>) }
                    </div>
                    <div style={{borderBottom: "1px solid black"}}>
                        { role === 'Staff' ? 
                        (<>
                            <span style={{ fontWeight: "bold"}}>Subscriptions Sold:</span>
                            <p>{suscriptions}</p>
                        </>) : 
                        (<>
                            <span style={{ fontWeight: "bold"}}>Tests Given:</span>
                            <p>{userData.test}</p>
                            <button className='btn btn-link float-right mb-2'
                            onClick={(e) => {test_history(e)}}>Test History</button>
                        </>) }
                        
                    </div>
                </div>
            </div>
        </div>
            </>
        );
}

    function convert_date(user_datetime){
        
        return format(new Date(user_datetime), 'yyyy/MM/dd kk:mm:ss')
    }

export default Profile;