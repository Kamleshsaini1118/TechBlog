import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { TbHexagonLetterPFilled } from "react-icons/tb";
import { GiCamel, GiUbisoftSun } from "react-icons/gi";


const Footer = () => {
  return (
    <footer className="bg-white shadow-lg-up">
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-900">
            © TechBlog. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            
            <a href="https://www.bhaskar.com/local/rajasthan/jaipur/" className="text-gray-700 hover:text-gray-800"
            target="_blank" 
            rel="noopener noreferrer">
              <GiUbisoftSun className="h-5 w-5"/>
            </a>

            <a href="https://epaper.patrika.com/JaipurCity?eid=20&edate=17/12/2024&pgid=2052482&device=desktop&view=3" className="text-gray-700 hover:text-gray-800"
            target="_blank" 
            rel="noopener noreferrer">
              <GiCamel className="h-5 w-5"/>
            </a>

            <a href="https://in.pinterest.com/" className="text-gray-700 hover:text-gray-800"
            target="_blank" 
            rel="noopener noreferrer">
              <TbHexagonLetterPFilled className="h-5 w-5"/>
            </a>

          <a 
              href="https://github.com/Kamleshsaini1118" 
              className="text-gray-700 hover:text-gray-800" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaGithub className="h-5 w-5" />
            </a>


          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
