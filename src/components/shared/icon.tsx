import * as PhosphorIcons from '@phosphor-icons/react/ssr'

type IconName = keyof typeof PhosphorIcons

interface IconProps {
  name?: string 
  size?: number
  className?: string
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill'
}

export function Icon({ name, size = 24, className, weight = 'regular' }: IconProps) {
  const isValid = name && name in PhosphorIcons

  const Component = isValid ? (PhosphorIcons[name as IconName] as any) : PhosphorIcons.HouseIcon

  return <Component size={size} className={className} weight={weight} />
}
