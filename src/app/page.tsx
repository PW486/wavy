import { Suspense } from 'react';
import Timeline from './timeline';
import Header from './header';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
        <Header />
      </Suspense>
      <main className="container mx-auto px-4 py-10">
        <Suspense fallback={<div>Loading...</div>}>
          <Timeline />
        </Suspense>
      </main>
    </div>
  );
}
