// src/pages/Support.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const Support = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real app, you would call your support API
      // await submitSupportTicket(formData);

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });

      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "How do I verify my email address?",
      answer: "After registration, you'll receive a verification email. Click the link in the email or go to Settings > Profile to resend the verification email."
    },
    {
      question: "I didn't receive the verification email. What should I do?",
      answer: "Check your spam folder first. If you still don't see it, go to Settings > Profile and click 'Resend Verification Email'. Make sure you entered the correct email address."
    },
    {
      question: "How can I reset my password?",
      answer: "Go to Settings > Security. You can reset your password using your current password or via OTP verification sent to your email."
    },
    {
      question: "What should I do if I'm having technical issues?",
      answer: "Describe your issue in detail using the contact form below. Include any error messages and steps to reproduce the problem."
    },
    {
      question: "How do I update my profile information?",
      answer: "Navigate to Settings > Profile where you can update your personal information, contact details, and bio."
    }
  ];

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@yourapp.com",
      action: "mailto:support@yourapp.com"
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Call us during business hours (9 AM - 6 PM)",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 24/7",
      action: "#chat"
    }
  ];

  return (
    <DashboardLayout>
      <div className="m-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
          <p className="text-gray-600 mt-1">Get help with your account and application issues</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'contact'
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg">📞</span>
                  <span className="font-medium">Contact Support</span>
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'faq'
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg">❓</span>
                  <span className="font-medium">FAQ</span>
                </button>
                <button
                  onClick={() => setActiveTab('status')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'status'
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium">System Status</span>
                </button>
              </nav>
            </Card>

            {/* Quick Help */}
            <Card className="p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Help</h3>
              <div className="space-y-2">
                <Link to="/settings" className="block text-sm text-green-600 hover:text-green-700">
                  Account Settings
                </Link>
                <Link to="/privacy" className="block text-sm text-green-600 hover:text-green-700">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block text-sm text-green-600 hover:text-green-700">
                  Terms of Service
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Our Support Team</h2>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {contactMethods.map((method, index) => (
                        <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                          <div className="text-2xl mb-2">{method.icon}</div>
                          <h3 className="font-medium text-gray-800 mb-1">{method.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                          <p className="text-sm font-medium text-green-600">{method.contact}</p>
                          <Button
                            onClick={() => window.open(method.action, '_blank')}
                            className="mt-2 w-full"
                            variant="secondary"
                            size="sm"
                          >
                            Contact
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Please describe your issue in detail..."
                          required
                        />
                      </div>

                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800">There was an error sending your message. Please try again.</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>

                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          className="w-full flex justify-between items-center p-4 text-left"
                          onClick={() => {
                            // Simple toggle - in real app you might want to use a proper accordion
                            const answer = document.getElementById(`faq-answer-${index}`);
                            if (answer) {
                              answer.classList.toggle('hidden');
                            }
                          }}
                        >
                          <span className="font-medium text-gray-800">{item.question}</span>
                          <span className="text-gray-500">▼</span>
                        </button>
                        <div id={`faq-answer-${index}`} className="hidden p-4 border-t border-gray-200">
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Can't find what you're looking for?</strong>{' '}
                      <button
                        onClick={() => setActiveTab('contact')}
                        className="text-blue-600 underline hover:text-blue-700"
                      >
                        Contact our support team
                      </button>{' '}
                      for personalized assistance.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* System Status Tab */}
            {activeTab === 'status' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">System Status</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Application Services</h3>
                        <p className="text-sm text-gray-600">Core application functionality</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Operational
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Email Services</h3>
                        <p className="text-sm text-gray-600">Verification and notification emails</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Operational
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Database</h3>
                        <p className="text-sm text-gray-600">User data and application storage</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Operational
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">API Services</h3>
                        <p className="text-sm text-gray-600">Backend API endpoints</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Operational
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Last Updated</h3>
                    <p className="text-gray-600">{new Date().toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      All systems are operating normally. No ongoing incidents reported.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;