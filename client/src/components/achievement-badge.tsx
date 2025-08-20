import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  color: "golden-yellow" | "islamic-green" | "warm-sand" | "gray";
  earned?: boolean;
  earnedDate?: string;
  progress?: string;
  className?: string;
}

export default function AchievementBadge({
  title,
  description,
  icon,
  color,
  earned = false,
  earnedDate,
  progress,
  className = ""
}: AchievementBadgeProps) {
  const colorClasses = {
    "golden-yellow": "bg-gradient-to-br from-golden-yellow to-warm-sand text-dark-slate",
    "islamic-green": "bg-gradient-to-br from-islamic-green to-success-green text-white",
    "warm-sand": "bg-gradient-to-br from-warm-sand to-golden-yellow text-dark-slate",
    "gray": "bg-gray-100 border-2 border-dashed border-gray-300"
  };

  const iconMap: { [key: string]: string } = {
    "book-open": "📖",
    "fire": "🔥",
    "star": "⭐",
    "lock": "🔒",
    "trophy": "🏆",
    "target": "🎯"
  };

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      className={`p-6 rounded-2xl text-center shadow-lg ${colorClasses[color]} ${className}`}
      data-testid={`achievement-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
        {earned ? (
          <span className="text-2xl">{iconMap[icon] || "🏆"}</span>
        ) : (
          <Lock className="text-2xl text-gray-400" />
        )}
      </div>
      
      <h4 className={`font-bold mb-2 ${!earned ? "text-gray-400" : ""}`}>
        {title}
      </h4>
      
      <p className={`text-sm ${earned ? "opacity-75" : "text-gray-400"}`}>
        {description}
      </p>
      
      <div className={`mt-3 text-xs rounded-full px-3 py-1 inline-block ${
        earned
          ? "bg-white bg-opacity-50"
          : "bg-gray-200 text-gray-500"
      }`}>
        {earned && earnedDate ? `Earned ${earnedDate}` : progress || "Not earned"}
      </div>
    </motion.div>
  );
}
