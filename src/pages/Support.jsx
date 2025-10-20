// src/pages/Support.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useSupport } from '../hooks/useSupport';

// Constants outside component to prevent recreation
const TABS = [
  { id: 'contact', label: 'Contact Support', icon: '📞' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'status', label: 'System Status', icon: '📊' },
  { id: 'my-tickets', label: 'My Tickets', icon: '🎫' },
];

const CONTACT_METHODS = [
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
  }
];

const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const Support = () => {
  const [activeTab, setActiveTab] = useState('contact');
  
  const {
    formData,
    setFormData,
    isSubmitting,
    submitStatus,
    setSubmitStatus,
    validationErrors,
    clearValidationErrors,
    clearForm,
    faqs,
    loadingFaqs,
    userTickets,
    loadingTickets,
    stats,
    submitTicket,
    fetchFAQs,
    fetchUserTickets,
    fetchUserStats
  } = useSupport();

  // Load stats on initial mount only
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Load tab-specific data only when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'faq':
        fetchFAQs();
        break;
      case 'my-tickets':
        fetchUserTickets();
        break;
      default:
        break;
    }
  }, [activeTab, fetchFAQs, fetchUserTickets]);

  // Clear validation errors when tab changes
  useEffect(() => {
    clearValidationErrors();
    setSubmitStatus('');
  }, [activeTab, clearValidationErrors, setSubmitStatus]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      clearValidationErrors();
    }
  }, [setFormData, validationErrors, clearValidationErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await submitTicket(formData);
    if (result.success) {
      clearForm();
      setTimeout(() => setSubmitStatus(''), 5000);
      
      // Refresh tickets if we're on the tickets tab
      if (activeTab === 'my-tickets') {
        fetchUserTickets(true);
      }
    }
  }, [formData, submitTicket, clearForm, setSubmitStatus, activeTab, fetchUserTickets]);

  const toggleFaqAnswer = useCallback((index) => {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (answer) {
      answer.classList.toggle('hidden');
    }
  }, []);

  const getStatusColor = useCallback((status) => STATUS_COLORS[status] || 'bg-gray-100 text-gray-800', []);
  const getPriorityColor = useCallback((priority) => PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800', []);

  // Memoized tab content
  const tabContent = useMemo(() => ({
    contact: (
      <ContactTab 
        formData={formData} 
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        validationErrors={validationErrors}
      />
    ),
    
    faq: (
      <FaqTab 
        faqs={faqs} 
        loading={loadingFaqs} 
        onToggleFaq={toggleFaqAnswer}
      />
    ),
    
    'my-tickets': (
      <TicketsTab 
        tickets={userTickets}
        loading={loadingTickets}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        onCreateTicket={() => setActiveTab('contact')}
      />
    ),
    
    status: <StatusTab />
  }), [
    formData, handleSubmit, handleInputChange, isSubmitting, submitStatus, validationErrors,
    faqs, loadingFaqs, toggleFaqAnswer, userTickets, loadingTickets,
    getStatusColor, getPriorityColor
  ]);

  return (
    <DashboardLayout>
      <div className="m-3">
        <Header stats={stats} />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1">{tabContent[activeTab]}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Sub-components
const Header = ({ stats }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
    <p className="text-gray-600 mt-1">Get help with your account and application issues</p>
    
    {stats && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-800">{stats.total_tickets}</div>
          <div className="text-sm text-gray-600">Total Tickets</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.open_tickets}</div>
          <div className="text-sm text-gray-600">Open</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.in_progress_tickets}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.resolved_tickets}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>
    )}
  </div>
);

const Sidebar = ({ activeTab, onTabChange }) => (
  <div className="lg:w-64">
    <Card className="p-4">
      <nav className="space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === tab.id
                ? "bg-green-100 text-green-700 border border-green-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </Card>
  </div>
);

const ContactTab = ({ formData, onSubmit, onInputChange, isSubmitting, submitStatus, validationErrors }) => (
  <Card>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Our Support Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {CONTACT_METHODS.map((method, index) => (
          <ContactMethod key={index} method={method} />
        ))}
      </div>

      <ContactForm 
        formData={formData}
        onSubmit={onSubmit}
        onInputChange={onInputChange}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        validationErrors={validationErrors}
      />
    </div>
  </Card>
);

const ContactMethod = ({ method }) => (
  <div className="text-center p-4 border border-gray-200 rounded-lg">
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
);

