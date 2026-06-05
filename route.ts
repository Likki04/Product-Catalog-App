import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({ data: products }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, image, description } = body;

    if (!name || !price || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = createProduct({
      name,
      price: parseFloat(price),
      category,
      image: image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
      description,
    });

    return NextResponse.json({ data: product, message: "Product created" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
