export default (typeof window === 'object' && window) ||
  (typeof process === 'object' && process && process.env) ||
  {}
