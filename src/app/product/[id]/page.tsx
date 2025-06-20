import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { NavBar } from "../../component/NavBar";
import { GetServerSidePropsContext } from "next";
import { Product } from "../../../types/product";

interface ProductPageProps {
  params: {
    id: string;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = params.id;

  const session = await getServerSession(authOptions);

  const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    next: { revalidate: 60 },
  });
  const product: Product = await res.json();

  return (
    <main>
      <NavBar session={session} />

      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
        <div className="bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-8">
          <h1 className="text-3xl font-bold mb-4 text-white text-center">
            {product.title}
          </h1>
          <img
            src={Array.isArray(product.images) ? product.images[0] : product.images}
            alt={product.title}
            className="h-80 w-full object-contain rounded-lg mb-6 bg-gray-100"
          />
          <p className="text-white mb-4">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-blue-600">
              ${product.price}
            </span>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
