// backend/src/database/seed.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

// ✅ Import all entities
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Queue } from '../queue/entities/queue.entity'; // ✅ Add Queue entity

// Database configuration
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root', // ✅ Changed from empty string
  database: process.env.DB_DATABASE || 'clinic_db',
  entities: [User, Doctor, Appointment, Queue], // ✅ Include all entities
  synchronize: true, // ✅ Changed to true to auto-create tables
  logging: true, // ✅ Enable logging to see what's happening
});

async function seed() {
  try {
    console.log('🚀 Starting database seeding...');
    
    await AppDataSource.initialize();
    console.log('✅ Data Source has been initialized!');

    const userRepository = AppDataSource.getRepository(User);
    const doctorRepository = AppDataSource.getRepository(Doctor);

    // ✅ Create default admin user
    const existingUser = await userRepository.findOne({ 
      where: { username: 'admin' } 
    });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const user = userRepository.create({
        username: 'admin',
        password: hashedPassword,
        fullName: 'System Administrator',
        role: 'admin', // ✅ Changed to 'admin' from 'staff'
        isActive: true,
      });
      await userRepository.save(user);
      console.log('✅ Default admin user created: admin / admin123');
    } else {
      console.log('ℹ️  Admin user already exists, skipping...');
    }

    // ✅ Create sample doctors
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        gender: 'Female',
        location: 'Building A, Floor 2',
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@clinic.com',
        availability: JSON.stringify({
          monday: '09:00-17:00',
          tuesday: '09:00-17:00',
          wednesday: '09:00-17:00',
          thursday: '09:00-17:00',
          friday: '09:00-15:00',
        }),
        isActive: true,
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Pediatrics',
        gender: 'Male',
        location: 'Building B, Floor 1',
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@clinic.com',
        availability: JSON.stringify({
          monday: '10:00-18:00',
          tuesday: '10:00-18:00',
          wednesday: '10:00-18:00',
          thursday: '10:00-18:00',
          friday: '10:00-16:00',
        }),
        isActive: true,
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialization: 'Dermatology',
        gender: 'Female',
        location: 'Building A, Floor 3',
        phone: '+1 (555) 345-6789',
        email: 'emily.rodriguez@clinic.com',
        availability: JSON.stringify({
          monday: '08:00-16:00',
          wednesday: '08:00-16:00',
          friday: '08:00-16:00',
        }),
        isActive: true,
      },
      {
        name: 'Dr. James Williams',
        specialization: 'Orthopedics',
        gender: 'Male',
        location: 'Building C, Floor 2',
        phone: '+1 (555) 456-7890',
        email: 'james.williams@clinic.com',
        availability: JSON.stringify({
          tuesday: '09:00-17:00',
          thursday: '09:00-17:00',
          saturday: '09:00-13:00',
        }),
        isActive: true,
      },
      {
        name: 'Dr. Priya Patel',
        specialization: 'General Medicine',
        gender: 'Female',
        location: 'Building A, Floor 1',
        phone: '+1 (555) 567-8901',
        email: 'priya.patel@clinic.com',
        availability: JSON.stringify({
          monday: '08:00-18:00',
          tuesday: '08:00-18:00',
          wednesday: '08:00-18:00',
          thursday: '08:00-18:00',
          friday: '08:00-18:00',
          saturday: '09:00-14:00',
        }),
        isActive: true,
      },
    ];

    for (const data of doctors) {
      const existingDoctor = await doctorRepository.findOne({ 
        where: { name: data.name } 
      });
      
      if (!existingDoctor) {
        const doctor = doctorRepository.create(data);
        await doctorRepository.save(doctor);
        console.log(`✅ Doctor added: ${data.name} (${data.specialization})`);
      } else {
        console.log(`ℹ️  Doctor already exists: ${data.name}`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   👤 Users: ${await userRepository.count()}`);
    console.log(`   👨‍⚕️  Doctors: ${await doctorRepository.count()}`);
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

seed();
