import { verifySession } from '@/lib/dal';
import { getWallet, getClientProjectsForPayment } from '@/lib/actions/wallet';
import { redirect } from 'next/navigation';
import { ClientWalletClient } from './ClientWalletClient';

export default async function ClientWalletPage() {
  const session = await verifySession();
  if (session.role !== 'client') redirect('/student/wallet');

  const [wallet, projects] = await Promise.all([
    getWallet(),
    getClientProjectsForPayment(),
  ]);

  return (
    <ClientWalletClient
      wallet={wallet}
      projects={projects}
    />
  );
}
