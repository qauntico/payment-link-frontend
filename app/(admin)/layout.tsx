import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import AdminLayout from '@/components/admin/AdminLayout';


export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and admin role on server side
  await requireRole('ADMIN');

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
