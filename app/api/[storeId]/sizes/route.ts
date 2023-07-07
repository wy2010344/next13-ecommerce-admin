import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function POST(req: Request, {
  params
}: {
  params: {
    storeId: string
  }
}) {
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

    const size = await prismadb.ecommerceSize.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    })
    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_POST]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}


export async function GET(req: Request, {
  params
}: {
  params: {
    storeId: string
  }
}) {
  try {
    const sizes = await prismadb.ecommerceSize.findMany({
      where: {
        storeId: params.storeId
      }
    })
    return NextResponse.json(sizes)
  } catch (error) {
    console.log("[SIZE_GET]", error)
    return new NextResponse("Interal error", { status: 500 })

  }
}