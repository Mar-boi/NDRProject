import { useState } from "react";
import Navbar from "./Navbar";
import "./Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
  username: string;
  password: string;
  cfpassword: string;
  receiveEmail: boolean;
};
function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState<any>();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const userData = {
      email: data.email,
      username: data.username,
      password: data.password,
      cfpassword: data.cfpassword,
      receiveEmail: data.receiveEmail,
    };
    console.log(userData);
    try {
      const response = await axios.post("http://localhost:8080/signup", data);
      
      console.log(response);
      if (response.status === 201) {
        console.log("Signup successful! Redirecting...");
        navigate("/"); // ✅ Redirect to the main page on success
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          if(error.response.data === "Email is already taken") {
            setError("email", { type: "server", message: error.response.data}); // ✅ Show error on form
          } else if(error.response.data === "Username is already taken") {
            setError("username", { type: "server", message: error.response.data });
          } else if(error.response.data === "Passwords don't match") {
            setError("cfpassword", { type: "server", message: error.response.data });
          } 
        } else {
          alert("Something went wrong! Please try again."); // Handle other errors
        }
      }
    }
  }
  return (
    
    <>
      <div className="">
        <div className="setBg">
          
          <h1 className="setTextAlignmentCenter">Sign up</h1>
          <form
            style={{ justifyItems: "center" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="setForms">
              <label htmlFor="" style={{ paddingBottom: "10px" }}>
                <span className="setHeader">Email</span>
              </label>
              <br />
              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    // pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    validate: (value) => {
                      if (!value.includes("@")) {
                        return "Email is must include @";
                      }
                      return true;
                    },
                  })}
                  className="inputBox"
                  type="text"
                  id="email"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <div style={{ color: "red" }}>{errors.email.message}</div>
                )}
              </div>
            </div>
            <div className="setForms ">
              <label htmlFor="" className="" style={{ paddingBottom: "10px" }}>
                <span className="setHeader">Username</span>
              </label>
              <br />
              <input
                {...register("username", {
                  required: "Username is required",
                })}
                className="inputBox"
                type="text"
                id="username"
                placeholder="Enter username"
              />
              {errors.username && (
                <div style={{ color: "red" }}>{errors.username.message}</div>
              )}
            </div>
            <div className="setForms">
              <label htmlFor="" style={{ paddingBottom: "10px" }}>
                <span className="setHeader">Password</span>
              </label>
              <br />
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
                className="inputBox"
                type="password"
                id="password"
                placeholder="Enter password"
              />
              {errors.password && (
                <div style={{ color: "red" }}>{errors.password.message}</div>
              )}
            </div>
            <div className="setForms ">
              <label htmlFor="" style={{ paddingBottom: "10px" }}>
                <span className="setHeader">Confirm Password</span>
              </label>
              <br />
              <input
                {...register("cfpassword", {
                  required: "Please, confirm password",
                  //validate: (value) => value.matchAll()
                })}
                className="inputBox"
                type="password"
                id="cfpassword"
                placeholder="Confirm password"
              />
              {errors.cfpassword && (
                <div style={{ color: "red" }}>{errors.cfpassword.message}</div>
              )}
            </div>
            <div className="form-check form-switch form-check-reverse setForms">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="receiveEmail"
                {...register("receiveEmail")}
                checked={watch("receiveEmail")}
                onChange={(e) => setValue("receiveEmail", e.target.checked)}
              />
              <label className="form-check-label" htmlFor="receiveMail">
                Receive latest IPO companies via email
              </label>
            </div>

            <div>
              <input
                type="submit"
                value="Sign up"
                className="btn signupBtnColor setBtn"
              />
              <br />
            </div>
          </form>
          <div style={{ justifyItems: "center" }}>
            <div>
                <input
                  type="submit"
                  value="Login"
                  className="btn loginBtnColor setBtn"
                  onClick={() => navigate("/login")}
                  
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
