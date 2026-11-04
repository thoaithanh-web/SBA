// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { api, message } from "./api";

export function useData(path) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ data: null, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    setResult({ data: null, error: "" });
    api.get(path, { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) setResult({ data, error: "" });
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ data: null, error: message(error) });
    });
    return () => controller.abort();
  }, [path, version]);
  return { ...result, reload: () => setVersion((value) => value + 1) };
}
