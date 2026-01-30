export const dynamic = "force-dynamic";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  listingId?: string;
}

// ================= POST =================
export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
    console.error("POST Favorite Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
    console.error("DELETE Favorite Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
