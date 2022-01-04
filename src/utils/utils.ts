export const tplExtension = 'tpl'

export function getFileExtension(filename: string): string {
  let fname = filename

  if (fname.length === 0) return ''

  // handle dotfiles
  if (fname[0] === '.') fname = fname.substring(1)

  const fnameSplit = fname.split('.')

  // filenames without an extension
  if (fnameSplit.length <= 1) return ''

  return fnameSplit.pop() || ''
}

export function extensionIsTpl(ext: string): boolean {
  return ext === tplExtension
}

export function getAllTplFilenamesFromList(filenames: string[]): string[] {
  return filenames.filter((filename) => {
    return getFileExtension(filename) === tplExtension
  })
}
