import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create clinics
  const clinic1 = await prisma.clinicInfo.upsert({
    where: { id: 'clinic-001' },
    update: {},
    create: {
      id: 'clinic-001',
      name: 'Main Clinic',
      company: 'AutoBebe',
      address: '123 Healthcare St',
      phone: '555-0123',
      hours: '9:00 AM - 5:00 PM',
      welcomeMessage: 'Welcome to AutoBebe Main Clinic'
    }
  });

  const clinic2 = await prisma.clinicInfo.upsert({
    where: { id: 'clinic-002' },
    update: {},
    create: {
      id: 'clinic-002',
      name: 'Downtown Clinic',
      company: 'AutoBebe',
      address: '456 Medical Ave',
      phone: '555-0456',
      hours: '8:00 AM - 6:00 PM',
      welcomeMessage: 'Welcome to AutoBebe Downtown Clinic'
    }
  });

  const clinic3 = await prisma.clinicInfo.upsert({
    where: { id: 'clinic-003' },
    update: {},
    create: {
      id: 'clinic-003',
      name: 'Pediatric Clinic',
      company: 'AutoBebe',
      address: '789 Children Blvd',
      phone: '555-0789',
      hours: '8:30 AM - 4:30 PM',
      welcomeMessage: 'Welcome to AutoBebe Pediatric Specialty Clinic'
    }
  });

  // Create users with hashed passwords
  const users = [
    {
      email: 'admin@autobebe.com',
      password: 'admin123',
      name: 'Admin User',
      role: UserRole.SUPER_ADMIN,
      clinicId: clinic1.id
    },
    {
      email: 'doctor@autobebe.com',
      password: 'doctor123',
      name: 'Dr. Smith',
      role: UserRole.STAFF,
      clinicId: clinic1.id
    },
    {
      email: 'nurse@autobebe.com',
      password: 'nurse123',
      name: 'Nurse Johnson',
      role: UserRole.STAFF,
      clinicId: clinic1.id
    },
    {
      email: 'doctor.downtown@autobebe.com',
      password: 'downtown123',
      name: 'Dr. Rodriguez',
      role: UserRole.STAFF,
      clinicId: clinic2.id
    },
    {
      email: 'admin.downtown@autobebe.com',
      password: 'admin456',
      name: 'Downtown Admin',
      role: UserRole.CLINIC_ADMIN,
      clinicId: clinic2.id
    },
    {
      email: 'pediatrician@autobebe.com',
      password: 'kids123',
      name: 'Dr. Williams',
      role: UserRole.STAFF,
      clinicId: clinic3.id
    },
    {
      email: 'admin.pediatric@autobebe.com',
      password: 'admin789',
      name: 'Pediatric Admin',
      role: UserRole.CLINIC_ADMIN,
      clinicId: clinic3.id
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