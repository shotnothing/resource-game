import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BorderBeam } from "@/components/ui/border-beam"
import ShineBorder from '@/components/ui/shine-border'
import { RainbowButton } from './components/ui/rainbow-button'
import ShimmerButton from './components/ui/shimmer-button'
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronsRight, Coins, Crown, Flag, Gem, Percent, PersonStanding, Swords, TicketMinus, Trophy, X } from 'lucide-react'
import './App.css'

import art from './art.json'
function GetArtFromCard(card: Card) {
  console.log(card)
  return art[card.art as keyof typeof art]
}
function GetArtFromNoble(noble: Noble) {
  return art[noble.art as keyof typeof art]
}

import gameState from './temp.json'
const currentPlayerName = Object.keys(gameState.game.players)[0] as keyof typeof gameState.game.players
const currentPlayer = { name: currentPlayerName, ...gameState.game.players[currentPlayerName] }
const yourName = "Alice"

type Player = {
  name: string
  attained_collection: number | null
  developments: number[]
  reservations: number[]
  wallet: Record<string, number>
}

function MiniTokenDisplay({ tokens, dropZero = false }: { tokens: Record<string, number>, dropZero?: boolean }) {
  return (<>{
    GetOrderedPrice(tokens).map(([color, amount]) => (
      dropZero && amount == 0 ? <></> : <Badge
        key={color}
        className={
          `${GetTokenColorScheme(color).backgroundDark} text-xs text-center ${GetTokenColorScheme(color).text} h-5`
        }
        variant="outline"
      >
        {amount}
      </Badge>
    ))
  } </>)
}

function MiniDiscountDisplay({ tokens, dropZero = false }: { tokens: Record<string, number>, dropZero?: boolean }) {
  return (<>{
    GetOrderedPrice(tokens).map(([color, amount]) => (
      dropZero && amount == 0 ? <></> : <Badge
        key={color}
        className={
          `${GetTokenColorScheme(color).verylight} ${GetTokenColorScheme(color).border} text-xs text-center ${GetTokenColorScheme(color).text} h-5`
        }
        variant="outline"
      >
        {amount}
      </Badge>
    ))
  } </>)
}


function MiniReservationCard({ card }: { card: Card }) {
  return (
    <Card className={`${GetTokenColorScheme(card.discount).verylight} ${GetTokenColorScheme(card.discount).border} border-0 border-l-4 rounded-md`}>
      <CardContent className="p-1 flex flex-row gap-1">
        <div className="text-sm">{GetArtFromCard(card).icon}</div>
      </CardContent>
    </Card>
  )
}

function PlayerCard({ player }: { player: Player }) {
  const score = GetPlayerScore(player)
  const totalDiscount = GetPlayerDiscount(player)

  const reservations = player.reservations.map((index) => gameState.cards[index])

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="p-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2">
            <Swords className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{player.name} {player.name == yourName ? "(You)" : ""}</h3>

            {player.name != yourName && (
              <>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-semibold text-muted-foreground">Wallet:</p>

                  <div className="flex flex-row gap-1">
                    <MiniTokenDisplay tokens={player.wallet} />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-semibold text-muted-foreground">Discount:</p>

                  <div className="flex flex-row gap-1">
                    <MiniDiscountDisplay tokens={totalDiscount} />
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm font-semibold text-muted-foreground">Victory Points:</p>
                  <p className="text-sm font-bold text-muted-foreground">{score} / 15</p>
                  <Progress value={score / 15 * 100} indicatorColor='bg-muted-foreground' className="h-2 w-16" />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-muted-foreground">Reservations:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {reservations.map((reservation) => (
                      <MiniReservationCard key={reservation.id} card={reservation} />
                    ))}
                  </div>
                </div>

              </>)}

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PlayersList() {
  const players = Object.entries(gameState.game.players).map(([name, player]) => ({ name, ...player }))

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-5">
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Players
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
      </CardContent>
    </Card>
  )
}

