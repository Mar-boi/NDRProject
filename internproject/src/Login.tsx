import { useNavigate } from "react-router-dom";
import "./Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "./assets/context/AuthContext";
import { useTranslation } from "./TranslationContext";

type FormFields = {
  username: string;
  password: string;
};
 const Login = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>();
  const { language, translations } = useTranslation();

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
        if (error.response.status === 400) {
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
            style={{
              paddingTop: 50,
              paddingBottom: 10,
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "#2e3e8b",
            }}
          >
            {translations["login"]}
          </h1>
          <div className="setTextAlignmentCenter">
            <label htmlFor="" style={{ fontSize: 14, paddingBottom: 10 }}>
              {translations["welcome_login_first"]}
              <br />
              {translations["welcome_login_sec"]}
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
              <label className="label">{translations["enter_email_username_login"]}</label>
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
              <label className="label">{translations["enter_password_login"]}</label>
              {errors.password && (
                <div className="error-message">{errors.password.message}</div>
              )}
            </div>

            <div style={{ justifyItems: "center", marginTop: 40 }}>
              <input
                type="submit"
                value={translations["login"]}
                className="btn signupBtnColor setBtn"
              />
            </div>
          </form>
          <div style={{ justifyItems: "center" }}>
            <div
              style={{ display: "flex", alignItems: "center", width: "80%" }}
            >
              <hr style={{ flexGrow: 1, border: "1px solid #2e3e8b" }} />
              <span style={{ backgroundColor: "white", padding: "0 10px" }}>
                {translations["or"]}
              </span>
              <hr style={{ flexGrow: 1, border: "1px solid #2e3e8b" }} />
            </div>
          </div>
          <div style={{ justifyItems: "center" }}>
            <div>
              <a href="http://localhost:5173/signup">
                <input
                  type="submit"
                  value={translations["sign_up"]}
                  className="btn loginBtnColor setBtn"
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