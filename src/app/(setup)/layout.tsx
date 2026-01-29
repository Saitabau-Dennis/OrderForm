import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup your store",
  description: "Configure your store settings to get started.",
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {children}
    </div>
  );
}