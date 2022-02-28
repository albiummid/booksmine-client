import React from 'react'
import styles from './spinner.module.css'

export default function LoadingSpinner({ full }) {
  return (
    <div className={full ? 'bg-transparent h-screen w-screen' : 'w-[100%]'}>
      <div className={styles.loader} />
    </div>
  )
}
