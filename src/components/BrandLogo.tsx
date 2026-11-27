export const CISAGA_HUB_LOGO_PATH =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_15.57.35_906e54c5.jpeg';

interface BrandLogoProps {
  size?: 'sm' | 'md';
}

export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  const heightClass = size === 'sm' ? 'h-11 sm:h-12' : 'h-14 sm:h-16';

  return (
    <span className="inline-flex items-center whitespace-nowrap shrink-0">
      <img
        src={CISAGA_HUB_LOGO_PATH}
        alt="CISAGA HUB — Dukung UMKM Cisaga, Go Digital Bersama"
        className={`${heightClass} w-auto object-contain rounded-md bg-white`}
      />
    </span>
  );
}
