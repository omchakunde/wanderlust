import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

/**
 * Prevent static build
 */
export const dynamic = "force-dynamic";

interface IParams {
  listingId?: string;
}

// ================= POST =================
export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // Lazy import (IMPORTANT)
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const favoriteIds = [
      ...(currentUser.favoriteIds || []),
      listingId,
    ];

    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error("POST FAVORITE ERROR:", error);

    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}

// ================= DELETE =================
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // Lazy import (IMPORTANT)
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds = favoriteIds.filter(
      (id) => id !== listingId
    );

    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favoriteIds,
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error("DELETE FAVORITE ERROR:", error);

    return new NextResponse("Server Error", {
      status: 500,
    });
  }
}
