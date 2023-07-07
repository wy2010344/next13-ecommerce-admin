"use client"
import useOrigin from '@/hooks/use-origin';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import ApiAlert from './api-alert';

interface ApiListProps {
  entityName: string
  entityIdName: string
}

const ApiList: FC<ApiListProps> = ({
  entityIdName,
  entityName
}) => {
  const params = useParams()
  const origin = useOrigin()
  const baseUrl = `${origin}/api/${params.storeId}`
  return (<>
    <ApiAlert
      title='GET'
      description={`${baseUrl}/${entityName}`}
    />
    <ApiAlert
      title='POST'
      variant="admin"
      description={`${baseUrl}/${entityName}`}
    />
    <ApiAlert
      title='GET'
      description={`${baseUrl}/${entityName}/{${entityIdName}}`}
    />
    <ApiAlert
      title='PATCH'
      variant="admin"
      description={`${baseUrl}/${entityName}/{${entityIdName}}`}
    />
    <ApiAlert
      title='DELETE'
      variant="admin"
      description={`${baseUrl}/${entityName}/{${entityIdName}}`}
    />
  </>);
}

export default ApiList;
