
let numVal:Array<any> = [1,2,3,5,10,20,30,50]

let enumVal:Array<any> = ['1,1','5,5','10,10','20,20','30,30','50,10','20,40']

export default {
    nodeSize: {
      type: 'enum',
      title: '圆点大小',
      values: numVal
    },
    size: {
      type: 'enum',
      title: '布局尺寸',
        values: enumVal
    },
    separation: {
      type: 'enum',
      title: '间距大小',
      values: enumVal,
    },
    position: {
      type: 'enum',
      title: '链接位置',
      values: ['linkHorizontal', 'linkVertical'],
    }
  };
