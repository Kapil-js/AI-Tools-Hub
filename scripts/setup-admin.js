// Setup Admin User Script
// Run this script to create an admin user in Firebase

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
const serviceAccount = {
  // Add your Firebase Admin SDK service account key here
  // You can download this from Firebase Console > Project Settings > Service Accounts
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ai-tools-hub-d6205.firebaseapp.com"
  });
}

const auth = getAuth();
const db = getFirestore();

async function createAdminUser() {
  try {
    const email = 'admin@aitoolshub.com';
    const password = 'admin123';
    const displayName = 'System Administrator';

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: true,
    });

    console.log('✅ Admin user created in Firebase Auth:', userRecord.uid);

    // Add user to Firestore users collection
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      photoURL: '',
      provider: 'email',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
    });

    console.log('✅ User document created in Firestore');

    // Add admin record to admins collection
    await db.collection('admins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      role: 'super_admin',
      permissions: [
        'dashboard.view',
        'users.view',
        'users.edit',
        'users.delete',
        'content.view',
        'content.edit',
        'content.delete',
        'blog.view',
        'blog.edit',
        'blog.delete',
        'tools.view',
        'tools.edit',
        'tools.delete',
        'analytics.view',
        'settings.view',
        'settings.edit',
        'admins.view',
        'admins.edit',
        'system.view',
        'system.edit',
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userRecord.uid,
      isActive: true,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Admin record created in Firestore');
    console.log('🎉 Setup complete!');
    console.log('');
    console.log('Admin Login Credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('📝 User already exists, trying to update admin permissions...');
      
      try {
        // Get existing user
        const userRecord = await auth.getUserByEmail('admin@aitoolshub.com');
        
        // Update admin permissions
        await db.collection('admins').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: 'admin@aitoolshub.com',
          displayName: 'System Administrator',
          role: 'super_admin',
          permissions: [
            'dashboard.view',
            'users.view',
            'users.edit',
            'users.delete',
            'content.view',
            'content.edit',
            'content.delete',
            'blog.view',
            'blog.edit',
            'blog.delete',
            'tools.view',
            'tools.edit',
            'tools.delete',
            'analytics.view',
            'settings.view',
            'settings.edit',
            'admins.view',
            'admins.edit',
            'system.view',
            'system.edit',
          ],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          createdBy: userRecord.uid,
          isActive: true,
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        
        console.log('✅ Admin permissions updated');
        console.log('Email: admin@aitoolshub.com');
        console.log('Password: admin123');
        
      } catch (updateError) {
        console.error('❌ Error updating admin permissions:', updateError);
      }
    }
  }
}

createAdminUser();
