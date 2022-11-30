import React, { component, useState, useEffect } from "react";
import axios from "axios";
import PrintMessage from "../../components/Message";
import Navbar from "../../components/Navbar";
import { format } from 'date-fns';

function TestHistory() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [test, setTests] = useState({});
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    get_user();

    return () => {
      get_history();
    };
  }, []);

  console.log(test);
  const get_user = async () => {
    await axios
      .get("user/", {})
      .then((response) => {
        setLoggedInUser(response.data);
      })
      .catch((error) => {
        setMessage(error);
      });
  };

  const get_history = async () => {
    await axios({
      method: "get",
      url: `/course/test_history/`,
      data: {},
      //headers: {'X-CSRFToken': Cookies.get('csrftoken')}
    })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoaded(true);
          //var data = Object.entries(response.data.data)
          setTests(response.data.data);
        } else {
          setIsLoaded(true);
        }
      })
      .catch((error) => {
        setMessage([error.name, "danger"]);
      });
  };

  if (!isLoaded) {
    return (
      <p style={{ fontSize: "10vw", textAlign: "center", marginTop: "2vw" }}>
        Loading...
      </p>
    );
  } else {
    return <>
    {
      loggedInUser.status === 200 ? (
        <>
          <Navbar user={loggedInUser} />
        </>
      ) : (
        <>
          <Navbar user={loggedInUser} />
        </>
      )
    }

    {
      message.length > 0 ? (
        <PrintMessage msg={message[0]} type={message[1]} />
      ) : (
        <></>
      )
    }
    {console.log(test)}
    {test ? (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Test Name</th>
                <th scope="col">Duration</th>
                <th scope="col">Marks Per Que</th>
                <th scope="col">Marks Scored</th>
                <th scope="col">Test DateTime</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {test.map((ele) => 
                        <tr>
                        <td>{ele.test_name}</td>
                        <td>{ele.duration}</td>
                        <td>{ele.mark_per_question}</td>
                        <td>{ele.marks_scored}</td>
                        <td>{convert_date(ele.test_date)}</td>
                        <td>{ele.description}</td>
                      </tr>
                )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <p>Noithing here</p>
        </>
      )
    }
    </>
  }

  function convert_date(user_datetime){
        
    return format(new Date(user_datetime), 'yyyy/MM/dd kk:mm:ss')
}

}

export default TestHistory;
