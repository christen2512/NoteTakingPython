import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
// import { Input } from "@/components/ui/input"; // No longer used if docId is not manually input
// import { useState } from "react"; // No longer used if docId is not manually input
// import axios from "axios"; // Moved to pageApi.ts
import { saveNewPage } from "@/api/pageApi"; // Import the centralized function
import { Page } from "@/types/page"; // Keep for type checking newPage if needed
// import { useNavigate } from 'react-router-dom'; // Uncomment if you want to navigate

// The savePage function is now simpler, just passing content to saveNewPage.
// The docId parameter from SimpleEditor is effectively ignored for new pages,
// as the backend will assign an ID.
const handleSaveNewPage = async (
    _docId: string | null | undefined, // This docId from SimpleEditor is not used for new pages
    editorContent: string
): Promise<string | void> => {
    console.log("handleSaveNewPage triggered. editorContent to be sent: ", editorContent);
    // const navigate = useNavigate(); // Call hook at top level if used

    try {
        const newPage = await saveNewPage(editorContent);

        if (newPage && newPage.id) {
            console.log("Page saved successfully. Response data:", newPage);
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
};

export default function NewPage() {
    return (
        <SimpleEditor 
            saveFunction={handleSaveNewPage} 
            // initialContent can be omitted for a new page, or pass empty Tiptap JSON
            // Or provide a default empty Tiptap structure if desired:
            // initialContent={{ type: "doc", content: [] }}
        />
    );
}
