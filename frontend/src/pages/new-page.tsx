import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { saveNewPage } from "@/api/pageApi";
import { usePagesContext } from "@/contexts/PagesContext";
import { useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom"; // Uncomment if you want to navigate after save

export default function NewPage() {
    const { setRefreshPagesTrigger } = usePagesContext();
    const [isPageCreated, setIsPageCreated] = useState(false);
    // const navigate = useNavigate(); // Uncomment if you want to navigate after save

    const handleSave = useCallback(async (
        _docId: string | null | undefined, // docId from SimpleEditor, potentially unused for new page creation as per original comment
        editorContent: string
    ): Promise<string | void> => {
        console.log("handleSave triggered. editorContent to be sent: ", editorContent);

        try {
            // Assuming saveNewPage is for creating a new page.
            // If SimpleEditor calls this multiple times for the same "new page" session,
            // we only want to trigger the list refresh and consider it "created" once.
            const newPage = await saveNewPage(editorContent);

            if (newPage && newPage.id) {
                console.log("Page saved successfully. Response data:", newPage);

                if (!isPageCreated) {
                    setRefreshPagesTrigger((prev) => prev + 1);
                    setIsPageCreated(true); // Mark as created to prevent further refresh triggers for this instance
                }
                
                // Optionally, navigate to the new page:
                // navigate(`/page/${newPage.id}`); 
                return newPage.id.toString(); // Return page ID as string on success
            } else {
                console.warn("Page save did not return a page or page ID.");
                return; // Return undefined on failure or no ID
            }
        } catch (error) {
            console.error("Error saving page in NewPage component:", error);
            return; // Return undefined on error
        }
    }, [isPageCreated, setRefreshPagesTrigger /*, navigate */]); // Add navigate to deps if used

    return (
        <SimpleEditor 
            saveFunction={handleSave}
            // You might want to pass initialContent from "@/components/tiptap-templates/simple/data/content.json"
            // or a different placeholder for new pages.
            // initialContent={yourInitialContentObject} 
        />
    );
}
