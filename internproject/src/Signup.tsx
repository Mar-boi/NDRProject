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
          if (error.response.data === "Email is already taken") {
            setError("email", { type: "server", message: error.response.data }); // ✅ Show error on form
          } else if (error.response.data === "Username is already taken") {
            setError("username", {
              type: "server",
              message: error.response.data,
            });
          } else if (error.response.data === "Passwords don't match") {
            setError("cfpassword", {
              type: "server",
              message: error.response.data,
            });
          }
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
          <h1
            className="setTextAlignmentCenter"
            style={{
              paddingTop: 50,
              paddingBottom: 10,
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            Sign up
          </h1>
          <div className="setTextAlignmentCenter">
            <label htmlFor="" style={{ fontSize: 14 }}>
              Do you have an account yet ?
              <br />
              To receive latest IPO companies via email Please Sign up
            </label>
          </div>
          <form
            style={{ justifyItems: "center" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="setForms container">
              <input
                {...register("email", {
                  required: "Email is require",
                })}
                type="text"
                id="email"
                placeholder=""
                className="form_input"
              />
              <label className="label">Email address</label>
              {errors.email && (
                <div className="error-message">{errors.email.message}</div>
              )}
            </div>
            <div className="setForms container">
              <input
                {...register("username", {
                  required: "Username is required",
                })}
                className="form_input"
                type="text"
                id="username"
                placeholder=""
              />
              <label className="label">Username</label>
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
            <div className="setForms container">
              <input
                {...register("cfpassword", {
                  required: "Please, confirm password",
                })}
                type="password"
                id="cfpassword"
                placeholder=""
                className="form_input"
              />
              <label className="label">Confirm Password</label>
              {errors.cfpassword && (
                <div className="error-message">{errors.cfpassword.message}</div>
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
                style={{ marginTop: 15 }}
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
                style={{ marginTop: 15 }}
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
