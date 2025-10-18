import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaUserLock,
  FaDatabase,
  FaCookie,
  FaEye,
  FaTrash,
  FaDownload,
  FaEdit,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const lastUpdated = "January 1, 2024";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const dataCollectionItems = [
    {
      category: "Personal Information",
      items: ["Full name", "Email address", "Phone number", "Professional credentials", "Bar registration numbers"]
    },
    {
      category: "Case Information",
      items: ["Case details", "Client information", "Legal documents", "Court dates", "Billing information"]
    },
    {
      category: "Technical Data",
      items: ["IP address", "Browser type", "Device information", "Usage patterns", "Login timestamps"]
    },
    {
      category: "Communication",
      items: ["Email correspondence", "Support tickets", "Feedback", "System notifications"]
    }
  ];

  const dataRights = [
    {
      icon: FaEye,
      title: "Right to Access",
      description: "View all personal data we hold about you"
    },
    {
      icon: FaEdit,
      title: "Right to Rectification",
      description: "Correct inaccurate or incomplete data"
    },
    {
      icon: FaTrash,
      title: "Right to Erasure",
      description: "Request deletion of your personal data"
    },
    {
      icon: FaSync,
      title: "Right to Portability",
      description: "Receive your data in a machine-readable format"
    }
  ];

  const securityMeasures = [
    {
      title: "Encryption",
      description: "End-to-end encryption for all sensitive legal data"
    },
    {
      title: "Access Controls",
      description: "Role-based access and multi-factor authentication"
    },
    {
      title: "Regular Audits",
      description: "Security assessments and penetration testing"
    },
    {
      title: "Data Backup",
      description: "Secure, encrypted backups with disaster recovery"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShieldAlt className="text-blue-600 text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['introduction', 'data-collection', 'data-usage', 'data-protection', 'your-rights', 'cookies'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
              >
                {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {[
                  { id: 'introduction', label: 'Introduction' },
                  { id: 'data-collection', label: 'Data Collection' },
                  { id: 'data-usage', label: 'Data Usage' },
                  { id: 'data-sharing', label: 'Data Sharing' },
                  { id: 'data-protection', label: 'Data Protection' },
                  { id: 'your-rights', label: 'Your Rights' },
                  { id: 'cookies', label: 'Cookies' },
                  { id: 'retention', label: 'Data Retention' },
                  { id: 'changes', label: 'Policy Changes' },
                  { id: 'contact', label: 'Contact Us' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Data Rights Quick View */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle />
                  Your Data Rights
                </h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your data</li>
                  <li>• Export your data</li>
                  <li>• Object to processing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

              {/* Introduction */}
              <div id="introduction" className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaShieldAlt className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                </div>

                <div className="space-y-4 text-gray-700">
                  <p>
                    At <strong>Satyamev Jayate Justice Management System</strong>, we are committed to
                    protecting your privacy and securing your legal data. This Privacy Policy explains
                    how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Legal Professional Notice</h4>
                    <p className="text-blue-700 text-sm">
                      As legal professionals using our platform, you have additional responsibilities
                      under attorney-client privilege and professional conduct rules. We provide tools
                      to help you meet these obligations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">For Legal Professionals</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Client data protection tools</li>
                        <li>• Confidentiality compliance features</li>
                        <li>• Secure document sharing</li>
                        <li>• Access control management</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">For Clients</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Control over personal information</li>
                        <li>• Secure communication channels</li>
                        <li>• Transparency in data usage</li>
                        <li>• Easy data access requests</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Collection */}
              <div id="data-collection" className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaDatabase className="text-green-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700">
                    We collect information necessary to provide our legal practice management services,
                    ensure platform security, and comply with legal obligations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dataCollectionItems.map((category, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {category.category}
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-2">
                              <span className="text-green-600">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">Sensitive Legal Data</h4>
                        <p className="text-yellow-700 text-sm">
                          We understand that case information and client data are highly sensitive.
                          We employ industry-leading security measures and encryption to protect
                          this information at all times.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div id="data-usage" className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>

                <div className="space-y-4 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Primary Purposes</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Provide and maintain legal practice management services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Process legal documents and case management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Client communication and collaboration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Billing and payment processing</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Security & Compliance</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Platform security and fraud prevention</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Legal and regulatory compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Service improvements and updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Customer support and troubleshooting</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sharing */}
              <div id="data-sharing" className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>

                <div className="space-y-6 text-gray-700">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties.
                    We only share information in the following limited circumstances:
                  </p>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Strict Confidentiality</h4>
                    <p className="text-red-700 text-sm">
                      Client case information and legal documents are never shared with third parties
                      except as required by law or with explicit client consent through the platform.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">When We Share</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-1">•</span>
                          <span><strong>With Your Consent:</strong> When you explicitly authorize sharing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-1">•</span>
                          <span><strong>Legal Requirements:</strong> Court orders or legal processes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-600 mt-1">•</span>
                          <span><strong>Service Providers:</strong> Trusted partners under strict contracts</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">When We Don't Share</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Client case details for marketing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Legal documents with advertisers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Sensitive information without consent</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Protection */}
              <div id="data-protection" className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaUserLock className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Data Security and Protection</h2>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700">
                    We implement comprehensive security measures to protect your legal data,
                    recognizing the sensitive nature of legal practice information.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {securityMeasures.map((measure, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{measure.title}</h4>
                        <p className="text-sm text-gray-700">{measure.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Industry Compliance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-700">
                      <div className="text-center">
                        <div className="font-semibold">GDPR</div>
                        <div className="text-xs">EU Data Protection</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">CCPA</div>
                        <div className="text-xs">California Privacy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">HIPAA</div>
                        <div className="text-xs">Health Information</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">SOC 2</div>
                        <div className="text-xs">Security Standards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div id="your-rights" className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Your Data Protection Rights</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {dataRights.map((right, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <right.icon className="text-blue-600 text-xl" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{right.title}</h4>
                      <p className="text-sm text-gray-600">{right.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Exercising Your Rights</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    To exercise any of these rights, please contact us using the information in the
                    "Contact Us" section. We will respond to your request within 30 days.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Request Data Access
                    </button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                      Download My Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div id="cookies" className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <FaCookie className="text-orange-600 text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Cookies and Tracking Technologies</h2>
                </div>

                <div className="space-y-4 text-gray-700">
                  <p>
                    We use cookies and similar technologies to enhance your experience, analyze platform usage,
                    and support our security measures.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                      <p className="text-sm text-gray-600">Required for platform functionality and security</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">Help us improve user experience</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                      <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Cookie Control</h4>
                    <p className="text-yellow-700 text-sm">
                      You can control cookies through your browser settings. However, disabling
                      essential cookies may affect platform functionality and security features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div id="retention" className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    We retain personal information only for as long as necessary to fulfill the purposes
                    outlined in this policy, unless a longer retention period is required or permitted by law.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Retention Periods</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Active accounts</span>
                          <span className="font-semibold">Until deletion</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Inactive accounts</span>
                          <span className="font-semibold">2 years</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Case records</span>
                          <span className="font-semibold">7 years</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Billing information</span>
                          <span className="font-semibold">10 years</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Deletion Process</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Secure data erasure methods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Backup data removal cycles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>Legal hold exceptions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Changes */}
              <div id="changes" className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>

                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our
                    practices, technology, legal requirements, or other factors.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Update Notification</h4>
                    <p className="text-blue-700 text-sm">
                      We will notify you of any material changes through the platform dashboard,
                      email notifications, or other reasonable means. The "Last updated" date at
                      the top of this policy indicates when it was last revised.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div id="contact" className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contact Us</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Privacy Inquiries</h4>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>Data Protection Officer:</strong><br />
                        Email: dpo@satyamevjayate.com<br />
                        Phone: +1 (555) 123-4567
                      </p>
                      <p>
                        <strong>General Privacy Questions:</strong><br />
                        Email: privacy@satyamevjayate.com
                      </p>
                      <p>
                        <strong>Office Address:</strong><br />
                        123 Justice Avenue<br />
                        Law District, LS 12345<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-900">Request Data Access</div>
                        <div className="text-sm text-gray-600">Get a copy of your personal data</div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-900">Update Preferences</div>
                        <div className="text-sm text-gray-600">Manage your communication settings</div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-900">Report a Concern</div>
                        <div className="text-sm text-gray-600">Contact our privacy team</div>
                      </button>
                    </div>
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
                  to="/terms"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Terms of Service
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  I Understand
                </button>
              </div>
            </div>

            {/* Bottom Notice */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By using our platform, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © {new Date().getFullYear()} Satyamev Jayate Justice Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;