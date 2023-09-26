import { useSelector } from "react-redux"

import { getCount } from "./bagSlice"

export function Bag() {
  const count = useSelector(getCount)

  return <div>Jewels in bag:{count}</div>
}
