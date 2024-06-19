import React, {useEffect, useRef, useState} from "react";
import RecaptchaComponent from '../Components/RecaptchaComponent';

export default function Registration() {
    const [isAgreeChecked, setIsAgreeChecked] = useState(false);
    const [isPermissionChecked, setIsPermissionChecked] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }
    };

    const [errors, setErrors] = useState({});

    const handleAgreeChange = (event) => {
        setIsAgreeChecked(event.target.checked);
    };

    const handlePermissionChange = (event) => {
        setIsPermissionChecked(event.target.checked);
    };

    const [showThankYou, setShowThankYou] = useState(false);


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
                window.grecaptcha.execute(siteKey, {action: 'submit'}).then((token) => {
                    setRecaptchaToken(token);
                });
            });
        });
    }, [siteKey]);

    const generateRecaptchaToken = () => {
        return window.grecaptcha.execute(siteKey, {action: 'submit'}).then((token) => {
            setRecaptchaToken(token);
            return token;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
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

        const formData = new FormData(event.target);
        const agreeValue = isAgreeChecked ? 1 : 0;
        const permissionValue = isPermissionChecked ? 1 : 0;
        formData.set('recaptchaToken', recaptchaToken);

        formData.set('chkAgree', agreeValue);
        formData.set('chkPermission', permissionValue);

        // Validate fields
        if (!formData.get('firstName')) {
            newErrors.firstName = 'First Name is required';
        }
        if (!formData.get('lastName')) {
            newErrors.lastName = 'Last Name is required';
        }
        if (!formData.get('DOB')) {
            newErrors.DOB = 'Date of Birth is required';
        }
        if (!formData.get('gender')) {
            newErrors.gender = 'Gender is required';
        }
        if (!formData.get('relationshipWithVictim')) {
            newErrors.relationshipWithVictim = 'Relationship to Victim is required';
        }
        if (!formData.get('phone')) {
            newErrors.phone = 'Phone is required';
        }
        if (!formData.get('email')) {
            newErrors.email = 'Email is required';
        }
        if (!formData.get('programsReferredTo')) {
            newErrors.programsReferredTo = 'Program(s) being referred to is required';
        }
        if (!formData.get('referredBy')) {
            newErrors.referredBy = 'Referral Source Name is required';
        }
        if (!formData.get('intakePreference')) {
            newErrors.intakePreference = 'Intake preference is required';
        }

        if (!isAgreeChecked) {
            newErrors.isAgreeChecked = 'You must agree to follow through with the remainder of your intake process.';
        }

        if(!isPermissionChecked){
            newErrors.isPermissionChecked = 'You must give permission to communicate with your referral source.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PREFIX}/upload-client`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Registered successfully!');
                setShowThankYou(true);
            } else {
                alert('Failed to submit form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <main className='bg-white p-4'>
            <h3 className="text-3xl font-semibold my-10">Registration</h3>
            <p className="pb-4 text-2xl">Please watch our short orientation video before deciding to continue to the registration form</p>
            <div className="m-auto">
                <iframe className="m-auto w-full max-w-80 h-[450px] md:max-w-[750px]" src="https://player.vimeo.com/video/801752925?title=0&amp;muted=1&amp;autoplay=1&amp;autopause=0&amp;loop=1&amp;app_id=122963" width="426" height="340" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="Bridges 2 Success Orientation" data-ready="true"></iframe>
            </div>
            <p className="pb-4 font-semibold mt-10">Notes</p>
            <ul className='pl-6 pb-4'>
                <li className='list-disc'>You will immediately receive an e-mail which provides proof of enrollment.</li>
                <li className='list-disc'>You will immediate receive a second e-mail titled 'Enrollment - Next Steps' which will provide you with the next steps.
                    <ul className='pl-6'>
                        <li className="list-circle">​​​​​​​If you chose to complete your intake in person, we will reach out to you within two business days.</li>
                        <li className="list-circle">If you chose to complete your intake online: within two business days of receiving your intake payment, you will receive the intake documents via Adobe Sign. Please fill out the packet completely (be sure to read through the assessment questions and change the drop down answers to the appropriate answer to ensure that you are accurately assessed) and then submit. Once you have completely filled out the packet there will be a blue banner across the bottom of the screen which will say Adobe Sign Click to Sign: clicking this will submit the documents and you will immediately receive a copy.</li>
                        <ul className='pl-6'>
                            <li className="list-square">Within two business days of us receiving your completed documents you will receive another e-mail, titled 'Enrollment - Next Steps 2' from office@bridges2success.com, asking for you to choose your group and start date. We ask that you start within two weeks. This e-mail will also include office hours for you to pick up your workbook and get answers to any questions you may have.</li>
                        </ul>
                    </ul>
                </li>
            </ul>
            <p className="pb-4 font-semibold">If at any time you do not see the e-mails, please check your spam/junk folder.</p>

            <p className="pb-6">Please keep in mind that you are welcome to e-mail/call us with any questions, at any time, and/or attend an informational session which will be listed in each e-mail that you receive from our office.</p>

            <p>We highly recommend saving our contact information in your phone so that we can communicate easily:</p>
            <p className="py-1 "><b>Phone:</b> 1 (800) 509-0794</p>
            <p className="py-1 pb-6"><b>E-mail:</b> office@bridges2success.com</p>
            <p className="pb-4 font-semibold">Please continue to the registration form and we look forward to working with you!</p>
            <form className="m-auto max-w-[600px]" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>First Name*</label>
                        <input name="firstName" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="First Name"/>
                        {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}

                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Last Name*</label>
                        <input name="lastName" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Last Name"/>
                        {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}

                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>DOB*</label>
                        <input name="DOB" type="date" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Date of Birth"/>
                        {errors.DOB && <span className="text-red-500">{errors.DOB}</span>}
                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Gender*</label>
                        <select name="gender" className="block w-full bg-[#DAEDFF] border-2 p-2 border-black mt-2 focus-visible:outline-[#FF4040]">
                            <option value="">Choose an option</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && <span className="text-red-500">{errors.gender}</span>}
                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Relationship to Victim*</label>
                        <select name="relationshipWithVictim" className="block w-full bg-[#DAEDFF] border-2 p-2 border-black mt-2 focus-visible:outline-[#FF4040]">
                            <option value="">Choose an option</option>
                            <option value="Intimate Partner">Intimate Partner</option>
                            <option value="Family Member">Family Member</option>
                            <option value="Stranger">Stranger</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.relationshipWithVictim && <span className="text-red-500">{errors.relationshipWithVictim}</span>}
                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Preferred Pronouns</label>
                        <input name="preferredPronouns" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Pronouns"/>
                    </div>
                </div>
                <input name="streetAddress1" type="hidden" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" value=""/>
                <input name="streetAddress2" type="hidden" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" value=""/>
                <div className="flex mb-4">
                    <div className="w-full pr-2">
                        <label>Street Address</label>
                        <input name="streetAddress1" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"/>
                    </div>
                </div>
                <div className="flex mb-4">
                    <div className="w-full pr-2">
                        <label>Street Address Line 2</label>
                        <input name="streetAddress2" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"/>
                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>City</label>
                        <input name="city" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="City"/>
                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>State</label>
                        <input name="state" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Region/State/Province"/>
                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Zip code</label>
                        <input name="zipCode" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Postal / Zip code"/>
                    </div>

                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Phone*</label>
                        <input name="phone" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Phone"/>
                        {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                    </div>

                    <div className="w-full md:w-1/2 pr-2">
                        <label>Email*</label>
                        <input name="email" type="email" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Email"/>
                        {errors.email && <span className="text-red-500">{errors.email}</span>}

                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Program(s) being referred to*</label>
                        <input name="programsReferredTo" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Program(s)"/>
                        {errors.programsReferredTo && <span className="text-red-500">{errors.programsReferredTo}</span>}

                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Referral Source Name*</label>
                        <input name="referredBy" type="text" className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]" placeholder="Name of PO, Judge, etc"/>
                        {errors.referredBy && <span className="text-red-500">{errors.referredBy}</span>}
                    </div>
                </div>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Intake preference*</label>
                        <select name="intakePreference" className="block w-full bg-[#DAEDFF] border-2 p-2 border-black mt-2 focus-visible:outline-[#FF4040]">
                            <option value="">Please select</option>
                            <option value="Online">Online</option>
                            <option value="In Person">In Person</option>
                        </select>
                        {errors.intakePreference && <span className="text-red-500">{errors.intakePreference}</span>}
                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                        <label>Location</label>
                        <select name="location" className="block w-full bg-[#DAEDFF] border-2 p-2 border-black mt-2 focus-visible:outline-[#FF4040]">
                            <option value="">Choose an office</option>
                            <option value="Salem">Salem</option>
                            <option value="Wilsonville">Wilsonville</option>
                            <option value="Clackamas">Clackamas</option>
                            <option value="Portland">Portland</option>
                            <option value="Scappoose">Scappoose</option>
                            <option value="Gresham">Gresham</option>
                            <option value="Bend">Bend</option>
                            <option value="Beaverton">Beaverton</option>
                            <option value="Hillsboro">Hillsboro</option>
                            <option value="Tillamook">Tillamook</option>
                        </select>
                    </div>
                </div>
                <p className="italic pb-5">Please note that completing your intake online requires the use of a computer to complete the necessary paperwork, it can not be completed on your phone or tablet.</p>
                <div className="flex mb-4">
                    <div className="w-full pr-2">
                        <label>Additional Notes</label>
                        <textarea name="note" type="text" placeholder="Type your message here..." className="block w-full bg-[#DAEDFF] border-2 p-1 border-black mt-2 focus-visible:outline-[#FF4040]"></textarea>
                    </div>
                </div>
                <p className="italic pt-5">Please upload a clear photo of your face. (Please note that your referral source will be able to see this photo) </p>
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="relative flex flex-col items-center justify-center w-full h-16 border border-black cursor-pointer bg-[#DAEDFF]"
                    >
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            {selectedFile ? (
                                <div className="relative w-full h-full">
                                    <img src={selectedFile} alt="Selected" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={removeSelectedFile}
                                        className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 rounded-full p-1"
                                        style={{ fontSize: '13px', width: '26px', height: '26px' }}
                                    >
                                        X
                                    </button>
                                </div>
                            ) : (
                                <p className="mb-2 mt-3 text-base text-[#373B4D] italic leading-10">
                                    Upload Photo <span className="text-2xl font-semibold">+</span>
                                </p>
                            )}
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            name="pictureFile"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}

                        />
                    </label>
                </div>
                <p className="text-left italic pt-5">
                    <input type="checkbox" name="chkAgree"
                           checked={isAgreeChecked}
                           onChange={handleAgreeChange}
                           className="mr-4 h-auto"
                    />I agree to follow through with the remainder of my intake process when I receive the next steps
                    {errors.isAgreeChecked && <span className="text-red-500 text-sm ml-2">{errors.isAgreeChecked}</span>}
                </p>
                <p className="text-left italic pt-5">
                    <input
                        type="checkbox"
                        name="chkPermission"
                        checked={isPermissionChecked}
                        onChange={handlePermissionChange}
                        className="mr-4 h-auto"
                    />I give you permission to communicate with my referral source about my case.
                </p>
                {errors.isPermissionChecked && <span className="text-red-500 text-sm ml-2">{errors.isPermissionChecked}</span>}
                <p className="text-left text-sm italic pl-6">*This authorization is good for 60 days.</p>
                <div className="text-center my-10">
                    <RecaptchaComponent onVerify={setRecaptchaTokenV2} />
                    {errors.captcha && <span className="text-red-500">{errors.captcha}</span>}
                </div>
                <div className="text-center my-10">
                    <button type="submit" className="bg-[#373B4D] text-xl text-white py-3 px-8 text-center m-auto">Submit</button>
                </div>

            </form>
            {showThankYou && <p className='text-lg font-semibold mt-4 text-center text-green-600'>Your registration has been submitted! Please check your email for confirmation</p>}

        </main>

    );
}
