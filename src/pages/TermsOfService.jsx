import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBalanceScale, 
  FaShieldAlt, 
  FaUserLock, 
  FaFileContract, 
  FaGavel,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

const TermsOfService = () => {
  const lastUpdated = "January 1, 2024";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaBalanceScale className="text-green-600 text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => scrollToSection('acceptance')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
            >
              Acceptance
            </button>
            <button
              onClick={() => scrollToSection('user-responsibilities')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              User Responsibilities
            </button>
            <button
              onClick={() => scrollToSection('intellectual-property')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              Intellectual Property
            </button>
            <button
              onClick={() => scrollToSection('privacy')}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => scrollToSection('termination')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
            >
              Termination
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <button
              onClick={() => scrollToSection('acceptance')}
              className="text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-900">1. Acceptance of Terms</span>
              <p className="text-gray-600 text-xs mt-1">By accessing our platform, you agree to these terms</p>
            </button>
            <button
              onClick={() => scrollToSection('user-responsibilities')}
              className="text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-900">2. User Responsibilities</span>
              <p className="text-gray-600 text-xs mt-1">Your obligations and conduct guidelines</p>
            </button>
            <button
              onClick={() => scrollToSection('intellectual-property')}
              className="text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-900">3. Intellectual Property</span>
              <p className="text-gray-600 text-xs mt-1">Rights to content and platform</p>
            </button>
            <button
              onClick={() => scrollToSection('privacy')}
              className="text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-900">4. Privacy & Data</span>
              <p className="text-gray-600 text-xs mt-1">How we handle your information</p>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Introduction */}
          <div className="border-b border-gray-200 p-6 bg-green-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Satyamev Jayate Justice Management System
            </h2>
            <p className="text-gray-700">
              These Terms of Service govern your use of our legal practice management platform 
              and the services we provide. Please read them carefully.
            </p>
          </div>

          {/* Section 1: Acceptance */}
          <div id="acceptance" className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                By accessing and using the Satyamev Jayate Justice Management System 
                ("the Platform"), you acknowledge that you have read, understood, and 
                agree to be bound by these Terms of Service.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                    <p className="text-yellow-700 text-sm">
                      If you do not agree with any part of these terms, you must immediately 
                      discontinue your use of the Platform. Continued use constitutes acceptance 
                      of any revised terms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">For Legal Professionals</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Must maintain valid professional credentials</li>
                    <li>• Responsible for case data accuracy</li>
                    <li>• Compliance with bar association rules</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">For Clients</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Provide accurate personal information</li>
                    <li>• Maintain confidentiality of login credentials</li>
                    <li>• Report unauthorized access immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: User Responsibilities */}
          <div id="user-responsibilities" className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaUserLock className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. User Responsibilities</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Account Security</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>You are responsible for maintaining the confidentiality of your login credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Immediately notify us of any unauthorized access to your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Use strong, unique passwords and enable two-factor authentication when available</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Prohibited Activities</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">Strictly Prohibited</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-red-700">
                    <div>
                      <ul className="space-y-1">
                        <li>• Unauthorized legal practice</li>
                        <li>• Sharing confidential case information</li>
                        <li>• Impersonating legal professionals</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• Data scraping or mining</li>
                        <li>• Introducing malware or viruses</li>
                        <li>• Circumventing security measures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Legal Compliance</h3>
                <p className="text-gray-700 mb-3">
                  Users must comply with all applicable laws, regulations, and professional 
                  standards, including but not limited to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Attorney-client privilege and confidentiality requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Data protection and privacy laws (GDPR, CCPA, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Rules of professional conduct for legal practitioners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Intellectual Property */}
          <div id="intellectual-property" className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaFileContract className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Intellectual Property Rights</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Platform Ownership</h3>
                <p>
                  The Satyamev Jayate Justice Management System, including its design, 
                  software, documentation, and all related materials, are the exclusive 
                  property of our organization and are protected by intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 User Content</h3>
                <p className="mb-3">
                  You retain all rights to the legal documents, case information, and other 
                  content you create or upload to the Platform. However, by using our services, 
                  you grant us a limited license to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Store, process, and display your content to provide our services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Create backup copies for data protection and recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Use anonymized, aggregated data for platform improvements</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Your Rights Protected</h4>
                <p className="text-green-700 text-sm">
                  We never claim ownership of your legal work product, case files, or client 
                  information. Your professional work remains your exclusive property.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Privacy & Data Protection */}
          <div id="privacy" className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FaShieldAlt className="text-indigo-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Privacy & Data Protection</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <p>
                We are committed to protecting your privacy and securing your legal data. 
                Our Privacy Policy explains in detail how we collect, use, and protect your information.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Data Security Measures</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• End-to-end encryption for sensitive data</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Secure data centers with physical protection</li>
                    <li>• Compliance with legal industry security standards</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Your Data Rights</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Right to access your personal information</li>
                    <li>• Right to correct inaccurate data</li>
                    <li>• Right to data portability</li>
                    <li>• Right to request deletion of data</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Legal Professional Notice</h4>
                <p className="text-yellow-700 text-sm">
                  As legal professionals, you are responsible for ensuring that your use of 
                  our Platform complies with your ethical obligations regarding client 
                  confidentiality and data protection.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Termination */}
          <div id="termination" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <FaGavel className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Termination & Suspension</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to suspend or terminate your access to the Platform 
                for violations of these Terms of Service or for any conduct that we 
                determine to be harmful to other users or the Platform.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Termination Scenarios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">By User</h5>
                    <ul className="text-gray-700 space-y-1">
                      <li>• May delete account at any time</li>
                      <li>• 30-day data retention period</li>
                      <li>• Export data before deletion</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">By Platform</h5>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Violation of terms</li>
                      <li>• Illegal activities</li>
                      <li>• Security threats</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Legal Inquiries</h4>
                <p className="text-gray-600 text-sm">
                  For legal notices or formal communications regarding these Terms of Service:
                </p>
                <p className="text-gray-700 mt-1">
                  Email: legal@satyamevjayate.com<br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">General Support</h4>
                <p className="text-gray-600 text-sm">
                  For questions about these terms or platform usage:
                </p>
                <p className="text-gray-700 mt-1">
                  Email: support@satyamevjayate.com<br />
                  Help Center: <Link to="/help" className="text-green-600 hover:underline">Visit Help Center</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link 
            to="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Home
          </Link>
          
          <div className="flex gap-3">
            <Link 
              to="/privacy"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By using our platform, you acknowledge that you have read and understood these Terms of Service.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Satyamev Jayate Justice Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;