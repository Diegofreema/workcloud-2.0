import { useState } from "react";
import { useDebounce } from "use-debounce";

export const useSearch = () => {
  const [value, setValue] = useState("");
  const [query] = useDebounce(value, 500);
  const onClear = () => setValue("");
  return { value, setValue, query, onClear };
};
