import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket, Star, Code2, Globe2, Zap, ArrowRight, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer'
import { Link } from 'react-router-dom';

export function AboutUs() {
  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Projects Deployed', value: '50K+', icon: Rocket },
    { label: 'Countries', value: '30+', icon: Globe2 },
    { label: 'Team Members', value: '50+', icon: Users },
  ];

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Help', href: '/help' },
    { title: 'Documentation', href: '/doc' },
  ]

  const footerSections = [
    {
      title: 'Services',
      links: [
        { title: 'Web Development', href: '/services/web' },
        { title: 'E-commerce', href: '/services/ecommerce' },
        { title: 'Mobile Apps', href: '/services/mobile' },
        { title: 'Consulting', href: '/services/consulting' },
      ]
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '/about' },
        { title: 'Portfolio', href: '/portfolio' },
        { title: 'Careers', href: '/careers' },
        { title: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Support',
      links: [
        { title: 'Help Center', href: '/help' },
        { title: 'Documentation', href: '/doc' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
      ]
    },
  ]

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      bio: 'With over 15 years of experience in web development and digital transformation.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      bio: 'Full-stack developer with expertise in React, Node.js, and cloud architecture.',
    },
    {
      name: 'Michael Chen',
      role: 'Design Director',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      bio: 'Award-winning designer focused on creating beautiful and functional user experiences.',
    },
    {
      name: 'Emily Davis',
      role: 'Project Manager',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      bio: 'Certified project manager with a track record of delivering projects on time and within budget.',
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

      <div className="min-h-screen bg-gradient-to-br from-[#e7e1f5] to-[#c9bce7]">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                About <span className="text-[#8b70cd]">WebNest</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We are a team of passionate developers, designers, and digital craftsmen dedicated to
                creating exceptional web experiences that help businesses thrive in the digital age.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-12 w-12 text-[#8b70cd] mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-[#8b70cd] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                To empower businesses with innovative web solutions that drive growth,
                enhance user experience, and create lasting digital success.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/80 hover:bg-white transition-colors duration-300">
                <CardHeader>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We stay at the forefront of technology to deliver cutting-edge solutions
                    that give our clients a competitive advantage.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We maintain the highest standards in code quality, design, and user experience
                    to ensure exceptional results for every project.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Partnership</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We build long-term relationships with our clients, working together to achieve
                    their business goals through technology.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The talented people behind our success.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center bg-white/80 hover:bg-white transition-colors duration-300">
                    <CardHeader>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 mx-auto rounded-full mb-4"
                      />
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="text-[#8b70cd] font-medium">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We strive for excellence in every aspect of our work, from code quality
                    to client communication and project delivery.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We embrace new technologies and methodologies to deliver innovative
                    solutions that solve real business challenges.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We maintain the highest standards of honesty and transparency in all
                    our business relationships and practices.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We believe in the power of teamwork and partnership to achieve
                    exceptional results for our clients.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer
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
        sections={footerSections}
        social={[
          {
            icon: <Globe className="h-5 w-5" />,
            href: "https://webnest.netlify.app",
            label: "Website"
          },
          {
            icon: <div className="p-1 rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <img src="/logo.png" alt="WebNest Icon" className="h-5 w-5 object-cover rounded-sm" />
            </div>,
            href: "https://github.com/webnestpro",
            label: "GitHub"
          },
        ]}
      />
    </div>
  );
}