'use client';
import React, { useState } from 'react';

const ReportIssueComponent = () => {
  // State for form fields
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [priority, setPriority] = useState('medium');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  // Remove an attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!issueType) newErrors.issueType = "Please select an issue type";
    if (!title.trim()) newErrors.title = "Title is required";
    if (description.length < 20) newErrors.description = "Description should be at least 20 characters";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      setIssueType('');
      setTitle('');
      setDescription('');
      setAttachments([]);
      setPriority('medium');
      setEmail('');
      setErrors({});
      setIsSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setErrors({ form: "Failed to submit issue. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#CE145B] to-[#E43A72] px-6 py-4 sm:px-8 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Report an Issue</h1>
            <p className="mt-1 text-white text-opacity-90">
              We're here to help. Let us know about any problems you're experiencing.
            </p>
          </div>

          {/* Success message */}
          {isSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Your issue has been successfully submitted. We'll look into it as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-6 space-y-6">
            {/* Issue Type */}
            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <select
                id="issueType"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className={`w-full rounded-md border ${errors.issueType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#CE145B] focus:border-transparent py-2 px-3`}
              >
                <option value="" disabled>Select an issue type</option>
                <option value="technical">Technical Problem</option>
                <option value="account">Account Issue</option>
                <option value="payment">Payment Problem</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
              {errors.issueType && (
                <p className="mt-1 text-sm text-red-500">{errors.issueType}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                className={`w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#CE145B] focus:border-transparent py-2 px-3`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about the issue, including any error messages and steps to reproduce it"
                rows="5"
                className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#CE145B] focus:border-transparent py-2 px-3`}
              ></textarea>
              {errors.description ? (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Minimum 20 characters required</p>
              )}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (Optional)
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#CE145B] hover:text-[#B5124E] focus-within:outline-none">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>

              {/* Attachment preview */}
              {attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className="relative flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={() => setPriority(level)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      priority === level 
                        ? 'border-[#CE145B]' 
                        : 'border-gray-300'
                    }`}>
                      {priority === level && (
                        <div className="w-2 h-2 rounded-full bg-[#CE145B]"></div>
                      )}
                    </div>
                    <span className="text-sm capitalize">
                      {level}
                      {level === 'low' && ' - Not urgent'}
                      {level === 'medium' && ' - Standard'}
                      {level === 'high' && ' - Urgent'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates on this issue"
                className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#CE145B] focus:border-transparent py-2 px-3`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Generic error message */}
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errors.form}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#CE145B] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-[#B5124E] focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Report"}
              </button>
            </div>
          </form>
        </div>

        {/* Help Info */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Need immediate assistance?</h2>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CE145B] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-600">+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CE145B] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-600">support@example.com</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Our support team is available Monday through Friday, 9am to 5pm EST.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueComponent;