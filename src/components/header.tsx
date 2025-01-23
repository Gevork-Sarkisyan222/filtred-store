import React from 'react';
import logo from '../assets/store-logo.svg';
import tochka from '../assets/tochka-mere.svg';
import Image from 'next/image';
import { BellDot, Menu } from 'lucide-react';

type Props = {};

function Header({}: Props) {
  return (
    <header className="bg-white">
      <div className="py-[35px] flex justify-between items-center max-w-[1400px] m-auto bg-white max-[1515px]:px-[20px]">
        <Image src={logo} alt="logo" />

        <ul className="flex items-center gap-[52px] max-[1305px]:hidden">
          <div></div>
          <li className="font-[500] cursor-pointer hover:text-[black] transition-all duration-300">
            Finds Jobs
          </li>
          <li className="text-[#9C9CA3] font-[500] cursor-pointer hover:text-[black] transition-all duration-300">
            Company Reviews
          </li>
          <li className="text-[#9C9CA3] font-[500] cursor-pointer hover:text-[black] transition-all duration-300">
            Find Salaries
          </li>
          <li className="text-[#9C9CA3] font-[500] cursor-pointer hover:text-[black] transition-all duration-300">
            Find Resumes
          </li>
          <li className="text-[#9C9CA3] font-[500] cursor-pointer hover:text-[black] transition-all duration-300">
            Employers / Post Job
          </li>
        </ul>

        <article className="flex items-center gap-[38px] max-[535px]:hidden">
          <div className="w-[36px] h-[36px] rounded-[9px] border-[#E1E1E1] border-[1px] flex justify-center items-center">
            <BellDot color="#0062FF" />
          </div>

          <div className="w-[2px] h-[48px] bg-[#E1E1E1]"></div>

          <div className="flex items-center gap-[12px]">
            <Image
              className="rounded-[20px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSuvv7lVRFi71nW2k_y-F7vYn8iKm243nBLZsg00QSwa5g68CDuuOXhytx0XrWvDBcYkM&usqp=CAU"
              alt="avatar"
              width={70}
              height={61}
            />

            <div className="flex flex-col">
              <span className="text-[#9C9CA3]">hello!</span>
              <div className="flex gap-[17px] items-center">
                <h2 className="font-bold">John Doe</h2>
                <Image src={tochka} alt="tochka" width={8} height={8} />
              </div>
            </div>
          </div>
        </article>

        <Menu className="hidden max-[535px]:block" />
      </div>
    </header>
  );
}

export default Header;
