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
      productId: string
    }
  }
) {
  try {
    const product = await prismadb.ecommerceProduct.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error)
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
      productId: string
    }
  }
) {
  try {
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived
    } = await req.json()
    if (!name) {
      return new NextResponse("name is required", { status: 400 })
    }
    if (!price) {
      return new NextResponse("price is required", { status: 400 })
    }
    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 400 })
    }
    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 })
    }
    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse("images is required", { status: 400 })
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

    await prismadb.ecommerceProduct.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          deleteMany: {}
        }
      }
    })

    const product = await prismadb.ecommerceProduct.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => {
                return image
              })
            ]
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error)
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
      productId: string
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

    const product = await prismadb.ecommerceProduct.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}