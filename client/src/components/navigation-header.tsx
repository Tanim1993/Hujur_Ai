import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Church, User as UserIcon } from "lucide-react";

const USER_ID = "default-user";

export default function NavigationHeader() {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", USER_ID],
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "bn" : "en");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" data-testid="navigation-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-islamic-green rounded-full flex items-center justify-center">
              <Church className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-islamic-green">Hujur</h1>
              <p className="text-sm text-dark-slate font-bengali">ইসলামী শিক্ষা</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-islamic-green text-white"
                    : "text-dark-slate hover:bg-gray-200"
                }`}
                data-testid="button-language-en"
              >
                EN
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium font-bengali transition-colors ${
                  language === "bn"
                    ? "bg-islamic-green text-white"
                    : "text-dark-slate hover:bg-gray-200"
                }`}
                data-testid="button-language-bn"
              >
                বাং
              </button>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-islamic-green to-success-green rounded-full flex items-center justify-center">
              <UserIcon className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
