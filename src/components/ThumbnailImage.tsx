import { FC } from 'react'

interface Props {
  url: string
  alt: string
  rotation: number
  height: 50 | 200 
}

const ThumbnailImage: FC<Props> = ({url, alt, rotation, height}) => (
  <img
    key={url}
    src={url}
    alt={alt}
    style={{
      transform: `rotate(${rotation}deg)`,
      height: `${height}px`
    }}
  />
)

export default ThumbnailImage
