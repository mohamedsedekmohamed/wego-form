import { useState, useCallback } from "react";
import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useGet() {
  const [response, setResponse] = useState({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const get = useCallback(async (url, retries = 0, retryDelay = 1000) => {
    const token = localStorage.getItem("token");

    setResponse({ data: null, loading: true, error: null, status: null });

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResponse({
          data: res.data,
          loading: false,
          error: null,
          status: res.status,
        });

        return res.data; // 👈 عشان تقدر ترجع الداتا مباشرة
      } catch (err) {
        if (attempt < retries) {
          await delay(retryDelay);
          continue;
        }

        setResponse({
          data: null,
          loading: false,
          error: err.response?.data?.message || err.message || "Unknown error",
          status: err.response?.status || null,
        });
      }
    }
  }, []);

  return { ...response, get };
}
