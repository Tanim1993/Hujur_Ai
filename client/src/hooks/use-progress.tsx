import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UserProgress } from "@shared/schema";

const USER_ID = "default-user"; // In a real app, this would come from auth

export function useUserProgress() {
  return useQuery<UserProgress[]>({
    queryKey: ["/api/users", USER_ID, "progress"],
  });
}

export function useChapterProgress(chapterId: string) {
  return useQuery<UserProgress[]>({
    queryKey: ["/api/users", USER_ID, "chapters", chapterId, "progress"],
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progressData: {
      lessonId: string;
      chapterId: string;
      completed: boolean;
      score?: number;
    }) => {
      const response = await apiRequest("POST", "/api/progress", {
        ...progressData,
        userId: USER_ID,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", USER_ID, "progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", USER_ID, "chapters"] });
    },
  });
}
