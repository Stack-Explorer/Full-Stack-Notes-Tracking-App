// About.js
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-semibold">About Notes Tracker</h1>
        <p className="mt-4 text-lg">
          Notes Tracker is a simple and efficient note-taking app designed to help you keep your ideas, tasks, and notes organized.
          Whether you're a student, professional, or anyone who needs a place to jot things down, this app makes it easy to manage your thoughts.
        </p>
        <h3 className="mt-6 text-2xl">Features:</h3>
        <ul className="mt-4 list-disc list-inside space-y-2 text-lg">
          <li>Create, edit, and delete notes with ease.</li>
          <li>Highlight search results for easy navigation.</li>
          <li>Personalized dark and light themes.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
