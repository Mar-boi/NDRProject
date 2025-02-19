import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

type FormFields = {
  username: string;
  password: string;
};
 const Login = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const userData = {
      username: data.username,
      password: data.password
    }
    console.log(userData);
    try {
      const response = await axios.post("http://localhost:8080/login", data);
      
      console.log(response);
      if (response.status === 200) {
        console.log("Signup successful! Redirecting...");
        login({
          userId: response.data.userID,
          username: response.data.userName
        });
        navigate("/"); // ✅ Redirect to the main page on success
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
            setError("password", { type: "server", message: "Username or password is wrong"}); // ✅ Show error on form
        } else {
          alert("Something went wrong! Please try again."); // Handle other errors
        }
      }
  };
}
  return (
   
    <>
      <div className="">
        <div className="setBg">
          <h1
            className="setTextAlignmentCenter"
            style={{ paddingBottom: "100px" }}
          >
            Login
          </h1>
          <form
            style={{ justifyItems: "center" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="setForms">
              <label htmlFor="" className="" style={{ paddingBottom: "10px" }}>
                <span className="setHeader">Username</span>
              </label>
              <br />
              <input
                {...register("username", {
                  required: "Username is require",
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
                  required: "Password is require",
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
            <div>
              <input
                type="submit"
                value="Login"
                className="btn loginBtnColor setBtn"
              />
            </div>
          </form>
          <div style={{ justifyItems: "center" }}>
            <div>
              <a href="http://localhost:5173/signup">
                <input
                  type="submit"
                  value="Sign up"
                  className="btn signupBtnColor setBtn"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;