import Navbar from "./Navbar";
import "./Register.css";
import { SubmitHandler, useForm } from "react-hook-form";

type FormFields = {
  username: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
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
