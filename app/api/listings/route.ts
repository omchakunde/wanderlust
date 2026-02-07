import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ✅ Prevent build-time execution
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error("LISTING POST ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
