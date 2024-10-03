import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PasswordReset.module.css";
import { ToastContainer, toast, Slide, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordReset = () => {
  const [login, setLogin] = useState({ email: "", otp: "", newPassword: "" });
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastOptions = {
      position: "top-center",
      autoClose: 5000,
      transition: Flip, 
    };

    if (!isOTPSent) {
      const loadingToast = toast.loading("Sending OTP...", toastOptions);

      try {
        const res = await axios.post("/send-otp", { email: login.email });
        toast.dismiss(loadingToast);

        if (res.data.emailRequire) {
          toast.error("Please enter your email address.", toastOptions);
        } else if (res.data.userNotExist) {
          toast.error("No account found with this email address.", toastOptions);
        } else if (res.data.msg === "OTP sent successfully") {
          toast.success("OTP has been sent to your email. Please check your inbox.", toastOptions);
          setIsOTPSent(true);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again.", toastOptions);
      }
    } else {
      toast.dismiss();
      try {
        const res = await axios.post("/update-password", {
          email: login.email,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res.data.otpNotValid) {
          toast.error("Invalid OTP. Please try again.", toastOptions);
        } else if (res.data.allFieldsRequired) {
          toast.error(res.data.allFieldsRequired, toastOptions);
        } else if (res.data.otpExpired) {
          toast.error("OTP has expired. Please request a new one.", toastOptions);
        } else if (res.data.updatedPassword) {
          toast.success("Password updated successfully! You can now log in.", toastOptions);
          setTimeout(() => {
            navigate("/");
          }, 2500); 
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating the password.", toastOptions);
      }
    }
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <h2>Password Reset</h2>
          <input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={login.email}
            className={styles.input}
            
          />
          {isOTPSent && (
            <>
              <input
                placeholder="Enter OTP"
                type="text"
                name="otp"
                onChange={handleChange}
                value={login.otp}
                className={styles.input}
              />
              <input
                placeholder="Enter New Password"
                type="password"
                name="newPassword"
                onChange={handleChange}
                value={login.newPassword}
                className={styles.input}
              />
            </>
          )}
          <button type="submit" className={styles.button}>
            {isOTPSent ? "Reset Password" : "Send OTP"}
          </button>
          <p className={styles.passwordText}>
            Remember your password?{" "}
            <Link to="/" className={styles.link}>
              Login
            </Link>
          </p>
        </div>
      </form>

      <ToastContainer position="top-center" transition={Slide} />
    </>
  );
};

export default PasswordReset;
