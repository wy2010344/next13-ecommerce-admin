import prismadb from "@/lib/prismadb";

export default async function getSalesCount(storeId: string) {
  const salesCount = await prismadb.ecommerceOrder.count({
    where: {
      storeId,
      isPaid: true
    }
  })
  return salesCount
}