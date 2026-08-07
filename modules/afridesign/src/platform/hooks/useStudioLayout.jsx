import { useState } from 'react';

export default function useStudioLayout() {
  const [layout, setLayout] = useState({ sidebar: true, toolbar: true });
  return { layout, setLayout };
}
