import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unautenticated", { status: 401 })
    }
    const store = await prismadb.eCommerceStore.create({
      data: {
        name,
        userId
      }
    })
    return NextResponse.json(store)
  } catch (error) {
    console.log("[STORES_POST]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}