import Link from 'next/link';
import { Bruno_Ace_SC } from 'next/font/google';

const bruno = Bruno_Ace_SC({ subsets: ['latin'], weight: '400' });

export const HexLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`fill-current ${className}`}>
    <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M46 15 L50 20 L20 60 L15 60 L46 15 Z M10 50 C10 32.5 21.2 17.6 36.8 12 L12 45 L35 75 C20.6 69.8 10 57.6 10 50 Z M88 55 L65 25 C79.4 30.2 90 42.4 90 50 C90 67.5 78.8 82.4 63.2 88 L88 55 Z M54 85 L50 80 L80 40 L85 40 L54 85 Z" />
  </svg>
);

export default function NavBar() {
  return (
    <nav className="relative z-30 flex items-center justify-between px-8 py-8 w-full max-w-[1440px] mx-auto">
      <Link href="/" className="flex items-center gap-4 group cursor-pointer drop-shadow-[0_0_10px_rgba(57,255,20,0.4)] relative z-20">
        <div className="relative w-8 h-8 text-[#39ff14] group-hover:scale-110 transition-transform">
          <HexLogo className="w-full h-full drop-shadow-[0_0_8px_#39ff14]" />
        </div>
        <span className={`${bruno.className} text-[1.2rem] font-bold tracking-[0.15em] uppercase text-white leading-none pt-1`}>
          Awareshield
        </span>
      </Link>
      
      {/* Nav Links Removed as they are unused features */}

      {/* Right Nav Actions */}
      <div className="hidden md:flex items-center gap-4 relative z-20">
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 hover:border-[#39ff14]/60 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)] group">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#39ff14] transition-colors mr-3 drop-shadow-[0_0_5px_#39ff14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs text-white w-24 placeholder-gray-500 font-light tracking-wide focus:w-32 transition-all" />
        </div>
        <Link href="/audit" className="px-5 py-2.5 rounded-full bg-[#39ff14] hover:bg-white hover:text-black text-black text-xs font-bold tracking-[0.15em] transition-all shadow-[0_0_25px_rgba(57,255,20,0.6)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]">
          GET STARTED
        </Link>
      </div>
    </nav>
  );
}
