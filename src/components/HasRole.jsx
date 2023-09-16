export default function HasRole({ rol, listRoles, children }) {
  if (!listRoles.includes(rol)) return null
  return <>{children}</>
}
