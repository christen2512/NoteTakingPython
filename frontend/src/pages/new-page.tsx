import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function NewPage() {
    const [pageTitle, setPageTitle] = useState("Untitled");
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="mx-auto">
                <SimpleEditor />
            </div>
        </div>
    )
}
