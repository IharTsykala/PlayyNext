import React from 'react'
import Image, { ImageProps } from 'next/image'
/**
 * Image document in Payload after references are expanded.
 * These are the only required fields.
 */



interface MediaTypes {
    __typename?: string
    id?: string
    filename?: string
    mimeType?: string
    filesize?: string
    width?: number
    height?: number
    alt?: string
    blurHash?: string
    dimensions?: {
        width?: number
        height?: number
    }
    duration?: number
    s3?: {
        url?: string
    },
    aspectRatio?: string
}
// export interface ExpandedImage {
//     fileurl: string
//     width: number
//     height: number
//     alt?: string
// }

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'width' | 'height'> {
    maxWidth?: number
    maxHeight?: number
    image: any
}

const getValue = (value: number, ratio: number) => {
  console.log(5, value, ratio)
  return value * ratio
}

const getSizeImg = (width: number, height: number, aspectRatio: string, name: string) => {
  if (!aspectRatio) {
    return name === "width" ? width : height
  }
  return name === "width"
    // for case when get width
    ?   +aspectRatio.split(":")[0] >= +aspectRatio.split(":")[1]
        // for 16:9 2:1 etc format
        ? getValue(width, 1)
        // for 2:3 1:2 etc format
        : getValue(height, +aspectRatio.split(":")[0] / +aspectRatio.split(":")[1])

    // for case when get height
    : +aspectRatio.split(":")[0] >= +aspectRatio.split(":")[1]
        // for 16:9 2:1 etc format
        ? getValue(width, +aspectRatio.split(":")[1] / +aspectRatio.split(":")[0])
        // for 2:3 1:2 etc format
        : getValue(height,1)
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
       image,
       maxHeight,
       maxWidth,
       alt,
       ...otherProps
   }) => {
    if (!image?.s3.url || !image?.height) {
        return null
    }

    const widthRatio = (maxWidth || image.width) / image.width
    const heightRatio = (maxHeight || image.height) / image.height

    let width = maxWidth || image.width
    let height = maxHeight || image.height

    if (maxWidth && !maxHeight) {
        height = Math.min(image?.height, image?.height * widthRatio)
    } else if (maxWidth && maxHeight) {
        // The smallest max dimension limits the other one
        if (widthRatio < heightRatio) {
            height = Math.min(image?.height, image?.height * widthRatio)
        } else {
            width = Math.min(image?.width, image?.width * heightRatio)
        }
    } else if (maxHeight) {
        width = Math.min(image?.width, image?.width * heightRatio)
    }

    console.log(2, width, height)
    const wrapWidth = getSizeImg(width, height, image.aspectRatio, "width")

    const wrapHeight = getSizeImg(width, height, image.aspectRatio, "height")
    console.log(6, wrapWidth, wrapHeight, image.aspectRatio)

    return (
        <Image
            // blurDataURL={`${image.blurHash}`}
            src={image.s3.url}
            width={wrapWidth}
            height={wrapHeight}
            alt={alt}
            {...(otherProps as any)}
            // placeholder='blur'
        />
    )
}

export default OptimizedImage