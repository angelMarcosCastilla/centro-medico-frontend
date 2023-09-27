export const listRoles = {
  tomografia: ['T', 'DT', 'R', 'DR'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  plantillas: ['L'],
  admisión: ['A'],
  pagos: ['A'],
  triaje: ['T']
}

export const redirectRoles = {
  T: '/tomografia',
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx'
}

export const mapRoles = {
  T: 'Tomografia',
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia'
}
