import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { Nanum_Myeongjo } from "next/font/google"
import { NextResponse } from "next/server"


export async function POST(req: Request, {
  params
}: {
  params: {
    storeId: string
  }
}) {
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

    const Category = await prismadb.ecommerceCategory.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    })
    return NextResponse.json(Category)
  } catch (error) {
    console.log("[CATEGORY_POST]", error)
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
    const Categories = await prismadb.ecommerceCategory.findMany({
      where: {
        storeId: params.storeId
      }
    })
    return NextResponse.json(Categories)
  } catch (error) {
    console.log("[CATEGORY_GET]", error)
    return new NextResponse("Interal error", { status: 500 })

  }
}