"use client"
import type { FC } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Copy, Server } from 'lucide-react';
import { Badge, BadgeProps } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';

type ApiVariant = "public" | "admin"
interface ApiAlertProps {
  title: string
  description: string
  variant?: ApiVariant
}

const textMap: Record<ApiVariant, string> = {
  public: "Public",
  admin: "Admin"
}
const variantMap: Record<ApiVariant, BadgeProps['variant']> = {
  public: "secondary",
  admin: "destructive"
}

const ApiAlert: FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public"
}) => {
  return (<Alert>
    <Server className='h-4 w-4' />
    <AlertTitle className='flex items-center gap-x-2'>
      {title}
      <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
    </AlertTitle>
    <AlertDescription className='mt-4 flex items-center justify-between'>
      <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>{description}</code>
      <Button variant="outline" size="icon" onClick={() => {
        navigator.clipboard.writeText(description)
        toast.success("API Route copied to the clipboard")
      }}>
        <Copy className='h-4 w-4' />
      </Button>
    </AlertDescription>
  </Alert>);
}

export default ApiAlert;
