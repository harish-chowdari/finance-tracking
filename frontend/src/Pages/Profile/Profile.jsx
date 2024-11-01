import React, { useEffect, useState } from "react";
import axios from "../../axios";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useColour } from "../../Context/UseContext";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [updateName, setUpdateName] = useState("");
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
        userId,
      });
      alert(response.data.updated);
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
        setSelectedDisease(localStorage.getItem("disease") || response.data.userData.disease);
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
    </div>
  );
};

export default Profile;
