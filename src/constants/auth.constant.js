export const listRoles = {
  admision: ['A'],
  triaje: ['TR'],
  tomografia: ['T', 'DT'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  informes: ['A'],
  plantillas: ['L'],
  pagosconvenio: ['A'],
  reembolsos: ['A'],
  servicios: ['A'],
  reportes: ['A'],
  mantenimiento: ['A']
}

export const redirectRoles = {
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx',
  T: '/tomografia',
  E: '/gestion-informes',
  TR: '/triaje'
}

export const mapRoles = {
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia',
  T: 'Tomografia',
  E: 'Gestión Informes',
  TR: 'Triaje'
}

export const rolesOptions = Object.keys(mapRoles).map((el) => ({
  value: el,
  label: mapRoles[el]
})).filter(el => el.value !== "A")