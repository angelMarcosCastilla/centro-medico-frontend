export const listRoles = {
  admisión: ['A'],
  triaje: ['T'],
  tomografia: ['T', 'DT'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  servicios: ['L'],
  plantillas: ['L'],
  pagos: ['A']
}

export const redirectRoles = {
  A: '/admision',
  T: '/tomografia',
  L: '/laboratorio'
}

export const mapRoles = {
  A: 'Admisión',
  T: 'Tomografia',
  L: 'Laboratorio'
}
