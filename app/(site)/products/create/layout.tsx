import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/server';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function CreateProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on server side
  // This will redirect to /signin if user is not authenticated
  await requireAuth();

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
