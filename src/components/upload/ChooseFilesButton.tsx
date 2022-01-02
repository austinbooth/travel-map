import { FC, ChangeEvent } from 'react'

interface Props {
  selectFiles: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

const ChooseFilesButton: FC<Props> = ({selectFiles, disabled}) => (
  <input
    type='file'
    multiple
    accept="image/*"
    onChange={selectFiles}
    disabled={disabled}
    style={{width: 'fit-content'}}
  />
)

export default ChooseFilesButton
