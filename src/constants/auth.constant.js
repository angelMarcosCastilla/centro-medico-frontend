export const listRoles = {
  admision: ['A'],
  triaje: ['T'],
  tomografia: ['T', 'DT'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  informes: ['L'],
  plantillas: ['L'],
  pagos: ['A']
}

export const redirectRoles = {
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx',
  T: '/tomografia',
  E: '/externalmodule'
}

export const mapRoles = {
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia',
  T: 'Tomografia',
  E: 'ExternalModule'
}
