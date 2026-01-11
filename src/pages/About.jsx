import React, { useState } from 'react';
import { FaDownload, FaChevronDown, FaChevronUp, FaEnvelope, FaInfoCircle, FaNewspaper, FaQuestionCircle } from 'react-icons/fa';

const AboutPage = () => {
  // State to manage which FAQ item is open
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // FAQ Data
  const faqItems = [
    {
      question: "How do I submit my case application on this portal?",
      answer: "Navigate to the 'New Case Application' section from your dashboard. Fill out the form completely with all required details, such as case type, financial details, and upload necessary documents. Please verify all information carefully before submission."
    },
    {
      question: "What should I do after submitting my application online?",
      answer: "After submission, you will receive a unique Case Reference Number and an acknowledgement on your dashboard. Please save this number for all future correspondence and status tracking regarding your case."
    },
    {
      question: "How can I check the status of my submitted case?",
      answer: "You can view the current status of all your cases in the 'View All Cases' section of your dashboard. For detailed updates, click on a specific case to view its dedicated timeline, documents, and hearing dates."
    },
    {
      question: "Can I correct information in my submitted application?",
      answer: "Once submitted, applications cannot be directly edited by clients. If you need to correct information, please contact your assigned advocate through the portal's messaging system or wait for an official request for clarification during the verification process."
    },
    {
      question: "How do I submit feedback or a complaint?",
      answer: "You can use the 'Contact Us' feature available in the portal's footer or sidebar. For formal communications, you may also email the committee using the official email address provided at the top of this page."
    },
    {
      question: "What happens if my case application is rejected?",
      answer: "If your application is rejected, you will receive a notification within your portal dashboard and via registered email. The notification will include the specific reasons for rejection and the necessary steps to appeal the decision or re-submit a corrected application."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Case Management Portal</h1>
          <p className="text-xl opacity-90">Official Committee for Financial Dispute Resolution</p>
          <div className="mt-6 pt-6 border-t border-blue-300">
            <h2 className="text-2xl font-semibold mb-1">Hon'ble Chairman [Committee Name]</h2>
            <p className="opacity-90">(Retd. Judge of the Hon'ble High Court)</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <FaEnvelope />
              <a href="mailto:info@committeeportal.com" className="hover:underline">
                info@committeeportal.com
              </a>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Overview Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaInfoCircle className="text-blue-600 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-800">Overview</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                This Case Management Portal has been established under the directive and supervision of the Hon'ble High Court. Its primary purpose is to facilitate the efficient resolution and management of financial dispute cases for investors and depositors.
              </p>
              <p className="mb-4">
                The portal serves as a centralized digital platform for case filing, document verification, hearing scheduling, and communication between clients, advocates, and the committee. It aims to bring transparency, speed, and order to the legal process.
              </p>
              <p>
                The overseeing committee consists of a retired Hon'ble High Court Judge as Chairperson, along with nominated members from relevant financial oversight and state authorities, ensuring a fair and multi-disciplinary approach to case adjudication.
              </p>
            </div>
          </section>

          {/* News & Notices Section */}
          <section className="mb-12 bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaNewspaper className="text-green-600 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-800">News & Notices</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Updated Procedure for Online Case Submission</h3>
                <p className="text-gray-600 mb-3">Revised guidelines for clients and advocates to file new cases and upload mandatory documents on the portal.</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">26th Feb, 2024</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <FaDownload /> Download File
                  </button>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">General Notice Regarding Portal Operations</h3>
                <p className="text-gray-600 mb-3">Extract of the governing orders and operational framework established by the Hon'ble Court for this portal.</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">9th Sep, 2017</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FaDownload /> Download File
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FaQuestionCircle className="text-purple-600 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full p-5 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-lg text-gray-800">{item.question}</span>
                    {openFaqIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t text-center text-gray-500 text-sm">
            <p>This portal is maintained for official use by the Committee. For the latest official orders, please refer to the notices section.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;