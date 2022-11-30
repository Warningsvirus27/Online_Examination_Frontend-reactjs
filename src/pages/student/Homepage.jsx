import React, { useState, useEffect }from 'react';
import CourseList from '../../components/student/CourseList';
import Profile from '../../components/Profile';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import PrintMessage from '../../components/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import Disabled from '../../components/staff/Disabled';


function Homepage(){
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({})
    const [message, setMessage] = useState([])
    const [isStaff, setIsStaff] = useState(false)
    const {state} = useLocation()
    const navigation = useNavigate();

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
      if (state) {
        setMessage([state.message, state.type])
      }
    }

    const get_courses = async () => {
      if (isStaff) {
        await axios.get("staff/course/", {}
        ).then((response) => {
            if (response.data.status === 200) {
            setItems(response.data.data)
            } else {
                setItems({'data': []})
                setMessage([response.data.message, response.data.type])
            }
            setIsLoaded(true)
        }).catch((error) => {
            isLoaded(true)
            setMessage([error.name, 'danger'])
        })
      } else {
          await axios.get("course/get_course/", {
          })
          .then((response) => {
            if (response.data.status === 200) {
            setItems(response.data)
            } else {
              setItems({'data': []})
            }
            setIsLoaded(true)
          })
          .catch((error) => {
            setIsLoaded(true)
            setMessage([error.name, "danger"])
          })
      }
    }

    const get_user = async () => {
        await axios.get("user/", {
          })
          .then((response) => {
            if (response.data.status === 200) {
              if (response.data.data.is_staff) {
                setIsStaff(true)
              }
              setLoggedInUser(response.data)
            } else {
              setMessage([response.data.message, response.data.type])
            }
            
          })
          .catch((error) => {
            setMessage([error.name, 'danger'])
            navigation("/login", {state: {'message': "you are not logged in as staff!!", 'type': 'danger'}})
          })
    }


   if (!isLoaded) {
        return (
        <p style={{fontSize:"10vw",textAlign:"center",marginTop:"2vw"}}>Loading...</p>
        )
    } else {
        return <>
        <><Navbar user={loggedInUser}/></>

{message.length>0 && (<>
<PrintMessage msg={message[0]} type={message[1]}/>
</>)}
    
    {loggedInUser.status === 200 && isStaff? 
    (<><Profile user={loggedInUser} role={"Staff"} /></>) : 
    (<><Profile user={loggedInUser} role={"Student"} /></>)}

    {loggedInUser.status === 200 && isStaff? 
    (<><Disabled /></>) : 
    (<></>)}

            {(items.data.length > 0) ?
            (<>
              <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                <h4 style={{ margin: "auto auto" }}>
                  { !isStaff ?  "Available Courses" : "My Courses"}
                  </h4>
                {
                    items.data?.map((ele)=><CourseList course={ele} user={loggedInUser}/>)
                }
                </div>
            </>) :
            (<>
                <div style={{width:"50vw",display:'flex',marginTop:"1vw",
                flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", background: "#b1e5f2"}}>
                    <p style={{fontSize:"2vw", fontWeight: 'bold'}}>No Courses Available</p>
                </div>
            </>) }
    </>
}
}


export default Homepage;