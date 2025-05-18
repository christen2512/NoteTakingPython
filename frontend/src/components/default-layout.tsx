import { Toaster } from "sonner";
import AppSidebar from "./app-sidebar";
import { ThemeToggle } from "./tiptap-templates/simple/theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row w-full">
            <div className="w-1/3.5">
                <AppSidebar />
            </div>
            <div className="flex flex-col w-full mx-auto">
                <SidebarTrigger />
                {children}
                <Toaster />
            </div>
        </div>
    )
}
