import React, { useState, useEffect } from 'react'
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PrintMessage from "../../components/Message";

function EditTest() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({});
    const [items, setItems] = useState({});
    const [isAdd, setIsAdd] = useState(false)
    const [addTest, setAddTest] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState(0)
    const [marks, setmarks] = useState(0)
    const [courseId, setCourseId] = useState(0)

    const [new_question, setNewQuestion] = useState("")
    const [opt1, setOpt1] = useState("")
    const [opt2, setOpt2] = useState("")
    const [opt3, setOpt3] = useState("")
    const [opt4, setOpt4] = useState("")
    const [correctOpt, setCorrectOpt] = useState("")

    const [message, setMessage] = useState([])
    const {state} = useLocation()
    const navigation = useNavigate();

    useEffect(() => {
        setCourseId(state.course_id);
        
        get_user();
        if (state.add)
        {
          setAddTest(true)
        } else {
        return () => {
            get_test()
        }}
      }, []);


      const get_test = async() => {
        await axios.get(`../course/test/${state.test_id}/`, {
        })
        .then((response) => {
          if (response.data.status === 200) {
            setName(response.data.test.test_name)
            setDescription(response.data.test.description)
            setDuration(response.data.test.duration)
            setmarks(response.data.test.mark_per_question)
            console.log('mcqs', response.data.mcqs)
            setItems(response.data.mcqs)
          } else {
            setMessage([response.data.message, response.data.type])
          }
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
          setMessage([error.name, "danger"])
        })
      }

      const get_user = async() => {
        await axios.get("../user/", {})
          .then((response) => {
            if (response.data.status === 200) {
              setLoggedInUser(response.data);
              setIsLoaded(true);
            } else {
              navigation("/login", { state:response.data});
            }
          })
          .catch((error) => {
            setIsLoaded(true);
            setMessage([error.name, "danger"]);
          });
      };

      const edit_test = async(e) => {
        e.preventDefault()
       if (name.length > 0 && description.length > 0) {
         await axios({
           method: 'patch',
           url: `../course/test/${state.test_id}/`,
           data: {"test_name": name,
           "description": description,
            "duration": duration,
            "mark_per_question": marks,
            "course_id": courseId},
           headers: {'X-CSRFToken': Cookies.get('csrftoken')}
       }).then((response) => {
                console.log(response.data)
               setMessage([response.data.message, response.data.type])
           })
           .catch((error) => {
            console.log(error)
             setMessage([error.name, "danger"]);
           });
       }
      }

      const delete_test = async(e) => {
        e.preventDefault()
    if (name.length > 0 && description.length > 0) {
      await axios({
        method: 'delete',
        url: `../course/test/${state.test_id}/`,
        data: {},
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }).then((response) => {
          console.log(response.data)
          if (response.data.status === 204) {
            navigation("/course", {state: {'data': response.data, 'course_id': courseId}});
          } else {
            setMessage([response.data.messge, response.data.type]);
          }
        })
        .catch((error) => {
          setMessage([error.name, "danger"]);
        });
    }
      }

    const submit_mcq = async(e) => {
      e.preventDefault()
       if (new_question.length > 0 && opt1.length > 0 && opt2.length > 0 && opt3.length > 0 && opt4.length > 0 
        && correctOpt > 0 && correctOpt < 5) {
         await axios({
           method: 'post',
           url: `../course/mcq/${state.test_id}/`,
           data: {"question": new_question,
           "opt1": opt1,
            "opt2": opt2,
            "opt3": opt3,
            "opt4": opt4,
            "correct_opt": correctOpt,
            "test_id": state.test_id},
           headers: {'X-CSRFToken': Cookies.get('csrftoken')}
       }).then((response) => {
                if (response.data.status === 201 ) {
                  //navigation('/test_view', {state: {'data': response.data, 'course_id': courseId, 'test_id': state.test_id}})
                  setMessage([response.data.message, response.data.type])
                setIsAdd(false)
                window.location.reload()
                } else {
               setMessage([response.data.message, response.data.type])
                }
           })
           .catch((error) => {
            console.log(error)
             setMessage([error.name, "danger"]);
           });
       }
    }

    const add_mcq = () => {
        setIsAdd(true)
    }

    const delete_mcq = async(e, idx) => {
        e.preventDefault()
          await axios({
            method: 'delete',
            url: `../course/mcq/${idx}/`,
            data: {},
            headers: {'X-CSRFToken': Cookies.get('csrftoken')}
        }).then((response) => {
              console.log(response.data)
              if (response.data.status === 204) {
                window.location.reload();
              } else {
                setMessage([response.data.messge, response.data.type]);
              }
            })
            .catch((error) => {
              setMessage([error.name, "danger"]);
            });
    }

    const create_test = async(e) => {
      e.preventDefault()
       if (name.length > 0 && duration > 0 && marks > 0 && description.length > 0) {
         await axios({
           method: 'post',
           url: `../course/test/`,
           data: {"test_name": name,
           "duration": duration,
            "description": description,
            "mark_per_question": marks,
            "course_id": courseId},
           headers: {'X-CSRFToken': Cookies.get('csrftoken')}
       }).then((response) => {
                if (response.data.status === 201 ) {
                  navigation('/course', {state: {'data': response.data, 'course_id': courseId}})
                } else {
               setMessage([response.data.message, response.data.type])
                }
           })
           .catch((error) => {
            console.log(error)
             setMessage([error.name, "danger"]);
           });
       }
    }

      if (!isLoaded) {
        return (
          <p style={{ fontSize: "10vw", textAlign: "center", marginTop: "2vw" }}>
            Loading...
          </p>
        );
      } else {
        return (
            <>
                {message?.length > 0 ? (<PrintMessage msg={message[0]} type={message[1]} />) : (<></>)}

                <Navbar user={loggedInUser} />
                <div
                style={{
                    width: "50vw",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: "30px",
                    borderRadius: "5px",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    marginTop: "2vw",
                    background: "linear-gradient(to bottom right, #b1e5f2, #74b4c4)"}}>
                        
                    <form>
                        <div className="col my-5">
                        <div className="col">
                            <div className="row my-4">
                            <span style={{ fontSize: "12" }}>TEST NAME</span>

                            { addTest ? 
                            (<><input
                              type="email"
                              name="email"
                              className="form-control"
                              aria-label="division"
                              autocomplete="off"
                              onChange={(event) => {
                                  setName(event.target.value)
                              }}
                              required></input></>) : 
                            (<>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              aria-label="division"
                              autocomplete="off"
                              value={name}
                              onChange={(event) => {
                                  setName(event.target.value)
                              }}
                              required></input></>) }
                            
                              <div className='row mt-2 mb-0'>
                                <div className='col'>
                                <span style={{ fontSize: "12" }}>DURATION</span>
                                { addTest ? 
                                (<><input
                                  type="text"
                                  name="first_name"
                                  className="form-control"
                                  aria-label="division"
                                  autocomplete="off"
                                  onChange={(event) => {
                                  setDuration(event.target.value);
                                  }}
                                  required
                              ></input></>) : 
                                (<><input
                                  type="text"
                                  name="first_name"
                                  className="form-control"
                                  aria-label="division"
                                  autocomplete="off"
                                  value={duration}
                                  onChange={(event) => {
                                  setDuration(event.target.value);
                                  }}
                                  required
                              ></input></>) }
                                    
                                </div>
                                <div className='col'>
                                <span style={{ fontSize: "12" }}>MARKS PER QUESTION</span>

                                { addTest ? 
                                (<><input
                                  type="text"
                                  name="first_name"
                                  className="form-control"
                                  aria-label="division"
                                  autocomplete="off"
                                  onChange={(event) => {
                                  setmarks(event.target.value);
                                  }}
                                  required
                              ></input></>) : 
                                (<><input
                                  type="text"
                                  name="first_name"
                                  className="form-control"
                                  aria-label="division"
                                  autocomplete="off"
                                  value={marks}
                                  onChange={(event) => {
                                  setmarks(event.target.value);
                                  }}
                                  required
                              ></input></>) }
                                    
                                </div>
                              </div>
                              

                            </div>
                            <div className="row">
                            <span style={{ fontSize: "12" }}>TEST DESCRIPTION</span>
                            
                            { addTest ? 
                            (<><input
                              type="text"
                              name="first_name"
                              className="form-control"
                              aria-label="division"
                              autocomplete="off"
                              onChange={(event) => {
                              setDescription(event.target.value);
                              }}
                              required
                          ></input></>) : 
                            (<><input
                              type="text"
                              name="first_name"
                              className="form-control"
                              aria-label="division"
                              autocomplete="off"
                              value={description}
                              onChange={(event) => {
                              setDescription(event.target.value);
                              }}
                              required
                          ></input></>) }
                             

                            </div>
                        </div>

                          { addTest ? 
                          (<>
                          <div className='row my-0 float-right mr-5'>
                              <button
                                  type="submit"
                                  className="btn btn-success"
                                  style={{ margin: "auto auto", marginTop: "3%" }}
                                  onClick={(e) => create_test(e)}>
                                  Add MCQ
                              </button>
                          </div>
                          </>) : 
                          (<>
                          <div className="row mt-4 mb-0">
                        <div className="col text-center">
                        <button
                            type="submit"
                            className="btn btn-warning"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => edit_test(e)}>
                            Edit Test
                        </button>
                        </div>
                        <div className="col text-center">
                        <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => delete_test(e)}>
                            Delete Test
                        </button>
                        </div>
                    </div>
                    <div className='row my-0 float-right mr-5'>
                        <button
                            type="submit"
                            className="btn btn-success"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => add_mcq(e)}>
                            Add MCQ
                        </button>
                    </div>
                          </>) }
                        
                          </div>
                    </form>
                </div>
                

                  
            <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                <h4 className='mb-0 mx-auto'>MCQs In This Test</h4>

                { isAdd ? 
                (<>
                <form onSubmit={(e) =>submit_mcq(e)}>
                    <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
                            padding:"30px", borderRadius:"5px", marginTop: "2vh",
                            background: "linear-gradient(to bottom right, #c3ebd6, #79b897)"}}>
                            <div className='col border-bottom mb-3'>
                            Question: <input type="text" className="form-control" value={new_question}
                            onChange={(e) => {setNewQuestion(e.target.value)}}/>
                            Option1: <input type="text" className="form-control" value={opt1}
                            onChange={(e) => {setOpt1(e.target.value)}}/>
                            Option2: <input type="text" className="form-control" value={opt2}
                            onChange={(e) => {setOpt2(e.target.value)}}/>
                            Option3: <input type="text" className="form-control" value={opt3}
                            onChange={(e) => {setOpt3(e.target.value)}}/>
                            Option4: <input type="text" className="form-control" value={opt4}
                            onChange={(e) => {setOpt4(e.target.value)}}/>
                            Correct Option: <input type="number" className="form-control" value={correctOpt}
                            onChange={(e) => {setCorrectOpt(e.target.value)}} max="4" min="1" maxLength={1}/>
                            <button type='submit' className='btn btn-primary float-right my-1'>Add</button>    
                            </div>      
                    </div>
                </form>
                </>) : 
                (<></>)
                }

            {(items?.length > 0) ?
                (<>
                {
                    items.map((ele)=>
                    (
                        <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
                            padding:"30px", borderRadius:"5px", marginTop: "2vh",
                            background: "linear-gradient(to bottom right, #c3ebd6, #79b897)"}} 
                            id={ele.id}>
                            <div className='col border-bottom'>
                                <p style={{fontSize:"2vw", fontWeight: 'bold'}}>{ele.question}</p>
                            </div>

                                <div className='ml-4'>
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
                                <span style={{ fontWeight: "bold", fontSize: "12", borderTop: "1px solid #433deb"}}>Correct Option: {ele.correct_opt}</span>
                                <button type='submit' className="btn btn-danger mr-4 mb-0 float-right"
                                onClick={(e) => {delete_mcq(e, ele.id)}}>Delete</button>
                        </div>
                    ))
                } </>) : 
                (<>
                    <div style={{width:"50vw",display:'flex',marginTop:"2vw",
                    flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                    borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", 
                    background: "linear-gradient(to bottom right, #c3ebd6, #79b897)"}}>
                        <p style={{fontSize:"2vw", fontWeight: 'bold'}}>This Test has no MCQ!!</p>
                    </div>
                </>) 
            }
                </div>
        </>
        )
      }
}

export default EditTest;