const tokenColorScheme: Record<string, Record<string, string>> = {
  'White': {
    'verylight': 'bg-slate-100',
    'background': 'bg-slate-200',
    'backgroundDark': 'bg-slate-300',
    'indicator': 'bg-slate-400',
    'text': 'text-slate-900',
    'textlight': 'text-slate-400',
    'border': 'border-slate-300',
  },
  'Black': {
    'verylight': 'bg-stone-100',
    'background': 'bg-stone-400',
    'backgroundDark': 'bg-stone-400',
    'indicator': 'bg-stone-500',
    'text': 'text-stone-950',
    'textlight': 'text-stone-500',
    'border': 'border-stone-600',
  },
  'Red': {
    'verylight': 'bg-red-100',
    'background': 'bg-red-400',
    'backgroundDark': 'bg-red-400',
    'indicator': 'bg-red-500',
    'text': 'text-red-950',
    'textlight': 'text-red-500',
    'border': 'border-red-400',
  },
  'Green': {
    'verylight': 'bg-emerald-100',
    'background': 'bg-emerald-400',
    'backgroundDark': 'bg-emerald-400',
    'indicator': 'bg-emerald-500',
    'text': 'text-emerald-950',
    'textlight': 'text-emerald-500',
    'border': 'border-emerald-400',
  },
  'Blue': {
    'verylight': 'bg-blue-100',
    'background': 'bg-blue-400',
    'backgroundDark': 'bg-blue-400',
    'indicator': 'bg-blue-500',
    'text': 'text-blue-950',
    'textlight': 'text-blue-500',
    'border': 'border-blue-400',
  },
  'Gold': {
    'verylight': 'bg-amber-100',
    'background': 'bg-amber-300',
    'backgroundDark': 'bg-amber-300',
    'indicator': 'bg-amber-500',
    'text': 'text-amber-950',
    'textlight': 'text-amber-500',
    'border': 'border-amber-400',
  },
}

function Capitalize(token: string) {
  return token.charAt(0).toUpperCase() + token.slice(1)
}

function GetTokenColorScheme(token: string) {
  // Capitalize the first letter
  return tokenColorScheme[Capitalize(token)]
}

function GetOrderedPrice(price: Record<string, number>) {
  const ORDER = ['white', 'black', 'red', 'green', 'blue', 'gold'];

  return Object.entries(price)
    .filter(([color]) => ORDER.includes(color)) // Filter out any colors that are not in the ORDER array
    .sort(([colorA], [colorB]) => ORDER.indexOf(colorA) - ORDER.indexOf(colorB)); // Sort
}

function GetDisplayName(name: string = currentPlayerName) {
  if (name == yourName) {
    return `You`
  }
  return name
}

function GetPlayerScore(player: Player) {
  return player.developments.reduce((acc, development) => acc + gameState.cards[development].score, 0)
}

function GetPlayerDiscount(player: Player) {
  return player.developments.reduce((acc, development) => {
    const discountColor = gameState.cards[development].discount as keyof typeof acc;
    acc[discountColor] += 1;
    return acc;
  }, {
    black: 0,
    blue: 0,
    green: 0,
    red: 0,
    white: 0,
  });
}

function GetPriceAfterDiscount(
  price: Record<string, number>,
  discount: Record<string, number>
): Record<string, number> {
  const adjustedPrice: Record<string, number> = {};
  for (const [color, amount] of Object.entries(price)) {
    // Ensure we don't end up with negative values
    adjustedPrice[color] = Math.max(0, amount - (discount[color] || 0));
  }
  return adjustedPrice;
}

function IsFree(price: Record<string, number>) {
  return Object.values(price).every(amount => amount === 0)
}

function ActionMarker() {
  return <ChevronsRight className="h-4 w-4 text-indigo-500" />
}

