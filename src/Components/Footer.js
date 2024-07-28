import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/style_footer.css';

export const Footer = () => {
  return (
    <section id="footer">
      <div className="footer-content">
        <p>Copyright &copy; {new Date().getFullYear()} WAPA - Simone Lutero - All Rights Reserved.</p>
        <Link to="/PrivacyPolicesScreen"><a id="prp">Privacy Policy</a></Link>
      </div>
    </section>
  );
};

export default Footer;
