import React from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col gap-y-5 items-center   bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;