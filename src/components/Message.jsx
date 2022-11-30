import React, { Component } from 'react'


function PrintMessage({msg, type}) {

    const [showPopup, setShowPopup] = React.useState(true);

    const toggleShowInfoPopup = () => {
        setShowPopup(!showPopup);
    };

    return <>
    { type ? (<>
    {showPopup && <div className="text-center" style={{ fontSize:"12", zIndex:"100", 
        position: "absolute", left: "68vw", top: "6vh", width: "30vw" }}>
            <div className={concat_class(type)} role="alert">
                <span>{msg}</span>
                <button
               className='btn btn-info my-0 mx-0 py-0 px-0 float-right'
               onClick={toggleShowInfoPopup}
              >Close</button>
            </div>
            
        </div>}</>) : 
        (<></>)
        }
    </>
}

function concat_class(type) {
    if (type === "error") {
        type = "danger"
    }
    return "alert alert-" + type + " pb-4";
}

export default PrintMessage;
