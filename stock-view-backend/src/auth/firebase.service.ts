import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const serviceAccount = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../service-key.json'),
        'utf-8',
      ),
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  async getUsersForAlert() {
    const db = admin.firestore();
    const snapshot = await db.collection('notify').get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  }
}
