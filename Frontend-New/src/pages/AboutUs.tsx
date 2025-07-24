import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket, Star, Code2, Globe2, Zap, Shield, TrendingUp, Sparkles, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AboutUs() {
  const stats = [
    {
      label: 'Active Users',
      value: '10K+',
      icon: Users,
      description: 'Monthly active users growing at 20% MoM',
      trend: 'up'
    },
    {
      label: 'Projects Deployed',
      value: '50K+',
      icon: Rocket,
      description: 'Successfully deployed projects across 50+ industries',
      trend: 'up'
    },
    {
      label: 'Countries',
      value: '30+',
      icon: Globe2,
      description: 'Global presence with offices in 10+ countries',
      trend: 'up'
    },
    {
      label: 'Team Members',
      value: '50+',
      icon: Users,
      description: 'Dedicated professionals from 15+ nationalities',
      trend: 'up'
    },
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      bio: 'With over 15 years of experience in web development and digital transformation.',
      expertise: ['Strategy', 'Leadership', 'Innovation'],
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith'
    },
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      bio: 'Full-stack developer with expertise in React, Node.js, and cloud architecture.',
      expertise: ['React', 'Node.js', 'Cloud'],
      github: 'https://github.com/sarahjohnson'
    },
    {
      name: 'Michael Chen',
      role: 'Design Director',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      bio: 'Award-winning designer focused on creating beautiful and functional user experiences.',
      expertise: ['UI/UX', 'Branding', 'Visual Design'],
      dribbble: 'https://dribbble.com/michaelchen'
    },
    {
      name: 'Emily Davis',
      role: 'Project Manager',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      bio: 'Certified project manager with a track record of delivering projects on time and within budget.',
      expertise: ['Agile', 'Scrum', 'Project Management'],
      linkedin: 'https://linkedin.com/in/emilydavis'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl bg-white rounded-2xl shadow-lg">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Your trusted partner in digital transformation and web development.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white/10 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                      <CardDescription className="text-sm">{stat.label}</CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/80">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to excellence
            </p>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-gray-600 mb-2">{member.role}</p>
                      <p className="text-gray-500 mb-4">{member.bio}</p>
                      <div className="flex gap-2 mb-4">
                        {member.expertise.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            LinkedIn
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            GitHub
                          </a>
                        )}
                        {member.dribbble && (
                          <a
                            href={member.dribbble}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Dribbble
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                          >
                            Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="leadership">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team
                  .filter(member => member.role.includes('CEO') || member.role.includes('Founder'))
                  .map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 mb-2">{member.role}</p>
                        <p className="text-gray-500 mb-4">{member.bio}</p>
                        <div className="flex gap-2 mb-4">
                          {member.expertise.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              LinkedIn
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-600"
                            >
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="tech">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team
                  .filter(member => member.role.includes('Developer') || member.role.includes('Tech'))
                  .map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 mb-2">{member.role}</p>
                        <p className="text-gray-500 mb-4">{member.bio}</p>
                        <div className="flex gap-2 mb-4">
                          {member.expertise.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              GitHub
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="design">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team
                  .filter(member => member.role.includes('Designer') || member.role.includes('Design'))
                  .map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 mb-2">{member.role}</p>
                        <p className="text-gray-500 mb-4">{member.bio}</p>
                        <div className="flex gap-2 mb-4">
                          {member.expertise.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          {member.dribbble && (
                            <a
                              href={member.dribbble}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800"
                            >
                              Dribbble
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
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
  );
}