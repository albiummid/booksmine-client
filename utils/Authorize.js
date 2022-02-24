import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export default function Authorize({ children, roleFor }) {
  const { data: session } = useSession()
  const [allowed, setAllowed] = useState(null)
  useEffect(() => {
    setAllowed(roleFor.includes(session?.user?.role))
  }, [session, roleFor])

  return <>{allowed && children}</>
}
