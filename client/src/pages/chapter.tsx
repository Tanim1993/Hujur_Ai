import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import NavigationHeader from "@/components/navigation-header";
import AITeacher from "@/components/ai-teacher";
import type { Chapter, Lesson, UserProgress } from "@shared/schema";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function ChapterPage() {
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, params] = useRoute("/chapter/:chapterId");
  const chapterId = params?.chapterId || "";

  const { data: chapter } = useQuery<Chapter>({
    queryKey: ["/api/chapters", chapterId],
    enabled: !!chapterId,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ["/api/chapters", chapterId, "lessons"],
    enabled: !!chapterId,
  });

  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", authUser?.id, "chapters", chapterId, "progress"],
    enabled: !!chapterId && !!authUser?.id,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-slate">Please log in to access chapters</h2>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-slate">Chapter not found</h2>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = progress.filter(p => p.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lessonId === lessonId);
  };

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="chapter-page">
      <NavigationHeader />
      
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Chapter Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4" data-testid="button-back-home">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-dark-slate">{chapter.name}</h1>
              {chapter.nameBengali && (
                <p className="text-lg font-bengali text-islamic-green">{chapter.nameBengali}</p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chapter Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-islamic-green to-success-green rounded-full flex items-center justify-center text-white text-3xl mb-4">
                    {chapter.icon === "book-quran" && "📖"}
                    {chapter.icon === "pray" && "🤲"}
                    {chapter.icon === "hands-praying" && "🙏"}
                  </div>
                  <h2 className="text-xl font-bold text-dark-slate">{chapter.name}</h2>
                  {chapter.nameBengali && (
                    <p className="font-bengali text-islamic-green">{chapter.nameBengali}</p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-dark-slate">Progress</span>
                    <span className="text-sm font-semibold text-islamic-green">
                      {completedLessons}/{lessons.length} lessons
                    </span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>

                <p className="text-gray-600 text-sm text-center">{chapter.description}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <AITeacher
                  message={`Ready to learn about ${chapter.name}?`}
                  messageBengali={`${chapter.nameBengali} শিখতে প্রস্তুত?`}
                  showSpeechBubble={true}
                  size="sm"
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-dark-slate mb-6">Lessons</h3>
              
              <div className="space-y-4">
                {lessons.map((lesson, index) => {
                  const lessonProgress = getLessonProgress(lesson.id);
                  const isCompleted = lessonProgress?.completed || false;
                  const isLocked = index > 0 && !getLessonProgress(lessons[index - 1].id)?.completed;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl shadow-lg p-6 ${
                        isLocked ? "opacity-60" : ""
                      }`}
                      data-testid={`lesson-${lesson.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-success-green text-white"
                              : isLocked
                              ? "bg-gray-300 text-gray-500"
                              : "bg-islamic-green text-white"
                          }`}>
                            {isCompleted ? "✓" : isLocked ? "🔒" : lesson.order}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-dark-slate">
                              {lesson.title}
                            </h4>
                            {lesson.titleBengali && (
                              <p className="text-sm font-bengali text-islamic-green">
                                {lesson.titleBengali}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 capitalize">
                              {lesson.difficulty} • {isCompleted ? "Completed" : "Not started"}
                            </p>
                          </div>
                        </div>

                        {!isLocked && (
                          <Link href={`/lesson/${lesson.id}`}>
                            <Button
                              className={`${
                                isCompleted
                                  ? "bg-success-green hover:bg-green-600"
                                  : "bg-islamic-green hover:bg-green-700"
                              }`}
                              data-testid={`button-start-lesson-${lesson.id}`}
                            >
                              <Play size={16} className="mr-2" />
                              {isCompleted ? "Review" : "Start"}
                            </Button>
                          </Link>
                        )}

                        {isLocked && (
                          <Button disabled variant="outline" data-testid={`button-locked-${lesson.id}`}>
                            Locked
                          </Button>
                        )}
                      </div>

                      {lessonProgress?.score !== undefined && lessonProgress.score !== null && lessonProgress.score > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Best Score:</span>
                            <span className="font-semibold text-success-green">
                              {lessonProgress.score}%
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
