import { Button } from '@components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip';
import {
  Triangle,
  SquareTerminal,
  Bot,
  Code2,
  Book,
  Settings2,
  LifeBuoy,
  SquareUser,
} from 'lucide-react';
import React from 'react';

export default function Sidebar() {
  return (
    <aside className='inset-y fixed  left-0 z-20 flex max-h-full min-h-[96.56%] flex-col border-r '>
      <div className='border-b p-2'>
        <Button variant='outline' size='icon' aria-label='Home'>
          <Triangle className='size-5 fill-foreground' />
        </Button>
      </div>
      <nav className='grid gap-1 p-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-lg bg-muted'
              aria-label='Playground'
            >
              <SquareTerminal className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Playground
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-lg w-0.75'
              aria-label='Models'
            >
              <Bot className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Models
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-lg'
              aria-label='API'
            >
              <Code2 className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            API
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-lg'
              aria-label='Documentation'
            >
              <Book className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Documentation
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-lg'
              aria-label='Settings'
            >
              <Settings2 className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Settings
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav className='mt-auto grid gap-1 p-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='mt-auto rounded-lg'
              aria-label='Help'
            >
              <LifeBuoy className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Help
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='mt-auto rounded-lg'
              aria-label='Account'
            >
              <SquareUser className='size-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={4} className='bg-main'>
            Account
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
