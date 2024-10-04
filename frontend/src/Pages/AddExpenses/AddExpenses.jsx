import React, { useState } from 'react';
import Styles from './AddExpenses.module.css';
import axios from '../../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddExpenses = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const userId = "66fe6e6d1ac13bb15e0adb5b"; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      userId,
      category,
      amount,
      date,
    };

    try {
      toast.dismiss();

      const response = await axios.post('/add-expenses', expenseData);

      if (response.data.allFieldsRequired) {
        toast.error(response.data.allFieldsRequired);  
      } else if(response.data.userIdNotFound) {
        toast.error(response.data.userIdNotFound);  
      }

      else if(response.data.AddedSuccessfully) {
        toast.success(response.data.AddedSuccessfully);  
      }

    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to add expense');
    }
  };

  

  return (
    <>
      <form className={Styles.form} onSubmit={handleSubmit}>
        <h2 className={Styles.title}>Add Expenses</h2>
        <div className={Styles.field}>
          <label className={Styles.label} htmlFor="category">Category</label>
          <select
            className={Styles.select}
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)} 
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className={Styles.field}>
          <label className={Styles.label} htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="Amount"
            className={Styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
        <div className={Styles.field}>
          <label className={Styles.label} htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className={Styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)} 
            
          />
        </div>

        <button className={Styles.button} type="submit">Add</button>
      </form>
      
      <ToastContainer position="top-center" />
    </>
  );
};

export default AddExpenses;
