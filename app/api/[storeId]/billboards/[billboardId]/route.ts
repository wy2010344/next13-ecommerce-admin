import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string
      billboardId: string
    }
  }
) {
  try {
    const billboard = await prismadb.ecommerceBillboard.findFirst({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}
export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      storeId: string
      billboardId: string
    }
  }
) {
  try {
    const { label, imageUrl } = await req.json()
    if (!label) {
      return new NextResponse("label is required", { status: 400 })
    }
    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 })
    }
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unautenticated", { status: 401 })
    }

    const storeByUserId = await prismadb.eCommerceStore.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const billboard = await prismadb.ecommerceBillboard.updateMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error)
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
      billboardId: string
    }
  }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unautenticated", { status: 401 })
    }

    const storeByUserId = await prismadb.eCommerceStore.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const billboard = await prismadb.ecommerceBillboard.deleteMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}