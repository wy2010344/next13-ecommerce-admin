import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const {
    address,
    phone,
    success,
    orderId
  } = await req.json()

  if (!address) {
    return new NextResponse("need address", { status: 401 })
  }
  if (!phone) {
    return new NextResponse("need phone", { status: 401 })
  }
  if (!orderId) {
    return new NextResponse("need orderId", { status: 401 })
  }

  if (success) {
    const order = await prismadb.ecommerceOrder.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true,
        address,
        phone
      },
      include: {
        orderItems: true
      }
    })
    if (order) {
      await prismadb.ecommerceProduct.updateMany({
        where: {
          id: {
            in: order.orderItems.map(v => v.productId)
          }
        },
        data: {
          isArchived: true
        }
      })
      return NextResponse.json({
        type: "success"
      })
    }
    return new NextResponse("no order found", { status: 401 })
  }
}