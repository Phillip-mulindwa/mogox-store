export const PRODUCTS = [
  { id: '1', title: 'Classic Tee', price: 19.99, category: 'tops', gender: 'men', isNew: true, 
    images: [
      'https://unsplash.com/photos/a-man-sitting-on-top-of-a-wooden-box-i-0jhxD1iF8', 
      'https://unsplash.com/photos/assorted-color-folded-shirts-on-wooden-panel-tWOz2_EK5EQ'
    ], 
    sizes: ['S','M','L','XL'], description: 'Soft cotton tee for everyday comfort.' 
  },
  { id: '2', title: 'Denim Jacket', price: 69.99, category: 'outerwear', gender: 'men', isNew: false, 
    images: [
      'https://unsplash.com/photos/a-woman-laying-on-the-ground-with-her-hand-on-her-head-cu2lsuznfuc',
      'https://unsplash.com/photos/a-label-on-the-back-of-a-jean-jacket-HYvkC1yNY2A'
    ], 
    sizes: ['M','L','XL'], description: 'Timeless denim with modern fit.' 
  },
  { id: '3', title: 'Slim Fit Jeans', price: 49.99, category: 'bottoms', gender: 'men', isNew: false, 
    images: [
      'https://unsplash.com/photos/a-woman-in-a-black-t-shirt-and-light-blue-jeans-K4Ty4UZ2vN8', 
      'https://unsplash.com/photos/man-in-blue-denim-jeans-standing-17qC7l19hMI'
    ], 
    sizes: ['30','32','34','36'], description: 'Stretch denim for everyday movement.' 
  },
  { id: '4', title: 'Hooded Sweatshirt', price: 39.99, category: 'tops', gender: 'unisex', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=80&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1614289677192-438dbb0c07c2?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L','XL'], description: 'Cozy hoodie with brushed interior.' 
  },
  { id: '5', title: 'Casual Shorts', price: 24.99, compareAt: 34.99, clearance: true, category: 'bottoms', gender: 'men', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1591012911203-f39235ab5ab0?w=1200&q=80&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1591047139832-9e7a9cf1f63a?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L'], description: 'Lightweight shorts for warm days.' 
  },
  { id: '6', title: 'Chic Dress', price: 79.99, category: 'dresses', gender: 'women', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200&q=80&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1520975825333-72b288f3e8e0?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L'], description: 'Elegant dress for day or evening.' 
  },
  { id: '7', title: 'Casual Sneakers', price: 59.99, category: 'shoes', gender: 'unisex', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1600180758892-437c08ef63b5?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562158070-1d827d9f61d6?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['7','8','9','10'], description: 'Comfortable sneakers with rubber sole.' 
  },
  { id: '8', title: 'Beanie Hat', price: 14.99, category: 'accessories', gender: 'unisex', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1573497161307-0d802cd8e8d6?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975929976-8e7a4b2a1a5b?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['One size'], description: 'Warm knit beanie.' 
  },
  { id: '9', title: 'Leather Belt', price: 24.99, category: 'accessories', gender: 'men', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1616338248312-6c4d86c913e4?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586201375761-83865001f6a0?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L'], description: 'Genuine leather belt.' 
  },
  { id: '10', title: 'Sunglasses', price: 34.99, category: 'accessories', gender: 'unisex', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520962967242-c1f9226e9086?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['One size'], description: 'Polarized lenses.' 
  },
  { id: '11', title: 'Oxford Shirt', price: 34.99, compareAt: 49.99, clearance: true, category: 'tops', gender: 'men', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1520975657289-6c7881a6b361?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L','XL'], description: 'Smart casual oxford.' 
  },
  { id: '12', title: 'Cargo Pants', price: 54.99, category: 'bottoms', gender: 'men', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1598014742762-078e3bbf2451?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581579181163-91c66dbbe229?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['30','32','34','36'], description: 'Utility pockets and relaxed fit.' 
  },
  { id: '13', title: 'Ribbed Knit Top', price: 24.99, category: 'tops', gender: 'women', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593033451245-85e2d321a6d8?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['XS','S','M','L'], description: 'Soft ribbed top with stretch.' 
  },
  { id: '14', title: 'Pleated Midi Skirt', price: 44.99, category: 'bottoms', gender: 'women', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520697220484-2e08d1d2d3e7?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L'], description: 'Flowy pleated skirt.' 
  },
  { id: '15', title: 'Puffer Jacket', price: 69.99, compareAt: 109.99, clearance: true, category: 'outerwear', gender: 'women', isNew: false, 
    images: [
      'https://chatgpt.com/c/68d2d5d5-76bc-8326-9cee-4dc32356c115',
      'https://images.unsplash.com/photo-1607344645866-009c320b63e?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L'], description: 'Warm lightweight puffer.' 
  },
  { id: '16', title: 'Running Leggings', price: 39.99, category: 'bottoms', gender: 'women', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600180758892-437c08ef63b5?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['XS','S','M','L'], description: 'High-rise leggings with compression.' 
  },
  { id: '17', title: 'Chelsea Boots', price: 99.99, category: 'shoes', gender: 'men', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600180758892-437c08ef63b5?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['8','9','10','11'], description: 'Leather Chelsea boots.' 
  },
  { id: '18', title: 'Sport Socks (3-Pack)', price: 12.99, category: 'accessories', gender: 'unisex', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1593032457861-693f24baf67b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573497161307-0d802cd8e8d6?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['One size'], description: 'Breathable cushioned socks.' 
  },
  { id: '19', title: 'Linen Blend Shirt', price: 39.99, category: 'tops', gender: 'men', isNew: true, 
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975657289-6c7881a6b361?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['S','M','L','XL'], description: 'Cool, airy linen blend.' 
  },
  { id: '20', title: 'Summer Sandals', price: 19.99, compareAt: 39.99, clearance: true, category: 'shoes', gender: 'women', isNew: false, 
    images: [
      'https://images.unsplash.com/photo-1540660241899-08dd1b5f13b2?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580910051076-7d7d87dcfd14?w=1200&q=80&auto=format&fit=crop'
    ], 
    sizes: ['6','7','8','9'], description: 'Comfortable strappy sandals.' 
  }
];
