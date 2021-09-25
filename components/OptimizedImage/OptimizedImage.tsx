import React from 'react'
import Image, { ImageProps } from 'next/image'
/**
 * Image document in Payload after references are expanded.
 * These are the only required fields.
 */



interface MediaTypes {
    __typename: string
    id: string
    filename: string
    mimeType: string
    filesize: number
    width: number
    height: number
    alt: string
    blurHash: string
    dimensions: {
        width: number
        height: number
    }
    duration: number | null
    s3: {
        url: string | StaticImageData
    },
    aspectRatio: string
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
    image: MediaTypes
}

const getValue = (value: number, ratio: number) => value * ratio

const getSizeImg = (width: number, height: number, aspectRatio: string, name: string) => {
  if (!aspectRatio) {
    return name === "width" ? width : height
  }
  const arrWidthAndHeightRatio = aspectRatio.split(":")
  return name === "width"
    // for case when get width
    ?   arrWidthAndHeightRatio[0] >= arrWidthAndHeightRatio[1]
        // for 16:9 2:1 etc format
        ? width
        // for 2:3 1:2 etc format
        : getValue(height, +arrWidthAndHeightRatio[0] / +arrWidthAndHeightRatio[1])

    // for case when get height
    : arrWidthAndHeightRatio[0] >= arrWidthAndHeightRatio[1]
        // for 16:9 2:1 etc format
        ? getValue(width, +arrWidthAndHeightRatio[1] / +arrWidthAndHeightRatio[0])
        // for 2:3 1:2 etc format
        : height
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

    const wrapWidth = getSizeImg(width, height, image.aspectRatio, "width")
    const wrapHeight = getSizeImg(width, height, image.aspectRatio, "height")

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