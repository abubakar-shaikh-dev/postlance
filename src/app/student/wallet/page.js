import { verifySession } from '@/lib/dal';
import { getWallet } from '@/lib/actions/wallet';
import { redirect } from 'next/navigation';
import { StudentWalletClient } from './StudentWalletClient';

export default async function StudentWalletPage() {
  const session = await verifySession();
  if (session.role !== 'student') redirect('/client/wallet');

  const wallet = await getWallet();

  return <StudentWalletClient wallet={wallet} />;
}
