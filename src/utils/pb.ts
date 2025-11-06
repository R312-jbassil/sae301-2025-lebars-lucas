import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pocketbase-types';

// Configuration dynamique selon l'environnement
let path = '';
if (import.meta.env.MODE === 'development') {
  path = 'http://127.0.0.1:8090'; // localhost = machine de dev
} else {
  path = 'https://sae301.lucas-lebars.fr:443'; // url du site en production
}

const pb = new PocketBase(path) as TypedPocketBase;

export default pb;
