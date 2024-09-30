import React, { useState } from "react";
import axios from "../../axios";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    colourBlind: [],
  });
  const navigate = useNavigate();

  const colorOptions = [
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Brown",
    "Purple",
    "Pink",
    "Orange",
    "Gray",
    "Cyan",
  ];

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSignup((prevState) => ({
        ...prevState,
        colourBlind: [...prevState.colourBlind, value],
      }));
    } else {
      setSignup((prevState) => ({
        ...prevState,
        colourBlind: prevState.colourBlind.filter((color) => color !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastOptions = {
      position: "top-center",
      autoClose: 5000,
      transition: Flip, 
    };

    try {
      const res = await axios.post("/signup", { ...signup });
      toast.dismiss()
      
      if (res.data.EnterAllDetails) {
        toast.error(res.data.EnterAllDetails, toastOptions);
      } else if (res.data.AlreadyExist) {
        toast.error(res.data.AlreadyExist, toastOptions);
      } else {
        const userId = res.data._id;
        toast.success("Signup successful! Redirecting...");

        setTimeout(() => {
          navigate(`/schedule/${userId}`);
        }, 2500); 
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Signup</h2>

        <div>
          <input
            placeholder="Enter Your Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={signup.name}
            className={styles.input}
            
          />
        </div>
        <div>
          <input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={signup.email}
            className={styles.input}
            
          />
        </div>
        <div>
          <input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={signup.password}
            className={styles.input}
            
          />
        </div>

        <div>
          <h4 className={styles.colorHeading}>Select Color Blindness</h4>
          <div className={styles.colorDiv}>
            {colorOptions.map((color) => (
              <label key={color} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="colourBlind"
                  value={color}
                  onChange={handleCheckboxChange}
                  checked={signup.colourBlind.includes(color)}
                />
                <p className={styles.color}>{color}</p>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Submit
        </button>
        <p className={styles.text}>
          Already have an account?{" "}
          <Link to="/" className={styles.link}>
            Login
          </Link>
        </p>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Signup;
