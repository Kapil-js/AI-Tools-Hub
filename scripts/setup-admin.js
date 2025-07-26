// Admin setup script
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to download your service account key from Firebase Console
// and place it in the project root or update the path below
try {
  const serviceAccount = require('./firebase-service-account.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ai-tools-hub-d6205.firebaseio.com'
  });
} catch (error) {
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

async function setupAdmin() {
  try {
    
    // Check if admin user already exists
    try {
      const existingUser = await auth.getUserByEmail('admin@aitoolshub.com');
      
      // Update admin document in Firestore
      await db.collection('admins').doc(existingUser.uid).set({
        uid: existingUser.uid,
        email: 'admin@aitoolshub.com',
        role: 'super_admin',
        permissions: ['all'],
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
  
      return;
    } catch (error) {
      // User doesn't exist, create new one
    }

    // Create admin user
    const userRecord = await auth.createUser({
      email: 'admin@aitoolshub.com',
      password: 'admin123',
      displayName: 'Admin User',
      emailVerified: true
    });


    // Add admin document to Firestore
    await db.collection('admins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'admin@aitoolshub.com',
      role: 'super_admin',
      permissions: ['all'],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Also add to users collection with admin role
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'admin@aitoolshub.com',
      displayName: 'Admin User',
      role: 'admin',
      isActive: true,
      isPremium: true,
      provider: 'email',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    });

    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  }
}

async function setupDefaultData() {
  try {
    // Create default site settings
    await db.collection('site_settings').doc('main').set({
      siteName: 'AI Tools Hub',
      siteDescription: 'Your All-in-One AI Toolkit',
      siteUrl: 'https://scalestack.in',
      contactEmail: 'contact@aitoolshub.com',
      supportEmail: 'support@aitoolshub.com',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxFileSize: 10,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
      theme: {
        primaryColor: '#8B5CF6',
        secondaryColor: '#3B82F6',
        darkMode: false
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false
      },
      security: {
        passwordMinLength: 8,
        requireStrongPassword: true,
        sessionTimeout: 24,
        maxLoginAttempts: 5
      },
      analytics: {
        googleAnalyticsId: '',
        trackingEnabled: false
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    
  } catch (error) {
    console.error('❌ Error setting up default data:', error);
  }
}

async function main() {
  await setupAdmin();
  await setupDefaultData();
  
  process.exit(0);
}

main().catch(console.error);