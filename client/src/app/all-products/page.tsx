'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { Mango } from '@/lib/type';
import ProductCard from '@/components/product/ProductCard';
import './Products.css';

export default function AllProducts() {
  const [products, setProducts] = useState<Mango[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="products-page">
      <header className="page-header">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-title">লোড হচ্ছে...</h1>
      </header>
      <div className="py-20 text-center text-primary-green font-semibold">সব আম লোড করা হচ্ছে...</div>
    </div>
  );

  return (
    <div className="products-page">
      <header className="page-header">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-title">সব আম ({products.length})</h1>
      </header>

      <div className="products-container">
        {products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">কোনো আম পাওয়া যায়নি।</div>
        ) : (
          <>
            <div className="products-grid">
              {currentItems.map((mango) => (
                <ProductCard key={mango.id} mango={mango} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} className="page-arrow" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} className="page-arrow" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}