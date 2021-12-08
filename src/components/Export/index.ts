import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Sources } from '../../types'
import { chartFilename } from '../../defaults/chart_yaml'
import { valuesFilename } from '../../defaults/values_yaml'
import { helmignoreFilename } from '../../defaults/helmignore'

type Files = {
  chart: string
  values: string
  helmignore: string
  templates: Sources
}

const handleExport = (name: string, files: Files) => {
  console.log('export', name, files)

  const zip = new JSZip()

  zip.file(chartFilename, files.chart)
  zip.file(valuesFilename, files.values)
  zip.file(helmignoreFilename, files.helmignore)

  const templateDir = zip.folder('templates')
  Object.keys(files.templates).forEach((templateName) => {
    templateDir?.file(templateName, files.templates[templateName])
  })

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `${name}.zip`)
  })
}

export default handleExport
