import React, { useState } from "react";
import axios from "../../axios";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const userId = localStorage.getItem("userId");

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    diseases: [], // Keep it as an array
  });

  const [avoid, setAvoid] = useState([]);
  const [use, setUse] = useState([]);
  const navigate = useNavigate();

  const optionNumbers = [
    "deuteranopia",
    "protanopia",
    "tritanopia",
    "monochromacy",
  ];

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;

    setSignup((prevState) => ({
      ...prevState,
      diseases: [value], // Set selected disease as an array
    }));

    let newAvoid = [];
    let newUse = [];

    if (value === "deuteranopia" || value === "protanopia") {
      newAvoid = ["red", "green", "brown", "orange"];
      newUse = ["blue", "yellow", "purple", "gray"];
    }
    if (value === "tritanopia") {
      newAvoid = ["blue", "yellow", "green"];
      newUse = ["red", "pink", "gray", "black"];
    }
    if (value === "monochromacy") {
      newAvoid = ["all colors"];
      newUse = ["black", "white", "gray"];
    }

    setAvoid(newAvoid);
    setUse(newUse);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastdiseases = {
      position: "top-center",
      autoClose: 5000,
      transition: Flip,
    };

    if (signup.password !== signup.confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match", toastdiseases);
      return;
    }

    try {
      const res = await axios.post("/signup", { ...signup });
      toast.dismiss();

      if (res.data.EnterAllDetails) {
        toast.error(res.data.EnterAllDetails, toastdiseases);
        return;
      } else if (res.data.AlreadyExist) {
        toast.error(res.data.AlreadyExist, toastdiseases);
        return;
      } else {
        toast.success("Signup successful! Redirecting...");
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("disease", res.data.diseases[0]?.disease);
        setTimeout(() => {
          navigate(`/finance/${res.data.name}`);
        }, 1000);
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
          <input
            placeholder="Confirm Your Password"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            value={signup.confirmPassword}
            className={styles.input}
          />
        </div>

        <div>
          <h4 className={styles.colorHeading}>Select a disease</h4>
          <div className={styles.colorDiv}>
            {optionNumbers.map((option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="diseases"
                  value={option}
                  onChange={handleRadioChange}
                  checked={signup.diseases.includes(option)} // Check if the option is selected
                />
                <p className={styles.color}>{option}</p>
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
