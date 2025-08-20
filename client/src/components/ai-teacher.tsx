import { motion } from "framer-motion";

interface AITeacherProps {
  message?: string;
  messageBengali?: string;
  showSpeechBubble?: boolean;
  size?: "sm" | "md" | "lg";
  isAnimating?: boolean;
}

export default function AITeacher({
  message = "Let's learn together!",
  messageBengali = "চলুন একসাথে শিখি!",
  showSpeechBubble = false,
  size = "md",
  isAnimating = false
}: AITeacherProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48", 
    lg: "w-64 h-64"
  };

  return (
    <div className="flex justify-center relative" data-testid="ai-teacher">
      <motion.div
        animate={{ 
          y: isAnimating ? [-8, 8, -8] : [-5, 5, -5],
          scale: isAnimating ? [1, 1.05, 1] : [1, 1.02, 1]
        }}
        transition={{ 
          duration: isAnimating ? 1.5 : 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative"
      >
        {/* Animated background circle */}
        <motion.div 
          className="absolute inset-0 bg-golden-yellow opacity-20 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* AI Teacher Character - 3D Islamic Style */}
        <div className={`${sizeClasses[size]} rounded-3xl border-4 border-golden-yellow shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden`}>
          {/* Main Character Body */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* Traditional Cap/Taqiyah */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-full border-2 border-gray-500 shadow-lg z-10"></div>
            
            {/* Head/Face */}
            <motion.div 
              className="relative w-20 h-24 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full border-4 border-white shadow-lg z-20"
              animate={{ rotateZ: [-1, 1, -1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Beard */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full border-2 border-gray-500 shadow-inner"></div>
              
              {/* Smiling mouth */}
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-2 border-dark-slate rounded-b-full opacity-70"
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>
              
              {/* Gentle cheek highlights */}
              <div className="absolute top-6 left-2 w-3 h-3 bg-pink-200 rounded-full opacity-40"></div>
              <div className="absolute top-6 right-2 w-3 h-3 bg-pink-200 rounded-full opacity-40"></div>
            </motion.div>

            {/* Traditional Islamic Clothing - Thobe/Kurta */}
            <motion.div 
              className="relative w-32 h-40 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-3xl mt-2 border-2 border-gray-500 shadow-lg"
              animate={{ scaleY: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Clothing details */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-600 rounded-full"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-500 rounded-full"></div>
              
              {/* Arms */}
              <motion.div 
                className="absolute top-6 -left-6 w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border-2 border-gray-500 shadow-md"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute top-6 -right-6 w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border-2 border-gray-500 shadow-md"
                animate={{ rotate: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              ></motion.div>
              
              {/* Hands in prayer position */}
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-200 rounded-full border-2 border-yellow-300 shadow-md"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>
          </div>
          
          {/* Name label */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold bg-islamic-green text-white rounded-full px-4 py-2 shadow-lg border-2 border-white">
              Hujur صاحب
            </div>
          </div>
        </div>

        {/* Floating Islamic symbols around character */}
        <motion.div
          className="absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-golden-yellow to-warm-sand rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          animate={{ 
            y: [-4, 4, -4],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        >
          <span className="text-islamic-green text-xl">📖</span>
        </motion.div>
        
        <motion.div
          className="absolute top-20 -left-8 w-12 h-12 bg-gradient-to-br from-warm-sand to-golden-yellow rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          animate={{ 
            y: [-3, 3, -3],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <span className="text-white text-lg">🤲</span>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-4 left-10 w-10 h-10 bg-gradient-to-br from-success-green to-islamic-green rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          animate={{ 
            y: [-3, 3, -3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <span className="text-white text-sm">⭐</span>
        </motion.div>
        
        <motion.div
          className="absolute top-8 right-8 w-8 h-8 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-md border border-white"
          animate={{ 
            y: [-2, 2, -2],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
        >
          <span className="text-pink-600 text-xs">💫</span>
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
