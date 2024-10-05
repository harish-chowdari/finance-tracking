import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import styles from './Profile.module.css';

const Profile = () => {
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get(`/user-data/${userId}`);
                setUser(response.data);
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
                <div className={styles.infoItem}>
                    <h3 className={styles.label}>User Name:</h3>
                    <p className={styles.value}>@{user.userData.name}</p>
                </div>
                <div className={styles.infoItem}>
                    <h3 className={styles.label}>Email:</h3>
                    <p className={styles.value}>{user.userData.email}</p>
                </div>
                <div className={styles.infoItem}>
                    <h3 className={styles.label}>Expenses Count:</h3>
                    <p className={styles.value}>{user.userData.expenses.length}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
