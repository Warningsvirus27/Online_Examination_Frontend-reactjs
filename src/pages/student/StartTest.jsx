import React, { useState, useEffect } from 'react';
import PrintMessage from '../../components/Message';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
//import Modal from 'react-bootstrap-modal';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';


function StartTest() {
    const [items, setItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState({})
    const [message, setMessage] = useState([])
    const [isLoaded, setisLoaded] = useState(false)
    const [answers,setAnswers] = useState({})
    const [showModel, setModel] = useState(false)
    const [score, setScore] = useState(0)
    const {state} = useLocation();

    const navigation = useNavigate();

    useEffect(() => {
        get_user();
        check_message();
        get_mcqs();
    }, [])

    const check_message = async() => {
      if (state) {
        setMessage([state.message, state.type])
      }
      else {
      }
    }

    const get_mcqs = async() => {
        if (state.test_id) { 
            await axios.get(`course/get_mcq/${state.test_id}/`, {
            })
            .then((response) => {
                console.log('my data test', response.data.data)
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

    const set_que_option = (e, idx) => {  
        var key = idx, obj = {[key]: e.target.value};
        var ret_obj = Object.assign(answers, obj); 
        setAnswers(ret_obj)
    }

    const redirect_home = (e) => {
        e.preventDefault()
        navigation("/")
    }

    const sumit_test = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: `course/evaluate/${state.test_id}/`,
            data: {"answers": answers},
            headers: {'X-CSRFToken': Cookies.get('csrftoken')}
        }).then((response) => {
            if (response.data.status === 200) {
                console.log(response.data)
                setScore(response.data.data)
                setModel(true)
            } else {
                setMessage([response.data.message, response.data.type])
            }
        }).catch((error) => {
            setMessage([error.name, 'danger'])
        })
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
            
            { showModel ? <>
            {console.log('yes comming')}
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Test Sccore</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Score: {score}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => redirect_home(e)}>Close</Button>
                </Modal.Footer>
            </Modal.Dialog>
          </> : 
            <>
            {(items.data?.length > 0) ?
            (<>
            <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                <form>
                {
                    items.data.map((ele)=>
                    (
                        <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
                            padding:"30px", borderRadius:"5px", marginTop: "2vh",
                            background: "linear-gradient(to bottom right, #b1e5f2, #74b4c4)"}} 
                            id={ele.id}>
                            <div className='col border-bottom'>
                                <p style={{fontSize:"2vw", fontWeight: 'bold'}}>{ele.question}</p>
                            </div>

                                <div className='ml-4' onClick={(e)=>set_que_option(e, ele.id)}>
                                    <div className='row'>
                                        <div className='col'>
                                            <input className="form-check-input" type="radio" name={ele.id} value={ele.opt1}/>
                                            <label className="form-check-label">{ele.opt1}</label>
                                        </div>
                                        <div className='col'>
                                            <input className="form-check-input" type="radio" value={ele.opt2} name={ele.id}/>
                                            <label className="form-check-label">{ele.opt2}</label>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <input className="form-check-input" type="radio" value={ele.opt3} name={ele.id}/>
                                            <label className="form-check-label">{ele.opt3}</label>
                                        </div>
                                        <div className='col'>
                                            <input className="form-check-input" type="radio" value={ele.opt4} name={ele.id}/>
                                            <label className="form-check-label">{ele.opt4}</label>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ))
                }
                    <button type='submit' className='btn btn-warning float-right mt-2'
                        onClick={(e) => sumit_test(e)}>Submit</button>
                </form> 
                </div>
                </>) 
                :
                (<>
                    <div style={{width:"50vw",display:'flex',marginTop:"2vw",
                    flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                    borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", background: "#b1e5f2"}}>
                        <p style={{fontSize:"2vw", fontWeight: 'bold'}}>This Test has no MCQs!!</p>
                    </div>
                </>) 
            }
            </>}
        </>
        }
}

export default StartTest;
