import React, { useEffect } from "react";

const Greetings = () => {
  const username = localStorage.getItem("username");
  const currentHour = new Date().getHours();

  // Function to determine the appropriate greeting
  const getGreeting = () => {
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good evening";
    } else {
      return null; // No greeting after 9 PM
    }
  };

  useEffect(() => {
    const lastGreetedHour = sessionStorage.getItem("lastGreetedHour");
    const greeting = getGreeting();

    if (greeting && username) {
      if (lastGreetedHour !== String(currentHour)) {
        alert(`${greeting}, ${username}!`);
        sessionStorage.setItem("lastGreetedHour", currentHour); // Update the last greeted hour
      }
    }
  }, [currentHour]); // Runs every time the hour changes

  return null; // No UI needed, just executes the greeting logic
};

export default Greetings;