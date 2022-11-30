import React, {  Component ,useState, useEffect }from 'react';
import CourseList from '../../components/student/CourseList';
import Profile from '../../components/Profile';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useLocation, useNavigate } from "react-router-dom";
import PrintMessage from '../../components/Message';


function StaffHomepage(){
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({})
    const [message, setMessage] = useState("")
    const navigation = useNavigate();
    

    useEffect(() => {
        get_user()
      return () => {
        get_courses()
      }
    }, [])
    

    const get_courses = async () => {
        await axios.get("../staff/course/", {}
        ).then((response) => {
            if (response.data.status === 200) {
            setItems(response.data.data)
            } else {
                setMessage([response.data.message, response.data.type])
            }
        setIsLoaded(true)
        }).catch((error) => {
            isLoaded(true)
            setMessage([error.name, 'danger'])
        })
    }

    const get_user = async () => {
        await axios.get("user/", {
          })
          .then((response) => {
            if (response.data.data.is_staff) {
                setLoggedInUser(response.data)
            } else {
                setMessage([response.data.message, response.data.type])
            }
          })
          .catch((error) => {
            navigation("/login", {state: {'message': "you are not logged in as staff!!", 'type': 'danger'}})
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

    {loggedInUser.status === 200 ? <><Profile user={loggedInUser} role={"Staff"}/></> : <></>}
            {(items.length > 0) ?
            (<>
            <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                <h4 style={{ margin: "auto auto" }}>My Courses</h4>
                {
                    items.map((ele)=><CourseList course={ele} user={loggedInUser}/>)
                }
                </div>
            </>) :
            (<>
                <div style={{width:"50vw",display:'flex',
                flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", background: "#b1e5f2"}}>
                    <p style={{fontSize:"2vw", fontWeight: 'bold'}}>You Have '0' Courses Created</p>
                </div>
            </>) }
    </>
}
}


export default StaffHomepage;