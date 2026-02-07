import { NextResponse } from "next/server";

/**
 * Prevent build-time execution
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IParams {
  listingId?: string;
}

// ================= DELETE =================
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // Lazy import auth
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    // Lazy import prisma
    const { default: prisma } = await import("@/lib/prismadb");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const listing = await prisma.listing.deleteMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error("DELETE LISTING ERROR:", error);

    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}
