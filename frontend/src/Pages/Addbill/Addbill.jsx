import React, { useState } from "react";
import Styles from "./Addbill.module.css";
import axios from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addbill = () => {
  const [formData, setFormData] = useState({
    billNumber: "",
    amount: "",
    category: "",
    toBePaidOn: "",
  });
 
  const userId = localStorage.getItem("userId");

  const addBill = async (req, res) => {
    toast.dismiss();
    try {
      const res = await axios.post("/add-bill/" + userId, formData);
      if (res.data.allFieldsRequired) {
        toast.error(res.data.allFieldsRequired);
      } else if (res.data.AddedSuccessfully) {
        toast.success(res.data.AddedSuccessfully);
      }

      console.log(res.data);
      console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBill(formData);
  };

  return (
    <div> 
      <form className={Styles.form}>
        <div className={Styles.addbill}>
          <h3 className={Styles.heading}>Add Bill</h3>

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
            <button onClick={handleSubmit}>Add Bill</button>
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

export default Addbill;
