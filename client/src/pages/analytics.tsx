import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Target, Trophy, TrendingUp, BookOpen, Flame, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/navigation-header";
import type { UserAnalytics } from "@shared/schema";

export default function AnalyticsPage() {
  const userId = "default-user"; // In a real app, get from auth context

  const { data: analytics, isLoading } = useQuery<UserAnalytics>({
    queryKey: [`/api/users/${userId}/analytics`],
  });

  const { data: user } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="analytics-page">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">Track your Islamic learning journey with detailed insights</p>
          <p className="text-islamic-green font-bengali text-lg">আপনার শেখার অগ্রগতি দেখুন</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Time */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Total Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(analytics?.totalTimeSpent || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Time spent learning</p>
            </CardContent>
          </Card>

          {/* Lessons Completed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Lessons Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.totalLessonsCompleted || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Islamic lessons mastered</p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Flame className="mr-2 h-4 w-4 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {analytics?.currentStreak || 0} days
              </div>
              <p className="text-xs text-gray-500 mt-1">Keep learning daily!</p>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(analytics?.averageScore || 0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Lesson performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Progress Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Your learning activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.weeklyProgress?.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-gray-600">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex-1 max-w-xs">
                        <Progress 
                          value={Math.min((day.lessonsCompleted / 3) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {day.lessonsCompleted} lessons
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(day.timeSpent)}
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Badges earned on your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.achievementsEarned?.length ? (
                  analytics.achievementsEarned.map((achievement, index) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-golden-yellow rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Achievement {index + 1}</div>
                        <div className="text-xs text-gray-500">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Award className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-2 text-sm text-gray-500">
                      Complete lessons to earn achievements!
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Chapter Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Chapter Progress</CardTitle>
              <CardDescription>Your progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Chapters Completed</span>
                  <Badge variant="outline">
                    {analytics?.chaptersCompleted || 0} chapters
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Longest Streak</span>
                  <Badge variant="outline" className="text-orange-600">
                    {analytics?.longestStreak || 0} days
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Study Time</span>
                  <Badge variant="outline">
                    {formatTime(analytics?.totalTimeSpent || 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Sessions</CardTitle>
              <CardDescription>Your latest study activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.recentActivity?.length ? (
                  analytics.recentActivity.slice(0, 3).map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          {session.sessionType === 'lesson' ? 'Lesson Study' : 'Practice Session'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.startedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatTime(session.durationMinutes)}
                        </div>
                        {session.score > 0 && (
                          <div className="text-xs text-green-600">
                            {session.score}% score
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-2 text-sm text-gray-500">
                      Start learning to see your activity here!
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            className="bg-islamic-green hover:bg-islamic-green-700"
            onClick={() => window.location.href = '/'}
          >
            Continue Learning
          </Button>
          <Button variant="outline">
            Export Progress
          </Button>
        </div>
      </main>
    </div>
  );
}