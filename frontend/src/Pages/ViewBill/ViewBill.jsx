import React, { useEffect } from "react";
import styles from "./ViewBill.module.css";
import axios from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useColour } from "../../Context/UseContext";

const ViewBill = () => {
    const [bill, setBill] = useState([]);

    const userId = localStorage.getItem("userId");

    const { tritanopia, protanopia, deuteranopia, monochromacy } = useColour();
    let colorsToUse;

    if (localStorage.getItem("disease") === "protanopia") {
        colorsToUse = protanopia.use;
    } else if (localStorage.getItem("disease") === "tritanopia") {
        colorsToUse = tritanopia.use;
    } else if (localStorage.getItem("disease") === "deuteranopia") {
        colorsToUse = deuteranopia.use;
    } else if (localStorage.getItem("disease") === "monochromacy") {
        colorsToUse = monochromacy.use;
    } else {
        colorsToUse = ["#000000"];
    }

    const getBill = async () => {
        try {
            const response = await axios.get(`/get-bill/${userId}`);
            if (response.data.bills.length === 0) {
                toast.error("No bill found");
            }

            if (!response.data) {
                toast.error("Failed to fetch bill");
                return;
            }

            if (response.status !== 200) {
                toast.error("Failed to fetch bill");
                return;
            }
            setBill(response.data.bills);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const userName = localStorage.getItem("name");

    useEffect(() => {
        getBill();
    }, [userId]);

    return (
        <div className={styles.viewBillPage}>
            <div className={styles.viewBillContainer}>
                <h3 className={styles.title}>View Bill</h3>
            </div>
            {
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead
                            style={{ backgroundColor: colorsToUse[3] }}
                            className={styles.tableHead}
                        >
                            <tr className={styles.tableRow}>
                                <th className={styles.tableHeading}>
                                    Bill Number
                                </th>
                                <th className={styles.tableHeading}>Amount</th>
                                <th className={styles.tableHeading}>
                                    Category
                                </th>
                                <th className={styles.tableHeading}>Due</th>
                                <th className={styles.tableHeading}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.map((bill) => (
                                <tr className={styles.tableRow} key={bill?._id}>
                                    <td className={styles.tableData}>
                                        {bill?.billNumber}
                                    </td>
                                    <td className={styles.tableData}>
                                        {bill?.amount}
                                    </td>
                                    <td className={styles.tableData}>
                                        {bill?.category}
                                    </td>
                                    <td className={styles.tableData}>
                                        {bill?.toBePaidOn.slice(0, 10)}
                                    </td>
                                    <td className={styles.tableData}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                window.location.href = `/finance/${userName}/edit-bill/${bill._id}`;
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {bill.length === 0 && (
                            <p className={styles.noBillContainer}>
                                Your bills are empty yet.
                            </p>
                        )}
                    </table>
                </div>
            }
        </div>
    );
};

export default ViewBill;
