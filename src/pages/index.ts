import React from 'react'


export const ComponentsPage = React.lazy(() => import('./components/index'))
export const AnimationsPage = React.lazy(() => import('./animations/index'))
export const SolutionsPage = React.lazy(() => import('./solutions/index'))
export const TopicsPage = React.lazy(() => import('./topics/index'))