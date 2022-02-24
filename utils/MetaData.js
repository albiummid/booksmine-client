import Head from 'next/head'
import React from 'react'

export default function MetaData({ title = 'BooksMine' }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
