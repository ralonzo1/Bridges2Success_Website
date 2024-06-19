import React, {useEffect, useState} from 'react';
import RecaptchaComponent from '../Components/RecaptchaComponent';

export default function Contact() {

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const [errors, setErrors] = useState({});

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaTokenV2, setRecaptchaTokenV2] = useState(null);

    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        const loadRecaptchaScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                script.async = true;
                script.defer = true;
                script.onload = resolve;
                document.body.appendChild(script);
            });
        };

        loadRecaptchaScript().then(() => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(siteKey, { action: 'submit' }).then((token) => {
                    setRecaptchaToken(token);
                });
            });
        });
    }, [siteKey]);

    const generateRecaptchaToken = () => {
        return window.grecaptcha.execute(siteKey, { action: 'submit' }).then((token) => {
            setRecaptchaToken(token);
            return token;
        });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const newErrors = {};
      setErrors({});

      const token = await generateRecaptchaToken();

      if (!token) {
          alert("reCAPTCHA token not available");
          return;
      }

      if (!recaptchaTokenV2) {
          newErrors.captcha = 'Please complete the reCAPTCHA.';
          setErrors(newErrors);
          return;
      }

      const formDataObj = new FormData();

      Object.keys(formData).forEach(key => {
          formDataObj.append(key, formData[key]);
      });

      formDataObj.set('recaptchaToken', recaptchaToken);

      const plainFormData = {};
      formDataObj.forEach((value, key) => {
          plainFormData[key] = value;
      });


      if (!formDataObj.get('email')) {
          newErrors.email = 'Email is required';
      }
      if (!formDataObj.get('subject')) {
          newErrors.subject = 'Subject is required';
      }
      if (!formDataObj.get('message')) {
          newErrors.message = 'Message is required';
      }
      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
      }

      try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PREFIX}/store-contact-us-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plainFormData)
      });
      if (response.ok) {
        // Handle success
        setShowThankYou(true);
        setFormData({
          email: '',
          subject: '',
          message: ''
        });

      } else {
        // Handle error
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <main className="bg-white p-4">
      <h3 className="text-3xl font-semibold my-10">Contact Us</h3>
      <form className="m-auto max-w-[500px]" onSubmit={handleSubmit}>
      <p className="py-1">Phone (toll free): 1 (800) 509-0794</p>
      <p className="py-1">Fax (toll free): 1 (800) 507-4708</p>
      <p className="py-1">
        Mailing Address:
        <br />
        PO Box 15118
        <br />
        Salem, OR 97309
      </p>
      <p className="py-1">E-mail: office@bridges2success.com</p>
      <p className="py-1">... or submit the contact form below</p>

      <div className="w-full mb-4">
        <label>Email*</label>
        <input
          name="email"
          type="email"
          placeholder="e.g., email@example.com"
          className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"
          value={formData.email}
          onChange={handleChange}
        />
          {errors.email && <span className="text-red-500">{errors.email}</span>}

      </div>
      <div className="w-full mb-4">
        <label>Subject*</label>
        <input
          name="subject"
          type="text"
          placeholder="e.g., Support"
          className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"
          value={formData.subject}
          onChange={handleChange}
        />
          {errors.subject && <span className="text-red-500">{errors.subject}</span>}

      </div>
      <div className="w-full mb-4">
        <label>Your message</label>
        <textarea
          name="message"
          placeholder="Enter text here"
          className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"
          value={formData.message}
          onChange={handleChange}
         />
          {errors.message && <span className="text-red-500">{errors.message}</span>}

      </div>
          <RecaptchaComponent onVerify={setRecaptchaTokenV2} />
          <div className="text-center my-10">
              {errors.captcha && <span className="text-red-500">{errors.captcha}</span>}
          </div>
      <div className="text-center my-10"><button type="submit" className="bg-[#373B4D] text-xl text-white py-3 px-8 text-center">Submit</button></div>
      {showThankYou && <p className='text-lg font-semibold mt-4 text-center text-green-600'>Thank you!</p>}
    </form>
    </main>
  );
}
