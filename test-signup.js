import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const { connectDB } = await import('./src/lib/db.js');
    const { default: User } = await import('./src/lib/models/User.js');

    await connectDB();
    console.log("DB connected");
    const existingUser = await User.findOne({ email: 'test_student_unique_123@example.com' });
    console.log("Found user?", !!existingUser);
    
    if (existingUser) {
        console.log("Roles:", existingUser.roles);
    }
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}

main();
