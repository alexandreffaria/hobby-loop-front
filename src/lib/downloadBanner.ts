import { toPng } from 'html-to-image'
import { bannerFilename, type BannerFormat } from './bannerFormats'

export const downloadBanner = async (
  node: HTMLElement,
  planName: string,
  format: BannerFormat,
): Promise<void> => {
  const dataUrl = await toPng(node, {
    width: format.width,
    height: format.height,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: '#090b10',
  })
  const link = document.createElement('a')
  link.download = bannerFilename(planName, format)
  link.href = dataUrl
  link.click()
}
