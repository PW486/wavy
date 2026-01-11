import Timeline from './timeline';
import Header from './header';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Timeline />
      </main>
    </div>
  );
}
