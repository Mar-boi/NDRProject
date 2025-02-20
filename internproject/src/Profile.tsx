import "./Profile.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS (this includes Popper.js)
import { useAuth } from "./AuthContext";
import axios from "axios";

export const Profile = () => {
  const [activeDays, setActiveDays] = useState([]); // Track an array of active days
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [receiveEmail, setReceiveEmail] = useState(false);

  
  // State to store the selected period (AM/PM)
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const { user, login, logout } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async ()  => { 
    if(user!= null) {
      console.log("Hi" + user.userId);
      // call spring boot for user & user preference
      try {
        const response = await axios.get("http://localhost:8080/getPreference?userID=" + user.userId);
        console.log(response);
         setUsername(response.data.username);
         setEmail(response.data.email);
         setHour(response.data.hour);
         setSelectedPeriod(response.data.period.toUpperCase());
      } catch(e) {
        console.log(e);
      }
    }
  }

  const handleClick = (day: string) => {
    if (activeDays.includes(day)) {
      // If the day is already active, remove it from the array (toggle off)
      setActiveDays(activeDays.filter((item) => item !== day));
    } else {
      // If the day is not active, add it to the array (toggle on)
      setActiveDays([...activeDays, day]);
    }
  };

  // Function to handle the selection of AM or PM
  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period); // Update the state with the selected value
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <>
      <div>
        <div className="setProfileBG">
          <h1>Profile</h1>
          <form>
            <div className="" style={{ paddingTop: 10 }}>
              <label htmlFor="" className="">
                <span className="">Email</span>
              </label>
              <br />
              <input
                className="inputBox"
                type="text"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="" style={{ paddingTop: 10 }}>
              <label htmlFor="" className="">
                <span className="">Username</span>
              </label>
              <br />
              <input
                className="inputBox"
                type="text"
                id="username"
                placeholder="Username"
                value = {username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="" style={{ paddingTop: 10 }}>
              <label htmlFor="">
                <span className="">Password</span>
              </label>
              <br />
              <input
                className="inputBox"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                
              />
            </div>
            <div className="" style={{ paddingTop: 10 }}>
              <label htmlFor="">
                <span className="">Confirm Password</span>
              </label>
              <br />
              <input
                className="inputBox"
                type="password"
                id="password"
                placeholder="Confirm Password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div style={{ display: "flex", marginLeft: 585 }}>
              <div>
                <input type="submit" value="Logout" className="" />
              </div>
              <div>
                <input type="submit" value="Save Changes" />
              </div>
            </div>
          </form>
          <div className="createLine"></div>
          <div>
            <form action="">
              <h1>Email</h1>
              <h4>Days and Time</h4>
              <p>Select days and time for email to be sent</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Center vertically
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 20, // Add space below for the day buttons
                }}
              >
                {/* Time container with two inputs and a dropdown */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 20,
                    padding: "5px 15px",
                    borderRadius: "10px",
                    border: "2px solid transparent",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {/* First input (Hour) */}
                  <input
                    type="number"
                    placeholder="10"
                    min="0"
                    max="12"
                    value={hour}
                    style={{
                      width: "75px",
                      padding: "8px",
                      textAlign: "center",
                      fontSize: "24px",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      color: "#000000",
                    }}
                    onChange={(event) => setHour(event.target.valueAsNumber)}
                  />
                  <span style={{ fontSize: "24px", margin: "0 5px" }}>:</span>
                  {/* Second input (Minutes) */}
                  <input
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    value={min}
                    style={{
                      width: "75px",
                      padding: "8px",
                      textAlign: "center",
                      fontSize: "24px",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      color: "#000000",
                    }}
                    onChange={(event) => setMin(event.target.valueAsNumber)}
                  />
                  {/* Dropdown for AM/PM */}
                  <div className="dropdown">
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#2e3e8b",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "5px",
                        fontSize: "20px",
                      }}
                    >
                      {selectedPeriod}
                    </button>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
               
                      style={{
                        borderRadius: "5px",
                        padding: "5px 0",
                        marginTop: "10px",
                      }}
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleSelectPeriod("AM")}
                          style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                          }}
                        >
                          AM
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleSelectPeriod("PM")}
                          style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                          }}
                        >
                          PM
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Container for the days buttons */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {days.map((day) => (
                    <button
                      key={day}
                      className={`dayBtn ${
                        activeDays.includes(day) ? "active" : ""
                      }`}
                      onClick={() => handleClick(day)}
                      style={{ marginRight: 5, marginBottom: 5 }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <h4>Followed Industry</h4>
              <p>
                Your followed industries will be show here. You can unfollow
                them anytime by clicking
              </p>
              <div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Look up industries
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Basic Materials
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Blank Check
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Consumer Goods
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Consumer Services
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Financials
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Health Care
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Industrials
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Oil & Gas
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Other
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Technology
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="form-check form-switch form-check-reverse setForms">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckReverse"
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckReverse"
                >
                  Receive latest IPO companies via email
                </label>
              </div>
              <div style={{ marginLeft: 650 }}>
                <input type="submit" value="Save Changes" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
