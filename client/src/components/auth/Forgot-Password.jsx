import React, { useState, useCallback } from 'react';
import { useNavigate,  } from 'react-router-dom';
import "../../css/Forgot-Password.css";
import { useToast } from '../../contexts/ToastContext';
function ForgotPassword(){
    const navigate = useNavigate();
    const [email, setEmail] =useState('');
    const [message] = useState('If an account with that email exists, a password reset link has been sent.');
    const { showToast } = useToast();



    const handleSubmit = useCallback(async (e) => {
       e.preventDefault();
       try{
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        const response = await fetch(`${API_BASE_URL}/api/auth/requestPasswordReset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            showToast(data.message || message, 'success');
            setEmail('');
        } else {
            showToast(data.message || message, 'info');
        }
       } catch (error) {
        showToast(message, 'info');
       }
       

    }, [email, message, showToast]);
    return(
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <label htmlFor="email">Enter your email address:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Request Password Reset</button>
            </form>

        </div>

    );  
};
export default ForgotPassword;