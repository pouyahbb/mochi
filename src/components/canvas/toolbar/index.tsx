import React from 'react'
import HistoryPill from './history'
import ZoomBar from './zoom'
import ToolbarShapes from './shapes'

const Toolbar = () => {
    return (
        <div className='fixed bottom-0 left-0 right-0 w-full grid grid-cols-1 md:grid-cols-3 z-50 p-2 md:p-5 gap-2 md:gap-0'>
            <div className='flex justify-center md:justify-start order-2 md:order-1'>
                <HistoryPill />
            </div>
            <div className='flex justify-center order-1 md:order-2'>
                <ToolbarShapes />
            </div>
            <div className='flex justify-center md:justify-end order-3'>
                <ZoomBar />
            </div>
        </div>
    )
}

export default Toolbar