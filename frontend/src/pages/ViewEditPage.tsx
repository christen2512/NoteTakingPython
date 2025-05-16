import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { getPageById, updateExistingPage } from '@/api/pageApi';
import { Page } from '@/types/page'; // Your Page type

export default function ViewEditPage() {
  const { id } = useParams<{ id: string }>();
  const [initialContent, setInitialContent] = useState<any>(null); // Tiptap content can be complex
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageId, setPageId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      setPageId(numericId);
      if (isNaN(numericId)) {
        setError("Invalid page ID.");
        setIsLoading(false);
        return;
      }

      const fetchPage = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const pageData = await getPageById(numericId);
          if (pageData) {
            setInitialContent(pageData.content);
          } else {
            setError("Page not found.");
          }
        } catch (err) {
          console.error("Error fetching page content:", err);
          setError("Failed to load page content.");
        }
        setIsLoading(false);
      };

      fetchPage();
    }
  }, [id]);

  const handleSave = async (
    _docIdFromEditor: string | null | undefined, // This is from SimpleEditor, we use pageId from URL
    editorContent: string
  ): Promise<string | void> => {
    if (!pageId) {
      console.error("Page ID is not set, cannot update.");
      return; // Return undefined
    }
    console.log(`Attempting to save page ID: ${pageId} with content:`, editorContent);
    try {
      const updatedPage = await updateExistingPage(pageId, editorContent);
      if (updatedPage && updatedPage.id) {
        console.log("Page updated successfully:", updatedPage);
        setInitialContent(updatedPage.content); // Refresh editor with saved content
        return updatedPage.id.toString(); // Return page ID as string
      } else {
        console.warn("Page update did not return a page or page ID.");
        return; // Return undefined
      }
    } catch (err) {
      console.error("Error in handleSave when updating page:", err);
      return; // Return undefined
    }
  };

  if (isLoading) {
    return <div>Loading page...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!initialContent && !isLoading) { // Ensure not to show if still loading
    return <div>Page content could not be loaded or page does not exist.</div>;
  }

  // Render editor only when initialContent is available
  return initialContent ? (
    <SimpleEditor
      initialContent={initialContent}
      saveFunction={handleSave}
      documentId={pageId ? pageId.toString() : undefined} // Pass the actual page ID to SimpleEditor
    />
  ) : (
    // This handles the case where initialContent is still null after loading and no error
    // (e.g. page truly has no content or an edge case)
    // You might want a more specific message or a fallback editor state here
    <div>Preparing editor...</div>
  );
} 