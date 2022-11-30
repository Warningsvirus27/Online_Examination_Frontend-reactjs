import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PrintMessage from "../components/Message";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";


function Edit() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [check, setCheck] = useState(true);

  const [message, setMessage] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    get_user();
  }, []);

  const get_user = async () => {
    await axios.get("../user/", {})
      .then((response) => {
        if (response.data.status === 200) {
          setLoggedInUser(response.data);
          setFirstName(response.data.data.first_name);
          setLastName(response.data.data.last_name);
          setEmail(response.data.data.email)
          setIsLoaded(true);
        } else {
          navigation("/login", { state: response.data });
        }
      })
      .catch((error) => {
        console.log("in error yes");
        setIsLoaded(true);
        setMessage([error.name, "danger"]);
      });
  };

  const handel_edit = async(e) => {
    e.preventDefault()
     if (loggedInUser.data.is_staff === true)
      var obj = {"email" : email,
      "first_name": firstName,
      "last_name": lastName,
      "is_staff": check}
      else {
        var obj = {"email" : email,
        "first_name": firstName,
        "last_name": lastName}
      }
    if (email.length > 0 && firstName.length > 0 && lastName.length > 0) {
      await axios({
        method: 'patch',
        url: `../user/`,
        data: obj,
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }).then((response) => {
          console.log('here ok', response.data);
          if (response.data.status === 200) {
            setMessage([response.data.message, response.data.type])
          } else {
            console.log("setting message");
            setMessage([response.data.messge, response.data.type]);
          }
        })
        .catch((error) => {
          console.log(error)
          setMessage([error.name, "danger"]);
        });
    }
  };

  const handel_delete = async(e) => {
    e.preventDefault()
    if (email.length > 0 && firstName.length > 0 && lastName.length > 0) {
      await axios({
        method: 'delete',
        url: `../user/`,
        data: {},
        headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    }).then((response) => {
          console.log(response.data)
          if (response.data.status === 204) {
            navigation("/register", {state: response.data});
          } else {
            setMessage([response.data.messge, response.data.type]);
          }
        })
        .catch((error) => {
          setMessage([error.name, "danger"]);
        });
    }
  };

  if (!isLoaded) {
    return (
      <p style={{ fontSize: "10vw", textAlign: "center", marginTop: "2vw" }}>
        Loading...
      </p>
    );
  } else {
    return (
      <>
        {message.length > 0 ? (
          <PrintMessage msg={message[0]} type={message[1]} />
        ) : (
          <></>
        )}

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
            background: "linear-gradient(to bottom right, #b1e5f2, #74b4c4)",
          }}
        >
          <form>
            <div className="col my-5">
              <div className="col">
                <div className="row my-4">
                  <span style={{ fontSize: "12" }}>EMAIL</span>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    aria-label="division"
                    autocomplete="off"
                    value={loggedInUser.data.email}
                    required
                    readOnly
                  ></input>
                </div>
                <div className="row my-4">
                  <span style={{ fontSize: "12" }}>FIRST NAME</span>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    aria-label="division"
                    autocomplete="off"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                    }}
                    required
                  ></input>
                </div>
                <div className="row my-4">
                  <span style={{ fontSize: "12" }}>LAST NAME</span>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    aria-label="division"
                    autocomplete="off"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                    }}
                    required
                  ></input>
                </div>
                {loggedInUser.data.is_staff === true ? (
                  <>
                    <div className="row">
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            defaultChecked
                            onClick={() => setCheck(!check)}
                          ></input>
                          IS STAFF
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="row my-4">
                <div className="col text-center">
                  <button
                    type="submit"
                    className="btn btn-warning"
                    style={{ margin: "auto auto", marginTop: "3%" }}
                    onClick={(e) => handel_edit(e)}>
                    Edit Profile
                  </button>
                </div>
                <div className="col text-center">
                  <button
                    type="submit"
                    className="btn btn-danger"
                    style={{ margin: "auto auto", marginTop: "3%" }}
                    onClick={(e) => handel_delete(e)}>
                    Delete Profile
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default Edit;
