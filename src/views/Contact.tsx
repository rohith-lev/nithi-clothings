import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="font-body min-h-screen bg-[#FAF8F1]">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#064E3B] mb-6">Contact Us</h1>
          <p className="text-lg text-[#5C635E] max-w-2xl mx-auto leading-relaxed">
            We are here to assist you. Whether you have a question about our collections, need styling advice, 
            or want to inquire about an order, our concierge is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 bg-white p-8 rounded-sm border border-[#E8E2D5] shadow-sm">
            <div>
              <h3 className="font-display text-xl font-bold text-[#1A1008] mb-2 text-[#064E3B]">Boutique Location</h3>
              <p className="text-sm text-[#5C635E]">
                Nithi Collection Flagship Boutique<br />
                Heritage Handloom Enclave<br />
                Madurai - 625001, Tamil Nadu, India
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#1A1008] mb-2 text-[#064E3B]">Direct Inquiries</h3>
              <p className="text-sm text-[#5C635E]">
                Email: care@nithicollection.com<br />
                Phone: +91 98765 43210 / +91 98401 23456
              </p>
              <p className="text-xs text-[#5C635E] mt-1">Available Mon - Sat: 9:30 AM to 8:30 PM IST</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#1A1008] mb-2 text-[#064E3B]">Social Media</h3>
              <div className="flex gap-4 mt-3">
                {["Instagram", "Facebook", "Pinterest", "WhatsApp"].map((platform) => (
                  <span key={platform} className="text-sm font-semibold text-[#C9A227] hover:text-[#064E3B] cursor-pointer transition-colors">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-sm border border-[#E8E2D5] shadow-sm">
            <h3 className="font-display text-2xl font-bold text-[#1A1008] mb-6">Send a Message</h3>
            {submitted ? (
              <div className="p-4 bg-[#064E3B] text-[#C9A227] text-sm rounded-sm font-medium">
                Thank you for your message. Our team will get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#064E3B] text-white py-3.5 font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-[#0B3D2E] transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
