import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./EditBill.module.css";
import axios from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useColour } from "../../Context/UseContext";

const EditBill = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    billNumber: "",
    amount: "",
    category: "",
    toBePaidOn: "",
  });

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

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get(`/get-bill/${userId}/${billId}`);
        if (response.data && response.data.bill) {
          const billData = response.data.bill;
          setFormData({
            billNumber: billData.billNumber || "",
            amount: billData.amount || "",
            category: billData.category || "",
            toBePaidOn: billData.toBePaidOn ? billData.toBePaidOn.slice(0, 10) : "",
          });
        }
      } catch (error) {
        console.error("Error fetching bill data:", error);
        toast.error("Error fetching bill data.");
      }
    };

    if (billId) {
      fetchBillData();
    }
  }, [billId, userId]);

  const userName = localStorage.getItem("name");

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await axios.put(`/edit-bill/${userId}/${billId}`, formData);
      if (res.data.success) {
        toast.success("Bill updated successfully!");
        navigate(`/finance/${userName}/view-bill`); // Redirect to the bills page after successful update
      }
    } catch (error) {
      toast.error("Error updating bill.");
      console.error(error);
    }
  };

  return (
    <div>
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.addbill}>
          <h3 className={Styles.heading}>Edit Bill</h3>

          <div className={Styles.formGroup}>
            <label htmlFor="billNumber">Bill Number:</label>
            <input
              type="text"
              id="billNumber"
              name="billNumber"
              value={formData.billNumber}
              onChange={(e) =>
                setFormData({ ...formData, billNumber: e.target.value })
              }
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="amount">Amount:</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="toBePaidOn">Bill Due Date:</label>
            <input
              type="date"
              id="toBePaidOn"
              name="toBePaidOn"
              value={formData.toBePaidOn}
              onChange={(e) =>
                setFormData({ ...formData, toBePaidOn: e.target.value })
              }
            />
          </div>

          <div className={Styles.formGroup}>
            <button style={{ backgroundColor: colorsToUse[1] }} type="submit">
              Update Bill
            </button>
          </div>
        </div>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        hideProgressBar
      />
    </div>
  );
};

export default EditBill;
