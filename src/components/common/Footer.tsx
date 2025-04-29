import React from 'react';
import { motion } from 'framer-motion';
import '../../assets/styles/common/Footer.scss';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60 }}
      className="footer"
    >
      <p>© {new Date().getFullYear()} Employee Management System. All rights reserved.</p>
    </motion.footer>
  );
};

export default Footer;
 