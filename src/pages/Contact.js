import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PREFIX}/store-contact-us-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
      </div>
      <div className="text-center my-10"><button type="submit" className="bg-[#373B4D] text-xl text-white py-3 px-8 text-center">Submit</button></div>
      {showThankYou && <p className='text-lg font-semibold mt-4 text-center text-green-600'>Thank you!</p>}
    </form>
    </main>
  );
}
