import React from 'react'

export default function Loading() {
  return (
    <div className="space-y-10 py-4 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-muted/50 h-120 md:h-140 flex items-center px-6 md:px-12">
        <div className="max-w-2xl w-full space-y-6">
          {/* Badge skeleton */}
          <div className="h-6 w-36 bg-muted rounded-full" />
          
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-10 w-[90%] bg-muted rounded-lg" />
            <div className="h-10 w-[60%] bg-muted rounded-lg" />
          </div>
          
          {/* Subtitle skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-[80%] bg-muted rounded" />
            <div className="h-4 w-[50%] bg-muted rounded" />
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="h-11 w-44 bg-muted rounded-lg" />
            <div className="h-11 w-44 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Category Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-28 bg-muted/60 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Brand Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 bg-muted rounded" />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 w-36 bg-muted/60 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Featured Cars Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-28 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
          <div className="h-4 w-20 bg-muted rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-muted/50 rounded-xl overflow-hidden bg-card flex flex-col h-[320px]">
              {/* Image skeleton */}
              <div className="aspect-4/3 bg-muted/80 w-full" />
              
              {/* Content skeleton */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Brand name */}
                  <div className="h-3 w-16 bg-muted rounded" />
                  {/* Car title */}
                  <div className="h-4 w-[85%] bg-muted rounded" />
                </div>
                
                {/* Badges specifications */}
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-muted/60 rounded-full" />
                  <div className="h-5 w-16 bg-muted/60 rounded-full" />
                </div>
                
                {/* Price */}
                <div className="h-6 w-28 bg-muted rounded mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