const ContactForm = ({ formData, onSubmit, onInputChange, isSubmitting, submitStatus, validationErrors }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Subject *"
        name="subject"
        type="text"
        value={formData.subject}
        onChange={onInputChange}
        placeholder="Brief description of your issue"
        error={validationErrors.subject}
        required
      />
      <FormField
        label="Category *"
        name="category"
        type="select"
        value={formData.category}
        onChange={onInputChange}
        error={validationErrors.category}
        options={[
          { value: 'general', label: 'General Inquiry' },
          { value: 'technical', label: 'Technical Issue' },
          { value: 'billing', label: 'Billing' },
          { value: 'feature', label: 'Feature Request' },
          { value: 'bug', label: 'Bug Report' },
          { value: 'case_related', label: 'Case Related' },
        ]}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Priority"
        name="priority"
        type="select"
        value={formData.priority}
        onChange={onInputChange}
        error={validationErrors.priority}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ]}
      />
      <FormField
        label="Case ID (Optional)"
        name="case_id"
        type="number"
        value={formData.case_id || ''}
        onChange={onInputChange}
        error={validationErrors.case_id}
        placeholder="Enter case ID if related to a case"
        min="1"
        step="1"
      />
    </div>

    <FormField
      label="Description *"
      name="description"
      type="textarea"
      value={formData.description}
      onChange={onInputChange}
      placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
      error={validationErrors.description}
      rows={6}
      required
    />

    {/* Display validation errors summary */}
    {Object.keys(validationErrors).length > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
        <ul className="text-red-700 text-sm list-disc list-inside">
          {Object.entries(validationErrors).map(([field, error]) => (
            <li key={field}>{error}</li>
          ))}
        </ul>
      </div>
    )}

    {submitStatus && !submitStatus.startsWith('error:') && (
      <div className={`p-4 rounded-lg ${
        submitStatus.startsWith('success') 
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        {submitStatus.startsWith('success') ? '✅ ' : '❌ '}
        {submitStatus.replace('success: ', '').replace('error: ', '')}
      </div>
    )}

    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="secondary"
        onClick={() => {
          document.querySelector('form').reset();
          onInputChange({ target: { name: 'category', value: 'general' } });
          onInputChange({ target: { name: 'priority', value: 'medium' } });
          onInputChange({ target: { name: 'case_id', value: null } });
        }}
      >
        Clear Form
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
      </Button>
    </div>
  </form>
);

const FormField = ({ label, type = 'text', options = [], error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {type === 'select' ? (
      <select 
        {...props} 
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea 
        {...props} 
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
    ) : (
      <input 
        type={type} 
        {...props} 
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
    )}
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const FaqTab = ({ faqs, loading, onToggleFaq }) => (
  <Card>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
      {loading ? (
        <LoadingSpinner text="Loading FAQs..." />
      ) : (
        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <div key={item.faq_id} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
                  onClick={() => onToggleFaq(index)}
                >
                  <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                  <span className="text-gray-500 flex-shrink-0">▼</span>
                </button>
                <div id={`faq-answer-${index}`} className="hidden p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="No FAQs available at the moment." />
          )}
        </div>
      )}
    </div>
  </Card>
);

const TicketsTab = ({ tickets, loading, getStatusColor, getPriorityColor, onCreateTicket }) => (
  <Card>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Support Tickets</h2>
        <Button onClick={onCreateTicket}>Create New Ticket</Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your tickets..." />
      ) : tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketItem 
              key={ticket.support_ticket_id}
              ticket={ticket}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          message="You haven't created any support tickets yet."
          action={<Button onClick={onCreateTicket}>Create Your First Ticket</Button>}
        />
      )}
    </div>
  </Card>
);

const TicketItem = ({ ticket, getStatusColor, getPriorityColor }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{ticket.subject}</h3>
        <p className="text-sm text-gray-600 mt-1">{ticket.ticket_number}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{ticket.description}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ')}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>
    </div>
    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
      <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
      <span>Category: {ticket.category}</span>
    </div>
  </div>
);

const StatusTab = () => (
  <Card>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">System Status</h2>
      <EmptyState message="All systems operational" />
    </div>
  </Card>
);

const LoadingSpinner = ({ text }) => (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    <p className="text-gray-600 mt-2">{text}</p>
  </div>
);

const EmptyState = ({ message, action }) => (
  <div className="text-center py-8 text-gray-500">
    <p className="mb-4">{message}</p>
    {action}
  </div>
);

export default Support;