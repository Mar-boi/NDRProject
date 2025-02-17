import React from "react";
import Navbar from "./Navbar";
import "./Register.css";
import { SubmitHandler, useForm } from "react-hook-form";

type FormFields = {
  email: string;
  username: string;
  password: string;
  cfpassword: string;
};
function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };
  return (
    <>
      <Navbar />
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
                    required: "Email is require",
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
                id="flexSwitchCheckReverse"
              />
              <label className="form-check-label" htmlFor="flexSwitchCheckReverse">
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
              <input
                type="submit"
                value="Login"
                className="btn loginBtnColor setBtn"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
