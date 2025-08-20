import { motion } from "framer-motion";

interface AITeacherProps {
  message?: string;
  messageBengali?: string;
  showSpeechBubble?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AITeacher({
  message = "Let's learn together!",
  messageBengali = "চলুন একসাথে শিখি!",
  showSpeechBubble = false,
  size = "md"
}: AITeacherProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48", 
    lg: "w-64 h-64"
  };

  return (
    <div className="flex justify-center relative" data-testid="ai-teacher">
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Animated background circle */}
        <motion.div 
          className="absolute inset-0 bg-golden-yellow opacity-20 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* AI Teacher Character - Islamic Style */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-golden-yellow shadow-2xl bg-gradient-to-br from-islamic-green to-success-green flex items-center justify-center relative overflow-hidden`}>
          {/* Islamic-appropriate character without eyes/nose */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Face outline */}
            <div className="relative w-20 h-24 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full border-2 border-white">
              {/* Beard */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-full border-2 border-white"></div>
              
              {/* Mouth for smiling */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-dark-slate rounded-b-full opacity-60"></div>
              
              {/* Traditional cap/hat */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white rounded-t-full border-2 border-islamic-green"></div>
            </div>
          </div>
          
          {/* Name label */}
          <div className="absolute bottom-2 text-white text-center">
            <div className="text-xs font-medium bg-black bg-opacity-20 rounded-full px-2 py-1">Hujur</div>
          </div>
        </div>

        {/* Floating icons around character */}
        <motion.div
          className="absolute -top-4 -right-4 w-12 h-12 bg-golden-yellow rounded-full flex items-center justify-center"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          <span className="text-islamic-green text-lg">📖</span>
        </motion.div>
        
        <motion.div
          className="absolute top-16 -left-6 w-10 h-10 bg-warm-sand rounded-full flex items-center justify-center"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <span className="text-white text-sm">🤲</span>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-2 left-8 w-8 h-8 bg-success-green rounded-full flex items-center justify-center"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <span className="text-white text-xs">⭐</span>
        </motion.div>

        {/* Speech bubble */}
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-4 -right-8 bg-white p-4 rounded-2xl shadow-lg border-2 border-islamic-green max-w-xs"
            data-testid="speech-bubble"
          >
            <p className="text-sm text-dark-slate font-medium">{message}</p>
            <p className="text-xs font-bengali text-islamic-green mt-1">{messageBengali}</p>
            <div className="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-white"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
