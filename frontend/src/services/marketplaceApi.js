// src/services/marketplaceApi.js
// Dummy mode: true = pakai data lokal, false = pakai Laravel API
const USE_DUMMY = true;
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const formatRupiah = (amount) =>
  'Rp ' + Number(amount).toLocaleString('id-ID');

// ─── Dummy Products ───────────────────────────────────────────────────────────
export const DUMMY_PRODUCTS = [
  { id:1, name:'Eco Paving Block', category:'plastik', price:6000, image:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80', description:'Paving block ramah lingkungan dari campuran plastik daur ulang dan semen. Kuat, tahan lama, dan membantu mengurangi sampah plastik yang mencemari lingkungan.', stock:500, is_featured:true, seller_name:'PT ECHO MAJU', unit:'pcs', rating:4.5, review_count:38, badge:null },
  { id:2, name:'Eco Fabric Keychain', category:'tekstil', price:3500, image:'https://images.unsplash.com/photo-1716306396977-7e5d4bb97f01?w=600&q=80', description:'Gantungan kunci unik buatan tangan dari kain perca daur ulang. Setiap produk bermotif berbeda dan bernilai seni tinggi.', stock:200, is_featured:true, seller_name:'PT NANET', unit:'pcs', rating:4.2, review_count:15, badge:null },
  { id:3, name:'Pupuk Organik Ramah Lingkungan', category:'organik', price:25000, image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', description:'Pupuk organik berkualitas dari bahan alami yang membantu menyuburkan tanah. Karung dari plastik recycle & bisa dipakai ulang.', stock:150, is_featured:true, seller_name:'EcoGrow', unit:'kg', rating:4.5, review_count:50, badge:'Best Seller' },
  { id:4, name:'Dompet Mini EcoPouch', category:'tekstil', price:9000, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', description:'Dompet mini dari karung goni daur ulang. Ringan, unik, dan ramah lingkungan.', stock:80, is_featured:false, seller_name:'EcoKraft', unit:'pcs', rating:4.0, review_count:22, badge:null },
  { id:5, name:'ToteBag EcoWeave', category:'tekstil', price:75000, image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', description:'Tas belanja dari anyaman serat daur ulang. Kuat menahan beban hingga 10kg.', stock:60, is_featured:false, seller_name:'WeaveGreen', unit:'pcs', rating:4.7, review_count:33, badge:'New' },
  { id:6, name:'Figure Mini Pelajar', category:'plastik', price:15000, image:'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=600&q=80', description:'Figur dekoratif mini dari plastik daur ulang. Cocok untuk hadiah atau koleksi.', stock:120, is_featured:false, seller_name:'ResinArt ID', unit:'pcs', rating:4.3, review_count:18, badge:null },
  { id:7, name:'Tempat Koin Piggy', category:'plastik', price:5000, image:'https://images.unsplash.com/photo-1602526212974-e9a97ebe6c96?w=600&q=80', description:'Celengan lucu berbentuk babi dari botol plastik daur ulang. Seru untuk anak-anak belajar menabung.', stock:200, is_featured:false, seller_name:'KidsEco', unit:'pcs', rating:4.1, review_count:27, badge:null },
  { id:8, name:'Tempat Makan Burung', category:'plastik', price:4500, image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', description:'Tempat makan burung dari botol plastik bekas. Mudah dipasang di taman atau balkon.', stock:300, is_featured:false, seller_name:'GreenBird', unit:'pcs', rating:4.4, review_count:12, badge:null },
  { id:9, name:'EcoFrame Kardus', category:'kardus', price:10000, image:'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', description:'Bingkai foto dari kardus tebal daur ulang. Dekorasi unik dan ramah lingkungan.', stock:90, is_featured:false, seller_name:'KardusCraft', unit:'pcs', rating:4.6, review_count:41, badge:null },
  { id:10, name:'Kompos Organik Premium', category:'organik', price:18000, image:'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', description:'Kompos siap pakai dari sampah organik rumah tangga yang diolah secara higienis.', stock:250, is_featured:false, seller_name:'BioCycle', unit:'kg', rating:4.5, review_count:29, badge:null },
  { id:11, name:'Vas Bunga Kardus', category:'kardus', price:12000, image:'https://images.unsplash.com/photo-1490750967868-88df5691cc18?w=600&q=80', description:'Vas bunga artistik dari lapisan kardus yang diperkuat. Tahan air dengan lapisan khusus.', stock:70, is_featured:false, seller_name:'KardusCraft', unit:'pcs', rating:4.2, review_count:19, badge:null },
];

async function apiFetch(path, options={}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers:{'Content-Type':'application/json',Accept:'application/json'}, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request gagal');
  return data;
}

export async function getProducts(params={}) {
  if (USE_DUMMY) {
    let list = [...DUMMY_PRODUCTS];
    if (params.category) list = list.filter(p => p.category === params.category);
    if (params.featured) list = list.filter(p => p.is_featured);
    if (params.search) { const q = params.search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q)); }
    return { products: list, meta: null };
  }
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.featured) qs.set('featured','1');
  if (params.search) qs.set('search', params.search);
  const res = await apiFetch(`/products${qs.toString()?'?'+qs:''}`);
  return { products: res.data ?? res, meta: res.meta ?? null };
}

export async function getProduct(id) {
  if (USE_DUMMY) {
    const p = DUMMY_PRODUCTS.find(p => p.id === parseInt(id));
    if (!p) throw new Error('Produk tidak ditemukan');
    return p;
  }
  const res = await apiFetch(`/products/${id}`);
  return res.data ?? res;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
const CART_KEY = 'ecoruk_cart';
export function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY))||[]; } catch { return []; } }
function saveCart(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); }

export function addToCart(product, quantity=1) {
  const cart = getCart();
  const ex = cart.find(i => i.id === product.id);
  if (ex) { ex.quantity += quantity; } else { cart.push({id:product.id, name:product.name, price:product.price, image:product.image, seller_name:product.seller_name, unit:product.unit||'pcs', quantity, checked:true}); }
  saveCart(cart); return cart;
}
export function updateCartQty(id, qty) { const c=getCart(); const i=c.find(x=>x.id===id); if(i) i.quantity=Math.max(1,qty); saveCart(c); return c; }
export function toggleCartItem(id) { const c=getCart().map(i=>i.id===id?{...i,checked:!i.checked}:i); saveCart(c); return c; }
export function toggleAllCartItems(checked) { const c=getCart().map(i=>({...i,checked})); saveCart(c); return c; }
export function removeFromCart(id) { const c=getCart().filter(i=>i.id!==id); saveCart(c); return c; }
export function calcCartTotals(cart, donation=false) {
  const sel=cart.filter(i=>i.checked);
  const subtotal=sel.reduce((s,i)=>s+i.price*i.quantity,0);
  const tax=Math.round(subtotal*0.1);
  const don=donation?1500:0;
  return {subtotal,tax,shipping:0,donation:don,total:subtotal+tax+don,count:sel.length};
}
export async function checkout({items,couponCode,includeDonation}) {
  if (USE_DUMMY) { await new Promise(r=>setTimeout(r,1000)); return {message:'Order berhasil',data:{id:Date.now(),status:'pending'}}; }
  return apiFetch('/orders',{method:'POST',body:JSON.stringify({items:items.map(i=>({product_id:i.id,quantity:i.quantity})),coupon_code:couponCode||undefined,include_donation:includeDonation})});
}
export function getCartCount() { return getCart().reduce((s,i)=>s+i.quantity,0); }