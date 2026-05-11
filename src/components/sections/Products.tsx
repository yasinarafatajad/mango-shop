import { mangoes } from "@/lib/data";
import ProductCard from "../product/ProductCard";
import Link from "next/link";

export default function Products() {
    return (
        <section>
            <div className="section-title">
                <h3>তাজা আম সমূহ</h3>
                <Link href="#" className="text-primary-orange">সব দেখুন</Link>
            </div>

            <div className="products-grid">
                {mangoes.map((mango) => (
                    <ProductCard key={mango.id} mango={mango} />
                ))}
            </div>
        </section>
    );
}