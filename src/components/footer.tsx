export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] border-t-4 border-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-3xl font-black mb-4 uppercase">
            🪽 Sonny Alert
          </div>
          <p className="text-lg font-bold mb-8 text-gray-300">
            Never miss a Sonny Angel drop again
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm font-bold">
            <a href="#" className="hover:text-[#ff69b4] transition-colors">ABOUT</a>
            <a href="#" className="hover:text-[#ff69b4] transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-[#ff69b4] transition-colors">TERMS</a>
            <a href="#" className="hover:text-[#ff69b4] transition-colors">CONTACT</a>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-700 text-sm font-mono text-gray-400">
            © {currentYear} Sonny Alert. Built for collectors, by collectors.
          </div>
        </div>
      </div>
    </footer>
  );
}
