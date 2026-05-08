import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface TableDemoProps {
  users: any[]
}

export function TableDemo({ users }: TableDemoProps) {
  return (
    <Table>
      {!users ? (
        <TableCaption>Table does not exist</TableCaption>
      ) : (
        <>
          <TableCaption>'Users' table from DB</TableCaption>
          <TableHeader>
            <TableRow>
              {users?.length &&
                Object.keys(users[0]).map((keyname, index) => (
                  <TableHead key={index}> {keyname}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={index}>
                {Object.values(user).map((val, index) => (
                  <TableCell key={index}>{val}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </>
      )}
    </Table>
  )
}
