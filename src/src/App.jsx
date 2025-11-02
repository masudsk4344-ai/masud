// src/App.jsx
import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/*
 Replica / learning clone:
 - Dark-mode catalog (grid + filters)
 - 17 product entries (placeholder images)
 - Product detail modal with color & size selectors
 - 'Sold out' badge for one product
 - Scroll/fade animations with framer-motion
 - Client-side pagination & sorting
*/

// ---------- Data ----------
const PRODUCTS = [
  { id:1, slug:'pure-simplicity-adult-tshirt', title:'pure Simplicity Adult T-shirt', price:18.99, seed:'p1', available:true },
  { id:2, slug:'pure-simplicity-kids-tshirt', title:'pure Simplicity Kids T-shirt', price:17.49, seed:'p2', available:true },
  { id:3, slug:'blossom-city-hoodie', title:'Simplicity Adult Blossom City Hoodie', price:40.49, seed:'p3', available:true },
  { id:4, slug:'blossom-skyline-hoodie', title:'Simplicity Adult Blossom city Skyline hoodie', price:40.49, seed:'p4', available:true },
  { id:5, slug:'blossom-sweatshirt', title:'Simplicity Adult Blossom city Skyline Sweatshirt', price:35.99, seed:'p5', available:true },
  { id:6, slug:'horizon-hoodie', title:'Simplicity Horizon Adult Hoodie', price:40.49, seed:'p6', available:true },
  { id:7, slug:'hydration-bottle', title:'Simplicity Hydration water bottle', price:10.49, seed:'p7', available:true },
  { id:8, slug:'legacy-crewneck', title:'Simplicity legacy Adult Crewneck Sweatshirt', price:35.99, seed:'p8', available:true },
  { id:9, slug:'legacy-hoodie', title:'Simplicity legacy Adult hoodie', price:40.49, seed:'p9', available:true },
  { id:10, slug:'legacy-tshirt', title:'Simplicity legacy Adult T-shirt', price:18.99, seed:'p10', available:true },
  { id:11, slug:'legacy-kids-hoodie', title:'Simplicity legacy Kids hoodie', price:36.99, seed:'p11', available:true },
  { id:12, slug:'legacy-kids-tshirt', title:'Simplicity legacy Kids T-shirt', price:17.49, seed:'p12', available:true },
  { id:13, slug:'style-adult-hoodie', title:'Simplicity style Adult hoodie', price:40.49, seed:'p13', available:true },
  { id:14, slug:'style-cap', title:'Simplicity Style Cap', price:15.99, seed:'p14', available:false }, // sold out
  { id:15, slug:'simplicity-tote', title:'Simplicity Tote', price:20.00, seed:'p15', available:true },
  { id:16, slug:'urban-essence-tshirt', title:'Simplicity urban essence Adult T-shirt', price:18.99, seed:'p16', available:true },
  { id:17, slug:'classic-crew', title:'Simplicity Classic Crew Sweatshirt', price:29.99, seed:'p17', available:true },
];

const img = (seed,w=900,h=900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const currency = n => `£${n.toFixed(2)} GBP`;

// ---------- App ----------
export default function App(){
  const [page, setPage] = useState(1)
  const perPage = 12
  const [selected, setSelected] = useState(null)
  const [sort, setSort] = useState('alpha')

  const sorted = useMemo(()=>{
    const arr = [...PRODUCTS]
    if(sort === 'alpha') arr.sort((a,b)=> a.title.localeCompare(b.title))
    if(sort === 'price-low') arr.sort((a,b)=> a.price - b.price)
    if(sort === 'price-high') arr.sort((a,b)=> b.price - a.price)
    return arr
  },[sort])

  const pageCount = Math.ceil(sorted.length / perPage)
  const items = sorted.slice((page-1)*perPage, page*perPage)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Topbar />
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-8">Products</h1>

        <div className="flex items-center justify-between mb-6 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>Filter:</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-700 rounded">Availability</button>
              <button className="px-3 py-1 border border-gray-700 rounded">Price</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>Sort by:</span>
            <select className="bg-transparent border border-gray-700 px-3 py-1 rounded" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="alpha">Alphabetically, A-Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <div className="text-gray-400">{PRODUCTS.length} products</div>
          </div>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((p, idx) => (
            <motion.article key={p.id}
              initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}}
              transition={{duration:.55, delay: idx * 0.03}} viewport={{once:true, amount:.2}}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:shadow-lg relative"
              onClick={()=>setSelected(p)}
            >
              <div className="aspect-[1/1] bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                <img src={img(p.seed,700,700)} alt={p.title} className="object-contain h-full w-full" />
              </div>

              {!p.available && (
                <div className="absolute left-3 top-3 bg-gray-700 px-3 py-1 rounded-full text-xs">Sold out</div>
              )}

              <h3 className="mt-4 text-sm text-gray-200">{p.title}</h3>
              <div className="mt-2 text-sm font-medium">{currency(p.price)}</div>
            </motion.article>
          ))}
        </section>

        <Pagination page={page} setPage={setPage} pageCount={pageCount} />
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">© {new Date().getFullYear()} Simplicity</footer>

      {selected && <ProductModal product={selected} onClose={()=>setSelected(null)} />}
    </div>
  )
}

