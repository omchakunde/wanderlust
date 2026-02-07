import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IParams {
  listingId?: string;
}

/* ================= ADD TO FAVORITES ================= */
export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    const { default: prisma } = await import("@/lib/prismadb");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId) {
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
    console.error("FAVORITE POST ERROR:", error);

    return new NextResponse("Server Error", { status: 500 });
  }
}

/* ================= REMOVE FROM FAVORITES ================= */
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { default: getCurrentUser } = await import(
      "@/app/actions/getCurrentUser"
    );

    const { default: prisma } = await import("@/lib/prismadb");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const favoriteIds = (currentUser.favoriteIds || []).filter(
      (id: string) => id !== listingId
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
    console.error("FAVORITE DELETE ERROR:", error);

    return new NextResponse("Server Error", { status: 500 });
  }
}
