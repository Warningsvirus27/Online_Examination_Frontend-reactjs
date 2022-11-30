import React, { useState } from 'react'
import NavItem from '../components/NavItem';


function Navbar(user) {
    return <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            { user.user.status === 200 ?  <>
                
                <a className="navbar-brand bg-dark" style={{ color: "white", marginLeft: "10" }} href="/edit/">
                    <img src={require("./download.png")} alt="" width={35} height={35} style={{ borderRadius: "50%"}} className="ml-4"/>
                    {"Hello " + user.user.data.first_name 
                + " " + user.user.data.last_name}</a>
            </> : 
            <>
                <p className="navbar-brand bg-dark">Hello Alien</p><p className="navbar-brand"></p>
            </>}
                <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto mr-5 gap-5">

                    { user.user.status === 200 ? <>
                        <NavItem text={"Log-Out"} link={"/logout"}/>
                    </> :
                    <>
                        <NavItem text={"Sign-In"} link={"/login"} />
                        <NavItem text={"Register"} link={"/register"} />
                    </>
                    }
                </ul>
            </div>
        </nav>
    </>
}


export default Navbar;