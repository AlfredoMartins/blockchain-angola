import { Toaster } from '@/components/toast/toaster';
import { useToast } from "@/components/ui/use-toast"
import TableVoters from '@/tables/voters_table/page';

function Voters() {
  const { toast } = useToast()

  return (
    <div className='flex gap-2 flex-col '>
      <span className='font-inria-sans text-2xl text-gray-400'>Voters</span>
      <div className='md:items-center md:gap-2 w-full bg-red h-screen'>
        <Toaster />
        <TableVoters toast={toast}/>
      </div>
    </div>
  )
}

export default Voters;