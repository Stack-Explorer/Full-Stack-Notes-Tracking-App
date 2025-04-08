import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const WelcomeToast = () => {

    const getTime = new Date().getHours();

    let message;

    const { username } = location.state || {};

    console.log(`Username is : ${username} `);

    useEffect(() => {
        wisher(username)
    })

    const wisher = (username) => {
        if (getTime >= 12) {
            message = `Hello ${username} ! Good Afternoon 🌞`;
            toast(message, 7000);
        } else if (getTime >= 18) {
            message = `Hello ${username} ! Good Evening 🌅`;
            toast(message, 7000);
        } else if (getTime > 24) {
            message = `Hello ${username} ! Good Morning ☀️`;
            toast(message, 7000);
        }
    }

  return (
      <>
      
      </>
  )
}

export default WelcomeToast