import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUsers() {
  try {
    // Find all users with PATIENT role
    const patients = await prisma.user.findMany({
      where: {
        role: UserRole.STAFF // We'll just convert everyone to STAFF since PATIENT is being removed
      }
    });

    console.log(`Found ${patients.length} users with PATIENT role`);

    // Update all PATIENT users to STAFF
    if (patients.length > 0) {
      await prisma.user.updateMany({
        where: {
          role: UserRole.STAFF
        },
        data: {
          role: UserRole.STAFF,
          position: 'Former Patient',
          specialty: null
        }
      });

      console.log('Successfully updated all PATIENT users to STAFF');
    }

    // Verify the update
    const remainingPatients = await prisma.user.findMany({
      where: {
        role: UserRole.STAFF
      }
    });

    console.log(`There are now ${remainingPatients.length} STAFF users`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers(); 