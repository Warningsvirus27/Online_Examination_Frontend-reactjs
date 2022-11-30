import React, { useState, useEffect } from 'react';
import PrintMessage from '../../components/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';


function Test() {
    const [items, setItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({})
    const [message, setMessage] = useState([])
    const [isLoaded, setisLoaded] = useState(false)
    const {state} = useLocation();

    const navigation = useNavigate();

    useEffect(() => {
        get_user();
        check_message();
        get_test();
    }, [])

    const check_message = async() => {
      if (state) {
        setMessage([state.message, state.type])
      }
      else {
      }
    }

    const get_test = async() => {
        if (state.course_id) { 
            await axios.get(`course/get_test/${state.course_id}/`, {
            })
            .then((response) => {
            setItems(response.data)
            setisLoaded(true)
            })
            .catch((error) => {
            setMessage([error.name, "danger"])
            setisLoaded(true)
            }) 
        } else {
            setMessage(["Something went wrong, go back and refresh", 'warning'])
            setisLoaded(true)
        }

    }

    const get_user = async () => {
        await axios.get("user/", {
          })
          .then((response) => {
            setLoggedInUser(response.data)
          })
          .catch((error) => {
            setMessage([error.name, 'danger'])
          })
    }

    const start_test = (e, id) => {
        e.preventDefault()
        navigation("/start_test", {state: {'test_id': id}})
    }

        if (!isLoaded)
        {
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
            
            {(items.data?.length > 0) ?
            (<>
            <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                {
                    items.data.map((ele)=>
                    (
                        <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
                            padding:"30px", borderRadius:"5px", marginTop: "2vh",
                            background: "linear-gradient(to bottom right, #b1e5f2, #74b4c4)"}} 
                            id={ele.id}>
                            <div className='col border-bottom'>
                                <div className='row'>
                                    <div className='col'>
                                    <p style={{fontSize:"2vw", fontWeight: 'bold'}}>{ele.test_name}</p>
                                    </div>
                                    <div className='col'>
                                        <div className='row'>
                                            <span style={{ fontWeight: "bold" }}>Duration:</span>
                                            <p>{ele.duration}</p>
                                        </div>
                                        <div className='row'>
                                            <span style={{ fontWeight: "bold" }}>Marks Per Question:</span>
                                            <p>{ele.mark_per_question}</p>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div className='row mt-2 ml-1'>
                                {ele.description}
                            </div>
                                <button type='submit' className='btn btn-warning float-right mt-2'
                                onClick={(e) => start_test(e, ele?.id)} >Start</button>
                        </div>
                    ))
                }
                </div>
                </>) 
                :
                (<>
                    <div style={{width:"50vw",display:'flex',marginTop:"2vw",
                    flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                    borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", background: "#b1e5f2"}}>
                        <p style={{fontSize:"2vw", fontWeight: 'bold'}}>This Course has no tests!!</p>
                    </div>
                </>) 
            }
        </>
        }
}

export default Test;