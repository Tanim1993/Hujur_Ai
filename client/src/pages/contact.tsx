import { Link } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import { Mail, MessageCircle, Clock, MapPin, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-ghost-white">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center text-islamic-green hover:text-islamic-green-700 transition-colors mb-4">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-dark-slate mb-2">Contact Us</h1>
          <p className="text-gray-600 font-bengali">যোগাযোগ করুন</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="text-islamic-green mr-3" size={24} />
              <h2 className="text-xl font-semibold">Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="lesson-content">Lesson Content Question</option>
                  <option value="account-help">Account Help</option>
                  <option value="parent-inquiry">Parent Inquiry</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="general">General Question</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green focus:border-transparent resize-none"
                  placeholder="Please describe your question or concern in detail..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-islamic-green hover:bg-islamic-green-700 text-white py-3"
              >
                <Send className="mr-2" size={18} />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Mail className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold">Get in Touch</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-islamic-green mr-3 mt-1" size={18} />
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-gray-600 text-sm">support@hujur.app</p>
                    <p className="text-gray-500 text-xs">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-blue-600 mr-3 mt-1" size={18} />
                  <div>
                    <h3 className="font-medium">Support Hours</h3>
                    <p className="text-gray-600 text-sm">Saturday - Thursday: 9 AM - 6 PM (UTC+6)</p>
                    <p className="text-gray-500 text-xs">Closed on Fridays and Islamic holidays</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-purple-600 mr-3 mt-1" size={18} />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                    <p className="text-gray-500 text-xs">Serving the global Muslim community</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-islamic-green rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Quick Help</h3>
              <div className="space-y-3">
                <Link href="/help-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 hover:bg-opacity-30 transition-colors cursor-pointer">
                    <h4 className="font-medium">📚 Help Center</h4>
                    <p className="text-sm opacity-90">Find answers to common questions</p>
                  </div>
                </Link>
                
                <Link href="/parent-guide">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 hover:bg-opacity-30 transition-colors cursor-pointer">
                    <h4 className="font-medium">👨‍👩‍👧‍👦 Parent Guide</h4>
                    <p className="text-sm opacity-90">Resources for parents and guardians</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Educational Excellence</h3>
              <p className="text-sm opacity-90 mb-3">
                Our team includes qualified Islamic scholars, experienced educators, and child development specialists 
                dedicated to providing authentic and age-appropriate Islamic education.
              </p>
              <div className="flex items-center text-sm">
                <span className="bg-white bg-opacity-20 rounded-full px-3 py-1 mr-2">✓ Authentic Content</span>
                <span className="bg-white bg-opacity-20 rounded-full px-3 py-1">✓ Expert Review</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Response Time</h3>
              <p className="text-sm text-yellow-700 mt-1">
                We aim to respond to all inquiries within 24 hours during business days. 
                For urgent technical issues affecting lesson access, we typically respond within 4-6 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}