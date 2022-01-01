import { FC } from 'react'

interface Props {
  max: number
  value: number
}

const Uploading: FC<Props> = ({max, value}) => (
  <>
    <p>Uploading...</p>
    <progress max={max} value={value} />
  </>
)

export default Uploading
