"use client";
import { useTranslation } from "@/app/i18n/client";
import React from "react";

interface FooterProps {
  lng: string;
}

const FooterComponent = (props: FooterProps) => {
  const { t } = useTranslation(props.lng, "footer");
  return (
    <footer className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="text-sm md:text-base">
            {t("made-with")}
            <a
              href="https://github.com/visheratin/web-ai"
              target="_blank"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Web AI
            </a>
          </div>
          <div>
            <a
              href="https://github.com/visheratin/ai-photo-sorter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gray-700 text-white h-10 w-10 rounded-md hover:bg-gray-500 mx-2 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.6-.015 2.89-.015 3.285 0 .32.21.694.825.577C20.565 22.097 24 17.6 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://twitter.com/visheratin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-cyan-500 text-white h-10 w-10 rounded-md hover:bg-cyan-400 mx-2 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.46 6.012c-.77.343-1.597.576-2.46.68.88-.527 1.556-1.362 1.874-2.354-.825.488-1.737.843-2.708 1.033-.778-.827-1.885-1.342-3.11-1.342-2.347 0-4.253 1.903-4.253 4.253 0 .33.04.653.115.96-3.533-.178-6.674-1.872-8.776-4.447-.366.63-.577 1.363-.577 2.144 0 1.48.75 2.782 1.9 3.542-.698-.022-1.355-.214-1.93-.535v.054c0 2.064 1.47 3.788 3.42 4.175-.358.097-.735.148-1.123.148-.276 0-.546-.027-.807-.076.547 1.7 2.134 2.937 4.014 2.97-1.47 1.15-3.318 1.835-5.33 1.835-.345 0-.687-.02-1.025-.06 1.9 1.218 4.158 1.93 6.574 1.93 7.88 0 12.2-6.518 12.2-12.197 0-.186-.005-.37-.014-.554.84-.6 1.568-1.35 2.142-2.206z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
