import { useEffect } from "react";

interface ErrorMessageProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export default function ErrorMessage({ children, onClose }: ErrorMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="error-message">
      {children}
    </div>
  );
}
