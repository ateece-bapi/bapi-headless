'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

export default function RequestQuotePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    productName: '',
    partNumber: '',
    quantity: '',
    application: '',
    timeline: '',
    details: '',
    companyName: '',
    phoneNumber: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data
      const data = new FormData();
      data.append('subject', formData.subject);
      data.append('productName', formData.productName);
      data.append('partNumber', formData.partNumber);
      data.append('quantity', formData.quantity);
      data.append('application', formData.application);
      data.append('timeline', formData.timeline);
      data.append('details', formData.details);
      data.append('companyName', formData.companyName);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('userEmail', user?.emailAddresses[0]?.emailAddress || '');

      // Append files
      files.forEach((file) => {
        data.append('files', file);
      });

      // Submit to API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect to quotes page after 3 seconds
      setTimeout(() => {
        router.push('/account/quotes');
      }, 3000);
    } catch (error) {
      logger.error('Error submitting quote', error);
      setIsSubmitting(false);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-neutral-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Quote Request Submitted!
          </h2>
          <p className="text-neutral-600 mb-6">
            We've received your request and our team will review it shortly. You'll receive a response within 24 business hours.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account/quotes"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              View My Quotes
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <Link
            href={user ? '/account/quotes' : '/'}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            {user ? 'Back to Quotes' : 'Back to Home'}
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Request a Custom Quote
          </h1>
          <p className="text-white/90 text-lg max-w-3xl">
            Tell us about your project and our technical specialists will provide a tailored solution with competitive pricing.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="w-full py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Product Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Request Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Bulk order for pressure sensors"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="productName" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Industrial Pressure Transducer"
                    />
                  </div>
                  <div>
                    <label htmlFor="partNumber" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Part Number
                    </label>
                    <input
                      type="text"
                      id="partNumber"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., BAPI-PT-4000"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Required Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="urgent">Urgent (1-2 weeks)</option>
                      <option value="standard">Standard (3-4 weeks)</option>
                      <option value="flexible">Flexible (1-2 months)</option>
                      <option value="planning">Planning phase</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Project Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="application" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Application/Use Case *
                  </label>
                  <input
                    type="text"
                    id="application"
                    name="application"
                    required
                    value={formData.application}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., HVAC monitoring system for commercial buildings"
                  />
                </div>
                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Additional Details *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    required
                    rows={6}
                    value={formData.details}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Please provide any technical specifications, customization requirements, or other relevant details about your project..."
                  />
                </div>
              </div>
            </div>

            {/* File Attachments */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Attachments (Optional)
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Upload technical drawings, specifications, or other relevant documents (Max 10MB per file)
              </p>
              <div className="space-y-4">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-neutral-400" strokeWidth={2} />
                    <p className="text-sm font-semibold text-neutral-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">
                      PDF, DOC, XLS, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                            <Upload className="w-4 h-4 text-primary-600" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                href={user ? '/account/quotes' : '/'}
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                    Submitting...
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-bold text-primary-900 mb-2">Need Assistance?</h3>
            <p className="text-sm text-primary-800 mb-4">
              Our technical specialists are available to help you find the right solution for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+1-555-123-4567"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Call: (555) 123-4567
              </a>
              <a
                href="mailto:quotes@bapi.com"
                className="inline-flex items-center justify-center px-4 py-2 border border-primary-300 text-primary-700 hover:bg-white font-semibold text-sm rounded-lg transition-colors"
              >
                Email: quotes@bapi.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
