import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type CategorieColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

export const columns: ColumnDef<CategorieColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell({ row }) {
      return row.original.billboardLabel
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell({ row }) {
      return <CellAction data={row.original} />
    }
  }
]