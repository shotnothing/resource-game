import { GridPattern } from '../components/ui/grid-pattern'
import { cn } from '../lib/utils'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function Error404Page() {
  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">

        <Card>
          <CardHeader>
            <CardTitle>404</CardTitle>
            <CardDescription>Page not found</CardDescription>
          </CardHeader>
        </Card>

        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
      </div >
    </>
  )
}

export default Error404Page
