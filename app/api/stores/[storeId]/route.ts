import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string
    }
  }
) {
  try {
    const { name } = await req.json()
    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unautenticated", { status: 401 })
    }

    const store = await prismadb.eCommerceStore.updateMany({
      where: {
        id: params.storeId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("[STORE_PATCH]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}


export async function DELETE(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string
    }
  }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unautenticated", { status: 401 })
    }

    const store = await prismadb.eCommerceStore.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("[STORE_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}