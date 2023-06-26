interface ClassControllerOptions {
  /**
   * @description 生成对应的class和对应可修改的值
   *
   * [
   *   ['class', 'border', 'shadow'],
   *   ['icon-class', 'textSize', 'textColor']
   * ]
   */
  keys: string[][]
  presets: string[][] // [['primary', 'text-blue-500 text-2xl']]
}
export function classController(_options: ClassControllerOptions) {

}

export function TextController() {

}
