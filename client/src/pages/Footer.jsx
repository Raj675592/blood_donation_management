import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {
    const footerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Trigger the entrance animation once the footer scrolls into view
    useEffect(() => {
        const node = footerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <footer
            className={`footer ${isVisible ? 'footer--visible' : ''}`}
            ref={footerRef}
        >
            {/* Scrolling ECG line — the heartbeat that opens every Vitals surface */}
            <div className="footer-ecg" aria-hidden="true"></div>

            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                                    <path
                                        d="M12 2C12 2 5 11.6 5 16.2A7 7 0 0 0 19 16.2C19 11.6 12 2 12 2Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <span className="logo-text">BloodBank</span>
                        </div>

                        <p className="footer-description">
                            Saving lives through blood donation.
                        </p>

                        <p className="footer-pulse-stat">
                            <span className="pulse-dot" aria-hidden="true"></span>
                            A donor is needed every <strong>2 seconds</strong>
                        </p>

                        <Link to="/signup" className="footer-cta">
                            <span className="footer-cta__ring" aria-hidden="true"></span>
                            <svg
                                className="footer-cta__icon"
                                viewBox="0 0 24 24"
                                width="17"
                                height="17"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 21s-7.5-4.6-9.5-9.1C1.2 8.6 3 5.5 6.4 5.5c2 0 3.4 1.1 4.1 2.2.7-1.1 2.1-2.2 4.1-2.2 3.4 0 5.2 3.1 3.9 6.4C19.5 16.4 12 21 12 21z" />
                            </svg>
                            Donate Now
                        </Link>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li>
                                    <Link to="/">
                                        <svg
                                            className="link-icon"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M3 11.5 12 4l9 7.5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M5.5 10v10h13V10"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup">
                                        <svg
                                            className="link-icon"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M12 21s-7-4.4-9-8.6C1.4 9 3 6 6.2 6c1.9 0 3.2 1 3.8 2 .6-1 1.9-2 3.8-2C17 6 18.6 9 21 12.4 19 16.6 12 21 12 21z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>Become a Donor</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login">
                                        <svg
                                            className="link-icon"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M14.5 3.5h4a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M10 16.5 14.5 12 10 7.5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M14.5 12H3"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>Sign In</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-divider">
                    <span className="footer-divider__pulse" aria-hidden="true"></span>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            &copy; 2026 BloodBank. All rights reserved. Made with{' '}
                            <span className="beating-heart" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                    <path d="M12 21s-7.5-4.6-9.5-9.1C1.2 8.6 3 5.5 6.4 5.5c2 0 3.4 1.1 4.1 2.2.7-1.1 2.1-2.2 4.1-2.2 3.4 0 5.2 3.1 3.9 6.4C19.5 16.4 12 21 12 21z" />
                                </svg>
                            </span>{' '}
                            for saving lives.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;