function BankSection() {
  const tokens = [
    { name: 'White', amount: gameState.game.bank.white, max: 7 },
    { name: 'Black', amount: gameState.game.bank.black, max: 7 },
    { name: 'Red', amount: gameState.game.bank.red, max: 7 },
    { name: 'Green', amount: gameState.game.bank.green, max: 7 },
    { name: 'Blue', amount: gameState.game.bank.blue, max: 7 },
    { name: 'Gold', amount: gameState.game.bank.gold, max: 5 },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 pb-4">
          <Coins className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Bank</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tokens.map((token) => (
            <div key={token.name} className={`${tokenColorScheme[token.name].background} p-2 rounded`}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.name}</span>
                <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.amount}/{token.max}</span>
              </div>
              <Progress
                value={(token.amount / token.max) * 100}
                className={`h-2 ${tokenColorScheme[token.name].verylight}`}
                indicatorColor={tokenColorScheme[token.name].indicator}
              />
            </div>
          ))}
        </div>

        <Separator className="w-full my-2" />

        <div className="flex flex-row gap-2">
          <Button className="w-full relative" variant="outline">
            <ActionMarker />
            Take 2 Same
            <BorderBeam size={50} duration={5} />

          </Button>

          <Button className="w-full relative" variant="outline">
            <ActionMarker />
            Take 3 Diff.
            <BorderBeam size={50} duration={5} />

          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

