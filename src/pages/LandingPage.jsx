import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ModalConfirmation from "../components/ModalConfirmation";
import { submitContactForm } from "../services/contactService";

// Yup schema for form validation
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
});

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Called when user confirms modal submission
  const handleModalConfirm = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      await submitContactForm(formData);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => setModalOpen(false);

  // Open modal with form data on submit
  const onSubmit = (data) => {
    setFormData(data);
    setModalOpen(true);
  };

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

        <form
          className="max-w-md mx-auto grid gap-5 px-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Your Name"
            className={`w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 outline-none shadow-sm hover:shadow-md transition-all ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
              }`}
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-xs text-left">{errors.name.message}</p>}

          <input
            type="email"
            placeholder="Your Email"
            className={`w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 outline-none shadow-sm hover:shadow-md transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
              }`}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs text-left">{errors.email.message}</p>}

          <textarea
            placeholder="Your Message"
            className={`w-full px-4 py-2.5 text-sm border rounded-md focus:ring-2 outline-none shadow-sm hover:shadow-md transition-all h-28 resize-none ${errors.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
              }`}
            {...register("message")}
          />
          {errors.message && <p className="text-red-500 text-xs text-left">{errors.message.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 text-white text-sm font-medium rounded-md shadow-md transition-all transform hover:scale-105 ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              } flex justify-center items-center space-x-2`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            <span>{loading ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </section>

      {/* Modal Confirmation */}
      <ModalConfirmation
        isOpen={modalOpen}
        title="Confirm Submission"
        message="Are you sure you want to send this message?"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* WhatsApp Floating Icon */}
      <a
        href="https://wa.me/919373200525"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0012 0a11.87 11.87 0 00-10.5 17.5L0 24l6.8-1.77A11.88 11.88 0 0012 24h.01c6.6 0 11.99-5.4 11.99-12a11.84 11.84 0 00-3.48-8.52zM12 22.1c-1.8 0-3.58-.48-5.14-1.38l-.37-.22-4.03 1.06 1.07-3.93-.25-.4A10.1 10.1 0 012.02 12 10.11 10.11 0 1112 22.1zm5.36-7.62c-.29-.14-1.7-.84-1.96-.93s-.45-.14-.64.14-.74.92-.91 1.11-.34.21-.63.07a8.26 8.26 0 01-2.42-1.5 9.13 9.13 0 01-1.68-2.09c-.18-.3-.02-.46.13-.61.13-.13.3-.33.45-.5.15-.17.2-.29.3-.49s.05-.37-.02-.51c-.07-.13-.64-1.54-.88-2.11s-.47-.49-.64-.5l-.55-.01c-.19 0-.5.07-.76.37s-1 1-.99 2.42 1.02 2.81 1.17 3.01c.14.2 2.02 3.2 4.91 4.49 1.74.75 2.43.82 3.31.69.53-.08 1.7-.69 1.94-1.35.24-.67.24-1.24.17-1.35-.07-.12-.26-.2-.55-.34z" />
        </svg>
      </a>


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

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default LandingPage;
