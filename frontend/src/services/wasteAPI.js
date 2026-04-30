const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const scanWaste = async (data) => {
  const res = await fetch(`${BASE_URL}/wastes/scan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal scan sampah');
  return json;
};

export const getCurrentWastes = async () => {
  const res = await fetch(`${BASE_URL}/wastes/current`, { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal memuat koleksi');
  return json.data;
};

export const exchangeWaste = async () => {
  const res = await fetch(`${BASE_URL}/wastes/exchange`, {
    method: 'POST',
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal menukar sampah');
  return json;
};

export const createPayment = async (data) => {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal memproses pembayaran');
  return json;
};

export const getPaymentHistory = async () => {
  const res = await fetch(`${BASE_URL}/payments`, { headers: getHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal memuat riwayat');
  return json.data;
};

export const WASTE_TYPE_LABELS = {
  plastik:       'Plastik Umum',
  pet_plastik:   'PET Botol Plastik',
  serat_kertas:  'Serat Kertas',
  plastic_fiber: 'Plastic Fiber',
  kardus:        'Kardus',
};

export const WASTE_PRICES = {
  pet_plastik:   6000,
  serat_kertas:  3000,
  plastic_fiber: 5500,
  plastik:       4000,
};

export const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount || 0);