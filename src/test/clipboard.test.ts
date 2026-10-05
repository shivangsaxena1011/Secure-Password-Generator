import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '../utils/clipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false for empty input text', async () => {
    const success = await copyToClipboard('');
    expect(success).toBe(false);
  });

  it('uses modern navigator.clipboard.writeText when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const success = await copyToClipboard('TestSecret123!');
    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('TestSecret123!');
  });

  it('falls back to document.execCommand when navigator.clipboard fails', async () => {
    // Fail modern clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });

    // Mock document.execCommand
    const execCommandMock = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandMock;

    const success = await copyToClipboard('FallbackPassword');
    expect(success).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });
});
