import { inngest } from '@/app/inngest/client'
import { autosaveProjectWorkflow } from '@/app/inngest/functions'
import {serve} from 'inngest/next'

export const {GET , POST , PUT} = serve({
    client : inngest,
    functions : [autosaveProjectWorkflow]
})

// should look 7:56