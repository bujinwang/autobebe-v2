import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // First, create a clinic
  const clinic = await prisma.clinicInfo.upsert({
    where: { id: 'clinic-001' },
    update: {},
    create: {
      id: 'clinic-001',
      name: 'Main Clinic',
      company: 'AutoBebe',
      address: '123 Healthcare St',
      phone: '555-0123',
      hours: '9:00 AM - 5:00 PM',
      welcomeMessage: 'Welcome to AutoBebe Clinic'
    }
  });

  // Create users with hashed passwords
  const users = [
    {
      email: 'admin@autobebe.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'STAFF',
      clinicId: clinic.id
    },
    {
      email: 'doctor@autobebe.com',
      password: 'doctor123',
      name: 'Dr. Smith',
      role: 'STAFF',
      clinicId: clinic.id
    },
    {
      email: 'nurse@autobebe.com',
      password: 'nurse123',
      name: 'Nurse Johnson',
      role: 'STAFF',
      clinicId: clinic.id
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashedPassword
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 