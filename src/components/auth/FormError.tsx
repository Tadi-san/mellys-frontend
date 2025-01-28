import { CircleAlert } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="w-full flex items-center gap-x-2 bg-destructive/15 p-3 rounded-md text-sm text-destructive">
      <CircleAlert className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