// ---------- Header / Topbar ----------
function Topbar(){ return <div className="bg-white text-gray-800 text-center py-1 text-xs">Welcome to our store</div> }
function Header(){
  return (
    <header className="bg-black">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="font-serif text-2xl">SIMPlicity</div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Catalog</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">My story</a>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          <button aria-label="search" className="p-2 rounded hover:bg-gray-800">🔍</button>
          <button aria-label="account" className="p-2 rounded hover:bg-gray-800">👤</button>
          <button aria-label="bag" className="p-2 rounded hover:bg-gray-800">👜</button>
        </div>
      </div>
    </header>
  )
}

// ---------- Pagination ----------
function Pagination({ page, setPage, pageCount }){
  return (
    <div className="mt-12 flex items-center justify-center gap-4 text-gray-400">
      <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border border-gray-700 rounded">◀</button>
      {Array.from({length:pageCount}).map((_,i)=> (
        <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 ${page===i+1 ? 'bg-gray-700 text-white rounded' : 'border border-gray-700 rounded'}`}>{i+1}</button>
      ))}
      <button onClick={()=>setPage(p=>Math.min(pageCount,p+1))} className="px-3 py-1 border border-gray-700 rounded">▶</button>
    </div>
  )
}

// ---------- Product Modal ----------
function ProductModal({ product, onClose }){
  const colors = ['Light Pink','Navy','Sand','White','Black']
  const sizes = ['S','M','L','XL']
  const [color, setColor] = useState(colors[0])
  const [size, setSize] = useState(sizes[1])

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
      <motion.div initial={{scale:.98, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:.18}} className="bg-gray-900 max-w-5xl w-full rounded-lg overflow-hidden grid md:grid-cols-2">
        <div className="p-6 flex items-center justify-center bg-gray-800">
          <img src={img(product.seed,1000,1000)} alt={product.title} className="max-h-[72vh] object-contain" />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-400">PRINTIFY</div>
            <h2 className="text-3xl font-serif mt-2">{product.title}</h2>
            <div className="mt-4 text-xl font-medium">{currency(product.price)}</div>
            <div className="mt-2 text-sm text-gray-400">Taxes included.</div>

            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2">Color</div>
              <div className="flex gap-3 flex-wrap">
                {colors.map(c=> (
                  <button key={c} onClick={()=>setColor(c)} className={`px-4 py-2 rounded-full border ${color===c ? 'bg-white text-black' : 'border-gray-700 text-gray-300'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2">Size</div>
              <div className="flex gap-3">
                {sizes.map(s=> (
                  <button key={s} onClick={()=>setSize(s)} className={`px-4 py-2 rounded-full border ${size===s ? 'bg-white text-black' : 'border-gray-700 text-gray-300'}`}>{s}</button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-gray-400">Minimal comfort tee — clean design and soft fabric. Choose colour and size, then add to cart.</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={()=>alert('Mock add to cart (learning demo)')} className="flex-1 bg-white text-black py-3 rounded">Add to cart</button>
            <button onClick={onClose} className="px-4 py-3 border border-gray-700 rounded">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
