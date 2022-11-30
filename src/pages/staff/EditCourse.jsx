import React, { useState, useEffect } from 'react'
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PrintMessage from "../../components/Message";

function EditCourse() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({});
    const [items, setItems] = useState({});
    const [isAdd, setIsAdd] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const [courseId, setCourseId] = useState("")
    const [message, setMessage] = useState([])
    const {state} = useLocation()
    const navigation = useNavigate();

    useEffect(() => {
      setCourseId(state.course_id)
      console.log('id', courseId)

        get_user();
        if (state.add)
        {
          console.log('yes add')
          setIsAdd(true)
        } else {
          return () => {
          get_course()
          get_test();
      }}
        if (state.data){
          console.log('here printing')
          setMessage([state.data.message, state.data.type])
        }
      }, []);

      const get_test = async() => {
        console.log('comming', courseId)
        if (state.course_id) { 
            await axios.get(`../course/get_test/${state.course_id}/`, {
            })
            .then((response) => {
                console.log('items', response.data)
            setItems(response.data)
            setIsLoaded(true)
            })
            .catch((error) => {
              console.log('yes', error)
            setMessage([error.name, "danger"])
            setIsLoaded(true)
            }) 
        } else {
            setMessage(["Something went wrong, go back and refresh", 'warning'])
            setIsLoaded(true)
        }
    }


      const get_course = async() => {
        await axios.get(`../staff/course/${state.course_id}/`, {
        })
        .then((response) => {
            console.log('editting', response.data)
          if (response.data.status === 200) {
            setName(response.data.data.name)
            setDescription(response.data.data.description)
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
              navigation("/login", { state: response.data });
            }
          })
          .catch((error) => {
            setIsLoaded(true);
            setMessage([error.name, "danger"]);
          });
      };

      const edit_course = async(e) => {
        e.preventDefault()
       if (name.length > 0 && description.length > 0) {
         await axios({
           method: 'patch',
           url: `../staff/course/${courseId}/`,
           data: {"name": name,
           "description": description},
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

      const delete_course = async(e) => {
        e.preventDefault()
    if (name.length > 0 && description.length > 0) {
      await axios({
        method: 'delete',
        url: `../staff/course/${courseId}/`,
        data: {},
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }).then((response) => {
          console.log(response.data)
          if (response.data.status === 204) {
            navigation("/", {state: response.data});
          } else {
            setMessage([response.data.messge, response.data.type]);
          }
        })
        .catch((error) => {
          setMessage([error.name, "danger"]);
        });
    }
      }

      const test_details = (e, idx) => {
        navigation('/test_view', {state: {'test_id': idx, 'course_id': courseId}})
    }

    const add_course = async(e) => {
      e.preventDefault()
       if (name.length > 0 && description.length > 0) {
         await axios({
           method: 'post',
           url: `../staff/course/`,
           data: {"name": name,
           "description": description},
           headers: {'X-CSRFToken': Cookies.get('csrftoken')}
       }).then((response) => {
                if (response.data.status === 201 ) {
                  navigation('/', {state: response.data})
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

    const add_test = () => {
        navigation('/test_view', {state: {'add': true, 'course_id': state.course_id}})
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
                            <span style={{ fontSize: "12" }}>COURSE NAME</span>

                            { isAdd ? 
                            (<>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                aria-label="division"
                                autocomplete="off"
                                onChange={(event) => {
                                    setName(event.target.value)
                                }}
                                required
                            ></input></>) : 
                            (<><input
                              type="email"
                              name="email"
                              className="form-control"
                              aria-label="division"
                              autocomplete="off"
                              value={name}
                              onChange={(event) => {
                                  setName(event.target.value)
                              }}
                              required></input>
                          </>)}

                            </div>
                            <div className="row my-4">
                            <span style={{ fontSize: "12" }}>DESCRIPTION</span>
                            
                              { isAdd ? 
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

                        { isAdd ? 
                        (<>
                          <div className='row my-0 float-right mr-5'>
                            <button
                                type="submit"
                                className="btn btn-success"
                                style={{ margin: "auto auto", marginTop: "3%" }}
                                onClick={(e) => add_course(e)}>
                                Add Course
                            </button>
                        </div>
                        </>) : 
                        (<><div className="row mt-4 mb-0">
                        <div className="col text-center">
                        <button
                            type="submit"
                            className="btn btn-warning"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => edit_course(e)}>
                            Edit Course
                        </button>
                        </div>
                        <div className="col text-center">
                        <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => delete_course(e)}>
                            Delete Course
                        </button>
                        </div>
                    </div>
                    <div className='row my-0 float-right mr-5'>
                        <button
                            type="submit"
                            className="btn btn-success"
                            style={{ margin: "auto auto", marginTop: "3%" }}
                            onClick={(e) => add_test(e)}>
                            Add Test
                        </button>
                    </div>
                    </>)}
                          </div>
                    </form>
                </div>

                { isAdd ? 
                (<></>) : 
                (<>
                  {(items.data?.length > 0) ?
            (<>
            <div style={{display:'flex', flexDirection:"column", width:"50vw", marginLeft:"auto",marginRight:"auto",
            fontWeight: "bold", fontSize: "20", marginBottom: "0", marginTop: "2vw"}} >
                <h4 className='mb-0 mx-auto'>Tests In This Course</h4>
                {
                    items.data.map((ele)=>
                    (
                        <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
                            padding:"30px", borderRadius:"5px", marginTop: "2vh",
                            background: "linear-gradient(to bottom right, #c3ebd6, #79b897)"}} 
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
                                <button type='submit' className='btn btn-primary float-right mt-2'
                                onClick={(e) => test_details(e, ele.id)}>Details</button>
                            </div>
                    ))
                }
                </div>
                </>) 
                :
                (<>
                    <div style={{width:"50vw",display:'flex',marginTop:"2vw",
                    flexDirection:"column", marginLeft:"auto",marginRight:"auto",padding:"30px",
                    borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", marginTop:"2vw", 
                    background: "linear-gradient(to bottom right, #c3ebd6, #79b897)"}}>
                        <p style={{fontSize:"2vw", fontWeight: 'bold'}}>This Course has no tests!!</p>
                    </div>
                </>) 
            }
                </>) }

                
        </>
        )
      }
}

export default EditCourse;