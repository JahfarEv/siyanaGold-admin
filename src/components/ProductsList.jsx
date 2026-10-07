import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Scale,
  IndianRupee,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "categories"), orderBy("createdAt", "asc")),
      (snapshot) =>
        setCategories(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        ),
      (error) => console.error("Error loading categories:", error),
    );
    return unsubscribe;
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, "products"), orderBy("createdAt", "desc")),
      );
      setProducts(
        snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: "error",
        title: "Could not load products",
        text: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    const product = products.find((item) => item.id === productId);
    const result = await Swal.fire({
      title: "Delete product?",
      text: `â€œ${product?.name || "This product"}â€ will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete product",
      cancelButtonText: "Keep it",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      const categoryId = product?.category?.id || product?.categoryId;
      if (categoryId)
        await updateDoc(doc(db, "categories", categoryId), {
          productCount: increment(-1),
          updatedAt: serverTimestamp(),
        });
      setProducts((current) => current.filter((item) => item.id !== productId));
      Swal.fire({
        icon: "success",
        title: "Product deleted",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Please try again.",
      });
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const term = searchTerm.toLowerCase().trim();
        const categoryName =
          typeof product.category === "object"
            ? product.category?.name
            : product.category;
        const searchable = [
          product.name,
          categoryName,
          product.material,
          product.gemstone,
          product.price,
          product.weight,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const categoryMatches =
          !selectedCategoryId ||
          product.category?.id === selectedCategoryId ||
          product.categoryId === selectedCategoryId;
        const statusMatches =
          filter === "all" || (product.status || "active") === filter;
        return searchable.includes(term) && categoryMatches && statusMatches;
      }),
    [products, searchTerm, selectedCategoryId, filter],
  );

  const activeCount = products.filter(
    (product) => (product.status || "active") === "active",
  ).length;
  if (loading)
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
            Catalog management
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your jewelry catalog accurate, polished, and ready to sell.
          </p>
        </div>
        <Link
          to="/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total products
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {products.length}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active listings
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {activeCount}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Showing now
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {filteredProducts.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4 text-amber-600" /> Find a
          product
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, material, category, price..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-amber-500"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-amber-500"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Material",
                  "Weight",
                  "Price",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const categoryName =
                  typeof product.category === "object"
                    ? product.category?.name
                    : product.category;
                const status = product.status || "active";
                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-amber-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                          <img
                            src={product.images?.[0]?.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="max-w-[240px] truncate text-sm font-semibold text-slate-900">
                            {product.name || "Untitled product"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.featured
                              ? "Featured piece"
                              : "Standard listing"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {categoryName || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.material || "â€”"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-sm font-semibold text-slate-700">
                        <Scale className="h-4 w-4 text-amber-600" />
                        {product.weight || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
                        {Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/edit/${product.id}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-amber-300" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
