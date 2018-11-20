var path = require('path')
var fs = require('fs')
var junk = require('junk')
const IMAGE_REGEXP = /<image(?:.*?)src=['"]\{\{.+?\}\}['"](?:.*?)(?:\/>|>(?:.*?)<\/image>)/g
function getAllFile (filePath, extname) {
  let files = fs.readdirSync(filePath)
  files = files.filter(junk.not)
  let filesArr = []
  files.forEach(file => {
    const fileDir = path.join(filePath, file)
    const stat = fs.statSync(fileDir)
    const isFile = stat.isFile() // 文件
    const isDir = stat.isDirectory() // 文件夹
    if (isDir) {
      filesArr = filesArr.concat(getAllFile(fileDir, extname))
    }
    if (isFile) {
      if (extname) {
        let selfExt = path.extname(fileDir)
        if (extname.indexOf(selfExt) !== -1) {
          filesArr.push(fileDir)
        }
      } else {
        filesArr.push(fileDir)
      }
    }
  })
  return filesArr
}

var files = getAllFile('./src', ['.wxml'])
let images = ''
files.forEach(file => {
  let data = fs.readFileSync(file, 'utf-8')
  data.replace(IMAGE_REGEXP, (image) => {
    // console.log(image)
    images += (image + '\n')
    console.log(images)
    return image
  })
})
console.log(images)
fs.writeFile('images.wxml', images, (err) => {
  if (err) throw err
  console.log('文件以保存')
})
