// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');

// const prisma = new PrismaClient();

// async function main() {
//   // Create admin user
//   const hashedPassword = await bcrypt.hash('admin123', 12);
  
//   const admin = await prisma.user.create({
//     data: {
//       email: 'admin@pmdss.com',
//       name: 'System Administrator',
//       password: hashedPassword,
//       role: 'ADMIN',
//       department: 'Administration',
//       phone: '+1-234-567-8900',
//     },
//   });

//   // Create doctor
//   const doctor = await prisma.user.create({
//     data: {
//       email: 'doctor@pmdss.com',
//       name: 'Dr. Sarah Wilson',
//       password: hashedPassword,
//       role: 'DOCTOR',
//       department: 'Cardiology',
//       phone: '+1-234-567-8901',
//     },
//   });

//   console.log('Seeding completed!');
//   console.log('Admin:', admin.email);
//   console.log('Doctor:', doctor.email);
// }

// main()
//   .catch((e) => {
//     console.error('Error during seeding:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // First, ensure we have a doctor user
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@pmdss.com' },
    update: {},
    create: {
      email: 'doctor@pmdss.com',
      name: 'Dr. Sarah Wilson',
      password: doctorPassword,
      role: 'DOCTOR',
      department: 'Cardiology',
      phone: '+1-555-0123',
      isActive: true,
    },
  });

  console.log('👨‍⚕️ Doctor user created/updated');

  // Dummy patients data
  const dummyPatients = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0101',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'MALE',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: 'Jane Smith (Wife) - +1-555-0102',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      status: 'ACTIVE',
      medicalHistory: 'Hypertension diagnosed in 2020. Regular check-ups.',
      currentMedications: ['Lisinopril 10mg daily', 'Aspirin 81mg daily'],
      chronicConditions: ['Hypertension']
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0201',
      dateOfBirth: new Date('1992-07-22'),
      gender: 'FEMALE',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
      emergencyContact: 'Carlos Garcia (Husband) - +1-555-0202',
      bloodType: 'A+',
      allergies: ['Shellfish'],
      status: 'STABLE',
      medicalHistory: 'Diabetes Type 2 diagnosed in 2021. Well controlled.',
      currentMedications: ['Metformin 500mg twice daily', 'Vitamin D3'],
      chronicConditions: ['Type 2 Diabetes']
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@email.com',
      phone: '+1-555-0301',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'MALE',
      address: '789 Pine Street, Chicago, IL 60601',
      emergencyContact: 'Linda Johnson (Sister) - +1-555-0302',
      bloodType: 'B+',
      allergies: [],
      status: 'CRITICAL',
      medicalHistory: 'Recent heart attack in January 2024. Underwent angioplasty.',
      currentMedications: ['Clopidogrel 75mg daily', 'Atorvastatin 40mg daily', 'Metoprolol 25mg twice daily'],
      chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia']
    },
    {
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@email.com',
      phone: '+1-555-0401',
      dateOfBirth: new Date('1990-04-12'),
      gender: 'FEMALE',
      address: '321 Elm Drive, San Francisco, CA 94102',
      emergencyContact: 'David Chen (Father) - +1-555-0402',
      bloodType: 'AB-',
      allergies: ['Latex', 'Iodine'],
      status: 'ACTIVE',
      medicalHistory: 'Asthma since childhood. Well controlled with medication.',
      currentMedications: ['Albuterol inhaler as needed', 'Fluticasone daily'],
      chronicConditions: ['Asthma']
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-0501',
      dateOfBirth: new Date('1965-12-03'),
      gender: 'MALE',
      address: '654 Maple Lane, Houston, TX 77001',
      emergencyContact: 'Patricia Brown (Wife) - +1-555-0502',
      bloodType: 'O-',
      allergies: ['Sulfa drugs'],
      status: 'DISCHARGED',
      medicalHistory: 'Appendectomy in 2022. Recovered well.',
      currentMedications: [],
      chronicConditions: []
    },
    {
      firstName: 'Sarah',
      lastName: 'Davis',
      email: 'sarah.davis@email.com',
      phone: '+1-555-0601',
      dateOfBirth: new Date('1988-09-18'),
      gender: 'FEMALE',
      address: '987 Cedar Court, Miami, FL 33101',
      emergencyContact: 'Tom Davis (Brother) - +1-555-0602',
      bloodType: 'A-',
      allergies: ['Eggs', 'Milk'],
      status: 'STABLE',
      medicalHistory: 'Gestational diabetes during pregnancy in 2020.',
      currentMedications: ['Prenatal vitamins', 'Iron supplement'],
      chronicConditions: []
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@email.com',
      phone: '+1-555-0701',
      dateOfBirth: new Date('1955-01-25'),
      gender: 'MALE',
      address: '147 Birch Boulevard, Phoenix, AZ 85001',
      emergencyContact: 'Nancy Wilson (Wife) - +1-555-0702',
      bloodType: 'B-',
      allergies: ['Morphine'],
      status: 'CRITICAL',
      medicalHistory: 'COPD diagnosed in 2019. Recent exacerbation.',
      currentMedications: ['Tiotropium daily', 'Prednisone 20mg daily', 'Albuterol nebulizer'],
      chronicConditions: ['COPD', 'Chronic Kidney Disease Stage 3']
    },
    {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1-555-0801',
      dateOfBirth: new Date('1993-06-30'),
      gender: 'FEMALE',
      address: '258 Spruce Street, Seattle, WA 98101',
      emergencyContact: 'Mark Anderson (Husband) - +1-555-0802',
      bloodType: 'AB+',
      allergies: [],
      status: 'ACTIVE',
      medicalHistory: 'Healthy. Regular preventive care.',
      currentMedications: ['Multivitamin daily'],
      chronicConditions: []
    }
  ];

  // Create patients
  for (const patientData of dummyPatients) {
    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        doctorId: doctor.id,
      },
    });
    console.log(`👤 Created patient: ${patient.firstName} ${patient.lastName}`);
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
