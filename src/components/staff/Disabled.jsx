import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import Cookies from 'js-cookie';
import PrintMessage from '../Message';



function Disabled(){
        const [data, setData] = useState({})
        const [message, setMessage] = useState([])
        const [std, setStd] = useState({})

        useEffect( () => {
           get_data()
           return () => {
            get_users()
           }
        }, [])

        const get_data = async() => {
            await axios({
                method: 'get',
                url: `staff/disable_std/`,
                data: {},
            }).then((response) => {
                    if (response.data.status === 200 ) {
                        setData(response.data)
                    } else {
                    setMessage([response.data.message, response.data.type])
                    }
                })
                .catch((error) => {
                setMessage([error.name, "danger"]);
                });
        }

        const handel_disable = async(e, email) => {
            await axios({
                method: 'post',
                url: `staff/disable_std/`,
                data: {'email': email},
                headers: {'X-CSRFToken': Cookies.get('csrftoken')}
            }).then((response) => {
                    if (response.data.status === 200 ) {
                            get_users()
                            get_data()
                    } else {
                    setMessage([response.data.message, response.data.type])
                    }
                })
                .catch((error) => {
                setMessage([error.name, "danger"]);
                });
        }

        const get_users = async(e) => {
                await axios.get(`staff/search/`)
                .then((response) => {
                    console.log('response', response.data)
                        if (response.data.status === 200 ) {
                            console.log(response.data)
                            setStd(response.data)
                        } else {
                        setMessage([response.data.message, response.data.type])
                        }
                    })
                    .catch((error) => {
                    setMessage([error.name, "danger"]);
                    });
        }

        return (<>
        { message.length > 0 ? <PrintMessage msg={message[0]} type={message[1]}/> : <></>}

        <div style={{ position: "absolute",width:"20vw",marginLeft:"77%",marginRight:"auto",marginTop:"2vw" }}>
            <div style={{display:'flex', 
                flexDirection:"column",padding:"30px",
                borderRadius:"5px",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "#f59a9d"}}>
                    <div style={{ borderBottomColor: "black" }}>
                        <h2 style={{ alignSelf: "center", borderBottom: "2px dashed #f090b9"}}>Disabled Studdent</h2>
                    </div>
                <div style={{display:'flex', flexDirection:"column"}}>
                    <div className='mb-3'>
                        <span style={{ fontWeight: "bold"}}>Count: {data.count}</span>
                    </div>
                    { data.data?.map((ele) => 
                        (
                            <div className='shadow p-1 mb-0 rounded' style={{  }}>
                                <p style={{  fontWeight: "bold" }} className="my-0">{ele.first_name} {ele.last_name}</p>
                                <p className='my-0'>{ele.email}</p>
                                <button type="submit" className="btn btn-link py-0 px-1 float-right my-1 mx-1"
                                onClick={(e) => handel_disable(e, ele.email)}>Active</button>
                            </div>
                        )) }
                </div>
            </div>

{console.log(std.data?.length)}
            { std.data?.length > 0 ? 
            (<>
                <ul class="list-group mt-2">
                <button type="button" class="list-group-item list-group-item-action active bg-secondary">
                    Active Users
                </button>
                    { std.data?.map((ele) => (
                        <li class="list-group-item"><p className='my-0'>{ele.email}</p>
                        <p className='my-0'>{ele.first_name} {ele.last_name}</p>
                        <button type="submit" className="btn btn-link py-0 px-1 float-right my-1 mx-1"
                        onClick={(e) => handel_disable(e, ele.email)}>Disable</button>
                        </li>
                    ))}
                </ul></>) : 
            (<>
                <p>All Students are Disabled!!</p>
            </>) }
            
        </div>
            </>
        );
}

    function convert_date(user_datetime){
        
        return format(new Date(user_datetime), 'yyyy/MM/dd kk:mm:ss')
    }

export default Disabled;