function WalletSection() {
  const tokens = [
    { name: 'White', amount: currentPlayer.wallet.white },
    { name: 'Black', amount: currentPlayer.wallet.black },
    { name: 'Red', amount: currentPlayer.wallet.red },
    { name: 'Green', amount: currentPlayer.wallet.green },
    { name: 'Blue', amount: currentPlayer.wallet.blue },
    { name: 'Gold', amount: currentPlayer.wallet.gold },
  ]

  const total = tokens.reduce((acc, token) => acc + token.amount, 0);

  return (
    <Card className="mx-auto">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 pb-4">
              <Coins className="h-5 w-5 text-muted-foreground" />
              Wallet <div className="text-muted-foreground">({GetDisplayName()})</div>
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {tokens.map((token) => (
                <div key={token.name} className={`${tokenColorScheme[token.name].background} p-2 rounded w-24`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`${tokenColorScheme[token.name].text} font-medium`}>{token.name}</span>
                  </div>
                  <div className="flex items-center text-lg font-semibold">
                    <span className={`${tokenColorScheme[token.name].text}`}>{token.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


function DeckCard({ tier }: { tier: string }) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-r-4 border-b-4 border-t-0 border-l-0 border-muted-foreground/25">
      <CardContent className="flex aspect-[3/4] items-center justify-center p-6">
        <div className="text-center">
          <div className="text-lg font-semibold">Tier {tier}</div>
          <div className="text-sm text-muted-foreground">Cards Left: {gameState.game.decks[tier as keyof typeof gameState.game.decks].hidden_count}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RainbowText({ text, className }: { text: string, className?: string }) {
  return (
    <span className={cn("animate-pulse-rainbow bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto]", className)}>
      {text}
    </span>
  )
}

type Card = {
  id: number
  art: string
  discount: string
  price: Record<string, number>
  score: number
  tier: string
}

function GameCard({ card }: { card: Card }) {
  const discount = GetPlayerDiscount(currentPlayer)
  const priceAfterDiscount = GetPriceAfterDiscount(card.price, discount)

  return (
    <Card className="transition-all hover:scale-105 shadow-lg">
      <CardContent className="flex flex-col aspect-[3/4] p-4 py-3">
        <div className="flex items-start gap-2">
          {card.score > 0 && <div>
            <h2 className="text-3xl font-bold text-muted-foreground">{card.score}</h2>
            <Trophy className="h-4 w-4 text-muted-foreground/50" />
            {/* <div className="text-xs text-muted-foreground font-semibold ${GetTokenColorScheme(card.discount).textlight">Points</div> */}
          </div>}
          <div className="flex-grow"></div>
          <div className={`flex flex-col items-center pt-1`}>
            <Gem className={`h-8 w-8 ${GetTokenColorScheme(card.discount).textlight}`} />
            <div className={`text-md text-muted-foreground font-medium ${GetTokenColorScheme(card.discount).textlight}`}>-1</div>
          </div>

        </div>

        <div className="flex items-center justify-center flex-col gap-4">
          <div className="text-6xl font-bold">{GetArtFromCard(card).icon}</div>
          <div className="text-md font-bold text-muted-foreground">{GetArtFromCard(card).name}</div>
        </div>

        <div className="mt-auto">

          <div className="flex flex-row gap-1">
            <div className="text-sm text-muted-foreground font-semibold">Price:</div>
            {IsFree(priceAfterDiscount) ? <RainbowText text="Free!" className="text-sm font-bold" /> : <></>}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {GetOrderedPrice(priceAfterDiscount).map(([color, amount]) => (
              amount > 0 && (
                <Badge
                  key={color}
                  className={
                    `${GetTokenColorScheme(color).background} text-md text-center ${GetTokenColorScheme(color).text}`
                  }
                  variant="outline"
                >
                  {amount}
                </Badge>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



function CardGrid() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {["3", "2", "1"].map((tier) => (
        <>
          <DeckCard key={`deck-${tier}`} tier={tier} />
          {[0, 1, 2, 3].map((index) => {
            const deck = gameState.game.decks[tier as keyof typeof gameState.game.decks]
            const cardIndex = deck.visible[index]
            const card = gameState.cards[cardIndex]
            return <GameCard key={`card-${tier}-${index}`} card={card} />
          })}
        </>
      ))}
    </div>
  )
}

function ReservationCard({ card }: { card: Card }) {
  const art = GetArtFromCard(card)

  const discount = GetPlayerDiscount(currentPlayer)
  const priceAfterDiscount = GetPriceAfterDiscount(card.price, discount)

  return (
    <Card className={`transition-colors hover:bg-muted/50 border-0 border-l-4 ${GetTokenColorScheme(card.discount).border} ${GetTokenColorScheme(card.discount).verylight}`}>
      <CardContent className="p-1">

        <div className='flex justify-between gap-4'>

          <div className="flex items-center gap-2">
            <div className="text-2xl">{art.icon}</div>
            <div className="text-md font-bold text-muted-foreground">{GetArtFromCard(card).name} ({card.score})</div>
          </div>

          <div className="flex justify-between gap-1">
            <div className="grid grid-cols-4 gap-1 items-center">
              {GetOrderedPrice(priceAfterDiscount).map(([color, amount]) => (
                amount > 0 && (
                  <Badge
                    key={color}
                    className={
                      `${GetTokenColorScheme(color).backgroundDark} text-sm text-center ${GetTokenColorScheme(color).text} w-7 h-7`
                    }
                    variant="outline"
                  >
                    {amount}
                  </Badge>
                )
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                className={`px-2 h-8 ml-3 relative`}
                variant="outline"
              >
                <ActionMarker />
                Purchase

                <BorderBeam size={50} duration={5} />
              </Button>

            </div>


          </div>

        </div>

      </CardContent>
    </Card>
  )
}

function ReservationsSection() {
  const reservationsIndexes = gameState.game.players[currentPlayerName].reservations
  const reservations = reservationsIndexes.map((index) => gameState.cards[index])
  return (
    <Card>
      <CardHeader className="py-5">
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-muted-foreground" />
          Reservations <div className="text-muted-foreground">({GetDisplayName()})</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} card={reservation} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DevelopmentCard({ card }: { card: Card }) {
  const art = GetArtFromCard(card)
  return (
    <Card className={`transition-colors hover:bg-muted/50 border-0 border-l-4 ${GetTokenColorScheme(card.discount).border} ${GetTokenColorScheme(card.discount).verylight}`}>
      <CardContent className="p-1">

        <div className='flex items-center gap-4'>

          <div className="flex items-center gap-2">
            <div className="text-2xl">{art.icon}</div>
            <div className="text-md font-bold text-muted-foreground">{GetArtFromCard(card).name} ({card.score})</div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

type Noble = {
  art: string
  score: number
  trigger: Record<string, number>
}

function NobleCard({ noble }: { noble: Noble }) {
  const art = GetArtFromNoble(noble)
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-2 px-2">

        <div className="flex flex-col gap-3">

          <div className="flex flex-col items-center">
            <div className="text-md font-bold text-muted-foreground">{art.name}</div>
            <div className="text-5xl text-muted-foreground">{art.icon}</div>
          </div>

          <div className="grid grid-cols-2 items-center justify-center gap-1">
            {GetOrderedPrice(noble.trigger).map(([color, amount]) => (
              <Badge
                key={color}
                className={
                  `${GetTokenColorScheme(color).verylight} ${GetTokenColorScheme(color).border} text-sm text-center ${GetTokenColorScheme(color).text} h-7`
                }
                variant="outline"
              >
                {amount}
              </Badge>
            ))}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

function NoblesSection() {
  const nobles = gameState.game.collections_in_play.map((index) => gameState.collections[index])

  return (
    <Card>
      <CardHeader className="py-5">
        <CardTitle className="flex items-center gap-2">
          <PersonStanding className="h-5 w-5 text-muted-foreground text-yellow-500" />
          Nobles <div className="text-muted-foreground text-sm">(+3 Victory Points)</div>
        </CardTitle>
      </CardHeader>
      <CardContent>

        <div className="grid grid-cols-5 gap-2">
          {nobles.map((noble) => (
            <NobleCard key={noble.art} noble={noble} />
          ))}
        </div>

      </CardContent>
    </Card>
  )
}

function DevelopmentsSection() {
  const developments = currentPlayer.developments.map((development) => gameState.cards[development]);

  const totalDiscount = developments.reduce((acc, development) => {
    const discountColor = development.discount as keyof typeof acc;
    acc[discountColor] += 1;
    return acc;
  }, {
    black: 0,
    blue: 0,
    green: 0,
    red: 0,
    white: 0,
  });

  const totalScore = developments.reduce((acc, development) => {
    return acc + development.score;
  }, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-5">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          Developments <div className="text-muted-foreground">({GetDisplayName()})</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex flex-row gap-4 items-center">
            <div className="text-md font-semibold text-muted-foreground">Total Discount: </div>
            <div className="flex flex-row gap-1">
              {GetOrderedPrice(totalDiscount).map(([color, amount]) => (
                <Badge
                  key={color}
                  className={
                    `${GetTokenColorScheme(color).verylight} ${GetTokenColorScheme(color).border} text-sm text-center ${GetTokenColorScheme(color).text} h-7`
                  }
                  variant="outline"
                >
                  {amount}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <div className="text-md font-semibold text-muted-foreground">Total Victory Points: </div>
            <div className="text-md font-bold text-muted-foreground">{totalScore} / 15</div>
            <Progress className="w-[30%]" indicatorColor='bg-muted-foreground' value={totalScore / 15 * 100} />
          </div>

          <Separator className="w-full" />
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {developments.map((development) => (
              <DevelopmentCard key={development.id} card={development} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}



function GameInterface() {
  return (
    <>
      <div className="flex h-full w-full overflow-hidden bg-background p-4">
        {/* Left sidebar - Players */}
        <div className="flex-shrink-0 mr-6 flex flex-col h-full">
          {/* Top section */}
          <div className="flex flex-col h-full space-y-5">
            <BankSection />
            <div className="flex-grow">
              <PlayersList />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex-shrink-0 flex flex-col h-full">

          <div className="flex-grow">
            <CardGrid />
          </div>

          {/* Wallet anchored at the bottom */}
          <div className="mt-auto w-full">

            <WalletSection />

          </div>

        </div>

        {/* Right sidebar */}
        <div className="flex-shrink-0 ml-6 flex flex-col h-full space-y-5 overflow-hidden">
          <NoblesSection />
          <ReservationsSection />
          <div className="flex-1 overflow-hidden">
            <DevelopmentsSection />
          </div>
        </div>

      </div>
    </>
  );
}




function App() {
  return (
    <>
      <div className="flex h-screen w-screen">
        <GameInterface />
      </div>
    </>
  )
}

export default App
