import { TabsEditAccountCard } from '@/components/edit-account-card';

function EditAccount() {

    return (
        <div className='flex flex-col gap-2 w-auto h-screen '>
            <div className='flex flex-row justify-start items-start gap-2  p-0'>
                <span className='font-inria-sans text-2xl text-gray-400'>Edit Account</span>
            </div>

            <div className="flex w-full flex-grow  items-center justify-center p-0">
                <TabsEditAccountCard />
            </div>
        </div>
    )
}

export default EditAccount;
