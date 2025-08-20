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
        
        {/* Realistic 3D AI Teacher Character */}
        <div className={`${sizeClasses[size]} rounded-2xl shadow-2xl bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden border border-slate-200`}>
          
          {/* Professional Islamic Teacher Figure */}
          <div className="relative w-full h-full flex flex-col items-center justify-end p-4">
            
            {/* Head with Traditional Cap */}
            <motion.div 
              className="relative mb-2"
              animate={{ 
                rotateY: isAnimating ? [-3, 3, -3] : [-1, 1, -1],
                y: isAnimating ? [-2, 2, -2] : [-1, 1, -1]
              }}
              transition={{ 
                duration: isAnimating ? 2 : 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Traditional Islamic Cap (Taqiyah) */}
              <div className="w-16 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-full mb-1 mx-auto border border-slate-600 shadow-md"></div>
              
              {/* Head/Face - More realistic proportions */}
              <div className="w-14 h-16 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-full border-2 border-white shadow-lg relative">
                
                {/* Realistic beard */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-b-full shadow-inner border border-slate-500"></div>
                
                {/* Subtle facial features without eyes/nose */}
                <motion.div 
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-slate-600 rounded-b-lg opacity-60"
                  animate={{ 
                    scaleX: isAnimating ? [1, 1.2, 1] : [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: isAnimating ? 1 : 3, 
                    repeat: Infinity 
                  }}
                />
                
                {/* Cheek definition */}
                <div className="absolute top-4 left-1 w-2 h-2 bg-amber-200 rounded-full opacity-50"></div>
                <div className="absolute top-4 right-1 w-2 h-2 bg-amber-200 rounded-full opacity-50"></div>
              </div>
            </motion.div>

            {/* Body - Professional Islamic Clothing */}
            <motion.div 
              className="relative w-28 h-32 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 rounded-t-3xl shadow-lg border border-slate-400"
              animate={{ 
                scaleY: isAnimating ? [1, 1.03, 1] : [1, 1.01, 1]
              }}
              transition={{ 
                duration: isAnimating ? 2 : 4, 
                repeat: Infinity 
              }}
            >
              {/* Traditional clothing details */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-px h-6 bg-slate-500"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-px bg-slate-400"></div>
              
              {/* Realistic arms */}
              <motion.div 
                className="absolute top-4 -left-4 w-8 h-12 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full border border-slate-400 shadow-md"
                animate={{ 
                  rotateZ: isAnimating ? [-8, 8, -8] : [-3, 3, -3]
                }}
                transition={{ 
                  duration: isAnimating ? 2 : 5, 
                  repeat: Infinity 
                }}
              />
              <motion.div 
                className="absolute top-4 -right-4 w-8 h-12 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full border border-slate-400 shadow-md"
                animate={{ 
                  rotateZ: isAnimating ? [8, -8, 8] : [3, -3, 3]
                }}
                transition={{ 
                  duration: isAnimating ? 2 : 5, 
                  repeat: Infinity,
                  delay: 0.3 
                }}
              />
              
              {/* Hands gesture */}
              <motion.div 
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-amber-100 rounded-lg border border-amber-200 shadow-sm"
                animate={{ 
                  y: isAnimating ? [-3, 3, -3] : [-1, 1, -1]
                }}
                transition={{ 
                  duration: isAnimating ? 1.5 : 3, 
                  repeat: Infinity 
                }}
              />
            </motion.div>
            
            {/* Professional name label */}
            <motion.div 
              className="mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg border border-emerald-500"
              animate={{ 
                scale: isAnimating ? [1, 1.05, 1] : [1, 1.02, 1]
              }}
              transition={{ 
                duration: isAnimating ? 1.5 : 3, 
                repeat: Infinity 
              }}
            >
              Hujur صاحب
            </motion.div>
          </div>
        </div>

        {/* Professional floating elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-md opacity-70"
          animate={{ 
            y: [-3, 3, -3],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        />
        
        <motion.div
          className="absolute top-16 -left-4 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-md opacity-60"
          animate={{ 
            y: [-2, 2, -2],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        
        <motion.div
          className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full shadow-md opacity-50"
          animate={{ 
            y: [-2, 2, -2],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

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
