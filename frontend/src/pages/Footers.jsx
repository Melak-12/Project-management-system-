import React from "react";
import { Link } from "react-router-dom";

const Fotters = () => {
  return (<footer className="sticky-foooter md:w-full w-[20vh]">
  
    <div className="h-12 mt-9 md:h-24  p-4 lg:px-20 xl:px-40 text-slate-500 flex items-center  justify-between">
      <Link to="/" className="font-bold text-xl px-6 ">ANGEL</Link>
       <div className="flex items-center justify-center gap-0 p-2 md:p-0 md:gap-9 font-sm md:font-bold space-x-2 md:space-x-4">
        <i className="fa fa-facebook text-blue-500 hover:text-green-600 transition text-2xl"></i>
        <i className="fa fa-telegram text-blue-500 hover:text-green-600 transition text-2xl"></i>
        <a href="mailto:melakabebeee@gmail.com" className="text-red-500 hover:text-green-600 transition">
          <i className="fa fa-envelope text-red-600 text-2xl"aria-hidden="true"></i>
        </a>
      </div>
      <p className="px-8 text-sm font-thin pt-10 md:pt-0">© All rights reserved!</p>

    </div>
    <span className="flex justify-center text-center p-3 text-sm text-slate-500">@2023 Designed by M.A</span>
    </footer>
  );
};

export default Fotters;