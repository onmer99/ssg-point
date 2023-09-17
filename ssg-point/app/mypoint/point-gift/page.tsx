import React from 'react'
import PointGiftTop from '@/components/pages/point/point-gift/PointGiftTop'
import PointGiftBot from '@/components/pages/point/point-gift/PointGiftBot'
import GiftPointFooter from '@/components/pages/pntGiftMain/GiftPointFooter'

const page = () => {
  return (
    <div>
      <PointGiftTop />
      <PointGiftBot />
      <GiftPointFooter/>
    </div>
  )
}

export default page