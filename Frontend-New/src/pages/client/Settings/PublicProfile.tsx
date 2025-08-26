import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { getInitials } from '@/lib/utils';
import { ArrowLeft, Star, Calendar, Building2, Phone, Mail, Trophy, Target, CheckCircle, Users, Award, Globe, MapPin, Briefcase, Clock, Verified } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/profile/public/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Profile not found');
      }
    },
    retry: 1,
  });

  const profile = response?.data || response;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full border-t-blue-400 animate-ping mx-auto"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Profile Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-600">The requested profile could not be found or is private.</p>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-xl transition-all duration-200"
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {profile.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-200/60 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%236366f1&#39; fill-opacity=&#39;0.05&#39;%3E%3Cpath d=&#39;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="relative">
                  <Avatar className="w-32 h-32 ring-4 ring-white shadow-2xl">
                    <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {profile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                      <Verified className="w-6 h-6 text-white fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <Badge className={`px-4 py-2 rounded-xl font-medium text-sm ${profile.isPremium
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700'
                      }`}>
                      {profile.isPremium ? '⭐ Premium Member' : 'Basic Member'}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 rounded-xl font-medium text-sm border-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since {formatDate(profile.createdAt)}
                    </Badge>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">{profile.bio}</p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span className="font-semibold">{profile.stats?.averageRating || 'N/A'}</span>
                    <span className="text-sm">({profile.stats?.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold">{profile.stats?.completedProjects || 0}</span>
                    <span className="text-sm">completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">{profile.stats?.successRate || 0}%</span>
                    <span className="text-sm">success rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="group">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-slate-900">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="group">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                          <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.company && (
                    <div className="group">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Company</p>
                          <p className="text-sm font-medium text-slate-900">{profile.company}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="group">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</p>
                          <p className="text-sm font-medium text-slate-900">{profile.location}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 rounded-xl font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Statistics */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                  <Trophy className="w-6 h-6 text-amber-600" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{profile.stats?.totalProjects || 0}</p>
                      <p className="text-sm text-slate-600 font-medium">Total Projects</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{profile.stats?.completedProjects || 0}</p>
                      <p className="text-sm text-slate-600 font-medium">Completed</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{profile.stats?.averageRating || 'N/A'}</p>
                      <p className="text-sm text-slate-600 font-medium">Avg. Rating</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-600 fill-current" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <Award className="w-6 h-6 text-yellow-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{achievement.title}</p>
                          <p className="text-xs text-slate-600">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}