import Timeline from './timeline';
import Header from './header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <Timeline />
      </main>
    </div>
  );
}
