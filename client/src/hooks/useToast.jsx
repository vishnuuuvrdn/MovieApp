import { useState } from "react";

function useToast(duration = 3000) {
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), duration);
  };
  return { toast, showToast };
}

export default useToast;
