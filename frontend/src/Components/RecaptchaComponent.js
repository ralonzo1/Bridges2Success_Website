import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaComponent = ({ onVerify }) => {
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (onVerify) {
            onVerify(token);
        }
    };

    return (
        <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY_v2}
            onChange={handleRecaptchaChange}
        />
    );
};

export default RecaptchaComponent;