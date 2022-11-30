import React, { useState, useEffect } from 'react';
import PrintMessage from '../../components/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import CourseList from '../../components/student/CourseList';


function MySubscription() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({})
    const [message, setMessage] = useState([])
    const {state} = useLocation()

    useEffect(() => {
        get_user()
      return () => {
        get_courses()
        return () => {
          check_message()
        }
      }
    }, [])
    
    const check_message = () => {
      console.log('calling')
      if (state) {
        console.log('yes state', state)
        setMessage([state.message, state.type])
      }
      else {
        console.log('in else')
      }
    }

    const get_courses = async () => {
        await axios.get("course/subscription/", {
        })
        .then((response) => {
            console.log('my data', response.data)
          setItems(response.data)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
          setMessage([error.name, "danger"])
        })

    }

    const get_user = async () => {
        await axios.get("user/", {
          })
          .then((response) => {
            setLoggedInUser(response.data)
          })
          .catch((error) => {
            setMessage(error)
          })
    }

    if (!isLoaded) {
        return (
        <p style={{fontSize:"10vw",textAlign:"center",marginTop:"2vw"}}>Loading...</p>
        )
    } else {
        return <>
        {
            loggedInUser.status === 200 ? 
            (<><Navbar user={loggedInUser}/></>)
            :
            (<><Navbar user={loggedInUser}/></>)
        }

            {message.length>0 ? (<PrintMessage msg={message[0]} type={message[1]}/>) : <></>}

            {(items.data.length > 0) ?
            (<><div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                {
                    items.data?.map((ele)=><CourseList course={ele} user={loggedInUser} subscription={true}/>)
                }
                </div>
            </>) :
            (<>
                <div style={{width:"50vw",display:'flex',marginTop:"2vw",
                flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", background: "#b1e5f2"}}>
                    <p style={{fontSize:"2vw", fontWeight: 'bold'}}>No Courses Subscribed</p>
                </div>
            </>) }
        </>

    }
}

export default MySubscription;