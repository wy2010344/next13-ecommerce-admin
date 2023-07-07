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
      colorId: string
    }
  }
) {
  try {
    const color = await prismadb.ecommerceColor.findFirst({
      where: {
        id: params.colorId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log("[COLOR_DELETE]", error)
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
      colorId: string
    }
  }
) {
  try {
    const { name, value } = await req.json()
    if (!name) {
      return new NextResponse("name is required", { status: 400 })
    }
    if (!value) {
      return new NextResponse("value is required", { status: 400 })
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

    const color = await prismadb.ecommerceColor.updateMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log("[COLOR_PATCH]", error)
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
      colorId: string
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

    const color = await prismadb.ecommerceColor.deleteMany({
      where: {
        id: params.colorId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log("[COLOR_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}