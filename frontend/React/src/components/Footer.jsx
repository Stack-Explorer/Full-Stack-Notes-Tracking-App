import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer footer-8 footer-center p-4 bg-base-300 text-base-content">
      <p>Copy ⓒ {year}</p>
    </footer>
  );
}

export default Footer;