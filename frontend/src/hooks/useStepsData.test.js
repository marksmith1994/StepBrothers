import { renderHook, act } from '@testing-library/react';
import { useStepsData } from './useStepsData';

const mockSteps = [
  { month: 'January', steps: { Mark: 1000, John: 2000 }, total: 3000 },
  { month: 'February', steps: { Mark: 1500, John: 2500 }, total: 4000 },
];
const mockTotals = { Mark: 2500, John: 4500 };

global.fetch = jest.fn((url) => {
  if (url.includes('totals')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTotals) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSteps) });
});

describe('useStepsData', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('fetches steps data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useStepsData());
    await waitForNextUpdate();
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].month).toBe('January');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('fetches totals data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useStepsData({ totals: true }));
    await waitForNextUpdate();
    expect(result.current.data).toEqual(mockTotals);
  });

  it('handles fetch error', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    const { result, waitForNextUpdate } = renderHook(() => useStepsData());
    await waitForNextUpdate();
    expect(result.current.error).not.toBe(null);
  });
});
