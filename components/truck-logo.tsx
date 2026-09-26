import Image from 'next/image';

/** One Canva master for the compact mark and opening artwork. */
export function TruckLogo({ large = false }: { large?: boolean }) {
  return <span className="truck-logo" aria-hidden="true">
    <Image src="/media/college-boy-truck-logo-v2.png" alt="" width={1600} height={807}
      sizes={large ? '(max-width: 760px) 92vw, 1100px' : '(max-width: 640px) 76px, 112px'}
      loading="eager" />
  </span>;
}
