import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, {
  params
}: {
  params: {
    storeId: string
  }
}) {
  const { productIds } = await req.json()
  if (!productIds || productIds.length == 0) {
    return new NextResponse("Product ids are required", {
      status: 400
    })
  }

  const products = await prismadb.ecommerceProduct.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  })
  const order = await prismadb.ecommerceOrder.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: products.map(product => {
          return {
            product: {
              connect: {
                id: product.id
              }
            }
          }
        })
      }
    }
  })

  return NextResponse.json({
    url: `https://localhost:3000/fake-payment?orderId=${order.id}`
  }, {
    headers: corsHeaders
  })
  // const session = await stripe.checkout.sessions.create({
  //   line_items: products.map(product => {
  //     return {
  //       quantity: 1,
  //       price_data: {
  //         currency: "USD",
  //         product_data: {
  //           name: product.name
  //         },
  //         unit_amount: product.price.toNumber() * 1000
  //       }
  //     }
  //   }),
  //   mode: "payment",
  //   billing_address_collection: "required",
  //   phone_number_collection: {
  //     enabled: true
  //   },
  //   success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
  //   cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
  //   metadata: {
  //     orderId: order.id
  //   }
  // })

  // return NextResponse.json({
  //   url: session.url
  // }, {
  //   headers: corsHeaders
  // })
}