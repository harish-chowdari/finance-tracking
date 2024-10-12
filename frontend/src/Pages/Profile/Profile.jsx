import React, { useEffect, useState } from "react";
import axios from "../../axios";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useColour } from "../../Context/UseContext";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const navigate = useNavigate();

  const [edit, setEdit] = useState(true);

  const disease = localStorage.getItem("disease");

  const { tritanopia, protanopia, deuteranopia, monochromacy } = useColour();
  let colorsToUse;

  if (disease === "protanopia") {
    colorsToUse = protanopia.use;
  } else if (disease === "tritanopia") {
    colorsToUse = tritanopia.use;
  } else if (disease === "deuteranopia") {
    colorsToUse = deuteranopia.use;
  } else if (disease === "monochromacy") {
    colorsToUse = monochromacy.use;
  } else {
    colorsToUse = ["#000000"];
  }

  const editAcc = async () => {
    try {
      const response = await axios.put(`/update-account/${userId}`, {
        name: updateName,
      });
      alert(response.data.updated);
      setEdit(!edit);
      window.location.reload();
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Failed to update account. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setUpdateName(value);
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

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`/user-data/${userId}`);
        setUser(response.data);
        setUpdateName(response.data.userData.name);
        
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
            <button style={{ backgroundColor: colorsToUse[1] }} onClick={() => setEdit(!edit)} className={styles.edit}>
              Edit Name
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
            <button style={{ backgroundColor: colorsToUse[1] }} onClick={editAcc} className={styles.edit}>
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
