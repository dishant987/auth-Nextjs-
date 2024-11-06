import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 rounded-lg dark:bg-gray-800 w-[97%] mb-3">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Dishant&apos;s Auth App
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xs">
              Secure authentication solutions for modern web applications.
            </p>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            {[
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Github, href: "https://github.com" },
            ].map((social) => (
              <a
                key={social.href}
                href={social.href}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.icon.name}</span>
                <social.icon className="h-10 w-10" />
              </a>
            ))}
          </div>
        </div>
        <div className=" border-gray-200 dark:border-gray-700  justify-center items-center">
          <p className="text-lg text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Dishant&apos;s Auth App. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
