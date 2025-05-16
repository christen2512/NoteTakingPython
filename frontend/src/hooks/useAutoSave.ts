import { useEffect, useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import debounce from 'lodash.debounce';

export const SAVE_DEBOUNCE_MS = 2000; // Default debounce time: 2 seconds

/**
 * Custom hook to automatically save editor content after a debounce period.
 *
 * @param editor The Tiptap editor instance.
 * @param documentId The ID of the document being edited. Can be null/undefined initially.
 * @param saveFunction An async function to call to save the content.
 *        It receives documentId (which can be null/undefined for a new document)
 *        and the content (Tiptap JSON object). It should return the documentId (string) if one
 *        is newly assigned or confirmed, or void.
 * @param debounceMs The debounce interval in milliseconds.
 * @returns An object containing the saving status.
 */
export function useAutoSave(
  editor: Editor | null,
  documentId: string | null | undefined,
  saveFunction: (
    docId: string | null | undefined, 
    content: any
  ) => Promise<string | void>, 
  debounceMs: number = SAVE_DEBOUNCE_MS
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Use a ref for the saveFunction to avoid re-creating the debounced function
  // if the saveFunction prop instance changes (but its identity doesn't).
  const saveFunctionRef = useRef(saveFunction);
  useEffect(() => {
    saveFunctionRef.current = saveFunction;
  }, [saveFunction]);

  const debouncedSave = useCallback(
    debounce(async (currentDocumentId: string | null | undefined, contentToSave: any) => {
      console.log('Starting save process...');
      setIsSaving(true);
      setLastError(null);
      try {
        console.log('Calling save function with:', { currentDocumentId, contentToSave });
        await saveFunctionRef.current(currentDocumentId, contentToSave);
        console.log('Save completed successfully');
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
        setLastError(error instanceof Error ? error.message : 'An unknown error occurred during save.');
      } finally {
        setIsSaving(false);
        console.log('Save process finished');
      }
    }, debounceMs),
    [debounceMs] 
  );

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const handleUpdate = () => {
        console.log('[useAutoSave] Editor "update" event detected.');
        const content = editor.getJSON();
        debouncedSave(documentId, content);
      };

      editor.on('update', handleUpdate);
      console.log('[useAutoSave] "update" listener attached to editor.');

      return () => {
        console.log('[useAutoSave] Cleaning up "update" listener from editor.');
        editor.off('update', handleUpdate);
        debouncedSave.cancel(); // Important: cancel any pending debounced calls on unmount
      };
    } else {
      console.log('[useAutoSave] Editor not available or destroyed, not attaching listener.');
    }
    // Explicitly return undefined if condition is not met, or an empty cleanup.
    return () => {
        debouncedSave.cancel();
    };
  }, [editor, documentId, debouncedSave]); // editor and documentId are dependencies

  return { isSaving, lastError, lastSaved };
} 