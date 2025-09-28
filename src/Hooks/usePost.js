import { useState, useCallback } from "react";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function usePost() {
  const [response, setResponse] = useState({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const post = useCallback(
    async (url, body, retries = 0, retryDelay = 1000) => {
      const token = localStorage.getItem("token");

      setResponse({ data: null, loading: true, error: null, status: null });

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res = await axios.post(url, body, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          setResponse({
            data: res.data,
            loading: false,
            error: null,
            status: res.status,
          });

          return res.data; 
        } catch (err) {
          if (attempt < retries) {
            await delay(retryDelay);
            continue;
          }

          setResponse({
            data: null,
            loading: false,
            error:
              err.response?.data?.message || err.message || "Unknown error",
            status: err.response?.status || null,
          });
        }
      }
    },
    []
  );

  return { ...response, post };
}

export default usePost;
