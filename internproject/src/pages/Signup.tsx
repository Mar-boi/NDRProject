import { useEffect, useState } from "react";

import "../styles/Register.css";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../assets/context/TranslationContext";

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
  const { language, translations } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onSubmit", // Set validation mode to trigger on blur (not on load)
    shouldFocusError: false, // Prevent focus errors immediately on load
  });

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
          if(error.response.data === "emailTaken") {
            setError("email", { type: "server", message: translations[error.response.data]});
         
          } else if(error.response.data === "usernameTaken") {
            setError("username", { type: "server", message: translations[error.response.data]});
         
          } else if(error.response.data === "passwordMismatch") {
            setError("cfpassword", { type: "server", message: translations[error.response.data] });

          } {
          }
        } else {
          alert(translations["something_went_wrong"]); // Handle other errors
        }
      }
    }
  }

  const getValidationRules = () => ({
    email: {
      required: translations["email_required"],
      validate: (value: string) => {
        if (!value.includes("@")) {
          return translations["email_format_error"];
        }
        return true;
      },
    },
    username: {
      required: translations["username_required"],
    },
    password: {
      required: translations["password_required"],
      minLength: {
        value: 8,
        message: translations["password_requirements"],
      },
    },
    cfpassword: {
      required: translations["please_confirm_password"],
    },
  });


  return (
    
    <>
     <div className="" style={{paddingBottom: 79}}>
        <div className="setBg">
          <h1
            className="setTextAlignmentCenter"
            style={{
              paddingTop: 50,
              paddingBottom: 10,
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "#2e3e8b"
            }}
          >
            {translations["sign_up"]}
          </h1>
          <div className="setTextAlignmentCenter">
            <label htmlFor="" style={{ fontSize: 14 }}>
              {translations["welcome_sign_up_first"]}
              <br />
              {translations["welcome_sign_up_sec"]}
            </label>
          </div>
          <form
            style={{ justifyItems: "center" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="setForms container">
              <input
                 {...register("email", getValidationRules().email)}

                type="text"
                id="email"
                placeholder=""
                className="form_input"
              />
              <label className="label">{translations["email"]}</label>
              {errors.email && (
                <div className="error-message">{errors.email.message}</div>
              )}
            </div>
            <div className="setForms container">
              <input
                {...register("username", getValidationRules().username)}
                className="form_input"
                type="text"
                id="username"
                placeholder=""
              />
              <label className="label">{translations["username"]}</label>
              {errors.username && (
                <div className="error-message">{errors.username.message}</div>
              )}
            </div>
            <div className="setForms container">
              <input
               {...register("password", getValidationRules().password)}
                type="password"
                id="password"
                placeholder=""
                className="form_input"
              />
              <label className="label">{translations["password"]}</label>
              {errors.password && (
                <div className="error-message">{errors.password.message}</div>
              )}
            </div>
            <div className="setForms container">
              <input
                {...register("cfpassword", getValidationRules().cfpassword)}
                type="password"
                id="cfpassword"
                placeholder=""
                className="form_input"
              />
              <label className="label">{translations["confirm_password"]}</label>
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
                {translations["receive_ipo_email"]}
              </label>
            </div>


            <div>
              <input
                type="submit"
                value={translations["sign_up"]}
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
                value={translations["login"]}
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
