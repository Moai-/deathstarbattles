// These used to be frontend-only, but have been moved to the shared ecs components
// For ease of refactoring, I'm re-exporting them here so I don't need to change
// a bunch of stuff
export * from 'shared/src/ecs/components/leavesTrail';
export * from 'shared/src/ecs/components/renderable';