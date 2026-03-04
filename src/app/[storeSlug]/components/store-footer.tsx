export function StoreFooter({ storeName }: { storeName: string }) {
  return (
    <footer className="bg-[#F7F7F5] border-t border-[#E8E8E5] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#737373]">
        <span className="font-medium text-[#1A1A1A]">{storeName}</span>
        <span>
          Powered by{" "}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1A1A1A] font-medium hover:underline"
          >
            OrderForm
          </a>
        </span>
      </div>
    </footer>
  )
}
