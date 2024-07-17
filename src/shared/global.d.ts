/** build time 构建时间 */
declare const BUILD_TIME: string

declare type Recordable<T = any> = Record<string, T>

declare module '*.yml' {
  const value: any
  export default value
}
