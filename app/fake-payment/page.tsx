"use client"
import { Button } from '@/components/ui/button';
import { useIsMounted } from '@/hooks/use-is-mounted';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import { toast } from 'react-hot-toast';

interface FakePaymentProps { }

const FakePayment: FC<FakePaymentProps> = () => {
  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  async function pay() {
    setLoading(true)
    try {
      const response = await axios.post(`/api/webhook`, {
        address: 'abc',
        phone: "22435455",
        success: true,
        orderId: searchParams.get("orderId")
      })
      location.href = `http://localhost:3001/cart?success=1`
    } catch (error) {
      toast.error("error for " + error)
    } finally {
      setLoading(false)
    }
  }
  if (!isMounted) {
    return null
  }

  return (<div>
    <Button disabled={loading} onClick={() => {
      location.href = `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`
    }}>Cancel</Button>
    <Button disabled={loading} onClick={() => {
      pay()
    }}>Pay</Button>
  </div>);
}

export default FakePayment;
