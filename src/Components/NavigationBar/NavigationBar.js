import React from 'react';
import './NavigationBar.css';

const NavigationBar = () => {
  return(
    <div className="navigation-bar">
      <ul className="navigation-list">
        <img src={require('./Images/trello.png')} alt=""/>
        <li>Home</li>
        <li>Contact Us</li>
        <li>About Us</li>
        <li>Privacy Policy</li>
      </ul>
    </div>
  );
}
export default NavigationBar;