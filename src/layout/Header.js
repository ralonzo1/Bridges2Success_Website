import React, { useEffect } from 'react';
export default function Header() {
    
    
    const currentPath = window.location.pathname;

    useEffect(() => {
        // Function to toggle the visibility of the dropdown menu
        const toggleDropdown = () => {
            const dropdown = document.getElementById("moreDropdown");
            dropdown.classList.toggle("scale-y-0");
            dropdown.classList.toggle("scale-y-100");
        };

        // Event listener for the "More" button
        document.getElementById("moreButton").addEventListener("click", toggleDropdown);

        // Cleanup function to remove event listener when component unmounts
        return () => {
            document.getElementById("moreButton").removeEventListener("click", toggleDropdown);
        };
    }, []);

  return (

    <header className="bg-white p-4">
    <nav className="bg-transparent p-1 w-full z-10 mt-5 border-t border-b border-[#CCCCCC]">
        <div className="container mx-auto flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-4 text-center m-auto w-full">
            <a href="/" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Home</a>
            <a href="registration" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/registration' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Registration</a>
            <a href="location" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/location' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Locations</a>
            <a href="fees" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/fees' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Fees</a>
            <a href="survivors" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/survivors' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Survivor's Info</a>
            <a href="contact" className={`w-full font-normal text-lg text-center leading-10 ${currentPath === '/contact' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Contact</a>

            <div className="relative inline-block text-left">
                <div>
                <a id="moreButton" type="button" className="inline-flex justify-center w-full text-[#9E9E9E] font-medium text-lg  text-center leading-5 cursor-pointer transition ease-in-out duration-150">
                    More                
                    <svg className="-mr-1 ml-2 h-5 w-5 leading-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </a>
            </div>
            <div id="moreDropdown" className=" absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform duration-300 transform scale-y-0 origin-top-right">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">                
                            <a href="grievance" className={`block w-full font-medium text-lg text-center leading-10 ${currentPath === '/grievance' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Grievance Policy</a>
                            <a href="attendance" className={`block w-full font-medium text-lg text-center leading-10 ${currentPath === '/attendance' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Attendance Policy</a>
                            <a href="portal" className={`block w-full font-medium text-lg text-center leading-10 ${currentPath === '/portal' ? 'text-[#0c3c60]' : 'text-[#9E9E9E]'}`}>Program Portal</a>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
        </nav>

    </header>
  );
}