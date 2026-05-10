import { Pharmacist } from './types';

export const PHARMACISTS: Pharmacist[] = [
  {
    id: 'ph-1',
    name: 'Apt. Ahmad Hidayat, S.Farm.',
    title: 'Apoteker Senior',
    specialization: 'Farmakologi & Konseling Obat',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
    isOnline: true,
    registered: true
  },
  {
    id: 'ph-2',
    name: 'Apt. Siti Aminah, M.Farm.',
    title: 'Apoteker Klinis',
    specialization: 'Kesehatan Ibu & Anak',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
    isOnline: true,
    registered: true
  },
  {
    id: 'ph-3',
    name: 'Apt. Budi Santoso, S.Farm.',
    title: 'Apoteker Madya',
    specialization: 'Penyakit Dalam',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200',
    isOnline: false,
    registered: true
  },
  {
    id: 'ph-4',
    name: 'Apt. Novita Indriani, S.Farm.',
    title: 'Apoteker Utama',
    specialization: 'Manajemen Farmasi',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1e598c6?auto=format&fit=crop&q=80&w=200&h=200',
    isOnline: true,
    registered: true
  }
];

export const WELCOME_MESSAGE = "Selamat datang di Apoteker Online, silakan chat untuk konsultasi obat gratis dengan apoteker kami yang terpercaya dan mohon ditunggu! ";
