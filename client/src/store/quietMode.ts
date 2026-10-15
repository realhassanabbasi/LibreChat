import { createStorageAtom } from './jotai-utils';

/**
 * Quiet mode: agent tool activity renders as a single Gemini-style status line
 * instead of expanding into per-tool cards while the run is live. A persisted
 * display preference — the setting itself is the way back to the details.
 */
export const quietModeAtom = createStorageAtom<boolean>('quietMode', false);
