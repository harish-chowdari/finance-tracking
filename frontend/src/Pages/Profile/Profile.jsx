import React, { useEffect, useState } from "react";
import axios from "../../axios";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useColour } from "../../Context/UseContext";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateExpensesLimit, setUpdateExpensesLimit] = useState(0);
  const [selectedDisease, setSelectedDisease] = useState("");
  const navigate = useNavigate();

  const [edit, setEdit] = useState(true);

  const { tritanopia, protanopia, deuteranopia, monochromacy } = useColour();
  let colorsToUse;

  if (selectedDisease === "protanopia") {
    colorsToUse = protanopia.use;
  } else if (selectedDisease === "tritanopia") {
    colorsToUse = tritanopia.use;
  } else if (selectedDisease === "deuteranopia") {
    colorsToUse = deuteranopia.use;
  } else if (selectedDisease === "monochromacy") {
    colorsToUse = monochromacy.use;
  } else {
    colorsToUse = ["#000000"];
  }

  const editAcc = async () => {
    try {
      const response = await axios.put(`/update-account/${userId}`, {
        name: updateName,
        disease: selectedDisease,
        expensesLimit: updateExpensesLimit,
        userId,
      });
      
      if(response.data.expensesLimitUpdated)
      {
        const res = axios.delete(`/delete-mail/${userId}`);
      }

        setEdit(!edit);

      // Update local storage with the selected disease
      localStorage.setItem("disease", selectedDisease);
      window.location.reload();
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Failed to update account. Please try again later.");
    }
  };


  const deleteAcc = async () => {
    try {
        const response = await axios.delete(`/delete/${userId}`);
        if (!response.data.deleted) {
            console.error("Error deleting account:", response.data);
            return;
        }
        alert(response.data.deleted);
        navigate("/");
    } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again later.");
    }
};


  const handleChange = (e) => setUpdateName(e.target.value);
  const handleDiseaseChange = (e) => setSelectedDisease(e.target.value);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`/user-data/${userId}`);
        setUser(response.data);
        setUpdateName(response.data.userData.name);
        setUpdateExpensesLimit(response.data.userData.expensesLimit);
        setSelectedDisease(localStorage.getItem("disease") || response.data.userData.disease);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, [userId]);

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.profile}>
      <h2 className={styles.title}>Your Profile</h2>
      <div className={styles.infoContainer}>
        {edit ? (
          <div className={styles.infoItem}>
            <h3 className={styles.label}>User Name:</h3>
            <p className={styles.value}>@{user.userData.name}</p>
            
              <h3 className={styles.label}>Expenses Limit:</h3>
              <p className={styles.value}>@{user.userData.expensesLimit}</p>
            
            <button
              style={{ backgroundColor: colorsToUse[0] }}
              onClick={() => setEdit(!edit)}
              className={styles.edit}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className={styles.infoItem}>
            <h3 className={styles.label}>User Name:</h3>
            <input
              type="text"
              className={styles.input}
              name="name"
              value={updateName || ""}
              onChange={handleChange}
            />
            <div>
              <h3>Expenses Limit:</h3>
              <input
                type="number"
                className={styles.input}
                name="expensesLimit"
                value={updateExpensesLimit || ""}
                onChange={(e) => setUpdateExpensesLimit(e.target.value)}
              />
            </div>
            <h3 className={styles.label}>Color Vision Deficiency:</h3>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="protanopia"
                  name="disease"
                  checked={selectedDisease === "protanopia"}
                  onChange={handleDiseaseChange}
                />
                Protanopia
              </label>
              <label>
                <input
                  type="radio"
                  value="tritanopia"
                  name="disease"
                  checked={selectedDisease === "tritanopia"}
                  onChange={handleDiseaseChange}
                />
                Tritanopia
              </label>
              <label>
                <input
                  type="radio"
                  value="deuteranopia"
                  name="disease"
                  checked={selectedDisease === "deuteranopia"}
                  onChange={handleDiseaseChange}
                />
                Deuteranopia
              </label>
              <label>
                <input
                  type="radio"
                  value="monochromacy"
                  name="disease"
                  checked={selectedDisease === "monochromacy"}
                  onChange={handleDiseaseChange}
                />
                Monochromacy
              </label>
            </div>
            <button
              style={{ backgroundColor: colorsToUse[0] }}
              onClick={editAcc}
              className={styles.edit}
            >
              Done
            </button>
          </div>
        )}
        <div className={styles.infoItem}>
          <h3 className={styles.label}>Email:</h3>
          <p className={styles.value}>{user.userData.email}</p>
        </div>
        <div className={styles.infoItem}>
          <h3 className={styles.label}>Expenses Count:</h3>
          <p className={styles.value}>{user.userData.expenses.length}</p>
        </div>
        <div className={styles.delInfoItem}>
          <h3>Delete Account</h3>
          <button style={{ backgroundColor: colorsToUse[3] }} className={styles.delete} onClick={deleteAcc}>Delete</button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default Profile;
