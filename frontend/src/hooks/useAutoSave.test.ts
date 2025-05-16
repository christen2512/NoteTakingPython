import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { useAutoSave, SAVE_DEBOUNCE_MS as HOOK_DEBOUNCE_MS } from './useAutoSave'; // Actual import

const createMockEditor = () => ({
  on: vi.fn(),
  off: vi.fn(),
  getJSON: vi.fn(() => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello Test' }] }] })),
  isDestroyed: false,
});

const mockActualSaveFunction = vi.fn(async (docId: string | null | undefined, content: any) => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); 
  // console.log('Mock save function called with:', docId, content);
});

// Equivalent to C# Test Class  
describe('useAutoSave Hook', () => {
  let mockEditorInstance: ReturnType<typeof createMockEditor>;
  const testDocumentId = 'test-doc-xyz';

  // Runs before each test
  beforeEach(() => {
    mockEditorInstance = createMockEditor();
    vi.useFakeTimers();
    mockActualSaveFunction.mockClear();
  });

  // Runs after each test   
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // Equivalent to C# Test Method
  it('should call the save function with editor content after "update" event and debounce period', () => {
    renderHook(() => useAutoSave(
      mockEditorInstance as unknown as Editor,
      testDocumentId,
      mockActualSaveFunction,
      HOOK_DEBOUNCE_MS
    ));

    const editorOnCall = mockEditorInstance.on.mock.calls[0];
    expect(editorOnCall[0]).toBe('update');
    const updateListener = editorOnCall[1] as () => void;

    // You always want to use this if you are changing state
    // You do this because you want to make sure you're testing the latest state    
    act(() => {
      updateListener(); // Simulate editor content update
    });

    expect(mockActualSaveFunction).not.toHaveBeenCalled(); // Not called immediately

    act(() => {
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS); // Advance time by the debounce interval
    });

    expect(mockActualSaveFunction).toHaveBeenCalledTimes(1);
    expect(mockActualSaveFunction).toHaveBeenCalledWith(testDocumentId, mockEditorInstance.getJSON());
  });

  it('should not subscribe to editor events if editor is null', () => {
    renderHook(() => useAutoSave(null, testDocumentId, mockActualSaveFunction, HOOK_DEBOUNCE_MS));
    expect(mockEditorInstance.on).not.toHaveBeenCalled();
  });

  it('should not subscribe to editor events if editor is destroyed', () => {
    const destroyedEditor = { ...createMockEditor(), isDestroyed: true };
    renderHook(() => useAutoSave(
      destroyedEditor as unknown as Editor,
      testDocumentId,
      mockActualSaveFunction,
      HOOK_DEBOUNCE_MS
    ));
    expect(destroyedEditor.on).not.toHaveBeenCalled(); // The mock 'on' of this specific instance
  });

  it('should cancel debounced save on unmount', () => {
    const { unmount } = renderHook(() => useAutoSave(
      mockEditorInstance as unknown as Editor,
      testDocumentId,
      mockActualSaveFunction,
      HOOK_DEBOUNCE_MS
    ));

    const editorOnCall = mockEditorInstance.on.mock.calls[0];
    const updateListener = editorOnCall[1] as () => void;

    act(() => {
      updateListener(); // Trigger update, queueing a debounced save
    });

    unmount(); // Unmount the hook before debounce period ends

    act(() => {
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS); // Advance time
    });

    expect(mockActualSaveFunction).not.toHaveBeenCalled(); // Save should have been cancelled
  });

  it('should call save function only once for multiple rapid updates within debounce period', () => {
    renderHook(() => useAutoSave(
      mockEditorInstance as unknown as Editor,
      testDocumentId,
      mockActualSaveFunction,
      HOOK_DEBOUNCE_MS
    ));

    const updateListener = mockEditorInstance.on.mock.calls[0][1] as () => void;

    act(() => {
      updateListener(); // 1st update
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS / 2); // Advance time, but less than debounce
      updateListener(); // 2nd update
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS / 2); // Advance more, still within for the 2nd call
      updateListener(); // 3rd update
    });

    expect(mockActualSaveFunction).not.toHaveBeenCalled(); // Still not called

    act(() => {
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS); // Advance past the last debounce
    });

    expect(mockActualSaveFunction).toHaveBeenCalledTimes(1);
    expect(mockActualSaveFunction).toHaveBeenCalledWith(testDocumentId, mockEditorInstance.getJSON());
  });

   it('should update isSaving state correctly during save operation', async () => {
    let resolveSave: any;
    const longSavingFunction = vi.fn(async () => {
      await new Promise(r => resolveSave = r);
    });

    const { result } = renderHook(() => useAutoSave(
      mockEditorInstance as unknown as Editor,
      testDocumentId,
      longSavingFunction,
      HOOK_DEBOUNCE_MS
    ));

    const updateListener = mockEditorInstance.on.mock.calls[0][1] as () => void;

    act(() => {
      updateListener();
      vi.advanceTimersByTime(HOOK_DEBOUNCE_MS);
    });
    
    // await next tick for state update after promise starts
    await act(async () => { await Promise.resolve(); });
    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      resolveSave(); // Complete the save operation
      await Promise.resolve(); // Allow promise microtasks to settle
    });
    expect(result.current.isSaving).toBe(false);
  });

}); 