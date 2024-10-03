import React from 'react';
import Styles from './AddExpenses.module.css';

const AddExpenses = () => {
  return (
    <form className={Styles.form}>
      <h2 className={Styles.title}>Add Expenses</h2>
      <div className={Styles.field}>
        <label className={Styles.label} htmlFor="category">Category</label>
        <select className={Styles.select} id="category">
          <option>Select category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Personal</option>
          <option>Education</option>
          <option>Health</option>
          <option>Other</option>
        </select>
      </div>
      <div className={Styles.field}>
        <label className={Styles.label} htmlFor="amount">Amount</label>
        <input
          type='number'
          id="amount"
          placeholder='Amount'
          className={Styles.input}
          required
        />
      </div>
      <div className={Styles.field}>
        <label className={Styles.label} htmlFor="date">Date</label>
        <input
          type='date'
          id="date"
          className={Styles.input}
          required
        />
      </div>
      
      <button className={Styles.button} type="submit">Add</button>
    </form>
  );
}

export default AddExpenses;
