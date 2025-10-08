import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-800 to-green-500 text-white shadow-lg px-4 py-1 flex justify-between items-center transition-all ease-in-out duration-300">
        <Link to="/" className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="w-32 h-8">
            <text x="0" y="35" fill="white" fontSize="24" fontWeight="bold" fontFamily="serif">
              Satyamev Jayate
            </text>
            <line x1="0" y1="42" x2="200" y2="42" stroke="white" strokeWidth="2" />
          </svg>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-5 text-[9px] font-medium">
          <li><Link to="/" className="hover:text-gray-200 transition-colors">Home</Link></li>
          <li><Link to="/apply" className="hover:text-gray-200 transition-colors">Application Form</Link></li>
          <li><Link to="/about" className="hover:text-gray-200 transition-colors">About</Link></li>
          <li><Link to="/services" className="hover:text-gray-200 transition-colors">Services</Link></li>
          <li><Link to="/contact" className="hover:text-gray-200 transition-colors">Contact</Link></li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex space-x-3">
          <Link
            to="/login"
            className="px-2 py-1 bg-blue-600 rounded-full text-white text-[8px] 
         shadow-inner hover:shadow-inner hover:bg-blue-700 
         transition-all ease-in-out transform hover:scale-105"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-2.5 py-1 bg-blue-700 rounded-full text-white text-[8px] 
         shadow-inner hover:shadow-inner hover:bg-blue-800 
         transition-all ease-in-out transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-500 transition-all duration-500">
        {/* Optional Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 sm:px-8 md:px-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md animate__animated animate__fadeInDown">
            Welcome to <span className="text-yellow-300">Satyamev Jayate</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-8 opacity-90 drop-shadow-sm animate__animated animate__fadeInUp animate__delay-1s">
            Your trusted digital platform for managing legal cases, applications, and more—designed for transparency and justice.
          </p>

          <Link
            to="/apply"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 rounded-full text-green-900 text-sm sm:text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-md hover:shadow-xl animate__animated animate__fadeInUp animate__delay-2s"
          >
            Fill Application Form
          </Link>
        </div>
      </section>


      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-green-100 via-white to-green-50 text-center">
        <h2 className="text-4xl font-bold text-green-900 mb-6">About Us</h2>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 px-4">
          <span className="font-semibold text-green-800">Satyamev Jayate</span> is your trusted digital platform built to streamline legal case management for clients and advocates.
          From court dates to document storage, we empower you to stay organized, informed, and focused on justice — all in one secure space.
        </p>

        <Link
          to="/about"
          className="inline-block px-6 py-3 bg-green-600 text-white text-sm rounded-full font-medium hover:bg-green-700 transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
        >
          Learn More
        </Link>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-green-100 via-white to-green-50 text-center">
        <h2 className="text-4xl font-bold text-green-900 mb-12">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">

          {/* Service 1 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:bg-green-50 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Case Management</h3>
            <p className="text-sm text-gray-600">
              Effortlessly manage and monitor your legal cases with real-time updates and tools.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:bg-green-50 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Document Storage</h3>
            <p className="text-sm text-gray-600">
              Upload, organize, and securely store all your legal documents in one place.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:bg-green-50 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Court Calendar</h3>
            <p className="text-sm text-gray-600">
              Keep track of all court dates, hearings, and deadlines with our integrated calendar.
            </p>
          </div>

          {/* Optional: Add more services if needed */}
        </div>
      </section>


      {/* Contact Section */}
     <section className="py-20 bg-gradient-to-b from-green-100 via-white to-green-50 text-center">
  <h2 className="text-4xl font-bold text-green-900 mb-6">Contact Us</h2>
  <p className="text-md text-gray-700 max-w-2xl mx-auto mb-10 px-4">
    Have a question or need legal assistance? Our team is here to help you with guidance, support, and solutions. Fill out the form below and we’ll get back to you shortly.
  </p>

  <form className="max-w-md mx-auto grid gap-5 px-4">
    <input
      type="text"
      placeholder="Your Name"
      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none shadow-sm hover:shadow-md transition-all"
    />
    <input
      type="email"
      placeholder="Your Email"
      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none shadow-sm hover:shadow-md transition-all"
    />
    <textarea
      placeholder="Your Message"
      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none shadow-sm hover:shadow-md transition-all h-28 resize-none"
    ></textarea>
    <button
      type="submit"
      className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-green-700 hover:shadow-lg transition-all transform hover:scale-105"
    >
      Send Message
    </button>
  </form>
</section>



      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-2">Satyamev Jayate</h3>
            <p className="opacity-80">
              Your trusted platform for managing legal cases, appointments, and documents — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 opacity-90">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/services" className="hover:underline">Services</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Connect with Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" className="hover:text-gray-300 transition-colors"><FaFacebookF /></a>
              <a href="https://twitter.com" className="hover:text-gray-300 transition-colors"><FaTwitter /></a>
              <a href="https://instagram.com" className="hover:text-gray-300 transition-colors"><FaInstagram /></a>
            </div>
            <p className="opacity-80">Email: support@satyamevjayate.com</p>
            <p className="opacity-80">Phone: +91 93732 00525</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Satyamev Jayate. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
