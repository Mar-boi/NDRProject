import Navbar from "./Navbar";
import "./Profile.css";

export const Profile = () => {
  return (
    <>
      <Navbar />
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
              />
            </div>
            <div style={{display: "flex"}}>
              <div>
                <input type="submit" value="Logout" className="" />
              </div>
              <div>
                <input type="submit" value="Save Changes" />
              </div>
            </div>
          </form>
          <div className="createLine"></div>
        </div>
      </div>
    </>
  );
};