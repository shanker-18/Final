import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'freelance';

  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName,
    });
    console.log(`MongoDB connected to database: ${dbName}`);

    // Ensure conversations collection does not have an incorrect unique index
    try {
      const convoCollection = mongoose.connection.collection('conversations');
      const indexes = await convoCollection.indexes();
      const hasParticipantsUnique = indexes.some(
        (idx) => idx.name === 'participants_1' && idx.unique
      );
      if (hasParticipantsUnique) {
        await convoCollection.dropIndex('participants_1');
        console.log('Dropped unique index participants_1 on conversations');
      }
    } catch (indexErr) {
      console.warn('Could not adjust conversations index:', indexErr.message);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
