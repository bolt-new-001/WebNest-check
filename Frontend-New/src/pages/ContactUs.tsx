import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Loader2, Globe2, Building2, Clock2, Shield, Sparkles, CircleDot, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/ui/navbar';
import { Link } from 'react-router-dom';

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/your-formspree-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Documentation', href: '/doc' },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@webnest.com',
      link: 'mailto:contact@webnest.com',
      description: 'For general inquiries and support',
      type: 'primary'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      description: 'Available Mon-Fri, 9AM-5PM EST',
      type: 'secondary'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: 'Tech District, Innovation City',
      link: 'https://maps.google.com',
      description: 'Visit our office during business hours',
      type: 'tertiary'
    },
    {
      icon: Globe2,
      title: 'Global Support',
      content: 'support@webnest.com',
      link: 'mailto:support@webnest.com',
      description: '24/7 international support',
      type: 'primary'
    },
    {
      icon: Building2,
      title: 'Head Office',
      content: '123 Innovation Street',
      link: 'https://maps.google.com',
      description: 'Main corporate headquarters',
      type: 'secondary'
    },
    {
      icon: Clock2,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-5PM EST',
      description: 'Extended support hours available',
      type: 'tertiary'
    },
  ];

  return (
    <div className="">
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img
                src="/logo.png"
                alt="WebNest Icon"
                className="h-8 w-8 object-cover rounded-sm"
              />
            </div>
            <span className="text-2xl font-bold text-gradient">WebNest</span>
          </Link>
        }
        items={navItems}
        actions={
          <>
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="gradient" size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-[#e7e1f5] via-[#c9bce7] to-[#e7e1f5]">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e7e1f5]/50 via-[#c9bce7]/50 to-[#e7e1f5]/50 rounded-3xl blur-3xl opacity-30"></div>
          <div className="container mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <Shield className="h-16 w-16 text-[#8b70cd]" />
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8b70cd] to-[#aa96da] mb-6">
                  Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b70cd] to-[#aa96da]">Touch</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Have a question or want to work together? We'd love to hear from you.
                  Send us a message and we'll respond as soon as possible.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg">
                    <Sparkles className="h-4 w-4 mr-2" /> Schedule Demo
                  </Button>
                  <Button variant="outline" size="lg">
                    <CircleDot className="h-4 w-4 mr-2" /> Contact Sales
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full mb-4 ${info.type === 'primary' ? 'bg-[#e7e1f5]' :
                        info.type === 'secondary' ? 'bg-[#c9bce7]' :
                          'bg-gray-100'
                      }`}>
                      <info.icon className="h-6 w-6 text-[#8b70cd]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{info.title}</h3>
                    <p className="text-gray-600 mb-2">{info.content}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                    {info.link && (
                      <a
                        href={info.link}
                        className="text-[#8b70cd] hover:text-[#aa96da] mt-2"
                      >
                        {info.link.includes('mailto:') ? 'Send Email' : 
                         info.link.includes('tel:') ? 'Call Now' : 
                         info.link.includes('http') ? 'Visit Website' : 
                         'View Location'}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're here to help! Whether you have a question, want to collaborate, or need support,
                  our team is ready to assist you.
                </p>
              </div>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General Inquiry</TabsTrigger>
                  <TabsTrigger value="technical">Technical Support</TabsTrigger>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="partnership">Partnership</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your inquiry..."
                        required
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <span>Send Message</span>
                        )}
                      </Button>

                      {showSuccess && (
                        <div className="text-green-600 text-sm">
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Message sent successfully!
                          </span>
                        </div>
                      )}
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="technical">
                  {/* Technical Support form content */}
                </TabsContent>

                <TabsContent value="sales">
                  {/* Sales form content */}
                </TabsContent>

                <TabsContent value="partnership">
                  {/* Partnership form content */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596698663!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564764047!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Find quick answers to common questions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/80 hover:bg-white transition-colors duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">
                    What services do you offer?
                  </h3>
                  <p className="text-gray-600">
                    We offer web development, mobile app development, UI/UX design,
                    and digital transformation consulting services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">
                    How long does a typical project take?
                  </h3>
                  <p className="text-gray-600">
                    Project timelines vary based on complexity. A simple website might
                    take 4-6 weeks, while larger applications can take 3-6 months.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Do you provide ongoing support?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer various maintenance and support packages to keep
                    your application running smoothly after launch.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">
                    What is your pricing model?
                  </h3>
                  <p className="text-gray-600">
                    We offer flexible pricing models including fixed-price projects
                    and time-and-materials arrangements based on your needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}