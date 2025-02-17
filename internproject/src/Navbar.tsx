import "./Navbar.css";

function Navbar() {
  return (
    <>
      <div className="container-fluid" style={{backgroundColor: "#2E3E8B"}}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-lg ">
            <h2>
              <a
                className="text-white "
                href=""
                target=""
                style={{ textDecoration: "none" }}
              >
                Last 100 IPO Companies
              </a>
            </h2>
              <input type="submit" value="Login" className="btn" style={{backgroundColor: "white"}}/>
          </div>
        </nav>
      </div>
      <body></body>
    </>
  );
}

export default Navbar;
