import { motion } from "framer-motion";
import { TrendingUp, Flame, Trophy } from "lucide-react";

interface ProgressCardProps {
  type: "progress" | "streak" | "achievements";
  value: string | number;
  subtitle: string;
  className?: string;
}

export default function ProgressCard({ type, value, subtitle, className = "" }: ProgressCardProps) {
  const configs = {
    progress: {
      icon: TrendingUp,
      bgClass: "bg-gradient-to-r from-islamic-green to-success-green",
      textClass: "text-white"
    },
    streak: {
      icon: Flame,
      bgClass: "bg-gradient-to-r from-golden-yellow to-warm-sand",
      textClass: "text-dark-slate"
    },
    achievements: {
      icon: Trophy,
      bgClass: "bg-gradient-to-r from-warm-sand to-islamic-green",
      textClass: "text-white"
    }
  };

  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${config.bgClass} p-6 rounded-2xl ${config.textClass} text-center shadow-lg ${className}`}
      data-testid={`progress-card-${type}`}
    >
      <IconComponent className="mx-auto text-3xl mb-3" />
      <h4 className="text-lg font-semibold mb-2 capitalize">
        {type === "progress" && "Overall Progress"}
        {type === "streak" && "Learning Streak"}
        {type === "achievements" && "Achievements"}
      </h4>
      <div className="text-3xl font-bold" data-testid={`${type}-value`}>{value}</div>
      <p className="text-sm opacity-75 sm:opacity-90">{subtitle}</p>
    </motion.div>
  );
}
