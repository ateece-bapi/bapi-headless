'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

export default function RequestQuotePage() {
  const { user, isLoaded } = useAuth();
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
      data.append('userEmail', user?.email || '');

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
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">Quote Request Submitted!</h2>
          <p className="mb-6 text-neutral-600">
            We&apos;ve received your request and our team will review it shortly. You&apos;ll receive a
            response within 24 business hours.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account/quotes"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              View My Quotes
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
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
      <section className="bg-linear-to-r w-full from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href={user ? '/account/quotes' : '/'}
            className="mb-6 inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            {user ? 'Back to Quotes' : 'Back to Home'}
          </Link>
          <h1 className="mb-3 text-3xl font-bold lg:text-4xl">Request a Custom Quote</h1>
          <p className="max-w-3xl text-lg text-white/90">
            Tell us about your project and our technical specialists will provide a tailored
            solution with competitive pricing.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Contact Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Product Information</h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Request Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Bulk order for pressure sensors"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="productName"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Industrial Pressure Transducer"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="partNumber"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Part Number
                    </label>
                    <input
                      type="text"
                      id="partNumber"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., BAPI-PT-4000"
                    />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
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
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="timeline"
                      className="mb-2 block text-sm font-semibold text-neutral-700"
                    >
                      Required Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Project Details</h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="application"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Application/Use Case *
                  </label>
                  <input
                    type="text"
                    id="application"
                    name="application"
                    required
                    value={formData.application}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., HVAC monitoring system for commercial buildings"
                  />
                </div>
                <div>
                  <label
                    htmlFor="details"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Additional Details *
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    required
                    rows={6}
                    value={formData.details}
                    onChange={handleInputChange}
                    className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Please provide any technical specifications, customization requirements, or other relevant details about your project..."
                  />
                </div>
              </div>
            </div>

            {/* File Attachments */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
              <h2 className="mb-2 text-xl font-bold text-neutral-900">Attachments (Optional)</h2>
              <p className="mb-6 text-sm text-neutral-600">
                Upload technical drawings, specifications, or other relevant documents (Max 10MB per
                file)
              </p>
              <div className="space-y-4">
                <label
                  htmlFor="file-upload"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors hover:border-primary-400 hover:bg-primary-50/50"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-neutral-400" strokeWidth={2} />
                    <p className="text-sm font-semibold text-neutral-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">PDF, DOC, XLS, JPG, PNG (Max 10MB)</p>
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
                        className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-primary-100">
                            <Upload className="h-4 w-4 text-primary-600" strokeWidth={2} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-neutral-900">
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
                          className="flex-shrink-0 p-1 text-neutral-400 transition-colors hover:text-red-600"
                        >
                          <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-end gap-4 sm:flex-row">
              <Link
                href={user ? '/account/quotes' : '/'}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                    Submitting...
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 p-6">
            <h3 className="mb-2 font-bold text-primary-900">Need Assistance?</h3>
            <p className="mb-4 text-sm text-primary-800">
              Our technical specialists are available to help you find the right solution for your
              project.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+1-555-123-4567"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Call: (555) 123-4567
              </a>
              <a
                href="mailto:quotes@bapi.com"
                className="inline-flex items-center justify-center rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-white"
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
