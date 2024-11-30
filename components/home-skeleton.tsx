import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400 p-4">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" /> {/* Title */}
          <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Subtitle */}
        </div>

        <div className="w-full max-w-xs mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Skeleton className="h-12 w-12 rounded-full mb-4" /> {/* Icon */}
              <Skeleton className="h-6 w-24 mb-2" /> {/* Feature title */}
              <Skeleton className="h-4 w-32" /> {/* Feature description */}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" /> {/* Slider label */}
                <Skeleton className="h-4 w-8" /> {/* Slider value */}
              </div>
              <Skeleton className="h-2 w-full" /> {/* Slider */}
            </div>
          ))}
        </div>

        <Skeleton className="h-12 w-full" /> {/* Button */}
      </div>
    </div>
  )
}

