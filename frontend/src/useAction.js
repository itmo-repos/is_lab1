import { useState } from 'react';

export function useAction() {
  const [state, setState] = useState({ result: null, error: null });

  async function run(action) {
    try {
      setState({ result: await action(), error: null });
    } catch (e) {
      setState({ result: null, error: e.message });
    }
  }

  return { ...state, run };
}
