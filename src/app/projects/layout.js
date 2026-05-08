import { Navbar } from '@/components/Navbar';
import { getSession } from '@/lib/dal';

export default async function ProjectsLayout({ children }) {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
