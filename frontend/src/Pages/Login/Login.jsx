import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; 
import { ToastContainer, toast, Flip } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastOptions = {
      position: "top-center",
      autoClose: 5000,
      transition: Flip 
    };

    try {
      const res = await axios.post("/login", { ...login });

      toast.dismiss();

      if (res.data.EnterAllDetails) {
        toast.error(res.data.EnterAllDetails, toastOptions);
      } else if (res.data.NotExist) {
        toast.error(res.data.NotExist, toastOptions);
      } else if (res.data.Incorrect) {
        toast.error(res.data.Incorrect, toastOptions);
      } else {
        toast.success("Login successful!", toastOptions);
        localStorage.setItem("name", res.data.name);
        setTimeout(() => {
          navigate(`/finance/${res.data.name}`);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.", toastOptions);
    }
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <h2>Login</h2>
          <input
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={login.email}
            className={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={login.password}
            className={styles.input}
          />
          <p className={styles.resetPassword}>
            Forget password? update{" "}
            <Link to="/reset" className={styles.link}> here</Link>
          </p>
          <button type="submit" className={styles.button}>
            Submit
          </button>
          <p className={styles.text}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.link}>Signup</Link>
          </p>
        </div>
      </form>
      
      <ToastContainer position="top-center" />
    </>
  );
};

export default Login;
