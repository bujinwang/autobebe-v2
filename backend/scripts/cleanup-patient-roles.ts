import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupPatientRoles() {
  console.log('Starting patient role cleanup...');
  
  // Find all users with PATIENT role
  const patientUsers = await prisma.user.findMany({
    where: { role: 'PATIENT' }
  });
  
  console.log(`Found ${patientUsers.length} users with PATIENT role`);
  
  if (patientUsers.length > 0) {
    // Option 1: Delete these users if they're not needed
    // await prisma.user.deleteMany({
    //   where: { role: 'PATIENT' }
    // });
    
    // Option 2: Convert them to STAFF with a note in position
    await prisma.user.updateMany({
      where: { role: 'PATIENT' },
      data: { 
        role: 'STAFF',
        position: 'Converted from PATIENT role'
      }
    });
    
    console.log(`Updated ${patientUsers.length} users from PATIENT to STAFF role`);
  }
  
  console.log('Patient role cleanup completed');
}

cleanupPatientRoles()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 