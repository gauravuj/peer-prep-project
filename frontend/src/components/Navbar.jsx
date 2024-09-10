const Navbar = () => {
  return (
    <nav className="mt-6 flex items-center justify-between px-8">
      {/* Navigation Links*/}
      <div className="flex space-x-2">
        {/* Logo */}
        <div className="mr-2 flex items-center">
          {/* add this link for the logo Illustration by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> from <a href="https://icons8.com/illustrations">Ouch!</a>*/}
          <img src="/images/8bit-star-1.png" alt="logo" className="h-8 w-8" />
        </div>
        <button className="rounded-full bg-white px-6 py-2 text-black">
          HOME
        </button>
        <button className="rounded-full border border-gray-400 px-6 py-2 text-white hover:border-hidden hover:bg-white hover:text-black">
          ABOUT
        </button>
        <button className="rounded-full border border-gray-400 px-7 py-2 text-white hover:border-hidden hover:bg-white hover:text-black">
          FEATURES
        </button>
      </div>

      {/* Login and Register Buttons */}
      <div className="flex space-x-2">
        <button className="rounded-full bg-white px-6 py-2 text-black hover:border hover:border-gray-400 hover:bg-transparent hover:text-white">
          LOGIN
        </button>
        <button className="rounded-full bg-[#C6FF46] px-8 py-2 font-medium text-black">
          REGISTER
        </button>
      </div>
    </nav>
  );
};

export default Navbar;