import Sidebar from "@/components/shared/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-60">
        {children}
      </div>
    </div>
  );
}
