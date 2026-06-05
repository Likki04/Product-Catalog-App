"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Page heading */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-body font-medium text-ivory">Products</h1>
          <p className="text-xs text-ivory/30 mt-0.5">
            {loading ? "Loading..." : `${products.length} items`}
          </p>
        </div>
        <Link href="/catalog/new" className="btn-primary text-sm">
          + Add Product
        </Link>
      </div>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field max-w-xs"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 border transition-colors ${
                category === cat
                  ? "border-gold text-gold"
                  : "border-white/10 text-ivory/40 hover:text-ivory/70 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <p className="text-ivory/30 text-sm">Loading products...</p>
      )}

      {error && (
        <div className="py-10 text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ivory/30 text-sm mb-4">
            {search ? `No results for "${search}"` : "No products yet."}
          </p>
          <Link href="/catalog/new" className="btn-primary">Add Product</Link>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} index={0} />
          ))}
        </div>
      )}
    </div>
  );
}
