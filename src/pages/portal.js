import React, {useEffect, useState} from 'react';
import RecaptchaComponent from '../Components/RecaptchaComponent';

export default function Portal() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

    const [errors, setErrors] = useState({});

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaTokenV2, setRecaptchaTokenV2] = useState(null);

    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;


    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('authenticated_portal');
        if (isAuthenticated) {
            setAuthenticated(true);
        }
    }, []);

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
        formDataObj.set('recaptchaToken', recaptchaToken);
        formDataObj.set('password', password);

        const plainFormData = {};
        formDataObj.forEach((value, key) => {
            plainFormData[key] = value;
        });

        const recaptchaVerify = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PREFIX}/verify-portal-access`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
            body: JSON.stringify(plainFormData)
      });

      const result = await recaptchaVerify.json();
      if (result.success) {
          setAuthenticated(true);
          sessionStorage.setItem('authenticated_portal', 'true');
          return;
      } else {
          alert('Incorrect password');
      }
  };

  if (!authenticated) {
    return (
    
      <div className='h-screen bg-[#daedff]  m-auto fixed top-0 w-full left-0'>
        <div className='fixed top-1/3 left-1/2 -translate-x-1/2'>
        <div className="text-5xl text-center text-[#0c3c60] font-medium">Guest Area</div>
        <form onSubmit={handleSubmit} className="p-4 text-center">
          <div className="text-[#0c3c60] text-base font-medium">Please enter the password below.</div>    
            <input
              placeholder="Password" 
                type="password"
                id="password" 
                className='w-56 py-1 bg-[#ecf3c8] mt-6 border-b border-[#6ea4ca]'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center my-10">
                <RecaptchaComponent onVerify={setRecaptchaTokenV2} />
            </div>

            {errors.captcha && <div className="text-center my-10"><span className="text-red-500">{errors.captcha}</span></div>}
            <button type="submit" className='bg-[#1b99e8] my-6 w-56 py-4 text-white block m-auto'>Go</button>
        </form>
        </div>
      </div>        
    );
}


    
    return (
        
    <main className='bg-white p-4'>
        <h3 className="text-7xl text-center my-10 text-[#062134] font-light"  >Zoom Links &<br/>Worksheet Downloads</h3>
        <p className="pb-4 pt-4 text-center">You can only attend your assigned group unless you have received permission to join a different group. Participants not on the roster will not be accepted into the session without written approval</p>
        <h3 className="text-3xl font-semibold my-2">PAYMENT INFO</h3>
        <p className='pb-4'>Please note that payments are not applied to your account instantaneously. They must be processed. We make every effort to process them the same day but note that they could take up to 48 hours to process. There is no need to e-mail/call to ensure that we got your payment, even if you have been told that you must pay prior to group as we can see that you have made it even if it hasn’t been entered into the system yet. </p>
        <p>You may make payment online the following ways (please do so prior to joining the group): </p>
        <ul className='pl-6 pb-4'>
            <li className='list-disc'><span className='font-semibold'>CashApp:</span> $bridges2success12 (you can send to our cashtag, office@bridges2success.com)             </li>
            <li className='list-disc'><span className='font-semibold'>Venmo:</span> @bridges2success12 (if it asks you for a phone number to verify use 4893) </li>
            <li className='list-disc'>E-Mail us and ask that we send you a square <span className='font-semibold'>invoice </span>(free) </li>
        </ul>
        <p className="pb-4">If you pay your group fee with someone else's account, please notate that it is for you. Otherwise, we do not know where to credit that payment. </p>
        <p className="pb-4">If you must pay in person please let me know and I can tell you when I will be in the office so that you may stop by to make payment.  </p>
        <p className="pb-4">We now have a system which will send you your receipts for payments and for group attendance. This will come from noreply@programpayments.com so please save this in your address book. Also, please note that our system counts you as absent until attendance is recorded so on your payment receipts it may show an absence, that you do not actually have. Please pay attention to your group attendance receipts for the accurate information.</p>
        
        <h3 className="text-3xl font-semibold my-2">VIRTUAL GROUP REQUIREMENTS</h3>
        <ul className='pl-6 pb-4'>
            <li className='list-disc'>You must be alone. If there is any chance that someone may walk in on you, you must be wearing headphones. However, even if wearing headphones, you still must be alone. </li>
            <li className='list-disc'>You must be prepared for group. Make sure you have your workbook, pens, drink, etc. o Homework should be completed outside of group and be ready to present when you log on. </li>
            <li className='list-disc'>You must have your video on, and be clearly visible, at all times. </li>
            <li className='list-disc'>You must be sitting, in a quiet setting, and be actively engaged in group. </li>
            <li className='list-disc'>You will not be getting up and walking around during group. </li>
            <li className='list-disc'>Whenever possible, please use the restroom before or after group. However, if you must go during group, you must tell your facilitator and leave your device. </li>
            <li className='list-disc'>You must be fully clothed, and your clothing must be appropriate (no clothing that promotes drugs, alcohol, violence, or that is abusive/derogatory). </li>
            <li className='list-disc'>Your background must be visible (no digital backgrounds) and appropriate (nothing in the background that promotes drugs, alcohol, violence, or that is abusive/derogatory). </li>
            <li className='list-disc'>At no time will you be in a moving vehicle, whether you are the one driving or not. </li>
            <li className='list-disc'>At no time will you record any portion of group;  this includes recording audio, visual, taking screen shots, etc. Confidentiality is essential for all participants.</li>

        </ul>
        <p className='pl-6 pb-4 font-semibold'> Violation of any of the above requirements will result in removal from group, reversal of credit for attendance, and may result in non-compliance from the program. </p>
        <h3 className="text-3xl font-semibold my-2 pb-8">ZOOM LINKS<span className='text-sm font-normal'> (If you have trouble with the links; you can go to zoom, click join meeting, and then enter the meeting ID, followed by the password)</span></h3>
        <p className='font-semibold text-xl pb-3'>Homework Help Sessions (via zoom)</p>

        <p className='font-semibold pb-3'>MENS</p>
 
<p className='pb-3'>David is inviting you to a scheduled Zoom meeting.</p>
 
<p className='pb-3'>Topic: Men's Homework Assistance Group<br/>
Time: Saturdays at 2:00 PM</p>
 
<p className='pb-3'>Join Zoom Meeting<br/>
<a href="https://us02web.zoom.us/j/83083339935?pwd=aFZJRDRtOHlzZTA1d2l4bjBqOHFVdz09" target="_blank" className='underline'>https://us02web.zoom.us/j/83083339935?pwd=aFZJRDRtOHlzZTA1d2l4bjBqOHFVdz09</a></p>

<p className='pb-3'>Meeting ID: 830 8333 9935<br/>
Passcode: 795541</p>

<p className='font-semibold pb-3'>WOMENS</p>
 
<p className='pb-3'>Camille is inviting you to a scheduled Zoom meeting.</p>
 
<p className='pb-3'>Topic: Homework Assistance (WOMENS)<br/>
Time: Saturdays at 02:00 PM Pacific Time (US and Canada)</p>
 
<p className='pb-3'>Join Zoom Meeting<br/>
<a href="https://us02web.zoom.us/j/83086749765?pwd=WUVWcmYxWnIxZEpPZEFta05SYWRidz09" target="_blank" className='underline'>https://us02web.zoom.us/j/83086749765?pwd=WUVWcmYxWnIxZEpPZEFta05SYWRidz09</a></p>

<p className='pb-3'>Meeting ID: 830 8674 9765<br/>
Passcode: 409125</p>

<p className='mt-20 text-base'>Your program will typically not start on Module one so be sure to download what you need for the program's current week**Open in Adobe Acrobat to be able to use a fillable version of your Worksheet**</p>

    </main>
        
    );
}
