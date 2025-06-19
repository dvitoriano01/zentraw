import { db } from './db';
import { users, templates } from '@shared/schema';

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const [adminUser] = await db.insert(users).values({
    username: 'admin',
    password: 'admin123'
  }).returning();

  // Create sample templates
  const sampleTemplates = [
    {
      name: 'Modern Business Card',
      category: 'Business Cards',
      description: 'Professional business card template with modern design',
      tags: ['business', 'modern', 'professional'],
      width: 350,
      height: 200,
      canvasData: { objects: [] },
      userId: adminUser.id,
      isPublic: true,
      isPremium: false,
      downloads: 125,
      rating: '4.8'
    },
    {
      name: 'Instagram Post Template',
      category: 'Social Media',
      description: 'Engaging Instagram post template for social media marketing',
      tags: ['instagram', 'social', 'marketing'],
      width: 1080,
      height: 1080,
      canvasData: { objects: [] },
      userId: adminUser.id,
      isPublic: true,
      isPremium: true,
      downloads: 89,
      rating: '4.5'
    },
    {
      name: 'Event Poster',
      category: 'Marketing',
      description: 'Eye-catching event poster template',
      tags: ['event', 'poster', 'marketing'],
      width: 600,
      height: 800,
      canvasData: { objects: [] },
      userId: adminUser.id,
      isPublic: true,
      isPremium: false,
      downloads: 67,
      rating: '4.2'
    },
    {
      name: 'Corporate Presentation',
      category: 'Presentations',
      description: 'Professional presentation template for corporate use',
      tags: ['corporate', 'presentation', 'business'],
      width: 1920,
      height: 1080,
      canvasData: { objects: [] },
      userId: adminUser.id,
      isPublic: true,
      isPremium: true,
      downloads: 156,
      rating: '4.9'
    },
    {
      name: 'Wedding Invitation',
      category: 'Invitations',
      description: 'Elegant wedding invitation template',
      tags: ['wedding', 'invitation', 'elegant'],
      width: 500,
      height: 700,
      canvasData: { objects: [] },
      userId: adminUser.id,
      isPublic: true,
      isPremium: false,
      downloads: 203,
      rating: '4.7'
    }
  ];

  await db.insert(templates).values(sampleTemplates);

  console.log('Database seeded successfully!');
}

seed().catch(console.error);