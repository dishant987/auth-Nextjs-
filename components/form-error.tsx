import { AlertCircle } from "lucide-react";
import React from "react";

const FormError = ({ message }: { message: string }) => {
  return (
    <p className="flex items-center text-red-500 bg-red-50 rounded-lg p-2 gap-2">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
};

export default FormError;
