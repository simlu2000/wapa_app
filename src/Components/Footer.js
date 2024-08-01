import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/style_footer.css';

const Footer = () => {
  return (
    <section id="footer">
      <div className="footer-content">
        <p>Copyright &copy; {new Date().getFullYear()} WAPA - Simone Lutero - All Rights Reserved.</p>
        <Link id="prp" to="/PrivacyPolicesScreen">Privacy Policy</Link>
      </div>
    </section>
  );
};

export default Footer;
