import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import OptimizedImage from "../components/OptimizedImage/OptimizedImage";
import url from "../assets/pictures/image.jpg";

const image = {
    __typename: "Media",
    id: "613b943c1e4f360022baff95",
    filename: "case-study.2021-09-10T17:22:04.686Z.jpg",
    mimeType: "image/jpeg",
    filesize: 570975,
    width: 1062,
    height: 784,
    alt: "Casestudy sample",
    blurHash: "URFGIla*JHaj=sMwNc$zKBV@oatRY7%2nOJD",
    dimensions: {
        "width": 1062,
        "height": 784
    },
    duration: 434,
    s3: {
        url: url
    },
    aspectRatio: "2:3"
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
       <OptimizedImage image={image}/>
    </div>
  )
}

export default Home
