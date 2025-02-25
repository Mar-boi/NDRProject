import { useNavigate } from "react-router-dom";
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
      password: data.password,
    };
    console.log(userData);
    try {
      const response = await axios.post("http://localhost:8080/login", data);

      console.log(response);
      if (response.status === 200) {
        console.log("Signup successful! Redirecting...");
        login({
          userId: response.data.userID,
          username: response.data.userName,
        });
        navigate("/"); // ✅ Redirect to the main page on success
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          setError("password", {
            type: "server",
            message: "Username or password is wrong",
          }); // ✅ Show error on form
        } else {
          alert("Something went wrong! Please try again."); // Handle other errors
        }
      }
    }
  };
  return (
    <>
      <div className="">
        <div className="setBg">
          <div className="">
            <h1
              className="setTextAlignmentCenter"
              style={{
                paddingTop: 50,
                paddingBottom: 10,
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
            >
              Login
            </h1>
            <div className="setTextAlignmentCenter">
              <label htmlFor="" style={{ fontSize: 14 , paddingBottom: 10}}>
                Welcome to Latest 100 IPO Companies website
                <br />
                Please enter an Email address or Username to login
              </label>
            </div>
            <form
              style={{ justifyItems: "center" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="setForms container">
                <input
                  {...register("username", {
                    required: "Email address or Username is require",
                  })}
                  type="text"
                  id="username"
                  placeholder=""
                  className="form_input"
                />
                <label className="label">Email address or username</label>
                {errors.username && (
                  <div className="error-message">{errors.username.message}</div>
                )}
              </div>
              <div className="setForms container">
                <input
                  {...register("password", {
                    required: "Password is require",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                  type="password"
                  id="password"
                  placeholder=""
                  className="form_input"
                />
                <label className="label">Password</label>
                {errors.password && (
                  <div className="error-message">{errors.password.message}</div>
                )}
              </div>
              <div style={{ justifyItems: "center", marginTop: 40 }}>
                <input
                  type="submit"
                  value="Login"
                  className="btn loginBtnColor setBtn"
                />
              </div>
            </form>
            <div style={{ justifyItems: "center" }}>
              <div
                style={{ display: "flex", alignItems: "center", width: "80%" }}
              >
                <hr style={{ flexGrow: 1, border: "1px solid #2e3e8b" }} />
                <span style={{ backgroundColor: "white", padding: "0 10px" }}>
                  or
                </span>
                <hr style={{ flexGrow: 1, border: "1px solid #2e3e8b" }} />
              </div>
            </div>
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
      </div>
    </>
  );
};

export default Login;
