import { useState } from 'react'
import { useWebSocket } from '../hooks/use-websocket'
import { GridPattern } from '../components/ui/grid-pattern'
import { cn } from '../lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { ArrowUpRightIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { CodeBlock } from "@/components/ui/code-block";

function CreateGameCard({
  users,
  room,
  setUsers,
  setRoom,
  setGameStarted
}: {
  users: string[],
  room: string,
  setUsers: (users: string[]) => void,
  setRoom: (room: string) => void,
  setGameStarted: (gameStarted: boolean) => void
}) {
  const {
    createRoom,
    joinRoom,
    beginGame,
  } = useWebSocket()

  const form = useForm()
  const { toast } = useToast()

  return (<Card className="w-full max-w-4xl z-10">
    <CardHeader>
      <CardTitle>Create Game</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="roomName"
            render={({ field }) => (
              <FormItem className="text-start">
                <FormLabel>Room Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={room}
                    onChange={(e) => {
                      setRoom(e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>This is the name of the room you are creating.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

          <Separator />

          {users.map((user, index) => (
            <FormField
              control={form.control}
              name={`player${index}`}
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="flex justify-between">
                    <div>
                      Player {index + 1} Name
                    </div>

                    <Button variant="ghost" size="icon" className="h-fit"
                      onClick={() => {
                        if (users.length <= 1) {
                          toast({
                            title: 'Minimum of 1 Player',
                            description: 'You cannot remove the last player.',
                            variant: 'destructive',
                          })
                          return
                        }

                        const newUsers = [...users]
                        newUsers.splice(index, 1)
                        setUsers(newUsers)
                      }}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>

                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={user}
                      onChange={(e) => {
                        const newUsers = [...users]
                        newUsers[index] = e.target.value
                        setUsers(newUsers)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          ))}

          <Button
            className="w-fit self-end"
            variant="outline"
            onClick={() => {
              if (users.length >= 4) {
                toast({
                  title: 'Maximum of 4 Players',
                  description: 'You cannot add more than 4 players.',
                  variant: 'destructive',
                })
                return
              }

              setUsers([...users, ''])
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Player
          </Button>

          <Separator />

          <Button
            type="submit"
            className="w-full"
            onClick={() => {
              if (room.trim().length === 0) {
                toast({
                  title: 'Room Name is Missing',
                  description: 'Please enter a room name.',
                  variant: 'destructive',
                });
                return;
              }

              const missingName = users.some((user, index) => {
                if (user.trim().length === 0) {
                  toast({
                    title: `Player Name is Missing for Player ${index + 1}`,
                    description: 'Please enter a player name.',
                    variant: 'destructive',
                  });
                  return true;
                }
                return false;
              });

              if (missingName) {
                return;
              }

              createRoom(room, users[0]);
              users.slice(1).forEach((user) => joinRoom(room, user));
              beginGame(room);
            }}
          >
            Create Room
          </Button>
        </Form>
      </div>

      <Separator orientation="vertical" />

      <div className="flex-1 flex flex-col gap-4">
        {
          users.map((user, index) => (
            <div className="flex flex-col gap-2">
              <CodeBlock
                code={
                  !room
                    ? `No Room Name`
                    : !user
                      ? `No Username`
                      : `https://game.jwen.cc/${room}/${user}`
                }
                language="text"
                filename={`Player ${index + 1}`}
                highlightLines={[0]}
              />
              <Button
                variant="outline"
                disabled={!room || !user}
                className="w-fit self-end"
                onClick={() => {
                  window.open(
                    !room
                      ? `No Room Name`
                      : !user
                        ? `No Username`
                        : `https://game.jwen.cc/${room}/${user}`,
                    '_blank'
                  )
                }}
              >
                <ArrowUpRightIcon className="w-4 h-4" />
                Visit
              </Button>
            </div>
          ))
        }
      </div>

    </CardContent>
  </Card >
  )
}

function Lobby() {
  const [users, setUsers] = useState<string[]>([
    '',
  ])
  const [room, setRoom] = useState<string>('')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const { toast } = useToast()

  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <CreateGameCard
          users={users}
          room={room}
          setUsers={setUsers}
          setRoom={setRoom}
          setGameStarted={setGameStarted}
        />

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

export default Lobby
