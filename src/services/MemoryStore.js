import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_DIR = path.join(__dirname, '../../memory_atoms');

export class MemoryStore {
  constructor() {
    this.initializeStore();
  }

  async initializeStore() {
    try {
      await fs.mkdir(MEMORY_DIR, { recursive: true });
    } catch (error) {
      console.error('Error initializing memory store:', error);
      throw error;
    }
  }

  async saveMemoryAtom(memoryAtom) {
    const filePath = path.join(MEMORY_DIR, `${memoryAtom.memoryId}.json`);
    try {
      await fs.writeFile(
        filePath,
        JSON.stringify(memoryAtom.toJSON(), null, 2),
        'utf8'
      );
      console.log(`Memory atom saved: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error saving memory atom:', error);
      throw error;
    }
  }

  async getMemoryAtom(memoryId) {
    const filePath = path.join(MEMORY_DIR, `${memoryId}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading memory atom:', error);
      throw error;
    }
  }
}