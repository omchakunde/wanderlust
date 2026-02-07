import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Lazy imports (important for Vercel build)
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    const { default: prisma } = await import("@/lib/prismadb");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = body;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        locationValue: location?.value,
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error("LISTINGS POST ERROR:", error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
