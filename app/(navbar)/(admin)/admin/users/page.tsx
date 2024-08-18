import { prisma } from '@/lib/prisma';
import UserTable from '@/app/(navbar)/(admin)/admin/users/UserTable';

export default async function Users() {
  const users = await prisma.user.findMany();

  return <UserTable data={users} />;
}
