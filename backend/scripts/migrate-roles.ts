import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function migrateRoleData() {
  console.log('Starting role data migration...');
  
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    // Map old string roles to new enum values
    let newRole: UserRole = 'PATIENT'; // Default
    
    if (user.role) {
      const roleStr = user.role.toLowerCase();
      if (roleStr.includes('admin') && roleStr.includes('super')) {
        newRole = 'SUPER_ADMIN';
      } else if (roleStr.includes('admin') && roleStr.includes('clinic')) {
        newRole = 'CLINIC_ADMIN';
      } else if (roleStr.includes('staff') || roleStr.includes('doctor') || roleStr.includes('nurse')) {
        newRole = 'STAFF';
      } else if (roleStr.includes('patient')) {
        newRole = 'PATIENT';
      }
    }
    
    // Update the user with the new role
    await prisma.user.update({
      where: { id: user.id },
      data: { userRole: newRole }
    });
    
    console.log(`Updated user ${user.id}: old role = "${user.role}", new role = ${newRole}`);
  }
  
  console.log('Role data migration completed');
}

migrateRoleData()
  .catch(e => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 