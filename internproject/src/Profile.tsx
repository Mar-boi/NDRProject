import "./Profile.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS (this includes Popper.js)
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [activeDays, setActiveDays] = useState<number[]>([]); // Track an array of active days
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);

  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [receiveEmail, setReceiveEmail] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState("");

  const { user, logout } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (user != null) {
      console.log("Hi" + user.userId);
      // call spring boot for user & user preference
      try {
        const response = await axios.get(
          "http://localhost:8080/getPreference?userID=" + user.userId
        );
        console.log(response);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setHour(response.data.hour);
        setMin(response.data.min);
        setSelectedPeriod(response.data.period.toUpperCase());
        setActiveDays(response.data.days);
        setReceiveEmail(response.data.receiveEmail);
        setSelectedIndustries(response.data.industries);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Function to handle the selection of AM or PM
  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period); // Update the state with the selected value
  };

  const handleDaysClick = (key: number) => {
    setActiveDays((prev) => {
      return prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key];
    });
  };



  const handleIndustryClick = (key: number) => {
    setSelectedIndustries((prev) => {
      const updatedIndustries = prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key];
      return updatedIndustries.sort();
    });
  };

  const handleOnSubmitProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const updateProfile = {
      username: username,
      email: email,
      userID: user?.userId
    }
    console.log(updateProfile);
    axios
    .put("http://localhost:8080/updateProfile", updateProfile)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => console.log(e));
  }

  const handleOnSubmitPref = (event: React.FormEvent) => {
      // Prevent form default submission behavior
    event.preventDefault();
    const updatePref = {
      days: activeDays,
      hour: hour,
      min: min,
      period: selectedPeriod.toLowerCase(),
      receiveEmail: receiveEmail,
      industries: selectedIndustries,
      userID: user?.userId,
    };
    console.log(updatePref); // Log to check the data
    axios
      .put("http://localhost:8080/updatePreference", updatePref)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e));
  };

  const days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };
  const industries: { [key: number]: string } = {
    1: "Basic Materials",
    2: "Blank Check",
    3: "Consumer Goods",
    4: "Consumer Services",
    5: "Financials",
    6: "Health Care",
    7: "Industrials",
    8: "Oil & Gas",
    9: "Other",
    10: "Technology",
  };

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
                value={username}
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
            <div style={{ display: "flex", marginLeft: 425 }}>
              <div style={{ marginRight: 10 }}>
                <input
                  type="submit"
                  value="Logout"
                  className="btn setProfileLogoutBtnColor setProfileLogoutBtn"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                />
              </div>
              <div>
              <button
                  type="submit"
                  className="btn setProfileBtnColor setProfileBtn"
                  onClick={handleOnSubmitProfile}
                >
                  Save Changes
                </button>
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
                      color: "#696969",
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
                    value={min.toString().padStart(2, "0")}
                    style={{
                      width: "75px",
                      padding: "8px",
                      textAlign: "center",
                      fontSize: "24px",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      color: "#696969",
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

                <div>
                  {Object.entries(days).map(([key, day]) => (
                    <label htmlFor="">
                      <input
                        key={key}
                        type="button"
                        className={`dayBtn ${
                          activeDays.includes(Number(key)) ? "active" : ""
                        }`} // Apply active class if the day is in the activeDays array
                        value={day}
                        onClick={() => handleDaysClick(Number(key))}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <h4>Followed Industry</h4>
              <p>
                Your followed industries will be show here. You can unfollow
                them anytime by clicking
              </p>
              <div>
                <div
                  className="dropdown"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="btn dropdown-toggle setDDIndustries"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Look up industries
                  </button>
                  <ul className="dropdown-menu ddIndustry">
                    {Object.entries(industries)
                      .filter(([key]) => !selectedIndustries.includes(+key)) // Convert key to number
                      .map(([key, industryName]) => (
                        <li key={key}>
                          <a
                            className="dropdown-item"
                            onClick={() => handleIndustryClick(+key)}
                          >
                            {industryName}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginLeft: "10px",
                    }}
                  >
                    {selectedIndustries.map((key: number) => (
                      <button
                        key={key}
                        className="btn setIndustriesBtn"
                        onClick={() => handleIndustryClick(key)}
                      >
                        {industries[key]} ✖
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-check form-switch form-check-reverse setForms">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckReverse"
                  checked={receiveEmail}
                  onChange={(e) => setReceiveEmail(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckReverse"
                >
                  Receive latest IPO companies via email
                </label>
              </div>
              <div style={{ marginLeft: 535 }}>
                <button
                  type="submit"
                  className="btn setProfileBtnColor setProfileBtn"
                  onClick={handleOnSubmitPref}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
