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
          <TableHeader>
            <TableRow>
              {users?.length &&
                Object.keys(users[0]).map((keyname, index) => (
                  <TableHead className="border-r-1" key={index}>
                    {" "}
                    {keyname}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={index}>
                {Object.values(user).map((val, index) => (
                  <TableCell className="border-r-1" key={index}>
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  )
}
