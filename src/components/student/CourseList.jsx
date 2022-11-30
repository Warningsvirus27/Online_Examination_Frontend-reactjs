import axios from 'axios';
import React, { Component, useState, useEffect } from 'react';
import PrintMessage from '../Message';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';


function CourseList({course, user="", subscription=false}) {
    const [courseId, setCourseId] = useState("");
    const [message, setMessage] = useState([])
    const {state} = useLocation()
    const navigation = useNavigate();
    
    useEffect(() => {
        getCourseId()
    }, [])

    const getCourseId = () => {
        setCourseId(course.id)
    }

    const handel_subscription = async(e) => {
        e.preventDefault()
            axios({
                method: 'post',
                url: `/course/subscription/${user.data.email}/`,
                data: {"course_id": courseId},
                headers: {'X-CSRFToken': Cookies.get('csrftoken')}
            }).then((response) => {
                if (response.data.status === 201) {
                    setMessage([response.data.message, response.data.type])
                    window.location.reload()
                    navigation("/", {state: response.data})
                } else {
                    setMessage([response.data.message, response.data.type])
                }
            }).catch((error) => {
                setMessage([error.name, 'danger'])
            })
    }

    const delete_subscription = (e) => {
        e.preventDefault()
        axios({
            method: 'delete',
            url: `/course/subscription/${user.data.email}/`,
            data: {"course_id": courseId},
            headers: {'X-CSRFToken': Cookies.get('csrftoken')}
        }).then((response) => {
            if (response.data.status === 204) {
                console.log('navigating after delete')
                navigation("/", {state: response.data})
            } else {
                console.log('printing message', response.data)
                setMessage([response.data.message, response.data.type])
            }
        }).catch((error) => {
            navigation("/login", {state: {'message': 'you are not logged in', 'type': 'danger'}})
        })
    }

    const view_test = () => {
        navigation("/test", {state: {'course_id': course.id}})
    }

    const course_details = (e, idx) => {
        navigation('/course', {state: {'course_id': idx}})
    }

    return <>
        { message ? (<><PrintMessage msg={message[0]} type={message[1]} /></>) : <></>}

        <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",width:"50vw", marginLeft:"auto",marginRight:"auto",
            padding:"30px", borderRadius:"5px", marginTop: "2vh",
            background: "linear-gradient(to bottom right, #b1e5f2, #74b4c4)"}} 
            id={course.id}>
            <div style={{display:'flex', borderBottom: "black 1px"}}>
                <p style={{fontSize:"2vw", fontWeight: 'bold'}}>{course.name}</p>
            </div>
            <div>{course.description}</div>
            
            { user.data.is_staff ? 
            (<>
                <div className='row float-right'>
                    <button className='btn btn-primay mt-2 float-right ml-2' onClick={(e) => {course_details(e, course.id)}}>
                        Details</button>
                </div>
            </>) : 
            
            <>
                { !subscription ? <>
                <button className='btn btn-warning mt-2 float-right' onClick={(e) => {handel_subscription(e)}}>
                    Subscribe</button>
                </> : 
                <>
                    <button className='btn btn-warning mt-2 float-right ml-2' onClick={(e) => {delete_subscription(e)}}>
                        Delete Subscription</button>
                    <button className='btn btn-primary mt-2 float-right' onClick={(e) => {view_test(e)}}>
                        View Tests</button>
                </>}
            </>}
            

        </div>
    </>
}

export default CourseList;