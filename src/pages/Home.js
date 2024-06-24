import React from "react";

export default function Home() {
    return (
    <main className='bg-white p-4'>
      <div className='text-center'>
        <img src ="./images/logo.jpg"  className='m-auto'/>
      </div>
      <div >
          <p ><a href="http://bridges2safety.com" target="_blank" className='font-bold' rel="noreferrer noopener">Bridges 2 Success </a> began its work to end domestic violence in 2000, founded by Lynda Bridges in Albany Oregon, with a clear focus on victim safety through abuse intervention. We believe that every individual is capable of change, and deserving of a life healthy/abuse free relationships. We look forward to partnering with you to help achieve success in all areas of your life. </p>
          <p className='font-bold text-[#062134] mt-6'>
          We offer the following programs, and there is NO waiting period to enroll*:
          </p>
          <p>
          <ul className='pl-6'>
            <li className='list-disc'>Domestic Violence Intervention Program for Men</li>
            <li className='list-disc'>Domestic Violence Intervention Program for Women
              <ul className='pl-6'><li className='list-circle'>We offer the following specialized groups:
              <ul className='pl-6'>
              <li className='list-square'>Family Violence (non-intimate partner)</li>
                <li className='list-square'>Spanish</li>
                <li className='list-square'>Fathers</li>
                </ul>
              </li></ul>
            </li>
            <li className='list-disc'>Domestic violence perpetrator specific parenting program for Fathers</li>
            <li className='list-disc'>Domestic violence perpetrator specific parenting program for Mothers</li>
            <li className='list-disc'>Anger management/aggression control program for men (non-domestic violence)</li>
            <li className='list-disc'>Anger management/aggression control program for women (non-domestic violence)</li>
          </ul>
          
          
          </p>
          <p className='mt-6'>We also offer community service monitoring for a one-time fee of $90.00 (this is discounted to $80.00 if you are concurrently enrolled in any of our other programs).</p>
          <p className='mt-6'>*Program & group availability vary by location</p>
          <p className='font-bold text-[#062134] mt-6'>For your convenience and success, we also feature:</p>
          <ul className='pl-6'>
            <li className='list-disc'>Morning, afternoon, early evening, late evening, and weekend group options.</li>
            <li className='list-disc'>An evidence based, module style curriculum with weekly assignments so participants move through the program toward a timely completion.</li>
            <li className='list-disc'>A multitude of convenient locations around Oregon.</li>
            <li className='list-disc'>Low cost orientations and intake fees to alleviate upfront costs and get started sooner.</li>
            <li className='list-disc'>Online software to  report your progress to your referral sources and attorney in real-time.</li>
            </ul>

            <div className='text-center py-6'><a href="/registration" target="_self"  className='text-2xl underline text-center text-[#820ED8]'>Click here to register now and get instant proof of enrollment</a></div>
      </div>
    </main>
);
}