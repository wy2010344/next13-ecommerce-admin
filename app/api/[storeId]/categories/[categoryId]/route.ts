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
      categoryId: string
    }
  }
) {
  try {
    const category = await prismadb.ecommerceCategory.findFirst({
      where: {
        id: params.categoryId,
        storeId: params.storeId
      },
      include: {
        billboard: true
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
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
      categoryId: string
    }
  }
) {
  try {
    const { name, billboardId } = await req.json()
    if (!name) {
      return new NextResponse("name is required", { status: 400 })
    }
    if (!billboardId) {
      return new NextResponse("billboardId is required", { status: 400 })
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

    const category = await prismadb.ecommerceCategory.updateMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error)
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
      categoryId: string
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

    const category = await prismadb.ecommerceCategory.deleteMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}