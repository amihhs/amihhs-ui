
declare module 'virtual:demo-loader' {
  const demos: Record<string,  import('./src/types').DemoItem[]>

  export default demos
}

declare module 'virtual:demo-loader/*' {
  const demos: Record<string,  import('./src/types').DemoItem[]>
  
  export default demos
}