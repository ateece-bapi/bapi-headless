"use client";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15, trickleSpeed: 200 });

export default function ProgressBar() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
    // Only run on pathname change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
