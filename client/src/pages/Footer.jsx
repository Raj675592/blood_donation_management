import {Link} from 'react-router-dom';
import '../css/Footer.css';

function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">🩸</span>
                            <span className="logo-text">BloodBank</span>
                        </div>
                        <p className="footer-description">
                            Saving lives through blood donation.
                        </p>

                    </div>
                    
                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                               
                                <li><Link to="/signup">Become a Donor</Link></li>
                                <li><Link to="/login">Sign In</Link></li>
                            </ul>
                        </div>
                        

                        

                    </div>
                </div>
                
                <div className="footer-divider"></div>
                
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            &copy; 2025 BloodBank. All rights reserved. Made with ❤️ for saving lives.
                        </p>
                       
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;