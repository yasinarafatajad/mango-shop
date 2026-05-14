'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Mango } from "@/lib/type";
import ProductCard from "../../product/ProductCard";
import Link from "next/link";

export default function Products() {
    const [products, setProducts] = useState<Mango[]>([]);
    const [loading, setLoading] = useState(true);
    const totalProducts = 5;

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

    if (loading) return <div className="loading-state">লোড হচ্ছে...</div>;
    if (products.length === 0) return <div className="empty-state">কোনো আম পাওয়া যায়নি।</div>;

    return (
        <section>
            <div className="section-title">
                <h3>তাজা আম সমূহ</h3>
                <Link href="/all-products" className="text-primary-orange">সব দেখুন</Link>
            </div>

            <div className="products-grid">
                {products.slice(0, totalProducts).map((mango) => (
                    <ProductCard key={mango.id} mango={mango} />
                ))}
            </div>
        </section>
    );
}